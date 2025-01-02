const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/database');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
  }

  async getDailyHoroscope(zodiacSign, date) {
    // Kiểm tra cache trước
    const cached = await this.getCachedDailyHoroscope(zodiacSign, date);
    if (cached) {
      return cached;
    }

    const prompt = `Hãy đưa ra dự đoán ngày ${date} cho cung hoàng đạo ${zodiacSign}.
    Trả lời theo format sau (chỉ trả về nội dung, không cần tiêu đề):

    May mắn:
    [Mức độ may mắn và các con số may mắn]

    Tổng quan:
    [Tổng quan về vận mệnh trong ngày]

    Tình cảm:
    [Dự đoán về tình cảm]

    Công việc:
    [Dự đoán về công việc]

    Lời khuyên:
    [Lời khuyên cho ngày hôm nay]`;

    try {
      const result = await this.model.generateContent(prompt);
      const prediction = result.response.text();
      
      // Lưu vào cache
      await this.cacheDailyHoroscope(zodiacSign, date, prediction);
      
      return prediction;
    } catch (error) {
      console.error('Error getting daily horoscope:', error);
      throw error;
    }
  }

  async getCachedDailyHoroscope(zodiacSign, date) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT prediction FROM daily_horoscopes WHERE zodiac_sign = ? AND date = ?',
        [zodiacSign, date],
        (err, row) => {
          if (err) reject(err);
          resolve(row ? row.prediction : null);
        }
      );
    });
  }

  async cacheDailyHoroscope(zodiacSign, date, prediction) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT OR REPLACE INTO daily_horoscopes (zodiac_sign, date, prediction)
         VALUES (?, ?, ?)`,
        [zodiacSign, date, prediction],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  async getHoroscopeReading(zodiacSign, birthDate) {
    const prompt = `Hãy phân tích chi tiết về cung hoàng đạo ${zodiacSign} cho người sinh ngày ${birthDate}. 
    Trả lời theo format sau (chỉ trả về nội dung, không cần tiêu đề):

    Tính cách:
    [Phân tích chi tiết về tính cách, đặc điểm nổi bật]

    Sự nghiệp:
    [Phân tích về con đường sự nghiệp, cơ hội, thách thức]

    Tình cảm:
    [Phân tích về tình yêu, các mối quan hệ]

    Tài chính:
    [Phân tích về tài chính, tiền bạc]`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting horoscope reading:', error);
      throw error;
    }
  }

  async getCompatibility(sign1, sign2) {
    const prompt = `Hãy phân tích độ hợp giữa cung hoàng đạo ${sign1} và ${sign2}. 
    Trả lời theo format sau (chỉ trả về nội dung, không cần tiêu đề):

    Tình cảm:
    [Phân tích chi tiết về sự hợp nhau trong tình yêu]

    Bạn bè:
    [Phân tích về tình bạn và sự hợp tác]

    Công việc:
    [Phân tích về môi trường làm việc chung]

    Lời khuyên:
    [Đưa ra lời khuyên cho mối quan hệ]`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting compatibility:', error);
      throw error;
    }
  }
}

module.exports = new GeminiService(); 