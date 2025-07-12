// .nft/backend/server.js
const express = require('express');
const app = express();
const collectionRoutes = require('./routes/collection');

app.use(express.json());
app.use('/api/v1/collection', collectionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
