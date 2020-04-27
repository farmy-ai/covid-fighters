import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const ResetPasswordSchema = new mongoose.Schema({
  userId: { type: String, unique: true},
  resetPasswordToken: String,
  expire: String,
  status: Number,
});


const ResetPassword = mongoose.model('ResetPassword', ResetPasswordSchema);

export default ResetPassword;
