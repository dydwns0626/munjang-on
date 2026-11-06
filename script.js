
const analyzeBtn = document.getElementById("analyzeBtn");
const userText = document.getElementById("userText");
const result = document.getElementById("result");

// 감정별 분석 단어
const emotionWords = {
  "슬픔": ["슬프", "눈물", "이별", "그립", "외롭", "울", "아픔", "상처", "떠나"],
  "기쁨": ["행복", "웃음", "기쁘", "즐겁", "설레", "사랑", "좋아"],
  "분노": ["화나", "분노", "짜증", "미워", "억울"],
  "불안": ["걱정", "두렵", "불안", "무섭", "초조"],
  "희망": ["꿈", "희망", "미래", "빛", "기대", "시작"]
};

// 분위기별 분석 단어
const moods = {
  "따뜻한": ["사랑", "햇살", "포근", "가족", "봄", "웃음"],
  "쓸쓸한": ["비", "밤", "혼자", "이별", "눈물", "그립"],
  "희망적인": ["꿈", "빛", "미래", "시작", "희망"],
  "긴장감 있는": ["두렵", "어둠", "위험", "불안", "무섭"]
};

// 표현 개선 사전
const alternatives = {
  "슬프다": "마음 한구석에 조용히 비가 내린다.",
  "좋다": "마음속에 작은 기쁨이 피어난다.",
  "외롭다": "세상에 홀로 남겨진 듯한 기분이다.",
  "힘들다": "긴 터널을 천천히 지나가는 기분이다.",
  "예쁘다": "눈길을 오래 붙잡는 한 폭의 그림 같다.",
  "행복하다": "마음속에 따스한 햇살이 번진다.",
  "그립다": "지나간 시간이 마음속에 머문다."
};

// 비유 표현 사전
const metaphors = {
  "슬픔": [
    "슬픔은 마음속에 조용히 내리는 비와 같다.",
    "그리움은 닿을 수 없는 곳에서 빛나는 별이다.",
    "눈물은 말하지 못한 마음의 언어다."
  ],
  "기쁨": [
    "기쁨은 마음속에서 피어나는 꽃이다.",
    "행복은 햇살처럼 조용히 스며든다.",
    "웃음은 어두운 하루를 밝히는 작은 등불이다."
  ],
  "분노": [
    "분노는 가슴속에서 타오르는 불꽃이다.",
    "화는 마음속에 쌓인 뜨거운 파도다.",
    "억울함은 출구를 찾지 못한 메아리다."
  ],
  "불안": [
    "불안은 안개 속을 걷는 발걸음이다.",
    "걱정은 마음속을 떠도는 그림자다.",
    "두려움은 보이지 않는 벽과 같다."
  ],
  "희망": [
    "희망은 어두운 밤을 밝히는 작은 별이다.",
    "꿈은 아직 피어나지 않은 꽃봉오리다.",
    "미래는 새로운 이야기가 시작되는 빈 페이지다."
  ]
};

function countWords(text, words) {
  return words.filter(word => text.includes(word)).length;
}

// 감정 점수 계산
function getEmotionScores(text) {
  const scores = {};

  for (const emotion in emotionWords) {
    scores[emotion] = countWords(text, emotionWords[emotion]);
  }

  return scores;
}

// 감정 분석 결과
function analyzeEmotion(scores) {
  const max = Math.max(...Object.values(scores));

  if (max === 0) return "중립";

  return Object.keys(scores).find(
    emotion => scores[emotion] === max
  );
}

// 분위기 분석
function analyzeMood(text) {
  const scores = {};

  for (const mood in moods) {
    scores[mood] = countWords(text, moods[mood]);
  }

  const max = Math.max(...Object.values(scores));

  if (max === 0) return "차분하고 중립적인 분위기";

  return Object.keys(scores).find(
    mood => scores[mood] === max
  );
}

// 감정 비중 그래프
function showEmotionChart(scores) {
  const chart = document.getElementById("emotionChart");
  chart.replaceChildren();

  const total = Object.values(scores).reduce(
    (sum, value) => sum + value, 0
  );

  if (total === 0) {
    chart.textContent = "분석할 감정 단어가 충분하지 않습니다.";
    return;
  }

  for (const emotion in scores) {
    const percent = Math.round(scores[emotion] / total * 100);

    const row = document.createElement("div");
    row.className = "bar-row";

    const label = document.createElement("span");
    label.textContent = emotion;

    const track = document.createElement("div");
    track.className = "bar-track";

    const bar = document.createElement("div");
    bar.className = "bar-fill";
    bar.style.width = percent + "%";

    track.appendChild(bar);

    const value = document.createElement("span");
    value.textContent = percent + "%";

    row.append(label, track, value);
    chart.appendChild(row);
  }
}

// 반복 단어 및 단어 빈도 분석
function showWordChart(text) {
  const chart = document.getElementById("wordChart");
  chart.replaceChildren();

  const stopWords = [
    "그리고", "하지만", "그래서", "나는", "너는",
    "우리는", "그것", "이것", "저것", "있다",
    "없다", "하다", "정말", "너무"
  ];

  const words = text.match(/[가-힣]{2,}/g) || [];
  const counts = {};

  words.forEach(word => {
    if (!stopWords.includes(word)) {
      counts[word] = (counts[word] || 0) + 1;
    }
  });

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  if (sorted.length === 0) {
    chart.textContent = "분석할 단어가 충분하지 않습니다.";
    return;
  }

  sorted.forEach(([word, count]) => {
    const row = document.createElement("div");
    row.className = "bar-row";

    const label = document.createElement("span");
    label.textContent = word;

    const track = document.createElement("div");
    track.className = "bar-track";

    const bar = document.createElement("div");
    bar.className = "bar-fill";
    bar.style.width = (count / sorted[0][1] * 100) + "%";

    track.appendChild(bar);

    const value = document.createElement("span");
    value.textContent = count + "회";

    row.append(label, track, value);
    chart.appendChild(row);
  });
}

// 문장 개선 전후 비교
function improveText(text) {
  let improved = text;
  let changed = [];

  for (const word in alternatives) {
    if (improved.includes(word)) {
      improved = improved.split(word).join(alternatives[word]);
      changed.push(word);
    }
  }

  return { improved, changed };
}

// 비유 표현 추천
function showMetaphors(emotion) {
  const box = document.getElementById("metaphor");
  box.replaceChildren();

  const list = metaphors[emotion] || [
    "하루는 한 권의 책과 같다.",
    "마음은 바람에 흔들리는 나뭇잎과 같다.",
    "시간은 멈추지 않고 흐르는 강물과 같다."
  ];

  list.forEach((sentence, index) => {
    const p = document.createElement("p");
    p.className = "metaphor-item";
    p.textContent = (index + 1) + ". " + sentence;
    box.appendChild(p);
  });
}

// 전체 분석 실행
analyzeBtn.addEventListener("click", () => {
  const text = userText.value.trim();

  if (!text) {
    alert("분석할 문장을 먼저 입력해 주세요.");
    return;
  }

  const scores = getEmotionScores(text);
  const emotion = analyzeEmotion(scores);
  const mood = analyzeMood(text);

  document.getElementById("emotion").textContent =
    "가장 두드러지는 감정: " + emotion;

  document.getElementById("mood").textContent = mood;

  showEmotionChart(scores);
  showWordChart(text);
  showMetaphors(emotion);

  const comparison = improveText(text);

  document.getElementById("beforeAfter").replaceChildren();

  const before = document.createElement("p");
  before.textContent = "원본 문장: " + text;

  const after = document.createElement("p");
  after.textContent = "개선 문장: " + comparison.improved;

  document.getElementById("beforeAfter").append(before, after);

  document.getElementById("suggestion").textContent =
    comparison.changed.length
      ? "개선에 활용한 표현: " + comparison.changed.join(", ")
      : "등록된 개선 대상 표현을 찾지 못했습니다.";

  showEmotionChart(scores);

  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth" });
});


function insertExample(number) {
  const examples = {
    1: "오늘은 유난히 마음이 무거웠다. 아무렇지 않은 척 웃었지만, 마음 한구석에는 아쉬움이 남아 있었다.",
    2: "나는 너를 기다렸다. 매일 너를 기다렸고, 오늘도 너를 기다리고 있다.",
    3: "그리움이 마음속에 남아 쉽게 사라지지 않았다. 밤이 깊어질수록 그리움은 더욱 커졌다."
  };

  const input = document.querySelector("textarea");

  if (input) {
    input.value = examples[number];
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  }
}
