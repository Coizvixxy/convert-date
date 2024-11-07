function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('日期時間轉換')
    .addItem('轉換格式', 'showDateTimePicker')
    .addToUi();
}

function showDateTimePicker() {
  const html = HtmlService.createHtmlOutput(getHtml())
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, '選擇日期和時間');
}

function formatDateTime(dateStr, startTime, endTime) {
  const date = new Date(dateStr);
  
  // 獲取星期幾
  const weekdaysCH = ['日', '一', '二', '三', '四', '五', '六'];
  const weekdaysEN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdayCH = weekdaysCH[date.getDay()];
  const weekdayEN = weekdaysEN[date.getDay()];
  
  // 獲取日期部分
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 格式化中文日期
  const chineseFormat = `${year}年${month}月${day}日（星期${weekdayCH}）${startTime}-${endTime}`;
  
  // 格式化英文日期
  const monthsEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const ordinalSuffix = getOrdinalSuffix(day);
  const englishFormat = `${startTime}–${endTime}, ${weekdayEN}, ${day}<sup>${ordinalSuffix}</sup> ${monthsEN[month-1]} ${year}`;
  
  return {
    chinese: chineseFormat,
    english: englishFormat
  };
}

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
} 