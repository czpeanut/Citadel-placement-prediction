document.getElementById("score-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const gradeValue = {
    "台南市": { "C": 1, "B": 2, "B+": 3, "B++": 4, "A": 5, "A+": 6, "A++": 7 },
    "高雄市": { "C": 2, "B": 4, "B+": 4, "B++": 4, "A": 6, "A+": 6, "A++": 6 }
  };

  const getGrade = (id) => document.getElementById(id).value;
  const city = document.getElementById("city").value;

  if (!city) {
    alert("請選擇縣市");
    return;
  }

  const scoreMap = gradeValue[city];
  const total =
    scoreMap[getGrade("chinese")] +
    scoreMap[getGrade("english")] +
    scoreMap[getGrade("math")] +
    scoreMap[getGrade("science")] +
    scoreMap[getGrade("social")];

  // 清除舊結果
  ["safe", "risky", "danger"].forEach((id) => {
    document.querySelector(`#${id} ul`).innerHTML = "";
  });

  // 載入學校資料
  let schools;
  try {
    const res = await fetch("data/schools.json");
    schools = await res.json();
  } catch (err) {
    alert("無法載入學校資料");
    return;
  }

  const filtered = schools.filter((s) => s.city === city);

  filtered.forEach((school) => {
    const diff = total - school.expected_score;
    const li = document.createElement("li");
    li.textContent = `${school.school}（預估錄取：${school.expected_score}分）`;

    if (diff >= 3) {
      document.querySelector("#safe ul").appendChild(li);
    } else if (diff >= 0) {
      document.querySelector("#risky ul").appendChild(li);
    } else {
      document.querySelector("#danger ul").appendChild(li);
    }
  });
});
