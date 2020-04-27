import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  task_name: String,
  desc: String,
  completed: Boolean,
});


const Task = mongoose.model('Task', taskSchema);

export default Task;
