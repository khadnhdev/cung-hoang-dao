const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Tạo thư mục data nếu chưa tồn tại
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'horoscope.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to database successfully');
    }
});

// Tạo các bảng cần thiết
db.serialize(() => {
    // Bảng lưu dự đoán hàng ngày
    db.run(`CREATE TABLE IF NOT EXISTS daily_horoscopes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zodiac_sign TEXT NOT NULL,
        date TEXT NOT NULL,
        prediction TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(zodiac_sign, date)
    )`, (err) => {
        if (err) {
            console.error('Error creating daily_horoscopes table:', err);
        }
    });

    // Bảng lưu kết quả độ hợp
    db.run(`CREATE TABLE IF NOT EXISTS compatibility_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sign1 TEXT NOT NULL,
        sign2 TEXT NOT NULL,
        result TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(sign1, sign2)
    )`, (err) => {
        if (err) {
            console.error('Error creating compatibility_results table:', err);
        }
    });
});

// Xử lý khi đóng ứng dụng
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});

module.exports = db; 