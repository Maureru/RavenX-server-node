import jwt from 'jsonwebtoken';

// Verify if valid user
const validateToken = (req, res, next) => {
  const accessToken = req.header('accessToken');

  if (!accessToken) return res.json({ error: 'You are not logged in' });

  try {
    const validToken = jwt.verify(accessToken, 'ravensx');
    req.user = validToken;

    if (validToken) {
      return next();
    } else {
      res.json({ error: 'Please login' });
    }
  } catch (error) {
    res.json({ error: error, message: 'Invalid User' });
  }
};

export { validateToken };
