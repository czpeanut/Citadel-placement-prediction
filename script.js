// script.js

const form = document.getElementById("score-form");
const resultSection = document.getElementById("result");

// 成績對照表：根據縣市
const scoreMap = {
  "台南市": {
    grade: { C: 1, B: 2, "B+": 3, "B++": 4, A: 5, "A+": 6, "A++": 7 },
    writing: { 6: 1, 5: 0.8, 4: 0.6, 3: 0.4, 2: 0.2, 1: 0.1, 0: 0 }
  },
  "高雄市": {
    grade: { C: 2, B: 4, "B+": 4, "B++": 4, A: 6, "A+": 6, "A++": 6 },
    writing: { 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 }
  },
  "台中市": {
    grade: { C: 2, B: 4, "B+": 4, "B++": 4, A: 6, "A+": 6, "A++": 6 },
    writing: { 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 }
  },
  "宜蘭市": {
    grade: { C: 1, B: 2, "B+": 2.3, "B++": 2.6, A: 3, "A+": 3, "A++": 3 },
    writing: { 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 }
  },
  "屏東市": {
    grade: { C: 1, B: 3, "B+": 3.5, "B++": 4, A: 5, "A+": 5, "A++": 5 },
    writing: { 6: 1, 5: 1, 4: 0.5, 3: 0.5, 2: 0, 1: 0, 0: 0 }
  }
};

let schoolData = [];

fetch("schools.json")
  .then((res) => res.json())
  .then((data) => {
    schoolData = data;
  });

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("student-name").value.trim();
  const phone = document.getElementById("contact-phone").value.trim();
  const city = document.getElementById("city").value;

  const grades = {
    chinese: document.getElementById("chinese").value,
    english: document.getElementById("english").value,
    math: document.getElementById("math").value,
    science: document.getElementById("science").value,
    social: document.getElementById("social").value,
    writing: document.getElementById("writing").value
  };

  const mapping = scoreMap[city];
  let total =
    mapping.grade[grades.chinese] +
    mapping.grade[grades.english] +
    mapping.grade[grades.math] +
    mapping.grade[grades.science] +
    mapping.grade[grades.social] +
    mapping.writing[grades.writing];

  const safeList = [];
  const riskyList = [];
  const dangerList = [];

  schoolData
    .filter((s) => s.縣市 === city)
    .forEach((s) => {
      const diff = total - s.預估錄取分數;
      if (diff >= 3) safeList.push(s.學校);
      else if (diff >= 0) riskyList.push(s.學校);
      else if (diff > -3) dangerList.push(s.學校);
    });

  document.querySelector("#safe ul").innerHTML = safeList.map((s) => `<li>${s}</li>`).join("");
  document.querySelector("#risky ul").innerHTML = riskyList.map((s) => `<li>${s}</li>`).join("");
  document.querySelector("#danger ul").innerHTML = dangerList.map((s) => `<li>${s}</li>`).join("");
  resultSection.style.display = "block";

  // Google 表單填寫
  const params = new URLSearchParams();
  params.append("entry.1443068889", name);
  params.append("entry.135201981", phone);
  params.append("entry.977897966", grades.chinese);
  params.append("entry.1550956144", grades.english);
  params.append("entry.1358965558", grades.math);
  params.append("entry.1044822364", grades.science);
  params.append("entry.630863529", grades.social);
  params.append("entry.523532941", grades.writing);
  params.append("entry.1905645741", city);
  params.append("entry.1640508304", safeList.join(", "));
  params.append("entry.1852642474", riskyList.join(", "));
  params.append("entry.748458775", dangerList.join(", "));

  fetch("https://docs.google.com/forms/d/e/1FAIpQLSde06ipoJ13R9ScEkmzZcqxuo-FfH7ZvvYbO3F12GF_J13sow/formResponse", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });
});
