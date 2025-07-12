const express = require('express');
const router = express.Router();
const { createCollection } = require('../controllers/collectionController');

router.post('/create_collection', createCollection);

module.exports = router;
