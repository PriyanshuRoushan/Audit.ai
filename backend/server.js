import dotenv from 'dotenv';
import app from './app.js';
import './src/cron/pricingMonitor.cron.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});