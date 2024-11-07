document.getElementById('convertBtn').addEventListener('click', convertDateTime);

document.addEventListener('DOMContentLoaded', () => {
  loadSavedResults();
  document.querySelector('.clear-btn').addEventListener('click', clearResults);
});

function convertDateTime() {
  const date = document.getElementById('dateInput').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  
  if (!date || !startTime || !endTime) {
    alert('請填寫所有欄位！');
    return;
  }
  
  const dateObj = new Date(date);
  const result = formatDateTime(dateObj, startTime, endTime);
  
  addNewResult(result);
  saveResults();
}

function formatDateTime(date, startTime, endTime) {
  const weekdaysCH = ['日', '一', '二', '三', '四', '五', '六'];
  const weekdaysEN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthsEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const weekdayCH = weekdaysCH[date.getDay()];
  const weekdayEN = weekdaysEN[date.getDay()];
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const chineseFormat = `${year}年${month}月${day}日（星期${weekdayCH}）${startTime}-${endTime}`;
  
  const ordinalSuffix = getOrdinalSuffix(day);
  const englishFormat = `${startTime}–${endTime}, ${weekdayEN}, ${day}<sup>${ordinalSuffix}</sup> ${monthsEN[month-1]} ${year}`;
  
  return {
    chinese: chineseFormat,
    english: englishFormat,
    timestamp: new Date().getTime()
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

function addNewResult(result) {
  const resultsList = document.getElementById('resultsList');
  const resultItem = document.createElement('div');
  resultItem.className = 'result-item';
  resultItem.setAttribute('data-timestamp', result.timestamp);
  
  resultItem.innerHTML = `
    <div>
      <div class="format-container">
        <strong>中文格式：</strong>
      </div>
      <div class="code-display">${result.chinese}</div>
      <div class="format-container">
        <strong>HTML 代碼：</strong>
      </div>
      <div class="code-display">${escapeHtml(result.chinese)}</div>
    </div>
    <div>
      <div class="format-container">
        <strong>English Format：</strong>
      </div>
      <div class="code-display">${result.english}</div>
      <div class="format-container">
        <strong>HTML Code：</strong>
      </div>
      <div class="code-display">${escapeHtml(result.english)}</div>
    </div>
  `;
  
  resultsList.insertBefore(resultItem, resultsList.firstChild);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function saveResults() {
  const resultsList = document.getElementById('resultsList');
  const results = [];
  
  resultsList.querySelectorAll('.result-item').forEach(item => {
    const timestamp = item.getAttribute('data-timestamp');
    const codeDisplays = item.querySelectorAll('.code-display');
    results.push({
      timestamp: timestamp,
      chinese: codeDisplays[0].innerHTML,
      english: codeDisplays[2].innerHTML
    });
  });
  
  chrome.storage.local.set({ 'dateTimeResults': results }, function() {
    console.log('Results saved');
  });
}

function loadSavedResults() {
  chrome.storage.local.get(['dateTimeResults'], function(result) {
    if (result.dateTimeResults) {
      result.dateTimeResults.reverse().forEach(result => addNewResult(result));
    }
  });
}

function clearResults() {
  const confirmMessage = '確定要清除所有記錄嗎？\n此操作無法復原。';
  
  if (confirm(confirmMessage)) {
    chrome.storage.local.clear(() => {
      if (chrome.runtime.lastError) {
        console.error('清除儲存空間時發生錯誤：', chrome.runtime.lastError);
        alert('清除記錄時發生錯誤，請重試。');
        return;
      }
      
      const resultsList = document.getElementById('resultsList');
      resultsList.innerHTML = '';
      
      showClearSuccessMessage();
      console.log('記錄已成功清除');
    });
  }
}

function showClearSuccessMessage() {
  const successMessage = document.createElement('div');
  successMessage.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 1000;
    animation: fadeInOut 2s ease-in-out;
  `;
  successMessage.textContent = '所有記錄已清除';
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; }
      15% { opacity: 1; }
      85% { opacity: 1; }
      100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(successMessage);
  
  setTimeout(() => {
    document.body.removeChild(successMessage);
    document.head.removeChild(style);
  }, 2000);
} 