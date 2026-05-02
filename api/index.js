import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

let isConnected = false;
let fallbackOrders = [];
let fallbackMessages = [];

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
  id: String, 
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

const getUserModel = () => mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: String, email: String, password: String
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

app.post('/api/register', async (req, res) => {
  try {
    const User = getUserModel();
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ user: { name: newUser.name, email: newUser.email } });
  } catch (err) { res.status(500).json({ error: 'Gagal daftar' }); }
});

app.post('/api/userlogin', async (req, res) => {
  try {
    const User = getUserModel();
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.json({ user: { name: user.name, email: user.email } });
    } else {
        res.status(401).json({ error: 'Email atau password salah!' });
    }
  } catch (err) { res.status(500).json({ error: 'Gagal login' }); }
});

app.post('/api/orders', async (req, res) => {
  try {
    const shortId = 'PRSA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const longId = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
    const orderData = { 
      ...req.body, 
      id: longId,
      orderId: shortId,
      date: new Date(),
      status: 'Menunggu Pembayaran',
      history: [{ status: 'Menunggu Pembayaran', date: new Date(), notes: 'Pesanan diterima.' }] 
    };

    if (isConnected) {
      const Order = getOrderModel();
      const order = new Order(orderData);
      await order.save();
    } else {
      fallbackOrders.push(orderData);
    }
    
    res.json(orderData);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders', async (req, res) => {
  try { 
    if (isConnected) {
      res.json(await getOrderModel().find().sort({ date: -1 })); 
    } else {
      res.json([...fallbackOrders].reverse());
    }
  } catch (err) { res.json([]); }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (isConnected) {
      const Order = getOrderModel();
      const order = await Order.findOne({ 
        $or: [{ id: req.params.id }, { orderId: req.params.id }] 
      });
      if (!order) return res.status(404).json({ error: 'Gak ketemu' });
      order.status = status;
      order.history.push({ status, date: new Date(), notes: notes || `Status jadi ${status}` });
      await order.save();
      return res.json(order);
    } else {
      const orderIndex = fallbackOrders.findIndex(o => o.id === req.params.id || o.orderId === req.params.id);
      if (orderIndex === -1) return res.status(404).json({ error: 'Gak ketemu' });
      fallbackOrders[orderIndex].status = status;
      fallbackOrders[orderIndex].history.push({ status, date: new Date(), notes: notes || `Status jadi ${status}` });
      return res.json(fallbackOrders[orderIndex]);
    }
  } catch (err) { res.status(500).json({ error: 'Gagal update' }); }
});

app.post('/api/messages', async (req, res) => {
  try {
    const msgData = { ...req.body, timestamp: new Date() };
    if (isConnected) {
      const Message = getMessageModel();
      const msg = new Message(msgData);
      await msg.save();
      res.json(msg);
    } else {
      msgData._id = 'msg-' + Date.now();
      fallbackMessages.push(msgData);
      res.json(msgData);
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/messages/:userId', async (req, res) => {
  try { 
    if (isConnected) {
      res.json(await getMessageModel().find({ userId: req.params.userId })); 
    } else {
      res.json(fallbackMessages.filter(m => m.userId === req.params.userId));
    }
  } catch (err) { res.json([]); }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    if (isConnected) {
      await getMessageModel().findByIdAndDelete(req.params.id);
    } else {
      fallbackMessages = fallbackMessages.filter(m => m._id !== req.params.id);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Gagal hapus' }); }
});

app.get('/api/messages/admin/list', async (req, res) => {
  try {
    let messages = isConnected ? await getMessageModel().find().sort({ timestamp: 1 }) : fallbackMessages;
    const chats = {};
    messages.forEach(m => {
      if (!chats[m.userId]) chats[m.userId] = [];
      chats[m.userId].push(m);
    });
    res.json(chats);
  } catch (err) { res.json({}); }
});

export default app;
