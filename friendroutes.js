
const express = require('express');
const router = express.Router();

// Sample friends data
const friends = require('./friends.js'); 

// Part 1: Add support to the 'filter' endpoint for a new query parameter 'letter'
router.get('/filter', (req, res) => {
  const { letter } = req.query;

  if (!letter) {
    return res.status(400).json({ error: 'Missing required parameter: letter' });
  }

  const filteredFriends = friends.filter((friend) => friend.name.startsWith(letter));
  res.json(filteredFriends);
});

// Part 2: Modify the 'info' route to only return specific headers
router.get('/info', (req, res) => {
  const userAgent = req.get('user-agent');
  const contentType = req.get('content-type');
  const acceptHeader = req.get('accept');

  res.json({ userAgent, contentType, acceptHeader });
});

// Part 3: Modify the dynamic GET route to return a single friend object matching the dynamic 'id' request parameter
router.get('/:id', (req, res) => {
  const friendId = parseInt(req.params.id);

  if (isNaN(friendId)) {
    return res.status(400).json({ error: 'Invalid friend ID' });
  }

  const friend = friends.find((f) => f.id === friendId);

  if (!friend) {
    return res.status(404).json({ error: 'Friend not found' });
  }

  res.json(friend);
});

// Part 4: Complete the PUT route which will update data for an existing friend
router.put('/:id', (req, res) => {
  const friendId = parseInt(req.params.id);

  if (isNaN(friendId)) {
    return res.status(400).json({ error: 'Invalid friend ID' });
  }

  const friendIndex = friends.findIndex((f) => f.id === friendId);

  if (friendIndex === -1) {
    return res.status(404).json({ error: 'Friend not found' });
  }

  const { name, gender } = req.body; // Assuming the request body contains updated data

  // Basic data validation
  if (!name || !gender) {
    return res.status(400).json({ error: 'Name and gender are required fields' });
  }

  friends[friendIndex] = { ...friends[friendIndex], name, gender };

  res.json({ message: 'Friend updated successfully', friend: friends[friendIndex] });
});

module.exports = router;
