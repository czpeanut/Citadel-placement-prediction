// script.js

let schoolData = [];

const scoreTable = {
  "台南市": { C: 1, B: 2, "B+": 3, "B++": 4, A: 5, "A+": 6, "A++": 7 },
  "高雄市": { C: 2, B: 4, "B+": 4, "B++": 4, A: 6, "A+": 6, "A++": 6 },
  "台中市": { C: 2, B: 4, "B+": 4, "B++": 4, A: 6, "A+": 6, "A++": 6 },
  "宜蘭市": { C: 1, B: 2, "B+": 2.3, "B++": 2.6, A: 3, "A+": 3, "A++": 3 },
  "屏東市": { C: 1, B: 3, "B+": 3.5, "B++": 4, A: 5, "A+": 5, "A++": 5 }
};

const writingTable = {
  "台南市": { 6: 1, 5: 0.8, 4: 0.6, 3: 0.4, 2: 0.2, 1: 0.1, 0: 0 },
  "屏東市": { 6: 1, 5: 1, 4: 0.5, 3: 0.5, 2: 0, 1: 0, 0: 0 }
};

function getScore(city, subject, value) {
  const table = scoreTable[city] || {};
  return table[value] || 0;
}

function getWritingScore(city, level) {
  const table = writingTable[city] || {};
  return table[level] ?? 0;
}

fetch("schools.json")
  .then((res) => res.json())
  .then((data) => {
    schoolData = data;
    document.getElementById("score-form").addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("student-name").value.trim();
      const phone = document.getElementById("contact-phone").value.trim();
      const city = document.getElementById("city").value;
      const writing = document.getElementById("writing").value;

      const subjects = ["chinese", "english", "math", "science", "social"];
      let total = 0;
      subjects.forEach((id) => {
        const value = document.getElementById(id).value;
        total += getScore(city, id, value);
      });

      total += getWritingScore(city, writing);

      const safeList = [];
      const riskyList = [];
      const dangerList = [];

      const filtered = schoolData.filter((s) => s.縣市 === city);

      filtered.forEach((s) => {
        const diff = total - s.預估錄取分數;
        if (diff >= 3) safeList.push(s.學校);
        else if (diff >= 0) riskyList.push(s.學校);
        else if (diff > -3) dangerList.push(s.學校);
      });

      // 清除並顯示結果
      const safeUl = document.querySelector("#safe ul");
      safeUl.innerHTML = "";
      safeList.forEach((schoolName) => {
        const li = document.createElement("li");
        li.textContent = schoolName;
        safeUl.appendChild(li);
      });

      const riskyUl = document.querySelector("#risky ul");
      riskyUl.innerHTML = "";
      riskyList.forEach((schoolName) => {
        const li = document.createElement("li");
        li.textContent = schoolName;
        riskyUl.appendChild(li);
      });

      const dangerUl = document.querySelector("#danger ul");
      dangerUl.innerHTML = "";
      dangerList.forEach((schoolName) => {
        const li = document.createElement("li");
        li.textContent = schoolName;
        dangerUl.appendChild(li);
      });

      document.getElementById("result").style.display = "block";

      // Google 表單送出
      const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSde06ipoJ13R9ScEkmzZcqxuo-FfH7ZvvYbO3F12GF_J13sow/formResponse";
      const formData = new FormData();
      formData.append("entry.1443068889", name);
      formData.append("entry.135201981", phone);
      formData.append("entry.977897966", document.getElementById("chinese").value);
      formData.append("entry.1550956144", document.getElementById("english").value);
      formData.append("entry.1358965558", document.getElementById("math").value);
      formData.append("entry.1044822364", document.getElementById("science").value);
      formData.append("entry.630863529", document.getElementById("social").value);
      formData.append("entry.523532941", writing);
      formData.append("entry.1905645741", city);
      formData.append("entry.1640508304", safeList.join(", "));
      formData.append("entry.1852642474", riskyList.join(", "));
      formData.append("entry.748458775", dangerList.join(", "));

      fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });
    });
  });
