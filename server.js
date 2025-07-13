const express = require('express');
const cors = require('cors');

const app = express();
const collectionRoutes = require('./الطرق/مجموعةNFT');

app.use(cors());
app.use(express.json());
app.use('/api/v1/collection', collectionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ الخادم يعمل على المنفذ ${PORT}`);
});
