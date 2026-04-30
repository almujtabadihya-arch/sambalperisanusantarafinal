import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

// -- Database Logic --
let isConnected = false;
const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) return;
    try {
          if (!mongoURI) throw new Error('MONGO_URI is missing');
          await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
          isConnected = true;
    } catch (err) {
          console.error('DB Error:', err.message);
    }
};

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    category: String,
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const messageSchema = new mongoose.Schema({
    userId: String,
    text: String,
    sender: String,
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

// -- Routes --
app.get('/api/health', async (req, res) => {
    await connectDB();
    res.json({ 
                 status: 'OK', 
          db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' 
    });
});

app.get('/api/products', async (req, res) => {
    await connectDB();
    try {
          const products = await Product.find();
    res.json(products);
    } catch (err) {
          res.status(500).json({ error: err.message });
    }
});

app.post('/api/orders', async (req, res) => {
    // Mock order handler
           res.json({ message: 'Order received!', order: req.body });
});

app.post('/api/messages', async (req, res) => {
    await connectDB();
    try {
          const msg = new Message(req.body);
          await msg.save();
          res.json(msg);
    } catch (err) {
          res.status(500).json({ error: err.message });
    }
});

app.get('/api/messages/:userId', async (req, res) => {
    await connectDB();
    try {
          const msgs = await Message.find({ userId: req.params.userId }).sort({ timestamp: 1 });
          res.json(msgs);
    } catch (err) {
          res.json([]);
    }
});

app.get('/api/messages/admin/list', async (req, res) => {
    await connectDB();
    try {
          const users = await Message.distinct('userId');
          const result = {};
          for (const u of users) {
                  result[u] = await Message.find({ userId: u }).sort({ timestamp: 1 });
          }
          res.json(result);
    } catch (err) {
          res.json({});
    }
});

app.post('/api/login', (req, res) => {
    if (req.body.username === 'admin' && req.body.password === 'admin123') {
          res.json({ token: 'BOSS_TOKEN' });
    } else {
          res.status(401).json({ error: 'Login Gagal!' });
    }
});

app.post('/api/userlogin', (req, res) => {
    res.json({ user: { name: req.body.email.split('@')[0], email: req.body.email } });
});

app.post('/api/register', (req, res) => {
    res.json({ user: { name: req.body.name, email: req.body.email } });
});

export default app;
