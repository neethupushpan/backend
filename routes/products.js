import express from 'express';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', authMiddleware, async (req, res) => {
    const { title, image, price } = req.body;
  
    if (!title || !image || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const newProduct = new Product({ title, image, price });
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

export default router;