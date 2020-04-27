import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import Task from '../models/task';
import BaseCtrl from './base';

export default class UserCtrl extends BaseCtrl {
  model = Task;
}
