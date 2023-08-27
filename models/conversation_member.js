import mongoose from 'mongoose';
const conversation_memberSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  joined_datetime: { type: Date, required: true },
  left_datetime: { type: Date },
});

export default mongoose.model('Conversation_Member', conversation_memberSchema);
