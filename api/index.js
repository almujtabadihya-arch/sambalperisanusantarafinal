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
  orderId: String, customer: Object, items: Array, totalAmount: Number, status: { type: String, default: 'Menunggu Pembayaran' }, 
  date: { type: Date, default: Date.now }, history: { type: Array, default: [] }
}));

const getMessageModel = () => mongoose.models.Message || mongoose.model('Message', new mongoose.Schema({
  userId: String, text: String, sender: String, timestamp: { type: Date, default: Date.now }
}));

// -- Endpoints --
app.post('/api/userlogin', (req, res) => {
  res.json({ user: { name: req.body.email.split('@')[0], email: req.body.email } });
});

app.post('/api/register', (req, res) => {
  res.json({ user: { name: req.body.name, email: req.body.email } });
});

app.post('/api/orders', async (req, res) => {
  try {
    const Order = getOrderModel();
    const shortId = 'PRSA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const order = new Order({ 
      ...req.body, 
      orderId: shortId,
      history: [{ status: 'Menunggu Pembayaran', date: new Date(), notes: 'Pesanan diterima.' }] 
    });
    await order.save();
    res.json({ id: order._id, orderId: shortId, ...order._doc });
  } catch (err) { res.status(500).json({ error: err.message }); }
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

export default app;
