import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }
});


const Token = mongoose.model('Token', tokenSchema);

export default Token;
