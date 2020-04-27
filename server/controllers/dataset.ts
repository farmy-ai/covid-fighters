import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as AWS from 'aws-sdk'
import Dataset from '../models/dataset';
import Instance from '../models/instance'
import BaseCtrl from './base';

export default class DatasetCtrl extends BaseCtrl {
  model = Dataset;


  // Insert
  insert = (req, res) => {

    if (!req.user._id) {
      req.body.id_user = 0
    } else {
      req.body.id_user = req.user._id
    }
    const data = {
      "name": req.body.name,
      "description": req.body.description,
      "classes": req.body.classes,
      "visibility": req.body.visibility,
      "id_user": mongoose.Types.ObjectId(req.body.id_user),
    }
    const obj = new this.model(data);
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

  // Update by id
  update = (req, res) => {
    console.log(req.params.id);
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

  download = (req, res) => {
    let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      apiVersion: 'latest',
      //endpoint: 'https://s3.eu-west-3.amazonaws.com/'+process.env.AWS_BUCKET_NAME
    });
    this.model.findOne({ _id: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      const LocalFolder = "tmp/"+item.name.replace(" ","_") + "_"+Date.now();
      var cmd = "mkdir " + LocalFolder + " && aws s3 cp s3://" + process.env.AWS_BUCKET_NAME +
        "/" + req.params.id + " " + LocalFolder + " --recursive && " +
        "zip -r " + LocalFolder + " " + LocalFolder + " && " +
        "rm -R " + LocalFolder
      console.log(cmd);
      child_process.execSync(cmd, {
        cwd: '.'
      });

      res.attachment(item.name.replace(" ","_") + ".zip");
      const filename = LocalFolder + ".zip"
      var stream = fs.createReadStream(filename);
      stream.pipe(res).once("close", function () {
        stream.destroy(); // makesure stream closed, not close if download aborted.
        //deleteFile;
        fs.unlink(filename, function (err) {
          if (err) {
            console.error(err.toString());
          } else {
            console.warn(filename + ' deleted');
          }
        });
      });
    });
  }
  // Delete by id
  delete = (req, res) => {
    if (req.user.role == "admin" || req.user.role == "expert" || req.user._id == req.body.id_user) {
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

    const aggregatorOpts = [{
      $match:
      {
        id_dataset: mongoose.Types.ObjectId(req.params.id)
      }
    },
    {
      $group: {
        _id: "$class",
        count: { $sum: 1 }
      }
    }
    ]
    Instance.aggregate(aggregatorOpts, function (err, classes) {
      res.json(classes);
    });
  }
}
