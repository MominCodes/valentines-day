// =======================================================
// CONFIG (edit these)
// =======================================================
const PASS_THRESHOLD =
  7; // You currently have 10 questions, so 7/10 pass. If you go back to 8 questions, set to 6.

const VAULT_CODE =
  "2025"; // Change this to your 4-digit inside joke / anniversary code

const LOVE_NOTE_TEXT =
`My love,
You are my favorite part of every day.
Thank you for being my peace, my happiness, and my home.
Happy Valentine’s Day — I love you more than words can express. 💘`;

// =======================================================
// ELEMENTS
// =======================================================
const bgMusic = document.getElementById("bgMusic");
const quizMusic = document.getElementById("quizMusic");
const voiceNote = document.getElementById("voiceNote");
const musicHint = document.getElementById("musicHint");

const BG_NORMAL_VOL = 1;      // normal background volume
const BG_DUCK_VOL = 0.18;    // how quiet it gets during voice note
const DUCK_TIME = 600;       // ms for fade in/out


const screens = {
  ask: document.getElementById("screenAsk"),
  yes: document.getElementById("screenYes"),
  quizCover: document.getElementById("screenQuizCover"),
  quiz: document.getElementById("screenQuiz"),
  quizResult: document.getElementById("screenQuizResult"),
  gifts: document.getElementById("screenGifts"),
  openWhen: document.getElementById("screenOpenWhen"),
  roulette: document.getElementById("screenRoulette"),
  dateAdventure: document.getElementById("screenDateAdventure"),
  

};

// Buttons
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const toQuizBtn = document.getElementById("toQuizBtn");
const backToAskBtn = document.getElementById("backToAskBtn");
const startQuizBtn = document.getElementById("startQuizBtn");
const quizBackBtn = document.getElementById("quizBackBtn");
const backToYesBtn = document.getElementById("backToYesBtn");
const retryQuizBtn = document.getElementById("retryQuizBtn");
const resultBackBtn = document.getElementById("resultBackBtn");

const openWhenBtn = document.getElementById("openWhenBtn");
const rouletteBtn = document.getElementById("rouletteBtn");
const dateAdventureBtn = document.getElementById("dateAdventureBtn");

const openWhenBackBtn = document.getElementById("openWhenBackBtn");
const rouletteBackBtn = document.getElementById("rouletteBackBtn");
const dateAdventureBackBtn = document.getElementById("dateAdventureBackBtn");
const dateBackToYesBtn = document.getElementById("dateBackToYesBtn");


// Voice + Promises
const voiceBtn = document.getElementById("voiceBtn");

// Quiz UI
const quizTitle = document.getElementById("quizTitle");
const quizPrompt = document.getElementById("quizPrompt");
const questionText = document.getElementById("questionText");
const optionsWrap = document.getElementById("optionsWrap");
const feedback = document.getElementById("feedback");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const scoreHint = document.getElementById("scoreHint");

const streakText = document.getElementById("streakText");
const streakMsg = document.getElementById("streakMsg");

// Result + Vault
const resultBadge = document.getElementById("resultBadge");
const resultTitle = document.getElementById("resultTitle");
const resultSubtitle = document.getElementById("resultSubtitle");
const resultScore = document.getElementById("resultScore");
const resultNote = document.getElementById("resultNote");

const vaultWrap = document.getElementById("vaultWrap");
const vaultDigits = Array.from(document.querySelectorAll(".vault-digit"));
const unlockBtn = document.getElementById("unlockBtn");
const vaultError = document.getElementById("vaultError");

// Gifts
const countdown = document.getElementById("countdown");
const countNum = document.getElementById("countNum");
const curtain = document.getElementById("curtain");
const giftFlip1 = document.getElementById("giftFlip1");
const giftFlip2 = document.getElementById("giftFlip2");
const loveNoteEl = document.getElementById("loveNote");

// FX canvas
const fxCanvas = document.getElementById("fxCanvas");
const fxCtx = fxCanvas ? fxCanvas.getContext("2d") : null;

// =======================================================
// THEME GLOW SWITCHING
// =======================================================
function setTheme(themeClass) {
  document.body.classList.remove("theme-memories", "theme-quiz", "theme-gifts");
  document.body.classList.add(themeClass);
}

// =======================================================
// SCREEN SWITCHING
// =======================================================
function showScreen(key) {
  Object.values(screens).forEach(s => s && s.classList.remove("is-active"));
  screens[key]?.classList.add("is-active");
  window.scrollTo({ top: 0, behavior: "smooth" });

  document.body.classList.remove("theme-memories", "theme-quiz", "theme-gifts");

if (key === "ask" || key === "yes" || key === "openWhen" || key === "roulette" || key === "dateAdventure") {
  document.body.classList.add("theme-memories");
}
if (key === "quizCover" || key === "quiz" || key === "quizResult") {
  document.body.classList.add("theme-quiz");
}
if (key === "gifts") {
  document.body.classList.add("theme-gifts");
}
}

// =======================================================
// MUSIC UNLOCK + SWITCHING (keeps your approach)
// =======================================================
let audioUnlocked = false;

async function unlockAudio() {
  if (audioUnlocked) return;
  try {
    if (bgMusic) {
      bgMusic.volume = 0;
      await bgMusic.play();
      bgMusic.pause();
      bgMusic.currentTime = 0;
      bgMusic.volume = 1;
    }
    if (quizMusic) {
      quizMusic.volume = 0;
      await quizMusic.play();
      quizMusic.pause();
      quizMusic.currentTime = 0;
      quizMusic.volume = 1;
    }
    if (voiceNote) {
      // No autoplay needed—just ensure it can play after unlock
      voiceNote.volume = 1;
    }
    audioUnlocked = true;
  } catch {
    // try again on next interaction
  }
}

function fadeTo(audioEl, target, ms, onDone) {
  if (!audioEl) return;
  const start = audioEl.volume ?? 1;
  const steps = 24;
  const stepMs = Math.max(20, Math.floor(ms / steps));
  let i = 0;

  const timer = setInterval(() => {
    i++;
    const t = i / steps;
    const v = start + (target - start) * t;
    audioEl.volume = Math.max(0, Math.min(1, v));
    if (i >= steps) {
      clearInterval(timer);
      audioEl.volume = target;
      if (typeof onDone === "function") onDone();
    }
  }, stepMs);
}

async function startBgMusic() {
  if (!bgMusic) return;
  await unlockAudio();
  try {
    if (quizMusic && !quizMusic.paused) {
      fadeTo(quizMusic, 0, 500, () => { quizMusic.pause(); quizMusic.currentTime = 0; });
    }

    bgMusic.volume = 0;
    await bgMusic.play();
    if (musicHint) musicHint.textContent = "🎶 Music is playing";
    fadeTo(bgMusic, 1, 900);
  } catch {
    if (musicHint) musicHint.textContent = "🔊 Tap/click once to enable sound";
  }
}

async function startQuizMusic() {
  if (!quizMusic) return;
  await unlockAudio();
  try {
    if (bgMusic && !bgMusic.paused) fadeTo(bgMusic, 0, 600, () => bgMusic.pause());

    quizMusic.volume = 0;
    await quizMusic.play();
    fadeTo(quizMusic, 1, 900);
  } catch {
    // will try again on next gesture
  }
}

// Start bg music on any gesture (click/tap/scroll)
function gestureStartBg() { startBgMusic(); removeGestureListeners(); }
function removeGestureListeners() {
  document.removeEventListener("click", gestureStartBg);
  document.removeEventListener("touchstart", gestureStartBg);
  document.removeEventListener("wheel", gestureStartBg);
  document.removeEventListener("scroll", gestureStartBg, true);
  document.removeEventListener("keydown", gestureStartBg);
}
document.addEventListener("click", gestureStartBg, { passive: true });
document.addEventListener("touchstart", gestureStartBg, { passive: true });
document.addEventListener("wheel", gestureStartBg, { passive: true });
document.addEventListener("scroll", gestureStartBg, { passive: true, capture: true });
document.addEventListener("keydown", gestureStartBg, { passive: true });

// =======================================================
// BUTTON WIRES
// =======================================================
if (yesBtn) yesBtn.addEventListener("click", () => showScreen("yes"));
if (backToAskBtn) backToAskBtn.addEventListener("click", () => showScreen("ask"));

if (toQuizBtn) toQuizBtn.addEventListener("click", async () => {
  showScreen("quizCover");
  await startQuizMusic();
});

if (quizBackBtn) quizBackBtn.addEventListener("click", async () => {
  showScreen("yes");
  await startBgMusic();
});

if (startQuizBtn) startQuizBtn.addEventListener("click", () => {
  resetQuiz();
  showScreen("quiz");
  renderQuestion();
});

if (retryQuizBtn) retryQuizBtn.addEventListener("click", () => {
  resetQuiz();
  showScreen("quiz");
  renderQuestion();
});

if (resultBackBtn) resultBackBtn.addEventListener("click", () => {
  showScreen("quizCover");
});

if (backToYesBtn) backToYesBtn.addEventListener("click", async () => {
  showScreen("yes");
  await startBgMusic();
});

// Playful NO button dodge
if (noBtn) {
  noBtn.addEventListener("mouseenter", () => {
    const maxX = Math.min(window.innerWidth - 160, 600);
    const maxY = Math.min(window.innerHeight - 100, 500);
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    noBtn.style.position = "relative";
    noBtn.style.left = `${x - maxX / 2}px`;
    noBtn.style.top = `${y - maxY / 2}px`;
  });
  noBtn.addEventListener("click", () => alert("Nice try 😄"));
}
// =======================================================
// NEW FEATURE BUTTON WIRES (Open When / Roulette / Date Adventure)
// =======================================================
if (openWhenBtn) openWhenBtn.addEventListener("click", () => showScreen("openWhen"));
if (rouletteBtn) rouletteBtn.addEventListener("click", () => showScreen("roulette"));

if (dateAdventureBtn) dateAdventureBtn.addEventListener("click", () => {
  showScreen("dateAdventure");
  startDateGame(); // important: builds the first question
});

// Back buttons from the new screens
if (openWhenBackBtn) openWhenBackBtn.addEventListener("click", () => showScreen("yes"));
if (rouletteBackBtn) rouletteBackBtn.addEventListener("click", () => showScreen("yes"));
if (dateAdventureBackBtn) dateAdventureBackBtn.addEventListener("click", () => showScreen("yes"));

// This button exists inside the date screen finish area
if (dateBackToYesBtn) dateBackToYesBtn.addEventListener("click", () => showScreen("yes"));

// =======================================================
// VOICE NOTE BUTTON
// =======================================================
function duckBackground() {
  if (!bgMusic || bgMusic.paused) return;
  fadeTo(bgMusic, BG_DUCK_VOL, DUCK_TIME);
}

function restoreBackground() {
  if (!bgMusic || bgMusic.paused) return;
  fadeTo(bgMusic, BG_NORMAL_VOL, DUCK_TIME);
}

// =======================================================
// VOICE NOTE BUTTON (with background ducking)
// =======================================================
let voicePlaying = false;

if (voiceBtn && voiceNote) {
  voiceBtn.addEventListener("click", async () => {
    await unlockAudio();

    try {
      if (!voicePlaying) {
        duckBackground();            // 🔽 fade bg music down
        await voiceNote.play();
        voicePlaying = true;
        voiceBtn.textContent = "Pause 💌";
      } else {
        voiceNote.pause();
        restoreBackground();         // 🔼 fade bg music back up
        voicePlaying = false;
        voiceBtn.textContent = "Press to hear something 💌";
      }
    } catch {}
  });

  voiceNote.addEventListener("ended", () => {
    restoreBackground();             // 🔼 restore when finished
    voicePlaying = false;
    voiceBtn.textContent = "Press to hear something 💌";
  });

  voiceNote.addEventListener("pause", () => {
    if (!voiceNote.ended) {
      restoreBackground();           // 🔼 restore if paused manually
    }
  });
}


// =======================================================
// PROMISE CARDS FLIP
// =======================================================
document.querySelectorAll(".promise-card").forEach((btn) => {
  btn.addEventListener("click", () => btn.classList.toggle("is-flipped"));
});

// =======================================================
// REVEAL ON SCROLL
// =======================================================
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// =======================================================
// VIDEO AUTOPLAY ON SCROLL
// =======================================================
const scrollVideos = document.querySelectorAll("video.scroll-video");
const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const vid = entry.target;
      if (!(vid instanceof HTMLVideoElement)) return;

      if (entry.isIntersecting) {
        vid.muted = true;
        const p = vid.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } else {
        vid.pause();
      }
    });
  },
  { threshold: 0.6 }
);
scrollVideos.forEach((v) => videoObserver.observe(v));

// =======================================================
// QUIZ DATA (your questions kept as-is)
// =======================================================
let questions = [
  {
    q: "What’s my favorite thing about you",
    options: ["Your hair", "Your eyes", "Your voice", "Your smile", "Your personality", "Your laugh", "All of the above and everything else about you 💗"],
    correctIndex: 6,
  },
  {
    q: "What is my favorite thing to do with you",
    options: ["Talk for hours", "Send reels", "Send snaps", "All of the above 💗"],
    correctIndex: 3,
  },
  {
    q: "If we went on a date, which of  these foods would we eat…",
    options: ["Lava cake w/ ice cream", "Sushi", "Ramen", "Cheesecake", "Gol Gappe", "All of these 💗"],
    correctIndex: 5,
  },
  {
    q: "If we went on a date, which one of these things would we do…",
    options: ["Go on a walk", "Eat food", "Take pictures", "All of these 💗"],
    correctIndex: 3,
  },
  {
    q: "You are my…",
    options: ["Best friend", "Favorite person", "Safe place", "Wife", "Life Partner", "Biwi", "Jaan", "Zindagi", "All of the above 💗"],
    correctIndex: 8,
  },
  {
    q: "If we went out for a drink, which one of these would we drink?",
    options: ["Chai", "Iced Coffee", "Mint Margarita", "All of these drinks 💗"],
    correctIndex: 3,
  },
  {
    q: "Which one of these places do we want to visit in Lahore?",
    options: ["Androon Lahore", "HOUSE Coffee", "Kite Coffee", "Wasabi", "Dan Dan", "Sumo", "Dahlia", "Haute Dolci", "Spread", "Eggspectation", "All of these places 💗"],
    correctIndex: 10,
  },
  {
    q: "Which one of these foods do we want to try together?",
    options: ["Chicken Kickers", "Papadias", "Kentucky Burger", "All of these 💗"],
    correctIndex: 3,
  },
  {
    q: "If we were going on a long drive, which one of these songs would we listen to?",
    options: ["Pyaar Mein", "Gori Gori", "Tum Tak", "Ishq Wala Love", "Tu Jaane Na", "Kuch Kuch Hota Hai", "All of these songs 💗"],
    correctIndex: 6,
  },
  {
    q: "Which one of these places is a special memory for us?",
    options: ["Gym Khana", "Costa Corner", "Janan Cafe", "Shaukat Naz", "Haqqi Centre", "All of these places 💗"],
    correctIndex: 5,
  },
];

// =======================================================
// QUIZ LOGIC (UPGRADED: per-question grading + streak + effects)
// =======================================================
let idx = 0;
let selected = null;
let answers = new Array(questions.length).fill(null);
let perQuestionCorrect = new Array(questions.length).fill(null);
let hasGradedCurrent = false;

let streak = 0;

function resetQuiz() {
  idx = 0;
  selected = null;
  answers = new Array(questions.length).fill(null);
  perQuestionCorrect = new Array(questions.length).fill(null);
  hasGradedCurrent = false;
  streak = 0;

  if (feedback) feedback.textContent = "";
  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.textContent = "Next 💗";
  }
  if (scoreHint) scoreHint.textContent = "You got this 😌";
  if (streakText) streakText.textContent = "0";
  if (streakMsg) streakMsg.textContent = "";

  // Hide vault
  if (vaultWrap) vaultWrap.style.display = "none";
  if (vaultError) vaultError.textContent = "";
  vaultDigits.forEach(d => d.value = "");
}

function totalCorrect() {
  return perQuestionCorrect.filter(x => x === true).length;
}

function renderQuestion() {
  const total = questions.length;
  const qObj = questions[idx];

  selected = answers[idx];
  hasGradedCurrent = false;

  if (quizTitle) quizTitle.textContent = `Question ${idx + 1} of ${total}`;
  if (quizPrompt) quizPrompt.textContent = `Need at least ${PASS_THRESHOLD}/${total} to pass 💗`;
  if (questionText) questionText.textContent = qObj.q;

  const pct = Math.round((idx / total) * 100);
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) progressText.textContent = `${idx} / ${total}`;

  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) {
    nextBtn.disabled = (selected === null);
    nextBtn.textContent = (idx === total - 1) ? "Finish 💘" : "Next 💗";
  }

  if (!optionsWrap) return;
  optionsWrap.innerHTML = "";

  qObj.options.forEach((opt, optIdx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.type = "button";
    btn.textContent = opt;

    if (selected === optIdx) btn.classList.add("selected");

    btn.addEventListener("click", () => {
      if (hasGradedCurrent) return;

      selected = optIdx;
      answers[idx] = optIdx;

      optionsWrap.querySelectorAll(".option-btn").forEach((b, i) => {
        b.classList.toggle("selected", i === optIdx);
      });

      if (nextBtn) nextBtn.disabled = false;
      if (feedback) feedback.textContent = "";
    });

    optionsWrap.appendChild(btn);
  });

  if (feedback) feedback.textContent = "";
}

function gradeCurrentQuestion() {
  const qObj = questions[idx];
  const correct = (answers[idx] === qObj.correctIndex);
  perQuestionCorrect[idx] = correct;

  // highlight correct/wrong
  const btns = Array.from(optionsWrap.querySelectorAll(".option-btn"));
  btns.forEach((b, i) => {
    if (i === qObj.correctIndex) b.classList.add("correct");
    if (answers[idx] === i && !correct) b.classList.add("wrong");
  });

  // feedback + animations
  if (correct) {
    if (feedback) feedback.textContent = "Correct 😭💗";
    burstHearts(window.innerWidth / 2, window.innerHeight / 3, 18);
    streak += 1;
  } else {
    if (feedback) feedback.textContent = "Almost 😌💞";
    streak = 0;
  }

  if (streakText) streakText.textContent = String(streak);

  if (streak >= 3) {
    if (streakMsg) streakMsg.textContent = "My smart baby 😭💗";
    sparkleBurst();
  } else {
    if (streakMsg) streakMsg.textContent = "";
  }

  hasGradedCurrent = true;

  if (nextBtn) {
    if (idx === questions.length - 1) nextBtn.textContent = "See Result 💘";
    else nextBtn.textContent = "Continue 💗";
  }
}

function showResult() {
  const score = totalCorrect();
  const pass = score >= PASS_THRESHOLD;

  if (resultScore) resultScore.textContent = `${score} / ${questions.length}`;

  if (pass) {
    if (resultBadge) resultBadge.textContent = "PASS 💘";
    if (resultTitle) resultTitle.textContent = "You passed, my love 😭💗";
    if (resultSubtitle) resultSubtitle.textContent = "Now unlock the vault…";
    if (resultNote) resultNote.textContent = "Enter the 4-digit code to reveal your gifts 💝";
    if (vaultWrap) vaultWrap.style.display = "";
    setupVaultInputs();
  } else {
    if (resultBadge) resultBadge.textContent = "Almost 💞";
    if (resultTitle) resultTitle.textContent = "Sooo close 😌";
    if (resultSubtitle) resultSubtitle.textContent = "Try again — I know you got this.";
    if (resultNote) resultNote.textContent = `You need at least ${PASS_THRESHOLD} correct to pass 💗`;
    if (vaultWrap) vaultWrap.style.display = "none";
  }

  showScreen("quizResult");
}

if (prevBtn) prevBtn.addEventListener("click", () => {
  if (idx > 0) {
    idx--;
    renderQuestion();
  } else {
    showScreen("quizCover");
  }
});

if (nextBtn) nextBtn.addEventListener("click", () => {
  if (selected === null) return;

  // First click = grade & show effects
  if (!hasGradedCurrent) {
    gradeCurrentQuestion();
    return;
  }

  // Second click = move next / show result
  if (idx === questions.length - 1) {
    showResult();
    return;
  }

  idx++;
  renderQuestion();
});

// =======================================================
// VAULT (4-digit unlock -> gifts)
// =======================================================
function setupVaultInputs() {
  if (!vaultDigits.length) return;

  vaultDigits.forEach((inp, i) => {
    inp.value = "";

    inp.addEventListener("input", () => {
      inp.value = inp.value.replace(/\D/g, "").slice(0, 1);
      if (inp.value && vaultDigits[i + 1]) vaultDigits[i + 1].focus();
    });

    inp.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !inp.value && vaultDigits[i - 1]) {
        vaultDigits[i - 1].focus();
      }
    });
  });

  vaultDigits[0].focus();
}

if (unlockBtn) {
  unlockBtn.addEventListener("click", () => {
    const code = vaultDigits.map(d => d.value || "").join("");
    if (code === VAULT_CODE) {
      if (vaultError) vaultError.textContent = "";
      showScreen("gifts");
      runGiftsSequence();
    } else {
      if (vaultError) vaultError.textContent = "Wrong code 😭 try again";
      sparkleBurst();

      // tiny shake
      let t = 0;
      const timer = setInterval(() => {
        t++;
        const dx = (t % 2 === 0) ? 6 : -6;
        vaultDigits.forEach(d => d.style.transform = `translateX(${dx}px)`);
        if (t >= 6) {
          clearInterval(timer);
          vaultDigits.forEach(d => d.style.transform = "translateX(0)");
        }
      }, 55);
    }
  });
}

// =======================================================
// GIFTS: cinematic countdown + curtain + flip cards + typewriter
// =======================================================
let typingTimer = null;

async function runGiftsSequence() {
  await startQuizMusic(); // quiz song continues on gifts page
  setTheme("theme-gifts");

  // reset
  giftFlip1?.classList.remove("flipped");
  giftFlip2?.classList.remove("flipped");
  if (loveNoteEl) loveNoteEl.textContent = "";

  curtain?.classList.remove("open");
  void curtain?.offsetWidth;

  await countdownSequence();

  curtain?.classList.add("open");

  setTimeout(() => { giftFlip1?.classList.add("flipped"); burstHearts(window.innerWidth / 2, window.innerHeight / 3, 16); }, 850);
  setTimeout(() => { giftFlip2?.classList.add("flipped"); sparkleBurst(); }, 1250);

  setTimeout(() => typeWriter(LOVE_NOTE_TEXT, loveNoteEl, 16), 1550);
}

function countdownSequence() {
  return new Promise((resolve) => {
    if (!countdown || !countNum) return resolve();

    let n = 3;
    countdown.classList.add("show");

    const step = () => {
      countNum.textContent = String(n);
      countNum.classList.remove("pulse");
      void countNum.offsetWidth;
      countNum.classList.add("pulse");

      n--;
      if (n < 0) {
        setTimeout(() => {
          countdown.classList.remove("show");
          resolve();
        }, 300);
        return;
      }
      setTimeout(step, 650);
    };

    step();
  });
}

function typeWriter(text, el, speedMs) {
  if (!el) return;
  if (typingTimer) clearInterval(typingTimer);

  let i = 0;
  typingTimer = setInterval(() => {
    i++;
    el.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(typingTimer);
      typingTimer = null;
    }
  }, Math.max(8, speedMs));
}

// =======================================================
// FX CANVAS: hearts burst + sparkle burst
// =======================================================
function resizeFx() {
  if (!fxCanvas || !fxCtx) return;
  fxCanvas.width = Math.floor(window.innerWidth * devicePixelRatio);
  fxCanvas.height = Math.floor(window.innerHeight * devicePixelRatio);
  fxCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resizeFx);
resizeFx();

function showFx() { if (fxCanvas) fxCanvas.style.opacity = "1"; }
function hideFx() { if (fxCanvas) fxCanvas.style.opacity = "0"; }

function burstHearts(x, y, count = 18) {
  if (!fxCanvas || !fxCtx) return;
  showFx();

  const parts = [];
  const colors = ["#ff2b7a", "#ff7db1", "#ff4d6d", "#ffd1dc", "#ff9a9e"];

  for (let i = 0; i < count; i++) {
    parts.push({
      x, y,
      vx: (Math.random() - 0.5) * 9,
      vy: -2 - Math.random() * 7,
      g: 0.22 + Math.random() * 0.10,
      s: 8 + Math.random() * 10,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.22,
      a: 1,
      c: colors[(Math.random() * colors.length) | 0],
    });
  }

  const start = performance.now();
  const dur = 800;

  function drawHeart(px, py, s, rot, color, alpha) {
    fxCtx.save();
    fxCtx.translate(px, py);
    fxCtx.rotate(rot);
    fxCtx.globalAlpha = alpha;
    fxCtx.fillStyle = color;
    fxCtx.beginPath();
    fxCtx.moveTo(0, s * 0.35);
    fxCtx.bezierCurveTo(s * 0.5, -s * 0.2, s * 1.1, s * 0.4, 0, s * 1.15);
    fxCtx.bezierCurveTo(-s * 1.1, s * 0.4, -s * 0.5, -s * 0.2, 0, s * 0.35);
    fxCtx.closePath();
    fxCtx.fill();
    fxCtx.restore();
  }

  function tick(now) {
    const t = now - start;
    fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    parts.forEach(p => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      p.a *= 0.985;
      drawHeart(p.x, p.y, p.s, p.r, p.c, p.a);
    });

    if (t < dur) requestAnimationFrame(tick);
    else { fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight); hideFx(); }
  }

  requestAnimationFrame(tick);
}

function sparkleBurst() {
  if (!fxCanvas || !fxCtx) return;
  showFx();

  const parts = [];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 3;

  for (let i = 0; i < 40; i++) {
    const ang = Math.random() * Math.PI * 2;
    const sp = 2 + Math.random() * 6;
    parts.push({
      x: cx, y: cy,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp,
      g: 0.12,
      a: 1,
      s: 2 + Math.random() * 2,
    });
  }

  const start = performance.now();
  const dur = 650;

  function tick(now) {
    const t = now - start;
    fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    parts.forEach(p => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.a *= 0.97;

      fxCtx.globalAlpha = p.a;
      fxCtx.fillStyle = "rgba(255,255,255,0.95)";
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      fxCtx.fill();
    });

    if (t < dur) requestAnimationFrame(tick);
    else { fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight); hideFx(); }
  }

  requestAnimationFrame(tick);
}

// =======================================================
// OPEN WHEN… (ENVELOPES)
// =======================================================
const OPEN_WHEN = [
  { title: "Open when you miss me", tag: "Missing me", body:
`Meri jaan…
If you miss me, close your eyes for 10 seconds.
That’s me holding you.
I’m always with you — in your heart, in your breath, in your life.
I love you. 💗` },

  { title: "Open when you feel stressed", tag: "Stressed", body:
`Breathe, my love.
You don’t have to carry everything alone.
I’m proud of you — even on the days you feel tired.
Come to me, I’ll be your peace. 🫶` },

  { title: "Open when you need to smile", tag: "Smile", body:
`Quick reminder:
You’re literally the prettiest girl on this planet.
And you make my whole day better just by existing.
Now smile… because I’m obsessed with you 😭💗` },

  { title: "Open when you doubt yourself", tag: "Confidence", body:
`Listen to me, meri biwi:
You are strong. You are rare. You are enough.
You are more than your worries.
And I will always choose you. Always. 💘` },

  { title: "Open when you can’t sleep", tag: "Night", body:
`Pretend I’m next to you.
I’m kissing your forehead and pulling you close.
You’re safe. You’re loved.
Sleep meri zindagi. I love you meri shahzadi 💗` },

  { title: "Open when you want to feel loved", tag: "Loved", body:
`My love,
You’re my biggest blessing.
My favorite person.
My home.
Meri pyaari biwi.
You are the definition of beautiful my sweetheart. I LOVE YOU SO MUCH MERI JAAN 💞` },
];

const openWhenGrid = document.getElementById("openWhenGrid");
const openWhenModal = document.getElementById("openWhenModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalCloseBtn = document.getElementById("modalCloseBtn");


function openModal(title, body, fromEl){
  if (modalTitle) modalTitle.textContent = title;
  if (modalBody) modalBody.textContent = body;

  // add wax seal once (optional)
  if (openWhenModal && !openWhenModal.querySelector(".wax-seal")) {
    const seal = document.createElement("div");
    seal.className = "wax-seal";
    seal.textContent = "💗";
    openWhenModal.querySelector(".modal-card")?.appendChild(seal);
  }

  // --- Fly-in-from-envelope math ---
  const modalCard = openWhenModal?.querySelector(".modal-card");
  if (openWhenModal && modalCard && fromEl) {
    // Put modal in DOM first (hidden), so we can measure final position
    openWhenModal.classList.add("show");
    openWhenModal.setAttribute("aria-hidden", "false");

    // force layout so modal card has its "final" box
    const cardRect = modalCard.getBoundingClientRect();
    const fromRect = fromEl.getBoundingClientRect();

    // We'll animate from the envelope center -> modal card center
    const fromCX = fromRect.left + fromRect.width / 2;
    const fromCY = fromRect.top + fromRect.height / 2;
    const cardCX = cardRect.left + cardRect.width / 2;
    const cardCY = cardRect.top + cardRect.height / 2;

    const dx = fromCX - cardCX;
    const dy = fromCY - cardCY;

    // scale based on envelope size vs card size (clamped)
    const s = Math.max(0.72, Math.min(0.90, (fromRect.width / cardRect.width) || 0.82));

    openWhenModal.style.setProperty("--from-x", `${dx}px`);
    openWhenModal.style.setProperty("--from-y", `${dy}px`);
    openWhenModal.style.setProperty("--from-scale", `${s}`);

    // Start in "from-envelope" state, then animate to final
    openWhenModal.classList.add("from-envelope");

    // Next frame: ensure transition runs
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        openWhenModal.classList.add("show"); // already added, safe
      });
    });
  } else {
    openWhenModal?.classList.add("show");
    openWhenModal?.setAttribute("aria-hidden", "false");
  }

  // lock background scroll
  document.body.style.overflow = "hidden";
}


function closeModal(){
  openWhenModal?.classList.remove("show");
  openWhenModal?.classList.remove("from-envelope");
  openWhenModal?.setAttribute("aria-hidden", "true");
  openWhenModal?.style.removeProperty("--from-x");
  openWhenModal?.style.removeProperty("--from-y");
  openWhenModal?.style.removeProperty("--from-scale");

  document.body.style.overflow = "";
}


modalCloseBtn?.addEventListener("click", closeModal);
openWhenModal?.addEventListener("click", (e) => {
  if (e.target === openWhenModal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

function renderOpenWhen(){
  if (!openWhenGrid) return;

  openWhenGrid.innerHTML = "";

  OPEN_WHEN.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "envelope";

    btn.innerHTML = `
      <div class="envelope-flap" aria-hidden="true"></div>

      <div class="envelope-body">
        <div class="envelope-title">${item.title}</div>
        <div class="envelope-tag">${item.tag}</div>
        <div class="envelope-sub">Tap to open… 💌</div>
      </div>

      <div class="envelope-seal" aria-hidden="true">💗</div>
    `;

    btn.addEventListener("click", () => {
      openModal(item.title, item.body, btn); // ✅ animate from this envelope
    });

    openWhenGrid.appendChild(btn);
  });
}




// Call once
renderOpenWhen();


// =======================================================
// COMPLIMENT ROULETTE (with favorites)
// =======================================================
const COMPLIMENTS = [
  "Your smile is the most beautiful thing ever 💗",
  "Your eyes are my favorite place to get lost in.",
  "You are the most gorgeous girl I have ever seen.",
  "You make my life feel better. Thank you meri jaan.",
  "Your voice is literally comfort to my heart.",
  "You’re not just pretty… you’re a blessing.",
  "You’re my favorite person, my best friend, my wife, my home.",
  "Every time I see you, I wonder what I did to deserve the best person in the world.",
  "You have that kind of beauty that makes the flowers, sun, moon, and stars jealous.",
  "You are my peace meri jaan. Thank you for loving me and giving me comfort.",
  "You are the most beautiful girl in the world.",
  "You have the most warm personality and kindest heart ever.",
  "You are the greatest gift and blessing I have ever received 💗.",
  "You have the most beautiful hair I have ever seen",
  "Your sense of style and your outfits are always amazing my love",
  "You have the most amazing energy—it lights up every room.",
  "You inspire me to be a better person every day.",
  "You make everything better just by being here.",
  "Your laugh is my favorite sound.",
  "Being with you feels like being home.",
  "I love that you can make anything fun.",
  "Your smile is my favorite work of art.",
  "You're more stunning than any sunset.",
  "Your natural beauty takes my breath away.",
  "Your style is impeccable—you make everything look good.",
  "You're the most beautiful person in every room you enter.",
  "You have the kindest heart I've ever known.",
  "I love the way you listen to me and make me feel heard.",
  "You always know how to cheer me up.",
  "You're the sweetest part of my life.",
  "You're the best thing that's ever happened to me.",
  "You make me feel so deeply loved.",
  "You're my forever and always.",
  "You make me want to be the best version of myself.",
  "You make the ordinary feel extraordinary.",
  "I love the way you notice beauty in small things.",
  "You're the kind of person who makes people believe in good again.",
  "You have a soul that shines brighter than any star.",
  "You're truly one of a kind.",
  "You have the kind of beauty that heals, the kind that makes everything feel okay.",
  "Aap sirf meri wife nahi ho, aap meri dua ki jawab ho.",
  "Aap mere liye sirf pyaar nahi ho, aap sukoon bi ho.",
  "Jab aap muskurati ho na, chaand bhi sharma jata hai",
  "Aapko dekh kar dil kehta hai: bas yahi, aur kuch nahi chahiye.",
  "Jab duniya mujhe thaka deti hai, aapka naam hi kaafi hota hai mujhe sambhalne ke liye.",
  "Aap meri zindagi ka woh hissa ho jo agar na hota, toh sab kuch adhoora lagta.",
  "Aapka haath pakar kar mujhe yaqeen hota hai ke main theek jagah par hoon."

];

const rouletteWheel = document.getElementById("rouletteWheel");
const spinBtn = document.getElementById("spinBtn");
const rouletteResult = document.getElementById("rouletteResult");
const saveComplimentBtn = document.getElementById("saveComplimentBtn");
const clearFavoritesBtn = document.getElementById("clearFavoritesBtn");
const favoritesList = document.getElementById("favoritesList");

let lastCompliment = null;
let spinning = false;

function loadFavorites(){
  try { return JSON.parse(localStorage.getItem("complimentFavs") || "[]"); }
  catch { return []; }
}
function saveFavorites(arr){
  localStorage.setItem("complimentFavs", JSON.stringify(arr));
}
function renderFavorites(){
  if (!favoritesList) return;
  const favs = loadFavorites();
  favoritesList.innerHTML = favs.length
    ? favs.map(t => `<li>${t}</li>`).join("")
    : `<li style="opacity:.75;">No favorites saved yet 😌</li>`;
}
renderFavorites();

spinBtn?.addEventListener("click", () => {
  if (spinning) return;
  spinning = true;

  // pick compliment
  const pick = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
  lastCompliment = pick;

  // spin animation
  if (rouletteWheel){
    const turns = 2 + Math.floor(Math.random() * 3); // 2–4 turns
    const extra = Math.floor(Math.random() * 360);
    rouletteWheel.style.transform = `rotate(${turns * 360 + extra}deg)`;
  }

  if (rouletteResult) rouletteResult.textContent = "Spinning… 💞";

  setTimeout(() => {
    if (rouletteResult) rouletteResult.textContent = pick;
    spinning = false;
  }, 1100);
});

saveComplimentBtn?.addEventListener("click", () => {
  if (!lastCompliment) return;
  const favs = loadFavorites();
  if (!favs.includes(lastCompliment)) favs.unshift(lastCompliment);
  saveFavorites(favs.slice(0, 20)); // keep it tidy
  renderFavorites();
});

clearFavoritesBtn?.addEventListener("click", () => {
  saveFavorites([]);
  renderFavorites();
});


// =======================================================
// DATE ADVENTURE (3-step)
// =======================================================
const dateStepHint = document.getElementById("dateStepHint");
const dateQuestion = document.getElementById("dateQuestion");
const dateOptions = document.getElementById("dateOptions");
const datePrevBtn = document.getElementById("datePrevBtn");
const dateNextBtn = document.getElementById("dateNextBtn");
const dateResult = document.getElementById("dateResult");
const dateFinishRow = document.getElementById("dateFinishRow");
const dateAgainBtn = document.getElementById("dateAgainBtn");

const DATE_STEPS = [
  {
    q: "Pick the vibe ✨",
    options: [
      { label: "Cozy & romantic 🕯️", value: "cozy" },
      { label: "Fancy date night 💎", value: "fancy" },
      { label: "Adventure & fun 🎢", value: "adventure" },
      { label: "Late night drive 🌙", value: "drive" },
    ]
  },
  {
    q: "Pick the food 🍽️",
    options: [
      { label: "Dessert date 🍰", value: "dessert" },
      { label: "Dinner together 🍛", value: "dinner" },
      { label: "Street food & laughs 🌯", value: "street" },
      { label: "Coffee + talking for hours ☕", value: "coffee" },
    ]
  },
  {
    q: "Pick the ending 💘",
    options: [
      { label: "Photos + memories 📸", value: "photos" },
      { label: "Movie + cuddles 🎬", value: "movie" },
      { label: "Walk + hand holding 🚶‍♀️🚶‍♂️", value: "walk" },
      { label: "Surprise gift moment 🎁", value: "gift" },
    ]
  }
];

let dateIdx = 0;
let dateChosen = [null, null, null];

function startDateGame(){
  dateIdx = 0;
  dateChosen = [null, null, null];
  if (dateResult) dateResult.style.display = "none";
  if (dateFinishRow) dateFinishRow.style.display = "none";
  renderDateStep();
}

function renderDateStep(){
  const step = DATE_STEPS[dateIdx];
  if (dateStepHint) dateStepHint.textContent = `Step ${dateIdx + 1} of ${DATE_STEPS.length}`;
  if (dateQuestion) dateQuestion.textContent = step.q;

  if (datePrevBtn) datePrevBtn.disabled = (dateIdx === 0);
  if (dateNextBtn) dateNextBtn.disabled = (dateChosen[dateIdx] === null);

  if (!dateOptions) return;
  dateOptions.innerHTML = "";

  step.options.forEach((opt) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "date-opt";
    b.textContent = opt.label;

    if (dateChosen[dateIdx] === opt.value) b.classList.add("selected");

    b.addEventListener("click", () => {
      dateChosen[dateIdx] = opt.value;
      [...dateOptions.querySelectorAll(".date-opt")].forEach(x => x.classList.remove("selected"));
      b.classList.add("selected");
      if (dateNextBtn) dateNextBtn.disabled = false;
    });

    dateOptions.appendChild(b);
  });
}

function buildDatePlan([vibe, food, ending]){
  const vibeText = {
    cozy: "cozy & romantic — candles, soft music, and you in my arms",
    fancy: "fancy — you dressed up, me staring at you because you are so beautiful",
    adventure: "fun & adventurous — laughs, little surprises, and lots of fun",
    drive: "a late night drive — your hand in mine and a playlist of our favorite songs",
  }[vibe];

  const foodText = {
    dessert: "a dessert date (because you’re sweeter than everything)",
    dinner: "a proper dinner together (and I’ll order your favorites)",
    street: "street food (and we’ll try everything and rate it)",
    coffee: "coffee + hours of talking (my favorite thing with you)",
  }[food];

  const endingText = {
    photos: "taking pictures and keeping them as memories forever.",
    movie: "a movie + cuddles until you fall asleep on me.",
    walk: "a long walk holding hands like the world is just us.",
    gift: "a little surprise gift moment — just to see you smile.",
  }[ending];

  return `Our date plan 💗
• Vibe: ${vibeText}
• Food: ${foodText}
• Ending: ${endingText}

 And the best part is…it ends with me telling you again:
You’re my wife. My best friend. My favorite person in the world. My home. I love you meri jaan.`;
}

datePrevBtn?.addEventListener("click", () => {
  if (dateIdx === 0) return;
  dateIdx--;
  renderDateStep();
});

dateNextBtn?.addEventListener("click", () => {
  if (dateChosen[dateIdx] === null) return;

  if (dateIdx === DATE_STEPS.length - 1){
    // show result
    const plan = buildDatePlan(dateChosen);
    if (dateResult){
      dateResult.style.display = "";
      dateResult.textContent = plan;
    }
    if (dateFinishRow) dateFinishRow.style.display = "";
    if (dateOptions) dateOptions.innerHTML = "";
    if (dateQuestion) dateQuestion.textContent = "Okay… here’s our date 😭💗";
    if (dateStepHint) dateStepHint.textContent = "Completed 💘";
    return;
  }

  dateIdx++;
  renderDateStep();
});

dateAgainBtn?.addEventListener("click", () => {
  startDateGame();
});



