const STORAGE_KEY = "ltracker.data";
const dailyForm = document.querySelector("#daily-form");
const activityForm = document.querySelector("#activity-form");
const exerciseAddForm = document.querySelector("#exercise-add-form");
const studentNameInput = document.querySelector("#student-name");
const studentList = document.querySelector("#student-list");
const newStudentToggle = document.querySelector("#new-student-toggle");
const newProgramToggle = document.querySelector("#new-program-toggle");
const studentForm = document.querySelector("#student-form");
const templateLibraryForm = document.querySelector("#template-library-form");
const templateLibraryList = document.querySelector("#template-library-list");
const applyTemplateForm = document.querySelector("#apply-template-form");
const studentDetail = document.querySelector("#student-detail");
const adminDetailTitle = document.querySelector("#admin-detail-title");
const timelineList = document.querySelector("#timeline-list");
const workoutToggle = document.querySelector("#workout-toggle");
const gymCard = document.querySelector("#gym-card");
const gymCardTitle = document.querySelector("#gym-card-title");
const templateEditToggle = document.querySelector("#template-edit-toggle");
const gymWorkoutActive = document.querySelector("#gym-workout-active");
const activeWorkoutHeading = document.querySelector("#active-workout-heading");
const workoutTabsContainer = document.querySelector("#workout-tabs");
const workoutProgress = document.querySelector("#workout-progress");
const currentDate = document.querySelector("#current-date");
const currentStudentLabel = document.querySelector("#current-student-label");
const distanceField = document.querySelector(".distance-field");
const gymFields = document.querySelectorAll(".gym-field");
const historyWorkouts = document.querySelector("#history-workouts");
const historyLastWorkout = document.querySelector("#history-last-workout");
const historyStreak = document.querySelector("#history-streak");
const historyActiveWorkout = document.querySelector("#history-active-workout");
const historyAdvice = document.querySelector("#history-advice");
const exportDataButton = document.querySelector("#export-data");
const importDataButton = document.querySelector("#import-data");
const importFileInput = document.querySelector("#import-file");
const backupStatus = document.querySelector("#backup-status");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
let isWorkoutCardOpen = true;
let isTemplateEditMode = false;
let activeWorkout = "A";
let selectedAdminDetail = { type: "", id: "" };
const openExercisePhotos = new Set();
const EXERCISE_NAME_ALIASES = {
  "Elevacao lateral": "Elevação lateral",
  "Elevacao frontal": "Elevação frontal",
};
const MUSCLE_GROUPS = {
  "Elevação lateral": "Ombro",
  "Elevação frontal": "Ombro",
  "Supino inclinado": "Peito",
  "Crucifixo maquina": "Peito",
  Pulley: "Costas",
  "Remada alta": "Ombro",
  "Rosca direta": "Bíceps",
  "Triceps corda": "Tríceps",
  "Extensora unilateral": "Quadríceps",
  "Leg 45": "Pernas",
  "Flexora vertical": "Posterior",
  "Mesa flexora": "Posterior",
  "Hack squat": "Pernas",
  Abdutora: "Glúteos",
  Panturrilha: "Panturrilha",
};
const DEFAULT_WORKOUT_TEMPLATES = {
  A: {
    title: "Treino A - Superiores",
    groups: [
      {
        title: "Superiores",
        exercises: [
          createTemplateExercise("Elevação lateral", "Ombro"),
          createTemplateExercise("Elevação frontal", "Ombro"),
          createTemplateExercise("Supino inclinado", "Peito"),
          createTemplateExercise("Crucifixo maquina", "Peito"),
          createTemplateExercise("Pulley", "Costas"),
          createTemplateExercise("Remada alta", "Ombro"),
          createTemplateExercise("Rosca direta", "Bíceps"),
          createTemplateExercise("Triceps corda", "Tríceps"),
        ],
      },
    ],
  },
  B: {
    title: "Treino B - Inferiores",
    groups: [
      {
        title: "Inferiores",
        exercises: [
          createTemplateExercise("Extensora unilateral", "Quadríceps"),
          createTemplateExercise("Leg 45", "Pernas"),
          createTemplateExercise("Flexora vertical", "Posterior"),
          createTemplateExercise("Mesa flexora", "Posterior"),
          createTemplateExercise("Hack squat", "Pernas"),
          createTemplateExercise("Abdutora", "Glúteos"),
          createTemplateExercise("Panturrilha", "Panturrilha"),
        ],
      },
    ],
  },
};

function getTodayKey() {
  const today = new Date();

  return formatDateKey(today);
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date) {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

function renderCurrentDate() {
  if (!currentDate) {
    return;
  }

  currentDate.textContent = formatDisplayDate(new Date());
}

function getCurrentWeekKeys() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  const weekKeys = [];

  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() - daysSinceMonday);

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(monday);

    date.setDate(monday.getDate() + index);
    weekKeys.push(formatDateKey(date));
  }

  return weekKeys;
}

function loadData() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return { days: {} };
  }

  try {
    const data = JSON.parse(savedData);

    if (!data.days) {
      return { days: {} };
    }

    return data;
  } catch {
    return { days: {} };
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function ensureGymData(data) {
  if (!isPlainObject(data.gym)) {
    data.gym = {};
  }

  if (!Array.isArray(data.gym.students)) {
    data.gym.students = [];
  }

  if (!Array.isArray(data.gym.templateLibrary)) {
    data.gym.templateLibrary = [];
  }

  if (!Array.isArray(data.gym.programLibrary)) {
    data.gym.programLibrary = data.gym.templateLibrary.map((template) => ({
      id: template.id || createTemplateId(),
      name: template.name || "Programa",
      note: template.note || "",
      workoutTemplates: {
        A: createWorkoutTemplateFromExercises("Treino A", template.exercises || []),
        B: createWorkoutTemplateFromExercises("Treino B", []),
        C: createWorkoutTemplateFromExercises("Treino C", []),
      },
      createdAt: template.createdAt || new Date().toISOString(),
    }));
  }

  return data.gym;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isValidLtrackerBackup(data) {
  if (!isPlainObject(data) || !isPlainObject(data.days)) {
    return false;
  }

  if (data.workoutTemplates !== undefined && !isPlainObject(data.workoutTemplates)) {
    return false;
  }

  if (data.gym !== undefined && !isPlainObject(data.gym)) {
    return false;
  }

  return true;
}

function setBackupStatus(message) {
  if (!backupStatus) {
    return;
  }

  backupStatus.textContent = message;
}

function showTab(targetId) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tabTarget === targetId;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  tabPanels.forEach((panel) => {
    panel.hidden = panel.id !== targetId;
  });
}

function getBackupFileName() {
  return `ltracker-backup-${getTodayKey()}.json`;
}

function exportData() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  const dataText = savedData || JSON.stringify({ days: {} }, null, 2);
  const blob = new Blob([dataText], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = getBackupFileName();
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setBackupStatus("Backup exportado.");
}

function renderAppFromStorage() {
  const data = loadData();

  if (dailyForm) {
    fillDailyForm(getTodayData(data));
  }

  renderStudentProfile();
  renderStudentList();
  saveData(data);

  if (timelineList) {
    renderActivities();
  }

  if (gymWorkoutActive) {
    renderGymExercises();
    updateWorkoutCard();
  }

  if (historyWorkouts) {
    renderWeeklySummary();
  }
}

function importDataFromFile(file) {
  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    try {
      const importedData = JSON.parse(String(reader.result || ""));

      if (!isValidLtrackerBackup(importedData)) {
        setBackupStatus("Arquivo invalido para o LTracker.");
        return;
      }

      const shouldImport = window.confirm(
        "Importar este backup vai substituir os dados atuais deste navegador. Continuar?",
      );

      if (!shouldImport) {
        setBackupStatus("Importacao cancelada.");
        return;
      }

      saveData(importedData);
      renderAppFromStorage();
      setBackupStatus("Backup importado.");
    } catch {
      setBackupStatus("Nao foi possivel ler este JSON.");
    } finally {
      importFileInput.value = "";
    }
  });

  reader.addEventListener("error", () => {
    importFileInput.value = "";
    setBackupStatus("Nao foi possivel ler o arquivo.");
  });

  reader.readAsText(file);
}

function getCanonicalExerciseName(name) {
  return EXERCISE_NAME_ALIASES[name] || name;
}

function getDefaultMuscleGroup(name) {
  return MUSCLE_GROUPS[getCanonicalExerciseName(name)] || "";
}

function getMuscleGroupClass(muscleGroup) {
  const classes = {
    Ombro: "muscle-shoulder",
    Peito: "muscle-chest",
    Costas: "muscle-back",
    Bíceps: "muscle-biceps",
    Tríceps: "muscle-triceps",
    Quadríceps: "muscle-quads",
    Posterior: "muscle-hamstrings",
    Pernas: "muscle-legs",
    Glúteos: "muscle-glutes",
    Panturrilha: "muscle-calves",
  };

  return classes[muscleGroup] || "";
}

function createTemplateExercise(name, muscleGroup = "") {
  const canonicalName = getCanonicalExerciseName(name);

  return {
    name: canonicalName,
    muscleGroup: muscleGroup || getDefaultMuscleGroup(canonicalName),
    weight: "",
    notes: "",
    photo: "",
  };
}

function normalizeTemplateExercise(exercise) {
  if (typeof exercise === "string") {
    return createTemplateExercise(exercise);
  }

  const name = getCanonicalExerciseName(exercise?.name || "Exercicio");

  return {
    name,
    muscleGroup: exercise?.muscleGroup || getDefaultMuscleGroup(name),
    weight: exercise?.weight || exercise?.load || "",
    notes: exercise?.notes || exercise?.note || "",
    photo: exercise?.photo || exercise?.photoDataUrl || "",
  };
}

function cloneDefaultWorkoutTemplates() {
  return JSON.parse(JSON.stringify(DEFAULT_WORKOUT_TEMPLATES));
}

function createWorkoutTemplateFromExercises(title, exercises) {
  return {
    title,
    groups: [
      {
        title: "Exercicios",
        exercises: exercises.map(normalizeTemplateExercise),
      },
    ],
  };
}

function getCurrentStudent(data) {
  const gymData = ensureGymData(data);

  return gymData.students.find((student) => student.id === gymData.currentStudentId) || null;
}

function getWorkoutTemplateOwner(data) {
  const currentStudent = getCurrentStudent(data);

  if (currentStudent?.currentProgram?.workoutTemplates) {
    return currentStudent.currentProgram;
  }

  if (currentStudent?.workoutTemplates) {
    return currentStudent;
  }

  return data;
}

function migrateGymExercisesToTemplates(data) {
  const exercises = data.gym?.exercises;

  if (!Array.isArray(exercises) || exercises.length === 0) {
    return null;
  }

  return {
    A: {
      title: "Treino A - Superiores",
      groups: [
        {
          title: "Exercicios",
          exercises: exercises
            .filter((exercise) => exercise.workout === "A")
            .sort((first, second) => (Number(first.order) || 0) - (Number(second.order) || 0))
            .map(normalizeTemplateExercise)
            .filter(Boolean),
        },
      ],
    },
    B: {
      title: "Treino B - Inferiores",
      groups: [
        {
          title: "Exercicios",
          exercises: exercises
            .filter((exercise) => exercise.workout === "B")
            .sort((first, second) => (Number(first.order) || 0) - (Number(second.order) || 0))
            .map(normalizeTemplateExercise)
            .filter(Boolean),
        },
      ],
    },
  };
}

function ensureWorkoutTemplates(data) {
  const owner = getWorkoutTemplateOwner(data);

  if (!owner.workoutTemplates) {
    owner.workoutTemplates = owner === data
      ? migrateGymExercisesToTemplates(data) || cloneDefaultWorkoutTemplates()
      : cloneDefaultWorkoutTemplates();
  }

  if (Object.keys(owner.workoutTemplates).length === 0) {
    owner.workoutTemplates = cloneDefaultWorkoutTemplates();
  }

  Object.keys(owner.workoutTemplates).forEach((workout) => {
    if (!owner.workoutTemplates[workout]) {
      owner.workoutTemplates[workout] = createWorkoutTemplateFromExercises(`Treino ${workout}`, []);
    }

    if (!Array.isArray(owner.workoutTemplates[workout].groups)) {
      owner.workoutTemplates[workout].groups = [{ title: "Exercicios", exercises: [] }];
    }

    if (!owner.workoutTemplates[workout].groups[0]) {
      owner.workoutTemplates[workout].groups[0] = { title: "Exercicios", exercises: [] };
    }

    if (!Array.isArray(owner.workoutTemplates[workout].groups[0].exercises)) {
      owner.workoutTemplates[workout].groups[0].exercises = [];
    }

    owner.workoutTemplates[workout].groups[0].exercises =
      owner.workoutTemplates[workout].groups[0].exercises.map(normalizeTemplateExercise);
  });

  if (!owner.workoutTemplates[activeWorkout]) {
    activeWorkout = Object.keys(owner.workoutTemplates)[0] || "A";
  }

  return owner.workoutTemplates;
}

function getNumber(value) {
  const number = Number(String(value).replace(",", "."));

  return Number.isFinite(number) ? number : 0;
}

function normalizeDecimalInput(value) {
  return String(value).trim().replace(",", ".");
}

function formatNumberInput(number) {
  return Number(number.toFixed(2)).toString();
}

function getDurationMinutes(value) {
  const textValue = String(value).trim();

  if (!textValue) {
    return 0;
  }

  if (textValue.includes(":")) {
    const parts = textValue.split(":");

    if (parts.length !== 2) {
      return 0;
    }

    const [minutesText, secondsText] = parts;
    const minutes = Number(minutesText);
    const seconds = Number(secondsText);

    if (!Number.isFinite(minutes) || !Number.isFinite(seconds) || seconds < 0 || seconds >= 60) {
      return 0;
    }

    return minutes + seconds / 60;
  }

  return getNumber(textValue);
}

function normalizeDurationInput(value) {
  const textValue = String(value).trim();
  const durationMinutes = getDurationMinutes(textValue);

  if (!textValue || durationMinutes <= 0) {
    return "";
  }

  return formatNumberInput(durationMinutes);
}

function getSleepHours(value) {
  const textValue = String(value).trim();

  if (!textValue) {
    return 0;
  }

  if (textValue.includes(":")) {
    const parts = textValue.split(":");

    if (parts.length !== 2) {
      return 0;
    }

    const [hoursText, minutesText] = parts;
    const hours = Number(hoursText);
    const minutes = Number(minutesText);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes) || minutes < 0 || minutes >= 60) {
      return 0;
    }

    return hours + minutes / 60;
  }

  return getNumber(textValue);
}

function normalizeSleepInput(value) {
  const textValue = String(value).trim();
  const sleepHours = getSleepHours(textValue);

  if (!textValue || sleepHours <= 0) {
    return "";
  }

  return formatNumberInput(sleepHours);
}

function formatSleepHours(value) {
  const totalMinutes = Math.round(value * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = String(totalMinutes % 60).padStart(2, "0");

  return `${hours}h${minutes}`;
}

function formatDecimal(value) {
  return Number(value.toFixed(2)).toString();
}

function formatDuration(value) {
  const totalSeconds = Math.round(value * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (seconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")} min`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      resolve(String(reader.result || ""));
    });

    reader.addEventListener("error", () => {
      resolve("");
    });

    reader.readAsDataURL(file);
  });
}

function getAverage(values) {
  if (values.length === 0) {
    return null;
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  return total / values.length;
}

function getTodayData(data) {
  const todayKey = getTodayKey();

  if (!data.days[todayKey]) {
    data.days[todayKey] = {
      dayStatus: "active",
      statusNote: "",
      weight: "",
      sleepHours: "",
      sleepQuality: "",
      mood: "",
      soreness: "",
      notes: "",
      activities: [],
    };
  }

  if (!data.days[todayKey].activities) {
    data.days[todayKey].activities = [];
  }

  return data.days[todayKey];
}

function fillDailyForm(dayData) {
  dailyForm.dayStatus.value = dayData.dayStatus || "active";
  dailyForm.statusNote.value = dayData.statusNote || "";
  dailyForm.weight.value = dayData.weight || "";
  dailyForm.sleepHours.value = dayData.sleepHours || "";
  dailyForm.sleepQuality.value = dayData.sleepQuality || "";
  dailyForm.mood.value = dayData.mood || "";
  dailyForm.soreness.value = dayData.soreness || "";
  dailyForm.notes.value = dayData.notes || "";
}

function setupDailyForm() {
  if (!dailyForm) {
    return;
  }

  const data = loadData();
  const todayKey = getTodayKey();
  const todayData = getTodayData(data);

  fillDailyForm(todayData);

  dailyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const currentData = loadData();
    const currentDay = getTodayData(currentData);

    currentData.days[todayKey] = {
      ...currentDay,
      dayStatus: dailyForm.dayStatus.value || "active",
      statusNote: dailyForm.statusNote.value,
      weight: normalizeDecimalInput(dailyForm.weight.value),
      sleepHours: normalizeSleepInput(dailyForm.sleepHours.value),
      sleepQuality: dailyForm.sleepQuality.value,
      mood: dailyForm.mood.value,
      soreness: dailyForm.soreness.value,
      notes: dailyForm.notes.value,
      activities: currentDay.activities,
    };

    saveData(currentData);
    renderActivities();
    renderWeeklySummary();
  });
}

function updateActivityFields() {
  if (!activityForm || !distanceField || !workoutToggle) {
    return;
  }

  const isGym = activityForm.activityType.value === "Academia";

  distanceField.classList.toggle("is-hidden", isGym);
  gymFields.forEach((field) => {
    field.classList.toggle("is-hidden", !isGym);
  });

  workoutToggle.classList.toggle("is-hidden", !isGym);

  if (!isGym) {
    isWorkoutCardOpen = false;
  }

  updateWorkoutCard();
}

function renderStudentProfile() {
  const data = loadData();
  const currentStudentName = getCurrentStudentName(data);

  if (studentNameInput) {
    studentNameInput.value = currentStudentName;
  }

  if (currentStudentLabel) {
    currentStudentLabel.textContent = currentStudentName
      ? `Aluno atual: ${currentStudentName}`
      : "Aluno atual: sem aluno selecionado";
  }
}

function setupStudentProfile() {
  if (!studentNameInput) {
    renderStudentProfile();
    return;
  }

  renderStudentProfile();
  studentNameInput.addEventListener("input", () => {
    const data = loadData();
    const gymData = ensureGymData(data);

    gymData.currentStudentName = studentNameInput.value.trim();
    saveData(data);
    renderStudentList();
  });
}

function createStudentId() {
  return `student-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createTemplateId() {
  return `template-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getCurrentStudentName(data) {
  const gymData = ensureGymData(data);
  const currentStudent = gymData.students.find((student) => student.id === gymData.currentStudentId);

  return currentStudent?.name || gymData.currentStudentName || "";
}

function selectStudent(studentId) {
  const data = loadData();
  const gymData = ensureGymData(data);
  const student = gymData.students.find((item) => item.id === studentId);

  if (!student) {
    return;
  }

  gymData.currentStudentId = student.id;
  gymData.currentStudentName = student.name;
  selectedAdminDetail = { type: "student", id: student.id };
  saveData(data);
  renderStudentProfile();
  renderStudentList();
  renderAdminDetail();
  renderTemplateLibrary();
}

function selectProgram(programId) {
  const data = loadData();
  const gymData = ensureGymData(data);
  const program = gymData.programLibrary.find((item) => item.id === programId);

  if (!program) {
    return;
  }

  selectedAdminDetail = { type: "program", id: program.id };
  renderTemplateLibrary();
  renderStudentList();
  renderAdminDetail();
}

function renderStudentList() {
  if (!studentList) {
    return;
  }

  const data = loadData();
  const gymData = ensureGymData(data);

  studentList.innerHTML = "";

  if (gymData.students.length === 0) {
    studentList.innerHTML = '<p class="activity-empty">Nenhum aluno cadastrado ainda.</p>';
    return;
  }

  gymData.students.forEach((student) => {
    const item = document.createElement("div");
    const content = document.createElement("div");
    const title = document.createElement("p");
    const meta = document.createElement("p");
    const selectButton = document.createElement("button");
    const isCurrent = student.id === gymData.currentStudentId;

    item.className = `student-item ${isCurrent ? "is-current" : ""}`.trim();
    content.className = "student-item-content";
    title.className = "student-item-title";
    title.textContent = student.name;
    meta.className = "activity-meta";
    meta.textContent = [
      student.startDate ? `inicio ${formatHistoryDate(student.startDate)}` : "",
      student.note || "",
    ]
      .filter(Boolean)
      .join(" | ") || "Sem observacoes";
    selectButton.className = "secondary-button";
    selectButton.type = "button";
    selectButton.textContent = isCurrent ? "Aberto" : "Abrir";
    selectButton.addEventListener("click", () => {
      selectStudent(student.id);
    });

    content.appendChild(title);
    content.appendChild(meta);
    item.appendChild(content);
    item.appendChild(selectButton);
    studentList.appendChild(item);
  });
}

function renderStudentDetail() {
  if (!studentDetail) {
    return;
  }

  const data = loadData();
  const student = getCurrentStudent(data);

  studentDetail.innerHTML = "";
  applyTemplateForm?.classList.toggle("is-hidden", !student);
  if (adminDetailTitle) {
    adminDetailTitle.textContent = student ? "Detalhes do aluno" : "Selecione um aluno";
  }

  if (!student) {
    studentDetail.innerHTML = '<p class="activity-empty">Selecione um aluno na lista para ver detalhes e aplicar programas.</p>';
    return;
  }

  const header = document.createElement("div");
  const title = document.createElement("p");
  const meta = document.createElement("p");
  const program = document.createElement("p");
  const workoutSummary = document.createElement("div");
  const timeline = document.createElement("div");

  header.className = "student-detail-header";
  title.className = "student-item-title";
  title.textContent = student.name;
  meta.className = "activity-meta";
  meta.textContent = [
    student.startDate ? `inicio ${formatHistoryDate(student.startDate)}` : "",
    student.note || "",
  ]
    .filter(Boolean)
    .join(" | ") || "Sem observacoes";
  program.className = "activity-meta";
  program.textContent = student.currentProgram?.name
    ? `Programa atual: ${student.currentProgram.name}`
    : "Sem programa aplicado";
  workoutSummary.className = "student-workout-summary";
  timeline.className = "timeline-list";

  const studentWorkouts = student.currentProgram?.workoutTemplates || student.workoutTemplates || {};
  const workoutKeys = Object.keys(studentWorkouts);

  (workoutKeys.length > 0 ? workoutKeys : ["A", "B"]).forEach((workout) => {
    const template = studentWorkouts[workout];
    const exercises = template?.groups?.[0]?.exercises || [];
    const item = document.createElement("div");
    const itemTitle = document.createElement("p");
    const itemMeta = document.createElement("p");

    item.className = "student-workout-item";
    itemTitle.className = "student-item-title";
    itemTitle.textContent = `Treino ${workout}`;
    itemMeta.className = "activity-meta";
    itemMeta.textContent = template
      ? `${template.title || `Treino ${workout}`} | ${exercises.length} exercicios`
      : "Sem ficha aplicada";
    item.appendChild(itemTitle);
    item.appendChild(itemMeta);
    workoutSummary.appendChild(item);
  });

  header.appendChild(title);
  header.appendChild(meta);
  header.appendChild(program);
  studentDetail.appendChild(header);
  studentDetail.appendChild(workoutSummary);

  Object.entries(data.days)
    .sort(([firstDate], [secondDate]) => secondDate.localeCompare(firstDate))
    .slice(0, 5)
    .forEach(([dayKey, dayData]) => {
      const item = document.createElement("div");
      const date = document.createElement("span");
      const icon = document.createElement("span");
      const content = document.createElement("div");
      const title = document.createElement("p");
      const gymActivity = (dayData.activities || []).find((activity) => activity.type === "Academia");

      item.className = "timeline-item";
      date.className = "timeline-date";
      date.textContent = formatHistoryDate(dayKey);
      icon.className = "timeline-icon";
      icon.textContent = gymActivity ? "\u2713" : getDayStatusIcon(dayData.dayStatus || "active");
      content.className = "timeline-content";
      title.className = "timeline-title";
      title.textContent = gymActivity?.workoutPlan
        ? `Treino ${gymActivity.workoutPlan}`
        : getDayStatusLabel(dayData.dayStatus || "active");
      content.appendChild(title);
      item.appendChild(date);
      item.appendChild(icon);
      item.appendChild(content);
      timeline.appendChild(item);
    });

  if (timeline.children.length > 0) {
    studentDetail.appendChild(timeline);
  }
}

function renderProgramDetail() {
  if (!studentDetail) {
    return;
  }

  const data = loadData();
  const gymData = ensureGymData(data);
  const program = gymData.programLibrary.find((item) => item.id === selectedAdminDetail.id);

  studentDetail.innerHTML = "";
  applyTemplateForm?.classList.add("is-hidden");

  if (adminDetailTitle) {
    adminDetailTitle.textContent = program ? "Editor do programa" : "Selecione um programa";
  }

  if (!program) {
    studentDetail.innerHTML = '<p class="activity-empty">Selecione um programa na lista para editar seus treinos.</p>';
    return;
  }

  const header = document.createElement("div");
  const title = document.createElement("p");
  const meta = document.createElement("p");
  const editor = document.createElement("div");

  ensureProgramWorkoutTemplates(program);
  header.className = "student-detail-header";
  title.className = "student-item-title";
  title.textContent = program.name;
  meta.className = "activity-meta";
  meta.textContent = program.note || "Sem observacoes";
  editor.className = "template-library-exercises";

  header.appendChild(title);
  header.appendChild(meta);
  studentDetail.appendChild(header);
  renderProgramEditor(program, editor);
  studentDetail.appendChild(editor);
}

function renderAdminDetail() {
  if (!studentDetail) {
    return;
  }

  if (selectedAdminDetail.type === "program") {
    renderProgramDetail();
    return;
  }

  if (selectedAdminDetail.type === "student") {
    renderStudentDetail();
    return;
  }

  applyTemplateForm?.classList.add("is-hidden");
  if (adminDetailTitle) {
    adminDetailTitle.textContent = "Selecione um aluno ou programa";
  }
  studentDetail.innerHTML = '<p class="activity-empty">Escolha um aluno ou programa para ver os detalhes.</p>';
}

function renderApplyTemplateOptions() {
  if (!applyTemplateForm) {
    return;
  }

  const data = loadData();
  const gymData = ensureGymData(data);
  const templateSelect = applyTemplateForm.applyTemplateId;

  templateSelect.innerHTML = "";

  if (gymData.programLibrary.length === 0) {
    const option = document.createElement("option");

    option.value = "";
    option.textContent = "Nenhum programa cadastrado";
    templateSelect.appendChild(option);
    return;
  }

  gymData.programLibrary.forEach((template) => {
    const option = document.createElement("option");

    option.value = template.id;
    option.textContent = template.name;
    templateSelect.appendChild(option);
  });
}

function renderTemplateLibrary() {
  if (!templateLibraryList) {
    return;
  }

  const data = loadData();
  const gymData = ensureGymData(data);

  templateLibraryList.innerHTML = "";

  if (gymData.programLibrary.length === 0) {
    templateLibraryList.innerHTML = '<p class="activity-empty">Nenhum programa cadastrado.</p>';
    renderApplyTemplateOptions();
    return;
  }

  gymData.programLibrary.forEach((template) => {
    const item = document.createElement("div");
    const content = document.createElement("div");
    const name = document.createElement("p");
    const note = document.createElement("p");
    const openButton = document.createElement("button");
    const isOpen = selectedAdminDetail.type === "program" && selectedAdminDetail.id === template.id;

    ensureProgramWorkoutTemplates(template);
    item.className = `student-item ${isOpen ? "is-current" : ""}`.trim();
    content.className = "student-item-content";
    name.className = "student-item-title";
    name.textContent = template.name;
    note.className = "activity-meta";
    note.textContent = [
      template.note || "",
      `${Object.keys(template.workoutTemplates).length} treinos`,
    ]
      .filter(Boolean)
      .join(" | ");
    openButton.className = "secondary-button";
    openButton.type = "button";
    openButton.textContent = isOpen ? "Aberto" : "Abrir";
    openButton.addEventListener("click", () => {
      selectProgram(template.id);
    });

    content.appendChild(name);
    content.appendChild(note);
    item.appendChild(content);
    item.appendChild(openButton);
    templateLibraryList.appendChild(item);
  });

  renderApplyTemplateOptions();
}

function renderProgramEditor(template, container) {
  const workoutForm = document.createElement("form");
  const workoutNameInput = document.createElement("input");
  const workoutTitleInput = document.createElement("input");
  const workoutButton = document.createElement("button");

  workoutForm.className = "template-inline-form";
  workoutNameInput.name = "workoutName";
  workoutNameInput.type = "text";
  workoutNameInput.placeholder = "Novo treino: A, B, C...";
  workoutTitleInput.name = "workoutTitle";
  workoutTitleInput.type = "text";
  workoutTitleInput.placeholder = "Titulo opcional";
  workoutButton.type = "submit";
  workoutButton.textContent = "Adicionar treino";
  workoutForm.appendChild(workoutNameInput);
  workoutForm.appendChild(workoutTitleInput);
  workoutForm.appendChild(workoutButton);
  workoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addProgramWorkout(template.id, workoutNameInput.value.trim(), workoutTitleInput.value.trim());
  });
  container.appendChild(workoutForm);

  Object.keys(template.workoutTemplates).forEach((workout) => {
    const workoutTemplate = template.workoutTemplates?.[workout] ||
      createWorkoutTemplateFromExercises(`Treino ${workout}`, []);
    const workoutBlock = document.createElement("section");
    const workoutTitle = document.createElement("h3");

    workoutBlock.className = "program-workout-block";
    workoutTitle.textContent = workoutTemplate.title || `Treino ${workout}`;
    workoutBlock.appendChild(workoutTitle);

    workoutTemplate.groups[0].exercises.forEach((exercise, index) => {
        const exerciseForm = document.createElement("form");
        const nameInput = document.createElement("input");
        const groupInput = document.createElement("input");
        const weightInput = document.createElement("input");
        const notesInput = document.createElement("textarea");
        const photoInput = document.createElement("input");
        const saveButton = document.createElement("button");
        const moveUpButton = document.createElement("button");
        const moveDownButton = document.createElement("button");
        const removeButton = document.createElement("button");

        exerciseForm.className = "template-exercise-form admin-template-exercise";
        nameInput.name = "name";
        nameInput.type = "text";
        nameInput.value = exercise.name;
        nameInput.placeholder = "Exercicio";
        groupInput.name = "muscleGroup";
        groupInput.type = "text";
        groupInput.value = exercise.muscleGroup || "";
        groupInput.placeholder = "Grupo muscular";
        weightInput.name = "weight";
        weightInput.type = "text";
        weightInput.value = exercise.weight || "";
        weightInput.placeholder = "Carga sugerida";
        notesInput.name = "notes";
        notesInput.rows = 2;
        notesInput.value = exercise.notes || "";
        notesInput.placeholder = "Observacao";
        photoInput.name = "photo";
        photoInput.type = "file";
        photoInput.accept = "image/*";
        saveButton.type = "submit";
        saveButton.textContent = "Salvar";
        moveUpButton.type = "button";
        moveUpButton.textContent = "\u2191";
        moveUpButton.disabled = index === 0;
        moveDownButton.type = "button";
        moveDownButton.textContent = "\u2193";
        moveDownButton.disabled = index === workoutTemplate.groups[0].exercises.length - 1;
        removeButton.type = "button";
        removeButton.textContent = "Remover";

        exerciseForm.appendChild(nameInput);
        exerciseForm.appendChild(groupInput);
        exerciseForm.appendChild(weightInput);
        exerciseForm.appendChild(notesInput);
        exerciseForm.appendChild(photoInput);
        exerciseForm.appendChild(saveButton);
        exerciseForm.appendChild(moveUpButton);
        exerciseForm.appendChild(moveDownButton);
        exerciseForm.appendChild(removeButton);

        exerciseForm.addEventListener("submit", async (event) => {
          event.preventDefault();

          const photoDataUrl = await readFileAsDataUrl(photoInput.files[0]);

          updateLibraryExercise(template.id, workout, index, {
            name: nameInput.value.trim() || "Exercicio",
            muscleGroup: groupInput.value.trim(),
            weight: weightInput.value.trim(),
            notes: notesInput.value.trim(),
            photo: photoDataUrl || exercise.photo || "",
          });
        });
        moveUpButton.addEventListener("click", () => moveLibraryExercise(template.id, workout, index, -1));
        moveDownButton.addEventListener("click", () => moveLibraryExercise(template.id, workout, index, 1));
        removeButton.addEventListener("click", () => removeLibraryExercise(template.id, workout, index));

        workoutBlock.appendChild(exerciseForm);
      });

      const addFormClone = document.createElement("form");
      const workoutAddInput = document.createElement("input");
      const workoutAddButton = document.createElement("button");

      workoutAddInput.name = "exerciseName";
      workoutAddInput.type = "text";
      workoutAddInput.placeholder = `Adicionar exercicio ao Treino ${workout}`;
      workoutAddButton.type = "submit";
      workoutAddButton.textContent = "Adicionar";
      addFormClone.className = "template-inline-form";
      addFormClone.appendChild(workoutAddInput);
      addFormClone.appendChild(workoutAddButton);
      addFormClone.addEventListener("submit", (event) => {
        event.preventDefault();
        addLibraryExercise(template.id, workout, workoutAddInput.value.trim());
      });

      workoutBlock.appendChild(addFormClone);
      container.appendChild(workoutBlock);
    });
}

function getLibraryTemplate(data, templateId) {
  const gymData = ensureGymData(data);

  return gymData.programLibrary.find((template) => template.id === templateId);
}

function renderAdminProgramState() {
  renderTemplateLibrary();
  renderAdminDetail();
}

function addProgramWorkout(templateId, workoutName, workoutTitle) {
  if (!workoutName) {
    return;
  }

  const data = loadData();
  const template = getLibraryTemplate(data, templateId);
  const workoutKey = workoutName.trim();

  if (!template) {
    return;
  }

  ensureProgramWorkoutTemplates(template);

  if (template.workoutTemplates[workoutKey]) {
    return;
  }

  template.workoutTemplates[workoutKey] =
    createWorkoutTemplateFromExercises(workoutTitle || `Treino ${workoutKey}`, []);
  saveData(data);
  renderAdminProgramState();
}

function ensureProgramWorkoutTemplates(program) {
  if (!program.workoutTemplates) {
    program.workoutTemplates = {};
  }

  if (Object.keys(program.workoutTemplates).length === 0) {
    program.workoutTemplates = {
      A: createWorkoutTemplateFromExercises("Treino A", []),
      B: createWorkoutTemplateFromExercises("Treino B", []),
    };
  }

  Object.keys(program.workoutTemplates).forEach((workout) => {
    if (!program.workoutTemplates[workout]) {
      program.workoutTemplates[workout] = createWorkoutTemplateFromExercises(`Treino ${workout}`, []);
    }

    if (!program.workoutTemplates[workout].groups?.[0]) {
      program.workoutTemplates[workout].groups = [{ title: "Exercicios", exercises: [] }];
    }

    program.workoutTemplates[workout].groups[0].exercises =
      program.workoutTemplates[workout].groups[0].exercises.map(normalizeTemplateExercise);
  });
}

function addLibraryExercise(templateId, workout, exerciseName) {
  if (!exerciseName) {
    return;
  }

  const data = loadData();
  const template = getLibraryTemplate(data, templateId);

  if (!template) {
    return;
  }

  ensureProgramWorkoutTemplates(template);
  if (!template.workoutTemplates[workout]) {
    template.workoutTemplates[workout] = createWorkoutTemplateFromExercises(`Treino ${workout}`, []);
  }

  template.workoutTemplates[workout].groups[0].exercises.push(createTemplateExercise(exerciseName));
  saveData(data);
  renderAdminProgramState();
}

function updateLibraryExercise(templateId, workout, index, updates) {
  const data = loadData();
  const template = getLibraryTemplate(data, templateId);
  const exercises = template?.workoutTemplates?.[workout]?.groups?.[0]?.exercises;

  if (!exercises?.[index]) {
    return;
  }

  exercises[index] = normalizeTemplateExercise({
    ...exercises[index],
    ...updates,
  });
  saveData(data);
  renderAdminProgramState();
}

function moveLibraryExercise(templateId, workout, index, direction) {
  const data = loadData();
  const template = getLibraryTemplate(data, templateId);
  const exercises = template?.workoutTemplates?.[workout]?.groups?.[0]?.exercises;
  const targetIndex = index + direction;

  if (!exercises || targetIndex < 0 || targetIndex >= exercises.length) {
    return;
  }

  [exercises[index], exercises[targetIndex]] = [exercises[targetIndex], exercises[index]];
  saveData(data);
  renderAdminProgramState();
}

function removeLibraryExercise(templateId, workout, index) {
  const data = loadData();
  const template = getLibraryTemplate(data, templateId);
  const exercises = template?.workoutTemplates?.[workout]?.groups?.[0]?.exercises;

  if (!exercises) {
    return;
  }

  exercises.splice(index, 1);
  saveData(data);
  renderAdminProgramState();
}

function applyTemplateToCurrentStudent(templateId) {
  const data = loadData();
  const gymData = ensureGymData(data);
  const student = getCurrentStudent(data);
  const template = gymData.programLibrary.find((item) => item.id === templateId);

  if (!student || !template) {
    return;
  }

  ensureProgramWorkoutTemplates(template);
  student.currentProgram = {
    id: createTemplateId(),
    sourceProgramId: template.id,
    name: template.name,
    note: template.note || "",
    workoutTemplates: JSON.parse(JSON.stringify(template.workoutTemplates)),
    appliedAt: new Date().toISOString(),
  };
  student.workoutTemplates = JSON.parse(JSON.stringify(template.workoutTemplates));
  saveData(data);
  renderStudentList();
  renderAdminDetail();
}

function setupAdmin() {
  if (!studentList || !newStudentToggle || !studentForm) {
    renderStudentProfile();
    return;
  }

  renderStudentList();
  renderAdminDetail();
  renderTemplateLibrary();

  newStudentToggle.addEventListener("click", () => {
    studentForm.classList.toggle("is-hidden");
  });

  newProgramToggle?.addEventListener("click", () => {
    templateLibraryForm?.classList.toggle("is-hidden");
  });

  studentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const studentName = studentForm.newStudentName.value.trim();

    if (!studentName) {
      return;
    }

    const data = loadData();
    const gymData = ensureGymData(data);
    const student = {
      id: createStudentId(),
      name: studentName,
      startDate: studentForm.newStudentStartDate.value,
      note: studentForm.newStudentNote.value.trim(),
      createdAt: new Date().toISOString(),
    };

    gymData.students.push(student);
    gymData.currentStudentId = student.id;
    gymData.currentStudentName = student.name;
    saveData(data);
    studentForm.reset();
    studentForm.classList.add("is-hidden");
    selectedAdminDetail = { type: "student", id: student.id };
    renderStudentProfile();
    renderStudentList();
    renderAdminDetail();
    renderTemplateLibrary();
  });

  if (templateLibraryForm) {
    templateLibraryForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const templateName = templateLibraryForm.templateLibraryName.value.trim();

      if (!templateName) {
        return;
      }

      const data = loadData();
      const gymData = ensureGymData(data);

      gymData.programLibrary.push({
        id: createTemplateId(),
        name: templateName,
        note: templateLibraryForm.templateLibraryNote.value.trim(),
        workoutTemplates: {
          A: createWorkoutTemplateFromExercises("Treino A", []),
          B: createWorkoutTemplateFromExercises("Treino B", []),
          C: createWorkoutTemplateFromExercises("Treino C", []),
        },
        createdAt: new Date().toISOString(),
      });
      saveData(data);
      templateLibraryForm.reset();
      templateLibraryForm.classList.add("is-hidden");
      selectedAdminDetail = {
        type: "program",
        id: gymData.programLibrary[gymData.programLibrary.length - 1].id,
      };
      renderTemplateLibrary();
      renderAdminDetail();
    });
  }

  if (applyTemplateForm) {
    applyTemplateForm.addEventListener("submit", (event) => {
      event.preventDefault();

      applyTemplateToCurrentStudent(applyTemplateForm.applyTemplateId.value);
    });
  }
}

function formatHistoryDate(dayKey) {
  const [year, month, day] = String(dayKey).split("-");

  if (!year || !month || !day) {
    return dayKey;
  }

  return `${day}/${month}`;
}

function getDayStatusLabel(status) {
  const labels = {
    active: "Treino feito",
    planned_rest: "Descanso",
    recovery: "Recuperacao",
    sick: "Doente",
  };

  return labels[status] || "Status";
}

function getDayStatusIcon(status) {
  const icons = {
    active: "\u2713",
    planned_rest: "Descanso",
    recovery: "Recuperacao",
    sick: "Doente",
  };

  return icons[status] || "\u2022";
}

function getDaysSince(dayKey) {
  const [year, month, day] = String(dayKey).split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const today = new Date();
  const date = new Date(year, month - 1, day);

  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return Math.max(0, Math.round((today - date) / 86400000));
}

function getRecentWorkoutStreak(days) {
  let streak = 0;

  for (const [, dayData] of days) {
    const hasGymWorkout = (dayData.activities || []).some((activity) => activity.type === "Academia");

    if (!hasGymWorkout) {
      break;
    }

    streak += 1;
  }

  return streak;
}

function getHistoryAdvice(totalWorkouts, lastWorkoutDay) {
  const daysSinceLastWorkout = lastWorkoutDay ? getDaysSince(lastWorkoutDay) : null;

  if (daysSinceLastWorkout !== null && daysSinceLastWorkout >= 5) {
    return `Ultimo treino ha ${daysSinceLastWorkout} dias. Vale retomar com calma.`;
  }

  if (totalWorkouts > 0 && totalWorkouts % 40 === 0) {
    return "Trocar treino apos 40 execucoes: hora de revisar a ficha.";
  }

  if (totalWorkouts > 0 && totalWorkouts % 12 === 0) {
    return "Hora de revisar cargas e observacoes da ficha.";
  }

  return "Acompanhe a continuidade do aluno pela linha do tempo.";
}

function setupTabs() {
  if (tabButtons.length === 0 || tabPanels.length === 0) {
    return;
  }

  tabButtons.forEach((button) => {
    button.setAttribute("aria-selected", button.classList.contains("is-active") ? "true" : "false");
    button.addEventListener("click", () => {
      showTab(button.dataset.tabTarget);
    });
  });
}

function renderActivities() {
  if (!timelineList) {
    return;
  }

  const data = loadData();
  const days = Object.entries(data.days).sort(([firstDate], [secondDate]) =>
    secondDate.localeCompare(firstDate),
  );
  const entries = [];
  let totalWorkouts = 0;
  let lastWorkoutLabel = "-";
  let lastWorkoutDay = "";

  timelineList.innerHTML = "";

  days.forEach(([dayKey, dayData]) => {
    const dayStatus = dayData.dayStatus || "active";
    const dayNotes = [dayData.statusNote, dayData.notes].filter(Boolean).join(" | ");
    const gymActivities = (dayData.activities || []).filter((activity) => activity.type === "Academia");

    if (gymActivities.length > 0) {
      gymActivities.forEach((activity) => {
        totalWorkouts += 1;

        if (!lastWorkoutDay) {
          lastWorkoutDay = dayKey;
          lastWorkoutLabel = activity.workoutPlan ? `Treino ${activity.workoutPlan}` : "Treino";
        }

        entries.push({
          date: formatHistoryDate(dayKey),
          icon: "\u2713",
          title: activity.workoutPlan ? `Treino ${activity.workoutPlan}` : "Treino feito",
          notes: [activity.notes, dayNotes].filter(Boolean).join(" | "),
        });
      });
      return;
    }

    if (dayStatus !== "active" || dayNotes) {
      entries.push({
        date: formatHistoryDate(dayKey),
        icon: getDayStatusIcon(dayStatus),
        title: getDayStatusLabel(dayStatus),
        notes: dayNotes,
      });
    }
  });

  historyWorkouts.textContent = totalWorkouts;
  historyLastWorkout.textContent = lastWorkoutLabel;
  historyStreak.textContent = getRecentWorkoutStreak(days);
  historyActiveWorkout.textContent = activeWorkout;
  historyAdvice.textContent = getHistoryAdvice(totalWorkouts, lastWorkoutDay);

  if (entries.length === 0) {
    timelineList.innerHTML = '<p class="activity-empty">Nenhum registro encontrado.</p>';
    return;
  }

  entries.slice(0, 10).forEach((entry) => {
    const item = document.createElement("div");
    const date = document.createElement("span");
    const icon = document.createElement("span");
    const content = document.createElement("div");
    const title = document.createElement("p");

    item.className = "timeline-item";
    date.className = "timeline-date";
    date.textContent = entry.date;
    icon.className = "timeline-icon";
    icon.textContent = entry.icon;
    content.className = "timeline-content";
    title.className = "timeline-title";
    title.textContent = entry.title;

    content.appendChild(title);

    if (entry.notes) {
      const notes = document.createElement("p");

      notes.className = "timeline-notes";
      notes.textContent = entry.notes;
      content.appendChild(notes);
    }

    item.appendChild(date);
    item.appendChild(icon);
    item.appendChild(content);
    timelineList.appendChild(item);
  });
}

function setupActivityForm() {
  if (!activityForm || !workoutToggle) {
    return;
  }

  updateActivityFields();
  renderActivities();

  activityForm.activityType.addEventListener("change", updateActivityFields);
  activityForm.workoutPlan.addEventListener("change", () => {
    activeWorkout = activityForm.workoutPlan.value || "A";
    updateWorkoutCard();
    renderGymExercises();
  });
  workoutToggle.addEventListener("click", () => {
    isWorkoutCardOpen = !isWorkoutCardOpen;
    updateWorkoutCard();
  });

  activityForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = loadData();
    const todayData = getTodayData(data);
    const isGym = activityForm.activityType.value === "Academia";

    const activity = {
      type: activityForm.activityType.value,
      duration: normalizeDurationInput(activityForm.activityDuration.value),
      intensity: activityForm.activityIntensity.value,
      notes: activityForm.activityNotes.value,
    };

    if (isGym) {
      activity.workoutPlan = activityForm.workoutPlan.value;
      activity.workoutFeeling = activityForm.workoutFeeling.value;
    } else {
      activity.distance = normalizeDecimalInput(activityForm.activityDistance.value);
    }

    todayData.dayStatus = "active";
    todayData.activities.push(activity);
    saveData(data);
    fillDailyForm(todayData);
    activityForm.reset();
    activityForm.activityType.value = "Academia";
    activityForm.workoutPlan.value = activity.workoutPlan || "A";
    activeWorkout = activityForm.workoutPlan.value || "A";
    updateActivityFields();
    renderGymExercises();
    renderActivities();
    renderWeeklySummary();
  });
}

function getSelectedWorkoutTemplate(data) {
  const templates = ensureWorkoutTemplates(data);

  return templates[activeWorkout];
}

function getExerciseCompletionKey(exercise) {
  return `${exercise.index}-${exercise.name}`;
}

function getCompletedExercises(dayData, workout) {
  if (!dayData.completedExercises) {
    dayData.completedExercises = {};
  }

  if (!Array.isArray(dayData.completedExercises[workout])) {
    dayData.completedExercises[workout] = [];
  }

  return new Set(dayData.completedExercises[workout]);
}

function saveCompletedExercises(dayData, workout, completedExercises) {
  if (!dayData.completedExercises) {
    dayData.completedExercises = {};
  }

  dayData.completedExercises[workout] = Array.from(completedExercises);
}

function toggleExerciseCompletion(workout, exercise) {
  const data = loadData();
  const todayData = getTodayData(data);
  const completedExercises = getCompletedExercises(todayData, workout);
  const completionKey = getExerciseCompletionKey(exercise);

  if (completedExercises.has(completionKey)) {
    completedExercises.delete(completionKey);
  } else {
    completedExercises.add(completionKey);
  }

  saveCompletedExercises(todayData, workout, completedExercises);
  saveData(data);
  renderGymExercises();
}

function renderWorkoutProgress(workout, exercises, completedExercises) {
  if (!workoutProgress) {
    return;
  }

  const completedCount = exercises.filter((exercise) =>
    completedExercises.has(getExerciseCompletionKey(exercise)),
  ).length;
  const totalCount = exercises.length;

  workoutProgress.textContent = `${completedCount} de ${totalCount} exercicios concluidos`;
  workoutProgress.classList.toggle("is-complete", totalCount > 0 && completedCount === totalCount);
}

function renderWorkoutSelector(templates) {
  if (!workoutTabsContainer || !activityForm) {
    return;
  }

  const workoutKeys = Object.keys(templates);

  workoutTabsContainer.innerHTML = "";
  activityForm.workoutPlan.innerHTML = "";

  workoutKeys.forEach((workout) => {
    const button = document.createElement("button");
    const option = document.createElement("option");

    button.className = "workout-tab";
    button.type = "button";
    button.dataset.workout = workout;
    button.textContent = workout;
    button.classList.toggle("is-active", workout === activeWorkout);
    button.addEventListener("click", () => {
      activeWorkout = workout;
      activityForm.workoutPlan.value = activeWorkout;
      updateWorkoutCard();
      renderGymExercises();
    });
    option.value = workout;
    option.textContent = workout;
    activityForm.workoutPlan.appendChild(option);
    workoutTabsContainer.appendChild(button);
  });

  activityForm.workoutPlan.value = activeWorkout;
}

function saveWorkoutTemplates(data, templates) {
  const owner = getWorkoutTemplateOwner(data);
  const currentStudent = getCurrentStudent(data);

  owner.workoutTemplates = templates;

  if (currentStudent?.currentProgram === owner) {
    currentStudent.workoutTemplates = templates;
  }

  saveData(data);
}

function renderGymExerciseList(container, exercises, workout) {
  if (!container) {
    return;
  }

  const data = loadData();
  const todayData = getTodayData(data);
  const completedExercises = getCompletedExercises(todayData, workout);

  container.innerHTML = "";

  if (exercises.length === 0) {
    container.innerHTML = '<p class="activity-empty">Nenhum exercicio cadastrado.</p>';
    return;
  }

  exercises.forEach((exercise) => {
    const item = document.createElement("div");
    const content = document.createElement("div");
    const title = document.createElement("p");
    const photoKey = `${workout}-${exercise.index}`;
    const completionKey = getExerciseCompletionKey(exercise);
    const isCompleted = completedExercises.has(completionKey);

    item.className = `gym-exercise-item ${isCompleted ? "is-completed" : ""}`.trim();
    item.classList.toggle("is-editing", isTemplateEditMode);
    content.className = "gym-exercise-content";
    title.className = "activity-title";

    const exerciseName = document.createElement("span");
    const exerciseMain = document.createElement("span");
    const exerciseNumber = document.createElement("span");

    exerciseNumber.className = "exercise-number";
    exerciseNumber.textContent = String(exercise.index + 1).padStart(2, "0");
    exerciseName.textContent = exercise.name;
    exerciseMain.className = "exercise-main";
    exerciseMain.appendChild(exerciseNumber);
    exerciseMain.appendChild(exerciseName);
    title.appendChild(exerciseMain);

    if (exercise.muscleGroup) {
      const badge = document.createElement("span");
      const muscleGroupClass = getMuscleGroupClass(exercise.muscleGroup);

      badge.className = `muscle-badge ${muscleGroupClass}`.trim();
      badge.textContent = exercise.muscleGroup;
      title.appendChild(badge);
    }

    if (exercise.photo && !isTemplateEditMode) {
      const photoChip = document.createElement("span");

      photoChip.className = "photo-chip";
      photoChip.textContent = "\u{1f4f7}";
      title.appendChild(photoChip);
    }

    content.appendChild(title);

    if (!isTemplateEditMode) {
      const details = [];

      if (exercise.weight) {
        details.push(`carga ${exercise.weight}`);
      }

      if (details.length > 0) {
        const meta = document.createElement("p");

        meta.className = "activity-meta";
        meta.textContent = details.join(" | ");
        content.appendChild(meta);
      }

      if (exercise.notes) {
        const notes = document.createElement("p");

        notes.className = "activity-notes";
        notes.textContent = exercise.notes;
        content.appendChild(notes);
      }

      if (exercise.photo && openExercisePhotos.has(photoKey)) {
        const image = document.createElement("img");

        image.className = "gym-exercise-photo";
        image.src = exercise.photo;
        image.alt = `Foto de ${exercise.name}`;
        content.appendChild(image);
      }
    }

    if (isTemplateEditMode) {
      const editForm = document.createElement("form");
      const nameLabel = document.createElement("label");
      const nameInput = document.createElement("input");
      const weightLabel = document.createElement("label");
      const weightInput = document.createElement("input");
      const notesLabel = document.createElement("label");
      const notesInput = document.createElement("textarea");
      const photoLabel = document.createElement("label");
      const photoInput = document.createElement("input");
      const saveButton = document.createElement("button");

      editForm.className = "template-exercise-form";
      nameLabel.textContent = "Exercicio";
      nameInput.name = "name";
      nameInput.type = "text";
      nameInput.value = exercise.name;
      weightLabel.textContent = "Carga/peso";
      weightInput.name = "weight";
      weightInput.type = "text";
      weightInput.value = exercise.weight || "";
      weightInput.placeholder = "Ex: 40kg";
      notesLabel.textContent = "Observacoes";
      notesInput.name = "notes";
      notesInput.rows = 2;
      notesInput.value = exercise.notes || "";
      photoLabel.textContent = "Foto";
      photoInput.name = "photo";
      photoInput.type = "file";
      photoInput.accept = "image/*";
      saveButton.type = "submit";
      saveButton.textContent = "Salvar";

      nameLabel.appendChild(nameInput);
      weightLabel.appendChild(weightInput);
      notesLabel.appendChild(notesInput);
      photoLabel.appendChild(photoInput);
      editForm.appendChild(nameLabel);
      editForm.appendChild(weightLabel);
      editForm.appendChild(notesLabel);
      editForm.appendChild(photoLabel);

      if (exercise.photo) {
        const removePhotoButton = document.createElement("button");

        removePhotoButton.type = "button";
        removePhotoButton.textContent = "Remover foto";
        removePhotoButton.addEventListener("click", () => {
          updateTemplateExercise(workout, exercise.index, { photo: "" });
          openExercisePhotos.delete(photoKey);
        });
        editForm.appendChild(removePhotoButton);
      }

      editForm.appendChild(saveButton);
      editForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const photoDataUrl = await readFileAsDataUrl(photoInput.files[0]);

        updateTemplateExercise(workout, exercise.index, {
          name: nameInput.value.trim() || "Exercicio",
          weight: weightInput.value.trim(),
          notes: notesInput.value.trim(),
          photo: photoDataUrl || exercise.photo || "",
        });
      });

      content.appendChild(editForm);
    }

    if (!isTemplateEditMode) {
      const completeButton = document.createElement("button");

      completeButton.className = "exercise-complete";
      completeButton.type = "button";
      completeButton.setAttribute(
        "aria-label",
        isCompleted ? `Marcar ${exercise.name} como pendente` : `Concluir ${exercise.name}`,
      );
      completeButton.textContent = isCompleted ? "\u2713" : "";
      completeButton.addEventListener("click", () => {
        toggleExerciseCompletion(workout, exercise);
      });
      item.appendChild(completeButton);
    }

    item.appendChild(content);

    if (exercise.photo && !isTemplateEditMode) {
      const photoButton = document.createElement("button");

      photoButton.className = "photo-toggle";
      photoButton.type = "button";
      photoButton.textContent = "\u{1f4f7}";
      photoButton.addEventListener("click", () => {
        if (openExercisePhotos.has(photoKey)) {
          openExercisePhotos.delete(photoKey);
        } else {
          openExercisePhotos.add(photoKey);
        }

        renderGymExercises();
      });
      item.appendChild(photoButton);
    }

    if (isTemplateEditMode) {
      const actions = document.createElement("div");
      const moveUpButton = document.createElement("button");
      const moveDownButton = document.createElement("button");
      const removeButton = document.createElement("button");

      actions.className = "exercise-actions";
      moveUpButton.type = "button";
      moveUpButton.textContent = "\u2191";
      moveUpButton.disabled = exercise.index === 0;
      moveDownButton.type = "button";
      moveDownButton.textContent = "\u2193";
      moveDownButton.disabled = exercise.index === exercises.length - 1;
      removeButton.type = "button";
      removeButton.textContent = "\u2715";

      moveUpButton.addEventListener("click", () => {
        moveTemplateExercise(workout, exercise.index, -1);
      });
      moveDownButton.addEventListener("click", () => {
        moveTemplateExercise(workout, exercise.index, 1);
      });
      removeButton.addEventListener("click", () => {
        removeTemplateExercise(workout, exercise.index);
      });

      actions.appendChild(moveUpButton);
      actions.appendChild(moveDownButton);
      actions.appendChild(removeButton);
      item.appendChild(actions);
    }

    container.appendChild(item);
  });
}

function renderGymExercises() {
  if (!gymWorkoutActive || !activityForm) {
    return;
  }

  const data = loadData();
  const templates = ensureWorkoutTemplates(data);
  const selectedExercises = templates[activeWorkout].groups[0].exercises.map((exercise, index) => ({
    ...exercise,
    index,
  }));
  const completedExercises = getCompletedExercises(getTodayData(data), activeWorkout);

  saveData(data);
  renderWorkoutSelector(templates);
  renderWorkoutProgress(activeWorkout, selectedExercises, completedExercises);
  renderGymExerciseList(gymWorkoutActive, selectedExercises, activeWorkout);
}

function updateTemplateExercise(workout, index, updates) {
  const data = loadData();
  const templates = ensureWorkoutTemplates(data);
  const exercise = templates[workout].groups[0].exercises[index];

  if (!exercise) {
    return;
  }

  templates[workout].groups[0].exercises[index] = {
    ...exercise,
    ...updates,
  };
  saveWorkoutTemplates(data, templates);
  renderGymExercises();
}

function moveTemplateExercise(workout, index, direction) {
  const data = loadData();
  const templates = ensureWorkoutTemplates(data);
  const exercises = templates[workout].groups[0].exercises;
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= exercises.length) {
    return;
  }

  [exercises[index], exercises[targetIndex]] = [exercises[targetIndex], exercises[index]];
  saveWorkoutTemplates(data, templates);
  renderGymExercises();
}

function removeTemplateExercise(workout, index) {
  const data = loadData();
  const templates = ensureWorkoutTemplates(data);

  templates[workout].groups[0].exercises.splice(index, 1);
  saveWorkoutTemplates(data, templates);
  renderGymExercises();
}

function addTemplateExercise(workout, exerciseName) {
  const data = loadData();
  const templates = ensureWorkoutTemplates(data);

  templates[workout].groups[0].exercises.push(createTemplateExercise(exerciseName));
  saveWorkoutTemplates(data, templates);
  renderGymExercises();
}

function updateWorkoutCard() {
  if (!activityForm || !gymCard || !exerciseAddForm || !templateEditToggle || !activeWorkoutHeading) {
    return;
  }

  const isGym = activityForm.activityType.value === "Academia";
  const data = loadData();
  const selectedTemplate = getSelectedWorkoutTemplate(data);
  const shouldShowCard = isGym && isWorkoutCardOpen;

  workoutToggle.textContent = isWorkoutCardOpen ? "Ocultar ficha do treino" : "Ver ficha do treino";
  gymCard.classList.toggle("is-hidden", !shouldShowCard);
  exerciseAddForm.classList.toggle("is-hidden", !shouldShowCard || !isTemplateEditMode);
  templateEditToggle.textContent = isTemplateEditMode ? "Sair do modo editar" : "Modo editar ficha";
  gymCardTitle.textContent = selectedTemplate.title || `Treino ${activeWorkout}`;
  activeWorkoutHeading.textContent = selectedTemplate.title || `Treino ${activeWorkout}`;
}

function setupGymForm() {
  if (!exerciseAddForm || !templateEditToggle || !activityForm) {
    return;
  }

  const data = loadData();

  ensureWorkoutTemplates(data);
  saveData(data);
  renderGymExercises();
  updateWorkoutCard();

  templateEditToggle.addEventListener("click", () => {
    isTemplateEditMode = !isTemplateEditMode;
    updateWorkoutCard();
    renderGymExercises();
  });

  exerciseAddForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const exerciseName = exerciseAddForm.newExerciseName.value.trim();

    if (!exerciseName) {
      return;
    }

    addTemplateExercise(activeWorkout, exerciseName);
    exerciseAddForm.reset();
  });
}

function setupBackupActions() {
  if (!exportDataButton || !importDataButton || !importFileInput) {
    return;
  }

  exportDataButton.addEventListener("click", exportData);
  importDataButton.addEventListener("click", () => {
    importFileInput.click();
  });
  importFileInput.addEventListener("change", () => {
    importDataFromFile(importFileInput.files[0]);
  });
}

function renderWeeklySummary() {
  if (!timelineList) {
    return;
  }

  renderActivities();
}

setupTabs();
setupBackupActions();
setupStudentProfile();
setupAdmin();
setupDailyForm();
setupActivityForm();
setupGymForm();
renderCurrentDate();
renderWeeklySummary();
