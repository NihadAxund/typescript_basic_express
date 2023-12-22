import express, { Request, Response } from 'express';
import mongoose, { Schema, Document } from 'mongoose';

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/dbtype');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
}

const Product = mongoose.model<IProduct>('Product', new Schema({
  name: String,
  description: String,
  price: Number,
}));


app.get('/products', async (req: Request, res: Response) => {
  const products = await Product.find();
  res.json(products);
});


app.get('/products/:id', async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});


app.post('/products', async (req: Request, res: Response) => {
  const { name, description, price } = req.body;
  const product = new Product({ name, description, price });
  await product.save();
  res.json(product);
});


app.put('/products/:id', async (req: Request, res: Response) => {
  const { name, description, price } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, description, price },
    { new: true }
  );
  res.json(product);
});


app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

app.listen(port, () => {
  console.log(`The application is running at http://localhost:${port}`);
});
