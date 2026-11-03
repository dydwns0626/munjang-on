
const analyzeBtn = document.getElementById("analyzeBtn");
const userText = document.getElementById("userText");
const result = document.getElementById("result");

const emotionWords = {
  "슬픔": ["슬프", "눈물", "이별", "그립", "외롭", "울", "아픔", "상처", "떠나"],
  "기쁨": ["행복", "웃음", "기쁘", "즐겁", "설레", "사랑", "좋아"],
  "분노": ["화나", "분노", "짜증", "미워", "억울"],
  "불안": ["걱정", "두렵", "불안", "무섭", "초조"],
  "희망": ["꿈", "희망", "미래", "빛", "기대", "시작"]
};

const moods = {
  "따뜻한": ["사랑", "햇살", "포근", "가족", "봄", "웃음"],
  "쓸쓸한": ["비", "밤", "혼자", "이별", "눈물", "그립"],
  "희망적인": ["꿈", "빛", "미래", "시작", "희망"],
  "긴장감 있는": ["두렵", "어둠", "위험", "불안", "무섭"]
};

const alternatives = {
  "슬프다": ["마음 한구석이 저려 온다", "가슴에 비가 내린다"],
  "좋다": ["마음에 오래 머문다", "작은 기쁨을 피워 낸다"],
  "외롭다": ["세상에 홀로 남겨진 듯하다", "고요함만 곁에 남았다"],
  "힘들다": ["마음이 무거운 걸음을 걷는다", "긴 터널을 지나는 듯하다"],
  "예쁘다": ["마치 한 폭의 그림 같다", "눈길을 오래 붙잡는다"]
};

function countWords(text, words) {
  return words.filter(word => text.includes(word)).length;
}

function analyzeEmotion(text) {
  let scores = {};

  for (const emotion in emotionWords) {
    scores[emotion] = countWords(text, emotionWords[emotion]);
  }

  const maxScore = Math.max(...Object.values(scores));
  
  if (maxScore === 0) {
    return "뚜렷한 감정 단서를 찾지 못했습니다.";
  }

  return Object.keys(scores).find(
    emotion => scores[emotion] === maxScore
  );
}

function analyzeMood(text) {
  let scores = {};

  for (const mood in moods) {
    scores[mood] = countWords(text, moods[mood]);
  }

  const maxScore = Math.max(...Object.values(scores));

  if (maxScore === 0) {
    return "차분하고 중립적인 분위기입니다.";
  }

  return Object.keys(scores).find(
    mood => scores[mood] === maxScore
  );
}

function findRepeatedWords(text) {
  const words = text.match(/[가-힣]{2,}/g) || [];
  const counts = {};

  words.forEach(word => {
    counts[word] = (counts[word] || 0) + 1;
  });

  const repeated = Object.entries(counts)
    .filter(([word, count]) => count >= 2)
    .map(([word, count]) => `${word} (${count}회)`);

  return repeated.length
    ? repeated.join(", ")
    : "뚜렷한 반복 단어가 없습니다.";
}

function suggestExpression(text) {
  let suggestions = [];

  for (const word in alternatives) {
    if (text.includes(word)) {
      suggestions.push(
        `"${word}" → ${alternatives[word].join(" / ")}`
      );
    }
  }

  return suggestions.length
    ? suggestions.join("<br>")
    : "현재 문장에 맞는 대체 표현을 찾지 못했습니다.";
}

function suggestMetaphor(emotion) {
  const metaphors = {
    "슬픔": "슬픔은 마음속에 조용히 내리는 비와 같습니다.",
    "기쁨": "기쁨은 마음속에서 피어나는 작은 꽃과 같습니다.",
    "분노": "분노는 가슴속에서 타오르는 불꽃과 같습니다.",
    "불안": "불안은 안개 속을 걷는 발걸음과 같습니다.",
    "희망": "희망은 어두운 밤을 밝히는 작은 별과 같습니다."
  };

  return metaphors[emotion] ||
    "글의 핵심 감정을 조금 더 구체적으로 표현해 보세요.";
}

analyzeBtn.addEventListener("click", () => {
  const text = userText.value.trim();

  if (!text) {
    alert("분석할 문장을 먼저 입력해 주세요.");
    return;
  }

  const emotion = analyzeEmotion(text);
  const mood = analyzeMood(text);
  const repeated = findRepeatedWords(text);
  const expression = suggestExpression(text);

  document.getElementById("emotion").innerHTML =
    `<strong>🎭 감정 분석</strong><br>${emotion}`;

  document.getElementById("mood").innerHTML =
    `<strong>🌙 분위기 분석</strong><br>${mood}`;

  document.getElementById("suggestion").innerHTML =
    `<strong>✍️ 표현 개선 및 반복 단어</strong><br>
    반복 단어: ${repeated}<br>${expression}`;

  document.getElementById("metaphor").innerHTML =
    `<strong>💡 비유적 표현 추천</strong><br>
    ${suggestMetaphor(emotion)}`;

  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth" });
});
