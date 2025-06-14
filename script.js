document.getElementById("score-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const gradeValue = {
    "台南市": { "C": 1, "B": 2, "B+": 3, "B++": 4, "A": 5, "A+": 6, "A++": 7 },
    "高雄市": { "C": 2, "B": 4, "B+": 4, "B++": 4, "A": 6, "A+": 6, "A++": 6 },
    "台中市": { "C": 2, "B": 4, "B+": 4, "B++": 4, "A": 6, "A+": 6, "A++": 6 },
    "宜蘭市": { "C": 1, "B": 2, "B+": 2.3, "B++": 2.6, "A": 3, "A+": 3, "A++": 3 },
    "屏東市": { "C": 1, "B": 3, "B+": 3.5, "B++": 4, "A": 5, "A+": 5, "A++": 5 }
  };

  const writingValue = {
  "台南市": { 6: 1, 5: 0.8, 4: 0.6, 3: 0.4, 2: 0.2, 1: 0.1, 0: 0 },
  "屏東市": { 6: 1, 5: 1, 4: 0.5, 3: 0.5, 2: 0, 1: 0, 0: 0 },
  "高雄市": { 6: 1, 5: 0.8, 4: 0.6, 3: 0.4, 2: 0.2, 1: 0.1, 0: 0 },
  "台中市": { 6: 1, 5: 0.8, 4: 0.6, 3: 0.4, 2: 0.2, 1: 0.1, 0: 0 },
  "宜蘭市": { 6: 1, 5: 0.8, 4: 0.6, 3: 0.4, 2: 0.2, 1: 0.1, 0: 0 } // 如果也要支援宜蘭
};

  const getGrade = (id) => document.getElementById(id).value;
  const city = document.getElementById("city").value;
  const name = document.getElementById("student-name").value.trim();
  const phone = document.getElementById("contact-phone").value.trim();

  if (!city || !name || !phone) {
    alert("請填寫所有欄位");
    return;
  }

  const scoreMap = gradeValue[city];
  const writingScore = writingValue[city]?.[parseInt(getGrade("writing"))] ?? 0;

  const total =
    scoreMap[getGrade("chinese")] +
    scoreMap[getGrade("english")] +
    scoreMap[getGrade("math")] +
    scoreMap[getGrade("science")] +
    scoreMap[getGrade("social")] +
    writingScore;

  // 清空舊結果
  ["safe", "risky", "danger"].forEach((id) => {
    document.querySelector(`#${id} ul`).innerHTML = "";
  });

  // 載入學校資料
  let schools;
  try {
    const res = await fetch("schools.json");
    schools = await res.json();
  } catch (err) {
    alert("無法載入學校資料");
    return;
  }

  const filtered = schools.filter((s) => s.city === city);

  const safeList = [];
  const riskyList = [];
  const dangerList = [];

  // 判斷是否為「完美條件」
  const allGrades = [
    getGrade("chinese"),
    getGrade("english"),
    getGrade("math"),
    getGrade("science"),
    getGrade("social")
  ];
  const isPerfect = allGrades.every(g => g === "A++") && getGrade("writing") === "6";

  filtered.forEach((school) => {
    const li = document.createElement("li");
    li.textContent = school.school;

    if (isPerfect) {
      document.querySelector("#safe ul").appendChild(li);
      safeList.push(school.school);
      return;
    }

    const diff = total - school.expected_score;

    if (diff >= 3) {
      document.querySelector("#safe ul").appendChild(li);
      safeList.push(school.school);
    } else if (diff >= 0) {
      document.querySelector("#risky ul").appendChild(li);
      riskyList.push(school.school);
    } else if (diff > -3) {
      document.querySelector("#danger ul").appendChild(li);
      dangerList.push(school.school);
    }
  });

  document.getElementById("result").style.display = "block";

  // 上傳 Google 表單
  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSde06ipoJ13R9ScEkmzZcqxuo-FfH7ZvvYbO3F12GF_J13sow/formResponse";
  const formData = new FormData();
  formData.append("entry.1443068889", name);
  formData.append("entry.135201981", phone);
  formData.append("entry.977897966", getGrade("chinese"));
  formData.append("entry.1550956144", getGrade("english"));
  formData.append("entry.1358965558", getGrade("math"));
  formData.append("entry.1044822364", getGrade("science"));
  formData.append("entry.630863529", getGrade("social"));
  formData.append("entry.523532941", getGrade("writing"));
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
