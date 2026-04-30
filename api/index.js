const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    if (!mongoURI) return;
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
  } catch (err) {
    console.error('DB Connection Error:', err.message);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// -- Safe Model Definition --
const getMessageModel = () => mongoose.models.Message || mongoose.model('Message', new mongoose.Schema({
  userId: String, text: String, sender: String, timestamp: { type: Date, default: Date.now }
}));

const getOrderModel = () => mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
  customer: Object, items: Array, totalAmount: Number, status: { type: String, default: 'Menunggu Pembayaran' }, 
  date: { type: Date, default: Date.now }, history: { type: Array, default: [] }
}));

// -- Endpoints --
app.get('/api/health', (req, res) => res.json({ status: 'OK', connected: isConnected }));

app.post('/api/userlogin', (req, res) => {
  res.json({ user: { name: req.body.email.split('@')[0], email: req.body.email } });
});

app.post('/api/register', (req, res) => {
  res.json({ user: { name: req.body.name, email: req.body.email } });
});

app.post('/api/orders', async (req, res) => {
  try {
    const Order = getOrderModel();
    const order = new Order({ ...req.body, history: [{ status: 'Menunggu Pembayaran', date: new Date(), notes: 'Pesanan diterima.' }] });
    await order.save();
    res.json({ id: order._id, ...order._doc });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders', async (req, res) => {
  try { res.json(await getOrderModel().find().sort({ date: -1 })); } catch (err) { res.json([]); }
});

app.post('/api/login', (req, res) => {
  if (req.body.username === 'admin' && req.body.password === 'admin123') res.json({ token: 'BOSS_TOKEN' });
  else res.status(401).json({ error: 'Gagal' });
});

module.exports = app;
