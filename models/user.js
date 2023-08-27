import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  image: { type: String, required: true },
  isOnline: { type: Boolean, required: true, default: false },
  isVerified: { type: Boolean, required: true, default: false },
});

export default mongoose.model('User', userSchema);
