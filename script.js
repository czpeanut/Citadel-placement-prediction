document.getElementById("score-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const city = document.getElementById("city").value;
  if (!city) {
    alert("請選擇縣市");
    return;
  }

  // 成績轉換表（五科）
  const gradeValue = {
    "台南市": { "C": 1, "B": 2, "B+": 3, "B++": 4, "A": 5, "A+": 6, "A++": 7 },
    "高雄市": { "C": 2, "B": 4, "B+": 4, "B++": 4, "A": 6, "A+": 6, "A++": 6 }
  };

  // 作文加分表（僅台南市使用）
  const writingScoreMap = {
    "6": 1.0,
    "5": 0.8,
    "4": 0.6,
    "3": 0.4,
    "2": 0.2,
    "1": 0.1,
    "0": 0.0
  };

  const getGrade = (id) => document.getElementById(id).value;
  const scoreMap = gradeValue[city];

  let total =
    scoreMap[getGrade("chinese")] +
    scoreMap[getGrade("english")] +
    scoreMap[getGrade("math")] +
    scoreMap[getGrade("science")] +
    scoreMap[getGrade("social")];

  // 台南市加作文加權
  if (city === "台南市") {
    const writingGrade = getGrade("writing");
    total += writingScoreMap[writingGrade];
  }

  // 清空原結果
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
