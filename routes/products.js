const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.use(express.json());

const readProducts = () => {
  const products = JSON.parse(fs.readFileSync('products.json').toString());
  return products;
};


const writeProducts = (products, indent = 2) => {
  fs.writeFileSync('products.json', JSON.stringify(products, null, indent));
};


router.get('/', (req, res) => {
  const products = readProducts();

  if (req.query.limit) {
    res.json(products.slice(0, req.query.limit));
  } else {
    res.json(products);
  }
});

router.get('/:pid', (req, res) => {
  const products = readProducts();
  const product = products.find((p) => p.id === parseInt(req.params.pid));

  if (!product) {
    return res.status(404).send('Product not found');
  }

  res.json(product)
});

router.post('/', (req, res) => {
  const products = readProducts();

  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).send('Missing fields');
  }

  const newProduct = {
    id: uuidv4(),
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails: thumbnails || [],
  };

  products.push(newProduct);

  writeProducts(products);

  res.json(newProduct);
});

router.put('/:pid', (req, res) => {
  const products = readProducts();
  const productIndex = products.findIndex((p) => p.id == req.params.pid);


  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }

  const { id, ...updatedFields } = req.body;

  if (id) {
    return res.status(400).send('Cannot update ID field');
  }

  products[productIndex] = {
    ...products[productIndex],
    ...updatedFields,
  };
  
  writeProducts(products);

  res.json(updatedFields)
});

router.delete('/:pid', (req, res) => {
  const products = readProducts();
  const filteredProducts = products.filter((p) => p.id !== req.params.pid);

  if (filteredProducts.length === products.length) {
    return res.status(404).send('Product not found');
  }

  writeProducts(filteredProducts);

  res.sendStatus(204);
});

module.exports = router;
