import * as express from 'express';

import UserCtrl from './controllers/user';
import User from './models/user';

import TaskCtrl from './controllers/task';
import TAsk from './models/task';

import DatasetCtrl from './controllers/dataset';
import Dataset from './models/dataset';

import InstanceCtrl from './controllers/instance';
import SubmissionCtrl from './controllers/submission';

import * as multer from 'multer';

import * as jwt from 'jsonwebtoken';


const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_TOKEN, (err, data) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = data.user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export default function setRoutes(app) {

  const router = express.Router();

  const userCtrl = new UserCtrl();
  const taskCtrl = new TaskCtrl();
  const datasetCtrl = new DatasetCtrl();
  const instanceCtrl = new InstanceCtrl();
  const submissionCtrl=new SubmissionCtrl();

  var zipStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './tmp')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + ".zip")
    }
  });
  var zipUpload = multer({ storage: zipStorage }).single('file');
  var storage = multer.memoryStorage();
  var upload = multer({ storage: storage });

  var singleUpload = upload.single('file');
  var multipleUpload = upload.array('file');


  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/resetpasswrd').post(userCtrl.resetPassword);
  router.route('/storepasswrd').post(userCtrl.storePassword);
  router.route('/confirmation/:token').get(userCtrl.emailConfirmation)
  router.route('/users').get(authenticateJWT, userCtrl.getAll);
  router.route('/users/count').get(authenticateJWT, userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(authenticateJWT, userCtrl.get);
  router.route('/user/:id').put(authenticateJWT, userCtrl.update);
  router.route('/user/:id').delete(authenticateJWT, userCtrl.delete);


  // Datasets
  //router.route('/datasets').get(datasetCtrl.getAll);
  //router.route('/datasets/count').get(datasetCtrl.count);
  //router.route('/dataset').post(authenticateJWT, datasetCtrl.insert);
  //router.route('/dataset/:id').get(datasetCtrl.get);
  //router.route('/dataset/:id/download').get(datasetCtrl.download);
  //router.route('/dataset/:id/stats').get(datasetCtrl.stat);
  //router.route('/dataset/:id').put(authenticateJWT, datasetCtrl.update);
  //router.route('/dataset/:id').delete(authenticateJWT, datasetCtrl.delete);

  // Instances
  //router.route('/dataset/:datasetId/instances').get(instanceCtrl.getAll);
  //router.route('/dataset/:datasetId/instances').get(instanceCtrl.count);
  //router.route('/dataset/:datasetId/instance').post(authenticateJWT, singleUpload, instanceCtrl.singleUpload);
  //router.route('/dataset/:datasetId/instances').post(authenticateJWT, multipleUpload, instanceCtrl.multipleUpload);
  //router.route('/dataset/:datasetId/upload').post(authenticateJWT, zipUpload, instanceCtrl.uploadZipedDataset);
  //router.route('/instance/:id').get(instanceCtrl.get);
  //router.route('/instance/:id').put(authenticateJWT, instanceCtrl.update);
  //router.route('/instance/:id').delete(authenticateJWT, instanceCtrl.delete);

  // Submissions
  router.route('/submissions').get(submissionCtrl.getAll);
  router.route('/submissions/stat').get(submissionCtrl.stat);
  router.route('/submission').post(authenticateJWT, multipleUpload, submissionCtrl.multipleUpload);
  router.route('/submission/:id').get(submissionCtrl.get);
  router.route('/submission/:id').put(authenticateJWT, submissionCtrl.update);
  router.route('/submission/:id').delete(authenticateJWT, submissionCtrl.delete);
  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
