const express = require('express');
const fs = require('fs/promises');
const app = express();
const PORT = 8080;

let products;

async function readProducts() {
  const file = await fs.readFile('products.json', 'utf-8');
  products = JSON.parse(file);
}

app.get('/products', (req, res) => {
  const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : undefined;
  const result = limit ? products.slice(0, limit) : products;
  res.json(result);
});

app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(product => product.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.listen(PORT, async () => {
  await readProducts();
  console.log(`Server listening on port ${PORT}`);
});
