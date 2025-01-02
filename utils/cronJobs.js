const cron = require('node-cron');
const geminiService = require('./geminiService');
const db = require('../config/database');

const ZODIAC_SIGNS = [
    'Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải',
    'Sư Tử', 'Xử Nữ', 'Thiên Bình', 'Bọ Cạp',
    'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư'
];

// Xóa dự đoán cũ
async function clearOldPredictions() {
    return new Promise((resolve, reject) => {
        const today = new Date().toISOString().split('T')[0];
        db.run(
            'DELETE FROM daily_horoscopes WHERE date < ?',
            [today],
            (err) => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

// Cập nhật dự đoán mới
async function updateDailyHoroscopes() {
    try {
        console.log('Bắt đầu cập nhật dự đoán hàng ngày...');
        
        // Xóa dự đoán cũ
        await clearOldPredictions();
        
        const today = new Date().toISOString().split('T')[0];
        
        // Lấy dự đoán mới cho tất cả các cung
        for (const sign of ZODIAC_SIGNS) {
            try {
                const prediction = await geminiService.getDailyHoroscope(sign, today);
                console.log(`Đã cập nhật dự đoán cho cung ${sign}`);
            } catch (error) {
                console.error(`Lỗi khi cập nhật dự đoán cho cung ${sign}:`, error);
            }
            
            // Delay giữa các request để tránh rate limit
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log('Hoàn thành cập nhật dự đoán hàng ngày');
    } catch (error) {
        console.error('Lỗi khi cập nhật dự đoán hàng ngày:', error);
    }
}

// Schedule cron job - chạy lúc 0:00 hàng ngày (UTC+7)
// '0 17 * * *' tương đương với 0:00 UTC+7 (vì server chạy ở UTC)
function initCronJobs() {
    cron.schedule('0 17 * * *', async () => {
        console.log('Bắt đầu cron job cập nhật dự đoán hàng ngày');
        await updateDailyHoroscopes();
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
    });

    console.log('Đã khởi tạo cron job cập nhật dự đoán hàng ngày');
}

module.exports = {
    initCronJobs,
    updateDailyHoroscopes // Export để có thể gọi thủ công khi cần
}; 