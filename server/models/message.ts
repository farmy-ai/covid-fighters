import * as mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone_number: String,
  description: String
});


const Message = mongoose.model('Message', messageSchema);

export default Message;
