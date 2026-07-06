require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3008;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'ms8-real-time-notifications' });
});

app.listen(PORT, () => {
  console.log(`[MS8] Real-Time Notifications running on port ${PORT}`);
});
