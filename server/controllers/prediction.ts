import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import Prediction from '../models/Prediction'
import BaseCtrl from './base';
import * as AWS from 'aws-sdk';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as request from 'request';
import * as fs from "fs";
import { Duplex } from 'stream';

export default class PredictionCtrl {
  getPrediction = (req, res) => {
    const file = req.file

    if (!req.body.id_user) {
      req.body.id_user = 0;
    }
    const duplexStream = new Duplex();
    duplexStream.push(file.buffer);
    duplexStream.push(null);
    var options = {
      'method': 'POST',
      'url': 'http://178.62.219.187:6100',
      'headers': {
        'key': 'T\\xcaf\\xbe\\x95\\xdd3\\xf6\\x19,\\x83\\xa6\\xf2\\xb0;=\\x0b\\x19\\xec7|\\xbd\\x87\\x86'
      },
      formData: {
        'image': {
          'value': duplexStream,
          'options': {
            'filename': file.originalname,
            'contentType': null
          }
        },
        'info': 'CovidFighter'
      }
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);

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
      console.log(JSON.parse(response.body));
      response.body=JSON.parse(response.body);
      const PredictionData = {
        tags: req.body.tags,
        upload_name: file.originalname,
        predicted_class: response.body.predictions[0].label,
        prediction_array: response.body,
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
    });
  }
}
