const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

// add routes and middleware
const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get('http://localhost:3000/posts', (req, res) => {
  res.send(posts);
});

app.post('http://localhost:3000/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  // axios.post('http://event-bus-srv:4005/events', {
  axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title,
    },
  });
  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Event Received:', req.body.type);
  res.send({});
});

const PORT = process.env.PORT || 4000;
const VERSION = 'v10000';

app.listen(PORT, () => {
  console.log(`${VERSION}`);
  console.log(`Listening post on port: ${PORT}`);
});
