import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

import * as AWS from 'aws-sdk';
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from 'uuid';
import * as extractZip from "extract-zip";
import * as zipFolder from 'zip-a-folder';
import * as json2csv from 'json2csv';

import Submission from '../models/submission';
import BaseCtrl from './base';
import User from '../models/user';
import * as fileApi from './file.api';


export default class SubmissionCtrl extends BaseCtrl {
  model = Submission;

  // Get all Instances in Datasets
  getAll = (req, res) => {


    var match = {}
    const sort = {}

    if (req.params.search) {
      match = { "$text": { "$search": req.params.search } }
    }

    if (req.query.sortBy && req.query.OrderBy) {
      sort[req.query.sortBy] = req.query.OrderBy === 'desc' ? -1 : 1
    }

    const options = {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
      sort
    };

    this.model.find(match, null, options, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  }

  // Count all Instances in Datasets
  /*count = (req, res) => {
    this.model.find({ id_dataset: req.params.datasetId }).count((err, count) => {
      if (err) { return console.error(err); }
      res.status(200).json(count);
    });
  }*/


  // Get by id
  get = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }



  // Update by id
  update = (req, res) => {
    if (req.user.role == "admin" || req.user.role == "expert") {
      this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
        // 11000 is the code for duplicate key error
        if (err && err.code === 11000) {
          res.sendStatus(400);
        }
        if (err) {
          return console.error(err);
        }
        res.sendStatus(200);
      });
    }
    else {
      return res.sendStatus(403);
    }
  }

  // Delete by id
  delete = (req, res) => {
    if (req.session.role == "admin" || req.session.role == "expert" || req.session._id == req.body.id_user) {
      this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
        if (err) { return console.error(err); }
        let s3bucket = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
          apiVersion: 'latest',
        });
        var params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: req.body.s3_path
        };
        s3bucket.deleteObject(params, function (error, data) {
          if (err) console.log(error, error.stack);  // error
          else res.sendStatus(200);              // deleted
        });

      });
    }
    else {
      return res.sendStatus(403);
    }
  }
  // Stats by dataset id
  stat = (req, res) => {
    const aggregatorOpts = [
      {
        $group: {
          _id: "$disease_type",
          count: { $sum: 1 }
        }
      }
    ]
    this.model.aggregate(aggregatorOpts, function (err, classes) {
      res.json(classes);
    });
  }




  multipleUpload = (req, res) => {
    const files = req.files;
    req.body.id_user = mongoose.Types.ObjectId(req.user._id);
    let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      apiVersion: 'latest',
    });
    var ResponseData = [];
    files.map((item) => {
      var uuid_name = uuidv4();
      var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: "datasets/" + req.body.disease_type + "/" + uuid_name + path.extname(item.originalname),
        Body: item.buffer,
        ACL: 'public-read'
      };
      const submissionData = {
        data_type: req.body.data_type,
        upload_name: item.originalname,
        description: req.body.description,
        disease_type: req.body.disease_type,
        annotation: req.body.annotation,
        tags: req.body.tags,
        s3_path: "datasets/" + req.body.disease_type + "/" + uuid_name + path.extname(item.originalname),
        id_user: req.body.id_user
      }
      s3bucket.upload(params, function (err, data) {
        if (err) {
          res.json({ "error": true, "Message": err });
        } else {

          const obj = new Submission(submissionData);
          obj.save((err, item) => {
            if (err) { res.status("500").json(err) };
            ResponseData.push(data);
            if (ResponseData.length == files.length) {
              res.json({ "error": false, "Message": "File Uploaded    SuceesFully", Data: ResponseData });
            }
          });
        }
      });
    });
  }

  PreviewImage = (req, res) => {
    let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      apiVersion: 'latest',
    });
    var params = { Bucket: process.env.AWS_BUCKET_NAME, Key: req.body.path };
    s3bucket.getObject(params, function (err, data) {
      res.writeHead(200, { 'Content-Type': 'image/' + path.extname(req.body.path).substr(1) });
      res.write(data.Body, 'binary');
      res.end(null, 'binary');
    });
  }

  mine = async (req, res) => {
    //console.log(req.user.populate);
    this.model.find({id_user:req.user._id}).sort([['updated_at', -1]]).exec((err, submissionData) => {
      if (err) {
        return res.status(500);
      }
      res.status(200).json(submissionData);
    });
  }


  downloadMultiple = (req, res) => {

    const dir = path.join("tmp", uuidv4());
    var match = {}

    if (req.params.search) {
      match = { "$text": { "$search": req.params.search } }
    }

    if (fs.existsSync(dir)) {
      fileApi.default.deleteFolder(dir);
    }
    fs.mkdirSync(dir);
    const imagesDir = path.join(dir, "images");
    fs.mkdirSync(imagesDir);
    this.model.find(match, (err, docs) => {
      if (err) { return console.error(err); }

      var S3_paths = [];
      const filtredSubmissions = docs.map((item) => {
        S3_paths.push(item.s3_path);
        item.filename = path.basename(item.s3_path);
        return item;
      });

      const fields = ["filename", "data_type", "disease_type", "description", "affiliation", "tags", "annotation"];
      let csv
      try {
        csv = json2csv.parse(filtredSubmissions, { fields });
        fs.writeFileSync(path.join(dir, "metadata.csv"), csv);
        fileApi.default.getFiles(S3_paths, imagesDir).then(function (result) {
          if (!result) {
            return res.status(500);
          }
          const zipFile = dir + ".zip";
          zipFolder.zipFolder(dir, zipFile, function (err) {
            if (err) {
              console.log('Something went wrong!', err);
            }

            res.attachment("dataset.zip");
            var stream = fs.createReadStream(zipFile);
            stream.pipe(res).once("close", function () {
              stream.destroy(); // makesure stream closed, not close if download aborted.
              //deleteFile;
              fs.unlinkSync(zipFile);
              fileApi.default.deleteFolder(dir);
            });
          });
        })
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    });

    // res.sendStatus(200);
  }

}

