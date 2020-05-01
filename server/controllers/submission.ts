import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

import * as AWS from 'aws-sdk';
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from 'uuid';
import * as extractZip from "extract-zip"

import Submission from '../models/submission';
import BaseCtrl from './base';
import { EnvironmentCredentials } from 'aws-sdk';


export default class SubmissionCtrl extends BaseCtrl {
  model = Submission;

  // Get all Instances in Datasets
  getAll = (req, res) => {


    var match = {}
    const sort = {}

    if (!req.params.search) {
      match = { $text: { $search: req.params.search } }
    }

    if (req.query.sortBy && req.query.OrderBy) {
      sort[req.query.sortBy] = req.query.OrderBy === 'desc' ? -1 : 1
    }

    const options = {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
      sort
    };

    this.model.find(match ,null, options ,(err, docs) => {
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


  downloadMultiple = (req, res) => {
    res.sendStatus(200);
  }

  multipleUpload = (req, res) => {
    const file = req.files;
    let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      apiVersion: 'latest',
    });
    var ResponseData = [];
    file.map((item) => {
      var uuid_name = uuidv4();
      var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: "datasets/" + req.body.class + "/" + uuid_name + path.extname(item.originalname),
        Body: item.buffer,
        ACL: 'public-read'
      };
      const instanceData = {
        data_type: req.body.data_type,
        upload_name: item.originalname,
        description: req.body.description,
        disease_type: req.body.disease_type,
        annotation: req.body.annotation,
        tags: req.body.tags,
        s3_path: "datasets/" + req.body.class + "/" + uuid_name + path.extname(item.originalname),
        id_user: req.user.id
      }
      s3bucket.upload(params, function (err, data) {
        if (err) {
          res.json({ "error": true, "Message": err });
        } else {

          const obj = new Submission(instanceData);
          obj.save((err, item) => {
            ResponseData.push(data);
            if (ResponseData.length == file.length) {
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
}

