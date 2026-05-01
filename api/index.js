import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    if (!mongoURI) return;
    await mongoose.connect(mongoURI);
    isConnected = true;
  } catch (err) {}
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// -- Models --
const getOrderModel = () => mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
  id: String, // ID unik buat database
  orderId: String, 
  customer: Object, 
  items: Array, 
  totalAmount: Number, 
  status: { type: String, default: 'Menunggu Pembayaran' }, 
  date: { type: Date, default: Date.now }, 
  history: { type: Array, default: [] }
}));

const getMessageModel = () => mongoose.models.Message || mongoose.model('Message', new mongoose.Schema({
  userId: String, text: String, sender: String, timestamp: { type: Date, default: Date.now }
}));

// -- Endpoints --
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ token: 'mock-admin-token-123' });
  } else {
    res.status(401).json({ error: 'Username atau password salah!' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const Order = getOrderModel();
    const shortId = 'PRSA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const longId = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 10000); // ID Unik Anti-Duplicate
    
    const order = new Order({ 
      ...req.body, 
      id: longId, // WAJIB ADA BIAR GAK ERROR DUP KEY
      orderId: shortId,
      history: [{ status: 'Menunggu Pembayaran', date: new Date(), notes: 'Pesanan diterima.' }] 
    });
    await order.save();
    res.json({ id: longId, orderId: shortId, ...order._doc });
  } catch (err) { 
    console.error('Order Error:', err);
    res.status(500).json({ error: err.message }); 
  }
});

app.get('/api/orders', async (req, res) => {
  try { res.json(await getOrderModel().find().sort({ date: -1 })); } catch (err) { res.json([]); }
});

app.post('/api/messages', async (req, res) => {
  try {
    const Message = getMessageModel();
    const msg = new Message(req.body);
    await msg.save();
    res.json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/messages/:userId', async (req, res) => {
  try { res.json(await getMessageModel().find({ userId: req.params.userId })); } catch (err) { res.json([]); }
});

app.get('/api/messages/admin/list', async (req, res) => {
  try {
    const messages = await getMessageModel().find().sort({ timestamp: 1 });
    const chats = {};
    messages.forEach(m => {
      if (!chats[m.userId]) chats[m.userId] = [];
      chats[m.userId].push(m);
    });
    res.json(chats);
  } catch (err) { res.json({}); }
});

export default app;
