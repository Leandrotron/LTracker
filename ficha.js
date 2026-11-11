const STORAGE_KEY = "ltracker.data";
const TARGET_SESSIONS = 40;
const WORKOUTS = {
  A: [
    ["Desenvolvimento Articulado", "3 × 10"],
    ["Elevação Frontal com Halteres", "3 × 10"],
    ["Crucifixo na Máquina", "3 × 10"],
    ["Supino Inclinado com Barra", "3 × 10"],
    ["Supino Reto com Barra", "3 × 10"],
    ["Tríceps Francês", "3 × 10"],
    ["Tríceps Pulley Barra Reta", "3 × 10"],
  ],
  B: [
    ["Cadeira Extensora", "3 × 10"],
    ["Leg Press Extensor", "3 × 10"],
    ["Cadeira Flexora", "3 × 10"],
    ["Agachamento Hack Sentado", "3 × 10"],
    ["Cadeira Adutora", "3 × 15"],
    ["Cadeira Abdutora", "3 × 15"],
    ["Panturrilha Sentado", "3 × 15"],
  ],
  C: [
    ["Pulley Frente", "3 × 10"],
    ["Remada Baixa Supinada", "3 × 10"],
    ["Remada Aberta Máquina", "3 × 10"],
    ["Crucifixo Invertido Máquina", "3 × 10"],
    ["Rosca Direta", "3 × 10"],
    ["Rosca Alternada", "3 × 10"],
  ],
};
const exerciseList = document.querySelector("#exercise-list");
const dateInput = document.querySelector("#workout-date");
const feedback = document.querySelector("#feedback");
const historyList = document.querySelector("#history");
const calendar = document.querySelector("#calendar");
const monthLabel = document.querySelector("#month-label");
let selectedTab = "A";
let visibleMonth = new Date();
visibleMonth.setDate(1);

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function readData() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return data && typeof data === "object" && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}
function getSessions(data = readData()) {
  if (!Array.isArray(data.workoutLog)) data.workoutLog = [];
  return data.workoutLog;
}
function writeData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function formatDate(key, options = { day: "numeric", month: "short", year: "numeric" }) {
  const [year, month, day] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", options).format(new Date(year, month - 1, day));
}
function getNextWorkout(sessions) {
  const last = [...sessions].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  if (!last) return "A";
  return ({ A: "B", B: "C", C: "A" })[last.type] || "A";
}
function renderExercises() {
  document.querySelectorAll(".tab").forEach((tab) => {
    const active = tab.dataset.tab === selectedTab;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  exerciseList.innerHTML = WORKOUTS[selectedTab].map(([name, detail]) =>
    `<div class="exercise"><span class="exercise-name">${name}</span><span class="exercise-meta">${detail}</span></div>`
  ).join("");
}
function renderProgress(sessions) {
  const count = sessions.length;
  const percent = Math.min(100, Math.round((count / TARGET_SESSIONS) * 100));
  document.querySelector("#progress-count").innerHTML = `${count} <small>/ ${TARGET_SESSIONS}</small>`;
  document.querySelector("#progress-percent").textContent = `${percent}%`;
  const ring = document.querySelector("#progress-ring");
  ring.style.setProperty("--progress", `${percent}%`);
  ring.setAttribute("aria-label", `${count} de ${TARGET_SESSIONS} treinos`);
  const message = count >= TARGET_SESSIONS
    ? `Ficha concluída em ${formatDate([...sessions].sort((a, b) => a.date.localeCompare(b.date))[TARGET_SESSIONS - 1].date)}`
    : `${TARGET_SESSIONS - count} sessões restantes · próximo sugerido: ${getNextWorkout(sessions)}`;
  document.querySelector("#progress-message").textContent = message;
}
function renderCalendar(sessions) {
  calendar.innerHTML = "";
  const weekdays = ["S", "T", "Q", "Q", "S", "S", "D"];
  weekdays.forEach((day) => {
    const cell = document.createElement("span");
    cell.className = "calendar-head";
    cell.textContent = day;
    calendar.appendChild(cell);
  });
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  monthLabel.textContent = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(visibleMonth);
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const marked = new Set(sessions.map((session) => session.date));
  for (let i = 0; i < offset; i += 1) {
    const blank = document.createElement("span");
    blank.className = "calendar-day empty";
    calendar.appendChild(blank);
  }
  const today = dateKey(new Date());
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = dateKey(new Date(year, month, day));
    const cell = document.createElement("span");
    cell.className = "calendar-day";
    cell.textContent = day;
    if (marked.has(key)) cell.classList.add("has-workout");
    if (key === today) cell.classList.add("today");
    calendar.appendChild(cell);
  }
}
function renderHistory(sessions) {
  historyList.innerHTML = "";
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  if (!sorted.length) {
    historyList.innerHTML = '<p class="history-empty">Nenhum treino registrado ainda.</p>';
    return;
  }
  sorted.forEach((session) => {
    const row = document.createElement("div");
    row.className = "history-row";
    const date = document.createElement("span");
    date.className = "history-date";
    date.textContent = formatDate(session.date);
    const badge = document.createElement("span");
    badge.className = `pill pill-${session.type.toLowerCase()}`;
    badge.textContent = session.type;
    const actions = document.createElement("div");
    actions.className = "row-actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.textContent = "Corrigir";
    edit.addEventListener("click", () => editSession(session.id));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Apagar";
    remove.addEventListener("click", () => deleteSession(session.id));
    actions.append(edit, remove);
    row.append(date, badge, actions);
    historyList.appendChild(row);
  });
}
function render() {
  const data = readData();
  const sessions = getSessions(data);
  renderProgress(sessions);
  renderCalendar(sessions);
  renderHistory(sessions);
}
function addSession(type) {
  const date = dateInput.value;
  if (!date) {
    feedback.textContent = "Escolha uma data.";
    return;
  }
  const data = readData();
  const sessions = getSessions(data);
  sessions.push({ id: crypto.randomUUID(), date, type, createdAt: Date.now() });
  writeData(data);
  feedback.textContent = `Treino ${type} registrado em ${formatDate(date)}.`;
  render();
}
function editSession(id) {
  const data = readData();
  const session = getSessions(data).find((item) => item.id === id);
  if (!session) return;
  const type = window.prompt("Tipo do treino: A, B ou C", session.type);
  if (!type) return;
  const normalizedType = type.trim().toUpperCase();
  if (!["A", "B", "C"].includes(normalizedType)) {
    window.alert("Digite A, B ou C.");
    return;
  }
  const newDate = window.prompt("Data do treino (AAAA-MM-DD)", session.date);
  if (!newDate) return;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
    window.alert("Use o formato AAAA-MM-DD.");
    return;
  }
  session.type = normalizedType;
  session.date = newDate;
  writeData(data);
  feedback.textContent = "Registro corrigido.";
  render();
}
function deleteSession(id) {
  if (!window.confirm("Apagar este treino do histórico?")) return;
  const data = readData();
  data.workoutLog = getSessions(data).filter((item) => item.id !== id);
  writeData(data);
  feedback.textContent = "Treino apagado.";
  render();
}
document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => {
  selectedTab = tab.dataset.tab;
  renderExercises();
}));
document.querySelectorAll(".workout-button").forEach((button) => button.addEventListener("click", () => addSession(button.dataset.workout)));
document.querySelector("#prev-month").addEventListener("click", () => {
  visibleMonth.setMonth(visibleMonth.getMonth() - 1);
  render();
});
document.querySelector("#next-month").addEventListener("click", () => {
  visibleMonth.setMonth(visibleMonth.getMonth() + 1);
  render();
});
dateInput.value = dateKey(new Date());
renderExercises();
render();
