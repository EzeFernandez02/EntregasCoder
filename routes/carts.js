const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const cartsRouter = express.Router();

const cartPath = './data/cart.json';
const productPath = './data/products.json';

cartsRouter.post('/', (req, res) => {
  const cart = {
    id: uuidv4(),
    products: []
  };
  const data = JSON.stringify(cart);
  fs.writeFile(cartPath, data, (err) => {
    if (err) throw err;
    console.log('Cart created');
    res.status(201).json(cart);
  });
});

cartsRouter.get('/:cid', (req, res) => {
  const { cid } = req.params;
  fs.readFile(cartPath, 'utf8', (err, data) => {
    if (err) throw err;
    const cart = JSON.parse(data);
    if (cart.id !== cid) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    const products = cart.products;
    if (products.length === 0) {
      return res.status(404).json({ error: 'Cart is empty' });
    }
    const productIds = products.map((product) => product.id);
    fs.readFile(productPath, 'utf8', (err, data) => {
      if (err) throw err;
      const productList = JSON.parse(data);
      const cartProducts = productList.filter((product) =>
        productIds.includes(product.id.toString())
      );
      res.json(cartProducts);
    });
  });
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  // Check if cart exists
  fs.readFile(cartPath, 'utf8', (err, data) => {
    if (err) throw err;
    const cart = JSON.parse(data);
    if (cart.id !== cid) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Check if product exists
    fs.readFile(productPath, 'utf8', (err, data) => {
      if (err) throw err;
      const productList = JSON.parse(data);
      const product = productList.find(
        (product) => product.id.toString() === pid
      );
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Add product to cart
      const cartProducts = cart.products;
      const cartProduct = cartProducts.find((product) => product.id === pid);
      if (cartProduct) {
        cartProduct.quantity += quantity;
      } else {
        const newCartProduct = {
          id: pid,
          quantity: quantity
        };
        cartProducts.push(newCartProduct);
      }

      // Write updated cart to file
      const updatedCart = JSON.stringify(cart);
      fs.writeFile(cartPath, updatedCart, (err) => {
        if (err) throw err;
        console.log(`Product ${pid} added to cart ${cid}`);
        res.status(201).json({ success: true });
      });
    });
  });
});

module.exports = cartsRouter;
