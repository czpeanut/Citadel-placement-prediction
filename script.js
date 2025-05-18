document.getElementById("score-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  // 讀取選取成績並轉為整數
  const getScore = (id) => parseInt(document.getElementById(id).value);
  const total =
    getScore("chinese") +
    getScore("english") +
    getScore("math") +
    getScore("science") +
    getScore("social");

  const city = document.getElementById("city").value;
  if (!city) {
    alert("請選擇縣市");
    return;
  }

  // 清空原結果
  ["safe", "risky", "danger"].forEach((id) => {
    document.querySelector(`#${id} ul`).innerHTML = "";
  });

  // 讀取學校資料
  let response, schools;
  try {
    response = await fetch("data/schools.json");
    schools = await response.json();
  } catch (err) {
    alert("無法讀取學校資料，請確認 data/schools.json 是否存在。");
    return;
  }

  // 過濾該縣市學校
  const filtered = schools.filter((s) => s.city === city);

  // 分類學校
  filtered.forEach((school) => {
    const diff = total - school.expected_score;
    const li = document.createElement("li");
    li.textContent = `${school.school}（錄取預估：${school.expected_score}分）`;

    if (diff >= 3) {
      document.querySelector("#safe ul").appendChild(li);
    } else if (diff >= 0) {
      document.querySelector("#risky ul").appendChild(li);
    } else {
      document.querySelector("#danger ul").appendChild(li);
    }
  });
});
