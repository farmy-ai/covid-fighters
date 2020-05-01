import * as mongoose from 'mongoose';

const submisionSchema = new mongoose.Schema({
  data_type:String,
  disease_type: String,
  description: String,
  affiliation: String,
  upload_name:String,
  s3_path: String,
  annotation: mongoose.Schema.Types.Mixed,
  tags: [String],
  id_user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

submisionSchema.pre('save', function (next,req) {
  const submision = this;
  req.modifiedDisease=true;
  if (!submision.isModified('disease_type')) {
    req.modifiedDisease=true;
  }
  return next();
});
// Omit the password when returning a user
/*datasetSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    //delete ret.password;
    return ret;
  }
});*/

const Submission = mongoose.model('Submission', submisionSchema);

export default Submission;
