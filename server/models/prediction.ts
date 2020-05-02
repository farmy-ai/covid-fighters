import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  upload_name: String,
  s3_path: String,
  predicted_class: String,
  prediction_array: mongoose.Schema.Types.Mixed,
  tags:[String],
  id_user:String
}, { timestamps: { createdAt: 'created_at' } });

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;
