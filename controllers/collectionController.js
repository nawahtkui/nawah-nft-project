exports.createCollection = (req, res) => {
  const { name, description, creator } = req.body;

  if (!name || !creator) {
    return res.status(400).json({ error: 'Name and creator are required.' });
  }

  const newCollection = {
    id: Date.now(),
    name,
    description,
    creator,
  };

  console.log('New Collection:', newCollection);
  return res.status(201).json({ message: 'Collection created.', collection: newCollection });
};
