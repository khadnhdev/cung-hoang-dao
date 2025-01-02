const express = require('express');
const router = express.Router();
const geminiService = require('../utils/geminiService');
const { getZodiacSign } = require('../utils/zodiacUtils');

const ZODIAC_SYMBOLS = {
  'Bạch Dương': '♈',
  'Kim Ngưu': '♉',
  'Song Tử': '♊',
  'Cự Giải': '♋',
  'Sư Tử': '♌',
  'Xử Nữ': '♍',
  'Thiên Bình': '♎',
  'Bọ Cạp': '♏',
  'Nhân Mã': '♐',
  'Ma Kết': '♑',
  'Bảo Bình': '♒',
  'Song Ngư': '♓'
};

const ZODIAC_SIGNS = [
  'Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải',
  'Sư Tử', 'Xử Nữ', 'Thiên Bình', 'Bọ Cạp',
  'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư'
];

router.get('/', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const dailyPredictions = {};

    // Lấy dự đoán cho tất cả các cung
    for (const sign of ZODIAC_SIGNS) {
      try {
        const prediction = await geminiService.getDailyHoroscope(sign, today);
        dailyPredictions[sign] = prediction;
      } catch (error) {
        console.error(`Error getting prediction for ${sign}:`, error);
        dailyPredictions[sign] = 'Không thể lấy dự đoán. Vui lòng thử lại sau.';
      }
    }

    res.render('index', { 
      dailyPredictions,
      error: null,
      getZodiacSymbol: (sign) => ZODIAC_SYMBOLS[sign] || '★'
    });
  } catch (error) {
    console.error('Error getting daily predictions:', error);
    res.render('index', { 
      dailyPredictions: {},
      error: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
      getZodiacSymbol: (sign) => ZODIAC_SYMBOLS[sign] || '★'
    });
  }
});

router.post('/horoscope', async (req, res) => {
  try {
    const { day, month, year } = req.body;
    const zodiacSign = getZodiacSign(parseInt(day), parseInt(month));
    const birthDate = `${day}/${month}/${year}`;
    
    let reading = await geminiService.getHoroscopeReading(zodiacSign, birthDate);
    // Đảm bảo kết quả được trả về đúng định dạng
    reading = reading.replace(/\r\n/g, '\n').trim();
    
    res.render('horoscope', { 
      zodiacSign, 
      reading, 
      birthDate 
    });
  } catch (error) {
    console.error('Horoscope error:', error);
    res.status(500).render('error', { error: error.message });
  }
});

router.post('/compatibility', async (req, res) => {
  try {
    const { sign1, sign2 } = req.body;
    let result = await geminiService.getCompatibility(sign1, sign2);
    // Đảm bảo kết quả được trả về đúng định dạng
    result = result.replace(/\r\n/g, '\n').trim();
    
    res.render('compatibility', { 
      sign1, 
      sign2, 
      result 
    });
  } catch (error) {
    console.error('Compatibility error:', error);
    res.status(500).render('error', { error: error.message });
  }
});

module.exports = router; 