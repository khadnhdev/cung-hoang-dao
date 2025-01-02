function getZodiacSign(day, month) {
  const dates = {
    'Bảo Bình': { start: [1, 20], end: [2, 18] },
    'Song Ngư': { start: [2, 19], end: [3, 20] },
    'Bạch Dương': { start: [3, 21], end: [4, 19] },
    'Kim Ngưu': { start: [4, 20], end: [5, 20] },
    'Song Tử': { start: [5, 21], end: [6, 20] },
    'Cự Giải': { start: [6, 21], end: [7, 22] },
    'Sư Tử': { start: [7, 23], end: [8, 22] },
    'Xử Nữ': { start: [8, 23], end: [9, 22] },
    'Thiên Bình': { start: [9, 23], end: [10, 22] },
    'Bọ Cạp': { start: [10, 23], end: [11, 21] },
    'Nhân Mã': { start: [11, 22], end: [12, 21] },
    'Ma Kết': { start: [12, 22], end: [1, 19] }
  };

  for (const [sign, period] of Object.entries(dates)) {
    if (
      (month === period.start[0] && day >= period.start[1]) ||
      (month === period.end[0] && day <= period.end[1])
    ) {
      return sign;
    }
  }
  return 'Ma Kết'; // Default for edge case
}

module.exports = {
  getZodiacSign
}; 