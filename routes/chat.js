import express from 'express';
import {
  check_if_conversation_exist,
  create_conversation,
  create_convo_and_send_message,
  get_chat_message,
  get_conversation,
  send_message,
} from '../controllers/chat.js';
import { validateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/send_message', send_message);
router.post('/get_message', get_chat_message);
router.post('/get_conversation', get_conversation);
router.post('/create_conversation', create_conversation);
router.post('/check_conversation', check_if_conversation_exist);
router.post('/create_conversation_and_message', create_convo_and_send_message);

export default router;
