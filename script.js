// script.js

document.getElementById("score-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("student-name").value.trim();
  const phone = document.getElementById("contact-phone").value.trim();
  const chinese = document.getElementById("chinese").value;
  const english = document.getElementById("english").value;
  const math = document.getElementById("math").value;
  const science = document.getElementById("science").value;
  const social = document.getElementById("social").value;
  const writing = parseInt(document.getElementById("writing").value);
  const city = document.getElementById("city").value;

  if (!name || !phone || !city) {
    alert("請填寫所有欄位");
    return;
  }

  const scores = { chinese, english, math, science, social };

  const cityRules = {
    "台南市": { C: 1, B: 2, "B+": 3, "B++": 4, A: 5, "A+": 6, "A++": 7, writing: [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1] },
    "高雄市": { C: 2, B: 4, "B+": 4, "B++": 4, A: 6, "A+": 6, "A++": 6, writing: [0, 0, 0, 0, 0, 0, 0] },
    "台中市": { C: 2, B: 4, "B+": 4, "B++": 4, A: 6, "A+": 6, "A++": 6, writing: [0, 0, 0, 0, 0, 0, 0] },
    "宜蘭市": { C: 1, B: 2, "B+": 2.3, "B++": 2.6, A: 3, "A+": 3, "A++": 3, writing: [0, 0, 0, 0, 0, 0, 0] },
    "屏東市": { C: 1, B: 3, "B+": 3.5, "B++": 4, A: 5, "A+": 5, "A++": 5, writing: [0, 0, 0.5, 0.5, 1, 1, 0] }
  };

  const rule = cityRules[city];
  let total = 0;
  for (let subject in scores) {
    total += rule[scores[subject]] || 0;
  }
  total += rule.writing[writing];

  const schools = window.SCHOOL_DATA || [];
  const safe = [], risky = [], danger = [];

  schools.forEach(school => {
    if (school.city !== city) return;
    const diff = total - school.score;
    if (diff >= 3) safe.push(school.name);
    else if (diff >= 0) risky.push(school.name);
    else if (diff >= -3) danger.push(school.name);
  });

  document.querySelector("#safe ul").innerHTML = safe.map(name => `<li>${name}</li>`).join("");
  document.querySelector("#risky ul").innerHTML = risky.map(name => `<li>${name}</li>`).join("");
  document.querySelector("#danger ul").innerHTML = danger.map(name => `<li>${name}</li>`).join("");

  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSde06ipoJ13R9ScEkmzZcqxuo-FfH7ZvvYbO3F12GF_J13sow/formResponse";
  const formData = new FormData();
  formData.append("entry.1443068889", name);
  formData.append("entry.135201981", phone);
  formData.append("entry.977897966", chinese);
  formData.append("entry.1550956144", english);
  formData.append("entry.1358965558", math);
  formData.append("entry.1044822364", science);
  formData.append("entry.630863529", social);
  formData.append("entry.523532941", writing);
  formData.append("entry.1905645741", city);
  formData.append("entry.1640508304", safe.join(", "));
  formData.append("entry.1852642474", risky.join(", "));
  formData.append("entry.748458775", danger.join(", "));

  fetch(formUrl, {
    method: "POST",
    mode: "no-cors",
    body: formData,
  });
});
