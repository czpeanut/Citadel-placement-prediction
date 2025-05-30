document.getElementById("score-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const city = document.getElementById("city").value;
  if (!city) {
    alert("請選擇縣市");
    return;
  }

  // 各縣市五科等級對應分數
  const gradeValueMap = {
    "高雄市": { "C": 2, "B": 4, "B+": 4, "B++": 4, "A": 6, "A+": 6, "A++": 6 },
    "台南市": { "C": 1, "B": 2, "B+": 3, "B++": 4, "A": 5, "A+": 6, "A++": 7 },
    "台中市": { "C": 2, "B": 4, "B+": 4, "B++": 4, "A": 6, "A+": 6, "A++": 6 },
    "宜蘭市": { "C": 1, "B": 2, "B+": 2.3, "B++": 2.6, "A": 3, "A+": 3, "A++": 3 },
    "屏東市": { "C": 1, "B": 3, "B+": 3.5, "B++": 4, "A": 5, "A+": 5, "A++": 5 }
  };

  // 作文加分規則（適用台南市與屏東市）
  const writingBonusMap = {
    "台南市": {
      "6": 1.0,
      "5": 0.8,
      "4": 0.6,
      "3": 0.4,
      "2": 0.2,
      "1": 0.1,
      "0": 0.0
    },
    "屏東市": {
      "6": 1.0,
      "5": 1.0,
      "4": 0.5,
      "3": 0.5,
      "2": 0.0,
      "1": 0.0,
      "0": 0.0
    }
  };

  const getGrade = (id) => document.getElementById(id).value;
  const scoreMap = gradeValueMap[city];
  const writingMap = writingBonusMap[city] || {};

  let total =
    scoreMap[getGrade("chinese")] +
    scoreMap[getGrade("english")] +
    scoreMap[getGrade("math")] +
    scoreMap[getGrade("science")] +
    scoreMap[getGrade("social")];

  if (writingMap) {
    const writingGrade = getGrade("writing");
    if (writingMap.hasOwnProperty(writingGrade)) {
      total += writingMap[writingGrade];
    }
  }

  // 清空原本的顯示結果
  ["safe", "risky", "danger"].forEach((id) => {
    document.querySelector(`#${id} ul`).innerHTML = "";
  });

  // 載入資料
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

    // 若差距太大（考生分數低於預估錄取超過3分），就不顯示
    if (diff < -3) return;

    const li = document.createElement("li");
    li.textContent = `${school.school}`;

    if (diff >= 3) {
      document.querySelector("#safe ul").appendChild(li);
    } else if (diff >= 0) {
      document.querySelector("#risky ul").appendChild(li);
    } else {
      document.querySelector("#danger ul").appendChild(li);
    }
  });
});
