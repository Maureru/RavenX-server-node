// =========== Auth Controllers =========== //
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import user from '../models/user.js';

// Valid user
const verified = async (req, res) => {
  return res.status(200).json(req.user);
};

//  Do the signup
const signup = async (req, res) => {
  const { name, email, username, password, image, age } = req.body;

  try {
    const hash_password = await bcrypt.hash(password, 12);
    const result = await user.create({
      email,
      username,
      password: hash_password,
      name,
      image,
      age,
    });

    const token = jwt.sign(
      {
        email: result.email,
        username: result.username,
        id: result._id,
        image: result.image,
        name: result.name,
        age: result.age,
        isOnline: result.isOnline,
      },
      'ravensx',
      { expiresIn: '1d' }
    );

    res.status(200).json({ result, token });
  } catch (error) {
    res
      .status(500)
      .json({ error, message: 'Something went wrong with the server!' });
  }
};

//  Do the login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await user.findOne({ email });

    if (!users) {
      return res.status(200).json({ message: "User doesn't exist" });
    }

    const is_correct_password = await bcrypt.compare(password, users.password);
    if (!is_correct_password) {
      return res.status(200).json({ message: 'Invalid credentials!' });
    }

    const token = jwt.sign(
      {
        email: users.email,
        username: users.username,
        id: users._id,
        image: users.image,
        name: users.name,
        age: users.age,
        isOnline: users.isOnline,
      },
      'ravensx',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      result: users,
      token,
    });
  } catch (error) {
    console.log('tet');
    res
      .status(500)
      .json({ error, message: 'Something went wrong with the server!' });
  }
};

// Set the user status
const set_status_online = async (user_id) => {
  try {
    const status = await user.findOneAndUpdate(
      { _id: user_id },
      { isOnline: true }
    );

    console.log('Status Changed');
  } catch (error) {
    console.log(error);
  }
};
// Set the user status
const set_status_offline = async (user_id) => {
  try {
    const status = await user.findOneAndUpdate(
      { _id: user_id },
      { isOnline: false }
    );
    console.log('Status Changed');
  } catch (error) {
    console.log(error);
  }
};

// Check if email already exist
const check_email_exist = async (req, res) => {
  const { email, username } = req.body;
  try {
    const is_exist = await user.findOne({ email });
    const is_exist_username = await user.findOne({ username });
    if (is_exist)
      return res
        .status(200)
        .json({ exist: true, message: 'Email already registered' });
    if (is_exist_username)
      return res
        .status(200)
        .json({ exist: true, message: 'Username already taken' });
    res.status(200).json({ exist: false });
  } catch (error) {
    res.status(500).json({ error, message: 'Something went wrong!' });
  }
};

// Search user
const search_user = async (req, res) => {
  const { query } = req.body;

  try {
    if (query === '') return res.status(200).json([]);
    const result = await user
      .find({
        $or: [
          {
            name: { $regex: query, $options: 'i' },
          },
          {
            username: { $regex: query, $options: 'i' },
          },
          {
            email: { $regex: query, $options: 'i' },
          },
        ],
      })
      .limit(7);

    res.status(200).json(result);
  } catch (error) {
    console.log('dwa');
    res.status(500).json({ error, message: 'Something went wrong server' });
  }
};

export {
  signup,
  login,
  set_status_online,
  set_status_offline,
  check_email_exist,
  verified,
  search_user,
};
