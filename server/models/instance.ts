import * as mongoose from 'mongoose';

const instanceSchema = new mongoose.Schema({
  name: String,
  description: String,
  class: String,
  path: String,
  annotation: mongoose.Schema.Types.Mixed,
  id_user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  id_dataset: { type: mongoose.Schema.ObjectId, ref: 'Dataset', required: true }
});


// Omit the password when returning a user
/*datasetSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    //delete ret.password;
    return ret;
  }
});*/

const Instance = mongoose.model('Instance', instanceSchema);

export default Instance;
