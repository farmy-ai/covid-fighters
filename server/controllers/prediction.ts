import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import Prediction from '../models/Prediction'
import BaseCtrl from './base';
import * as AWS from 'aws-sdk';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default class PredictionCtrl {
  getPrediction = (req, res) => {
    const file = req.file
    console.log(file);
    
    if (!req.body.id_user) {
      req.body.id_user = 0;
    }
    let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      apiVersion: 'latest',
    });
    var uuid_name = uuidv4();
    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: "predictions/" + uuid_name + path.extname(file.originalname),
      Body: file.buffer,
      ACL: 'public-read'
    };
    const PredictionData = {
      tags: req.body.tags,
      upload_name: file.originalname,
      predicted_class: "from the AI API",
      prediction_array: "from the AI API",
      s3_path: "predictions/" + uuid_name + path.extname(file.originalname),
      id_user: req.body.id_user
    }
    s3bucket.upload(params, function (err, data) {
      if (err) {
        return res.json({ "error": true, "Message": err });
      } else {

        const obj = new Prediction(PredictionData);
        obj.save((err, item) => {
          if (err) { res.status("500").json(err) };
            res.json({ "error": false, "Message": "File Uploaded SuceesFully", Data: PredictionData });
        });
      }
    });
  }
}
