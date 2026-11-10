const mongoose = require('mongoose');

const CATEGORIES = [
  'food',
  'transport',
  'rent',
  'bills',
  'shopping',
  'health',
  'entertainment',
  'other',
];

function toUtcMidnight(value) {
  if (value == null) return value;

  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(NaN);
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return new Date(NaN);
  }

  return date;
}

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least ₹ 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Amount must be a whole number of paise',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      set: toUtcMidnight,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, 'Note cannot be longer than 200 characters'],
    },
  },
  { timestamps: true }
);

expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1, date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
module.exports.CATEGORIES = CATEGORIES;