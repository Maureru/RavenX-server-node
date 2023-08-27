import mongoose from 'mongoose';
const messageSchema = mongoose.Schema({
  from_user: {
    name: { type: String, required: true },
    id: { type: String, required: true },
  },
  user_image: { type: String, required: true },
  message_text: { type: String, required: true },
  message_media: {
    isMedia: { type: Boolean, required: true, default: false },
    type: { type: String },
    file: { type: String },
  },

  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  send_datetime: { type: Date, required: true },
  is_seen: { type: Boolean, default: false, required: true },
});

export default mongoose.model('Message', messageSchema);
