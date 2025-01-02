require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const { initCronJobs, updateDailyHoroscopes } = require('./utils/cronJobs');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', routes);

// Khởi tạo cron jobs
initCronJobs();

// Chạy cập nhật ngay khi khởi động server
updateDailyHoroscopes().catch(console.error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 