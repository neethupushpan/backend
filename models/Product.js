import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: Number
});

export default mongoose.model('Product', productSchema);