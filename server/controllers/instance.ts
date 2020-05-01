import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as fs from "fs";
import * as path from "path";
import * as extractZip from "extract-zip"

import Instance from '../models/instance';
import Dataset from '../models/dataset';
import BaseCtrl from './base';


export default class InstanceCtrl extends BaseCtrl {
  model = Instance;

  // Get all Instances in Datasets
  getAll = (req, res) => {
    this.model.find({ id_dataset: req.params.datasetId }, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  }

  // Count all Instances in Datasets
  count = (req, res) => {
    this.model.find({ id_dataset: req.params.datasetId }).count((err, count) => {
      if (err) { return console.error(err); }
      res.status(200).json(count);
    });
  }


  // Get by id
  get = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }



  // Update by id
  update = (req, res) => {
    if (req.user.role == "admin" || req.user.role == "expert" || req.user._id == req.body.id_user) {
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
        res.sendStatus(200);
      });
    }
    else {
      return res.sendStatus(403);
    }
  }
  // Stats by dataset id
  stat = (req, res) => {
    res.sendStatus(200);
  }
  download = (req, res) => {
    res.sendStatus(200);
  }
  // Insert
  singleUpload = (req, res) => {
    if (!req.body._id || (req.user.role != "admin" && req.user.role != "expert" && req.user._id != req.body.id_user))
      return res.sendStatus(403);
    const file = req.file;
    const s3FileURL = req.body.id_dataset + '/' + req.body.class;
    var ep = new AWS.Endpoint('https://s3.eu-west-3.amazonaws.com');
    let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      apiVersion: 'latest',
      //endpoint: 'https://s3.eu-west-3.amazonaws.com/'+process.env.AWS_BUCKET_NAME
    });
    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3FileURL + '/' + file.originalname,//
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read"
    };

    s3bucket.upload(params, function (err, data) {
      if (err) {
        res.status(500).json({ error: true, Message: err });
      } else {
        //res.send({ data });
        /*var newFileUploaded = {
          description: req.body.description,
          fileLink: s3FileURL + file.originalname,
          s3_key: params.Key
        };*/
        req.body.name = file.originalname;
        req.body.path = s3FileURL + '/' + file.originalname;
        req.body.id_user = mongoose.Types.ObjectId(req.body.id_user);
        req.body.id_dataset = mongoose.Types.ObjectId(req.params.datasetId);


        if (!req.body._id) {
          const obj = new Instance(req.body);
          obj.save((err, item) => {
            // 11000 is the code for duplicate key error
            if (err && err.code === 11000) {
              res.sendStatus(400);
            }
            if (err) {
              return console.error(err);
            }
            res.status(200).json(item);
          });
        }
        else {
          Instance.findOneAndUpdate({ _id: req.body._id }, req.body, (err) => {
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
      }
    });
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
    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: req.params.datasetId + "/" + req.body.class + "/" + item.originalname,
      Body: item.buffer,
      ACL: 'public-read'
    };
    const instanceData = {
      name: item.originalname,
      description: req.body.class,
      class: req.body.class,
      annotation: req.body.class,
      path: req.params.datasetId + "/" + req.body.class + "/" + item.originalname,
      id_user: req.user.id,
      id_dataset: req.params.datasetId
    }
    s3bucket.upload(params, function (err, data) {
      if (err) {
        res.json({ "error": true, "Message": err });
      } else {

        const obj = new Instance(instanceData);
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

uploadZipedDataset = (req, res) => {
  //extract zip file to tmp
  const file = req.file.path;
  //console.log(file);

  const uploadTmpPath = "./tmp/Dataset_" + req.params.datasetId + "_" + (Math.floor(Math.random() * 1000) + 1);

  extractZip(file, { dir: path.resolve(uploadTmpPath) }).then(result => {
    //console.log(result);

    console.log('Extraction complete')

    //upload content to dataset
    //const distFolderPath = path.join(__dirname, folderPath);
    var ResponseData = [];
    var allDocs = [];
    let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      apiVersion: 'latest',
    });
    Dataset.findOne({ _id: req.params.datasetId }, (error, item) => {
      // get of list of files from 'dist' directory
      //console.log(item.classes);


      var interPath = "";

      var folders = fs.readdirSync(uploadTmpPath + "/" + interPath);
      while (!folders.includes(item.classes[0])) {
        interPath = interPath + folders[0] + "/";
        folders = fs.readdirSync(uploadTmpPath + "/" + interPath);
      }
      var i = 0;
      console.log(interPath);
      var classesFolder = fs.readdirSync(uploadTmpPath + "/" + interPath);
      classesFolder = classesFolder.filter(word => !word.startsWith("."));
      classesFolder.map((classFolder, iFolder) => {
        var distFolderPath = uploadTmpPath + "/" + interPath + classFolder + "/";
        var files = fs.readdirSync(path.resolve(distFolderPath));
        files = files.filter(word => !word.startsWith("."));
        /*fs.readdir(path.resolve(distFolderPath), (err, files) => {
          console.log(files);
          if (!files || files.length === 0) {
            console.log(`provided folder '${distFolderPath}' is empty or does not exist.`);
            console.log('Make sure your project was compiled!');
            return;
          }*/
        var ResponseDataClass = { class: classFolder, data: [] };
        files.map((fileName, iFile) => {


          // get the full path of the file
          const filePath = distFolderPath + fileName;

          // ignore if directory
          //if (fs.lstatSync(filePath).isDirectory()) {
          //  continue;
          //}

          // read file contents
          //console.log(filePath);

          const fileContent = fs.readFileSync(filePath);

          var params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: req.params.datasetId + "/" + classFolder + "/" + fileName,
            Body: fileContent,
            ACL: 'public-read'
          };
          const instanceData = {
            name: fileName,
            description: classFolder,
            class: classFolder,
            annotation: classFolder,
            path: req.params.datasetId + "/" + classFolder + "/" + fileName,
            id_user: req.user._id,
            id_dataset: req.params.datasetId
          }
          // upload file to S3
          s3bucket.upload(params, function (err, data) {
            if (err) {
              res.json({ "error": true, "Message": err });
            } else {
              allDocs.push(instanceData);
              ResponseDataClass.data.push(data);
              if (ResponseDataClass.data.length == files.length) {
                ResponseData.push(ResponseDataClass);
                if (ResponseData.length == classesFolder.length) {
                  //save in mongodb
                  //const obj = new Instance(instanceData);
                  //obj.save(
                  Instance.insertMany(allDocs,
                    (err, items) => {

                      if (err)
                        res.status(500).json({ "error": true, "Message": err });
                      //ResponseData[i - 1].data.push(data);
                      try {
                        fs.unlinkSync(file);
                        var deleteFolderRecursive = function (path) {
                          if (fs.existsSync(path)) {
                            fs.readdirSync(path).forEach(function (file, index) {
                              var curPath = path + "/" + file;
                              if (fs.lstatSync(curPath).isDirectory()) { // recurse
                                deleteFolderRecursive(curPath);
                              } else { // delete file
                                fs.unlinkSync(curPath);
                              }
                            });
                            fs.rmdirSync(path);
                          }
                        }
                        deleteFolderRecursive(uploadTmpPath);
                        //file removed
                      } catch (err) {
                        console.error(err)
                      }
                      //done
                      res.json({ "error": false, "Message": "Dataset Uploaded SuceesFully", DataUploaded: ResponseData });

                    });
                }
              }
            }
          });
        });

      });
    });

  });
}
}

