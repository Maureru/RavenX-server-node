/* ============ Chat Controllers =========== */

import conversation_member from '../models/conversation_member.js';
import conversation from '../models/conversation.js';
import message from '../models/message.js';

// Retrieve the chat message of a conversation
const get_chat_message = async (req, res) => {
  const { conversation_id } = req.body;

  try {
    const messages = await message.find({ conversation_id });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error, message: 'Something went wrong!' });
  }
};

// Retrieve all user conversation
const get_conversation = async (req, res) => {
  const { user_id } = req.body;
  console.log(user_id);
  try {
    const conversations = await conversation
      .find({
        conversation_members: {
          $all: [user_id],
        },
      })
      .populate('conversation_members')
      .exec();

    const newConversations = await Promise.all(
      conversations.map(async (convo, i) => {
        const last_message = await message.find({
          conversation_id: convo._id,
        });

        return { ...convo._doc, last_message: last_message.pop() };
      })
    );

    res.json(newConversations);
  } catch (error) {
    console.log('ERR');
    res.status(500).json({ error, message: 'Something went wrong!' });
  }
};

// create a conversation
const create_conversation = async (req, res) => {
  const { members_id, conversation_name } = req.body;
  try {
    const conversation_user = await conversation.create({
      conversation_name,
    });

    members_id.map(async (id, i) => {
      const result = await conversation_member.create({
        user_id: id,
        conversation_id: conversation_user._id,
        joined_datetime: new Date(),
      });
    });

    res.status(200).json(conversation_user._id);
  } catch (error) {
    res
      .status(500)
      .json({ error, message: 'Something went wrong with the server' });
  }
};

// create a conversation and send a message
const create_convo_and_send_message = async (req, res) => {
  const { members, conversation_name, messages } = req.body;

  console.log(members);
  try {
    const conversation_user = await conversation.create({
      conversation_name,
      conversation_members: [...members],
    });

    members.map(async (mem, i) => {
      await conversation_member.create({
        user_id: mem,
        conversation_id: conversation_user._id,
        joined_datetime: new Date(),
      });
    });

    const messaged = await message.create({
      ...messages,
      conversation_id: conversation_user._id,
      send_datetime: new Date(),
    });

    if (!messaged) return res.json({ error: 'Sending Error' });

    res
      .status(200)
      .json({ conversation_id: conversation_user._id, message: messaged });
  } catch (error) {
    res.json({ error: 'Something went wrong with server' });
  }
};
// Send message
const send_message = async (req, res) => {
  const { messages } = req.body;

  try {
    const messaged = await message.create({
      ...messages,
      send_datetime: new Date(),
    });
    res.status(200).json(messaged);
  } catch (error) {
    res.status(500).json({ error, message: 'Something went wrong!' });
  }
};

const check_if_conversation_exist = async (req, res) => {
  const { user_id, other_id } = req.body;

  try {
    const is_exist = await conversation.find({
      conversation_members: {
        $all: [user_id, other_id],
      },
    });

    const convo_array = is_exist.filter(
      (convo) => convo.conversation_members.length === 2
    );

    if (convo_array.length !== 0) {
      res.status(200).json(convo_array[0]._id);
    } else {
      res
        .status(200)
        .json({ error: 'conversation doesnt exist!', type: 'new' });
    }
  } catch (error) {
    res.json({ error: 'Server Error' });
  }
};

const chat_seen = async (other_id, conversation_id) => {
  try {
    const res = await message.updateMany(
      { 'from_user.id': other_id, conversation_id },
      {
        $set: { is_seen: true },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export {
  check_if_conversation_exist,
  get_chat_message,
  get_conversation,
  send_message,
  create_conversation,
  create_convo_and_send_message,
  chat_seen,
};
