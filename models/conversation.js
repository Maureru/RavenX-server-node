import mongoose from 'mongoose';
const conversationSchema = mongoose.Schema({
  conversation_name: { type: String, required: true },
  conversation_members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
});

export default mongoose.model('Conversation', conversationSchema);
