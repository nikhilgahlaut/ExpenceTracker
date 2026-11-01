import { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [status, setStatus] = useState('checking...');

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/health')
      .then((res) => setStatus(res.data.status))
      .catch(() => setStatus('server not reachable'));
  }, []);

  return <h1>Expense Tracker | API: {status}</h1>;
}