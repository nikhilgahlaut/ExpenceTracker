import { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [status, setStatus] = useState('checking...');
  const [form, setForm] = useState({ name: '', amount: '', category: '' });
  const [savedExpense, setSavedExpense] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/health')
      .then((res) => setStatus(res.data.status))
      .catch(() => setStatus('server not reachable'));
  }, []);

  async function addExpense(event) {
    event.preventDefault();
    setError('');
    setSavedExpense(null);

    try {
      const res = await axios.post('http://localhost:4000/api/demo/expense', form);
      setSavedExpense(res.data);
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message);
    }
  }

  return (
    <main>
      <h1>Expense Tracker | API: {status}</h1>
      {/* DEMO: remove this form when building the real screens. */}
      <form onSubmit={addExpense}>
        <label>
          Expense name{' '}
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>{' '}
        <label>
          Amount in rupees{' '}
          <input
            type="text"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
          />
        </label>{' '}
        <label>
          Category{' '}
          <input
            type="text"
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          />
        </label>{' '}
        <button type="submit">Add to DB</button>
      </form>
      {error && <p role="alert">{error}</p>}
      {savedExpense && (
        <section aria-live="polite">
          <h2>Saved to MongoDB</h2>
          <p>
            <strong>{savedExpense.note}</strong>{' '}
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
            }).format(savedExpense.amount / 100)}
          </p>
          <p>
            {savedExpense.category} ·{' '}
            {new Intl.DateTimeFormat('en-IN', {
              dateStyle: 'medium',
              timeZone: 'UTC',
            }).format(new Date(savedExpense.date))}
          </p>
          <small>ID: {savedExpense._id}</small>
        </section>
      )}
    </main>
  );
}