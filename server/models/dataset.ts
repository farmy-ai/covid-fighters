import * as mongoose from 'mongoose';

const datasetSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
  classes: [{
    type: String
  }],
  visibility: Boolean,
  id_user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
});

// Omit the password when returning a user
/*datasetSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    //delete ret.password;
    return ret;
  }
});*/

const Dataset = mongoose.model('Dataset', datasetSchema);

export default Dataset;
