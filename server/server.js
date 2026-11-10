require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Expense = require('./models/Expense');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// DEMO: remove this route and its fixed user when building the real expense flow.
app.post('/api/demo/expense', async (req, res) => {
  try {
    const { name, amount, category } = req.body;
    const expenseName = typeof name === 'string' ? name.trim() : '';
    const rupees = Number(amount);
    const paise = Math.round(rupees * 100);

    if (!expenseName) {
      throw new Error('Expense name is required');
    }

    if (!Number.isFinite(rupees) || !Number.isSafeInteger(paise)) {
      throw new Error('Amount must be a valid amount in rupees');
    }

    const user = await User.findOneAndUpdate(
      { email: 'expense-demo@example.invalid' },
      {
        $setOnInsert: {
          name: 'Demo User',
          passwordHash: 'DEMO_ONLY_PLACEHOLDER_HASH',
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    const expense = await Expense.create({
      user: user._id,
      amount: paise,
      category,
      date: new Date().toISOString().slice(0, 10),
      note: expenseName,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });