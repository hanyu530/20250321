let radio; // 用於存放選項的 RADIO 物件
let inputBox; // 用於存放填空題的文字框
let button; // 用於送出的按鈕
let table; // 用於存放 CSV 資料
let currentQuestion = 0; // 當前題目索引
let correctCount = 0; // 答對的題數
let incorrectCount = 0; // 答錯的題數

function preload() {
  // 載入 CSV 檔案
  table = loadTable('questions.csv', 'csv', 'header');
}

function setup() { // 這是一個初始設定函數，只會執行一次
  // 產生一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
  // 設定背景顏色
  background("#1e6091");

  // 設定選項的 RADIO 物件
  radio = createRadio();
  radio.style('font-size', '35px');
  radio.style('color', 'black');

  // 設定填空題的文字框
  inputBox = createInput();
  inputBox.style('font-size', '20px');
  inputBox.hide(); // 預設隱藏，只有填空題時顯示

  // 設定送出按鈕
  button = createButton('下一題');
  button.style('font-size', '20px');
  button.mousePressed(nextQuestion); // 當按下按鈕時執行 nextQuestion 函數

  // 顯示第一題
  displayQuestion();
}

function draw() { // 這是一個重複執行的函數
  background("#1e6091"); // 設定背景顏色
  
  // 設定填充顏色
  fill("#ffc300");
  noStroke(); // 移除邊框

  // 計算矩形的位置與大小
  let rectWidth = windowWidth / 2;
  let rectHeight = windowHeight / 2;
  let rectX = (windowWidth - rectWidth) / 2;
  let rectY = (windowHeight - rectHeight) / 2;

  // 繪製矩形
  rect(rectX, rectY, rectWidth, rectHeight);

  // 顯示題目文字
  fill("black");
  textSize(35);
  textAlign(CENTER, CENTER);

  if (currentQuestion < table.getRowCount()) {
    const question = table.getString(currentQuestion, 'question');
    text(question, windowWidth / 2, windowHeight / 2 - 50);
  } else {
    // 顯示測驗結果
    text(`測驗結束！`, windowWidth / 2, windowHeight / 2 - 100);
    text(`答對題數：${correctCount}`, windowWidth / 2, windowHeight / 2 - 50);
    text(`答錯題數：${incorrectCount}`, windowWidth / 2, windowHeight / 2);
  }
}

// 當視窗大小改變時，調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  radio.position((windowWidth - 200) / 2, (windowHeight / 2) + 50); // 調整選項位置
  inputBox.position((windowWidth - 200) / 2, (windowHeight / 2) + 50); // 調整文字框位置
  button.position((windowWidth - 100) / 2, (windowHeight / 2) + 150); // 調整按鈕位置
}

function displayQuestion() {
  if (currentQuestion < table.getRowCount()) {
    // 清空選項和文字框
    radio.html('');
    inputBox.hide();

    // 取得當前題目的類型
    const type = table.getString(currentQuestion, 'type');

    if (type === 'choice') {
      // 顯示選項題
      const option1 = table.getString(currentQuestion, 'option1');
      const option2 = table.getString(currentQuestion, 'option2');
      const option3 = table.getString(currentQuestion, 'option3');
      const option4 = table.getString(currentQuestion, 'option4');

      // 設定選項
      radio.option(option1, option1);
      radio.option(option2, option2);
      radio.option(option3, option3);
      radio.option(option4, option4);
      radio.show();

      // 設定選項位置
      radio.position((windowWidth - 200) / 2, (windowHeight / 2) + 50);
    } else if (type === 'fill') {
      // 顯示填空題
      inputBox.show();
      inputBox.position((windowWidth - 200) / 2, (windowHeight / 2) + 50);
    }

    // 設定按鈕位置
    button.position((windowWidth - 100) / 2, (windowHeight / 2) + 150);
  } else {
    // 測驗結束，按鈕顯示「再試一次」
    button.html('再試一次');
    button.mousePressed(restartQuiz);
  }
}

function nextQuestion() {
  if (currentQuestion < table.getRowCount()) {
    const type = table.getString(currentQuestion, 'type');
    const correctAnswer = table.getString(currentQuestion, 'answer'); // 取得正確答案

    let answer;
    if (type === 'choice') {
      answer = radio.value(); // 獲取選中的選項值
    } else if (type === 'fill') {
      answer = inputBox.value(); // 獲取填空題的輸入值
    }

    // 判斷答案是否正確
    if (answer === correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }

    // 前往下一題
    currentQuestion++;
    displayQuestion();
  }
}

function restartQuiz() {
  // 重置測驗狀態
  currentQuestion = 0;
  correctCount = 0;
  incorrectCount = 0;
  button.html('下一題');
  button.mousePressed(nextQuestion);
  displayQuestion();
}
