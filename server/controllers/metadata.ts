import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import User from '../models/user'
import Submission from '../models/submission'
import BaseCtrl from './base';

export default class MetadataCtrl {
  getAffiliations = (req, res) => {
    Submission.find().distinct('affiliation', function (error, submissionAffils) { 
      User.find().distinct('affiliation', function (error, userAffils) {
        const allAffiliations= submissionAffils.concat(userAffils);
        const set = new Set(allAffiliations);
        const result = Array.from(set);
        res.json(result);
      });
    });
  }
  getTags = (req, res) => {

    Submission.find().distinct('tags', function (error, tagTitles) {
      res.json(tagTitles);
    });
  }
}
