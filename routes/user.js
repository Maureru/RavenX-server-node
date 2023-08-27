import express from 'express';
import {
  check_email_exist,
  login,
  search_user,
  signup,
  verified,
} from '../controllers/auth.js';
import { validateToken } from '../middleware/auth.js';
const router = express.Router();

router.get('/', validateToken, verified);
router.post('/search', search_user);
router.post('/signup', signup);
router.post('/login', login);
router.post('/email_check', check_email_exist);

export default router;
