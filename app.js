const STORAGE_KEY = "ltracker.data";
const dailyForm = document.querySelector("#daily-form");
const activityForm = document.querySelector("#activity-form");
const gymForm = document.querySelector("#gym-form");
const activityList = document.querySelector("#activity-list");
const gymWorkoutA = document.querySelector("#gym-workout-a");
const gymWorkoutB = document.querySelector("#gym-workout-b");
const currentDate = document.querySelector("#current-date");
const distanceField = document.querySelector(".distance-field");
const gymFields = document.querySelectorAll(".gym-field");
const weeklyRuns = document.querySelector("#weekly-runs");
const weeklyGym = document.querySelector("#weekly-gym");
const weeklyActiveDays = document.querySelector("#weekly-active-days");
const weeklyRestDays = document.querySelector("#weekly-rest-days");
const weeklyRunKm = document.querySelector("#weekly-run-km");
const weeklyBikeKm = document.querySelector("#weekly-bike-km");
const weeklyWalkKm = document.querySelector("#weekly-walk-km");
const weeklySleep = document.querySelector("#weekly-sleep");
const weeklyWeight = document.querySelector("#weekly-weight");
const INITIAL_GYM_EXERCISES = [
  { id: "gym-a-001", workout: "A", order: 1, name: "Supino inclinado", load: "", sets: "4", reps: "8-10", note: "", photoDataUrl: "" },
  { id: "gym-a-002", workout: "A", order: 2, name: "Crucifixo maquina", load: "", sets: "4", reps: "8-10", note: "", photoDataUrl: "" },
  { id: "gym-a-003", workout: "A", order: 3, name: "Pulley", load: "", sets: "4", reps: "8-10", note: "", photoDataUrl: "" },
  { id: "gym-a-004", workout: "A", order: 4, name: "Remada alta", load: "", sets: "4", reps: "8-10", note: "", photoDataUrl: "" },
  { id: "gym-a-005", workout: "A", order: 5, name: "Elevacao lateral", load: "", sets: "4", reps: "10", note: "", photoDataUrl: "" },
  { id: "gym-a-006", workout: "A", order: 6, name: "Elevacao frontal", load: "", sets: "4", reps: "10", note: "", photoDataUrl: "" },
  { id: "gym-a-007", workout: "A", order: 7, name: "Rosca direta", load: "", sets: "4", reps: "12", note: "", photoDataUrl: "" },
  { id: "gym-a-008", workout: "A", order: 8, name: "Triceps corda", load: "", sets: "4", reps: "12", note: "", photoDataUrl: "" },
  { id: "gym-b-001", workout: "B", order: 1, name: "Extensora unilateral", load: "", sets: "4", reps: "10", note: "", photoDataUrl: "" },
  { id: "gym-b-002", workout: "B", order: 2, name: "Leg 45", load: "", sets: "4", reps: "10", note: "", photoDataUrl: "" },
  { id: "gym-b-003", workout: "B", order: 3, name: "Flexora vertical", load: "", sets: "4", reps: "10", note: "", photoDataUrl: "" },
  { id: "gym-b-004", workout: "B", order: 4, name: "Hack squat", load: "", sets: "4", reps: "10", note: "", photoDataUrl: "" },
  { id: "gym-b-005", workout: "B", order: 5, name: "Panturrilha", load: "", sets: "4", reps: "10", note: "", photoDataUrl: "" },
  { id: "gym-b-006", workout: "B", order: 6, name: "Abdutora", load: "", sets: "4", reps: "10", note: "", photoDataUrl: "" },
  { id: "gym-b-007", workout: "B", order: 7, name: "Mesa flexora", load: "", sets: "4", reps: "10", note: "", photoDataUrl: "" },
];

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
  if (!data.gym) {
    data.gym = { exercises: [] };
  }

  if (!Array.isArray(data.gym.exercises)) {
    data.gym.exercises = [];
  }

  return data.gym;
}

function seedInitialGymExercises(data) {
  const gymData = ensureGymData(data);

  if (gymData.exercises.length > 0) {
    return false;
  }

  gymData.exercises = INITIAL_GYM_EXERCISES.map((exercise) => ({ ...exercise }));

  return true;
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
  const data = loadData();
  const todayKey = getTodayKey();
  const todayData = getTodayData(data);

  fillDailyForm(todayData);

  dailyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const currentData = loadData();
    const currentDay = getTodayData(currentData);

    currentData.days[todayKey] = {
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
    renderWeeklySummary();
  });
}

function updateActivityFields() {
  const isGym = activityForm.activityType.value === "Academia";

  distanceField.classList.toggle("is-hidden", isGym);
  gymFields.forEach((field) => {
    field.classList.toggle("is-hidden", !isGym);
  });
}

function renderActivities() {
  const data = loadData();
  const todayData = getTodayData(data);

  activityList.innerHTML = "";

  if (todayData.activities.length === 0) {
    activityList.innerHTML = '<p class="activity-empty">Nenhuma atividade registrada hoje.</p>';
    return;
  }

  todayData.activities.forEach((activity) => {
    const item = document.createElement("div");
    const title = document.createElement("p");
    const type = document.createElement("span");
    const meta = document.createElement("p");
    const details = [];

    const duration = getDurationMinutes(activity.duration);
    const distance = getNumber(activity.distance);

    if (duration > 0) {
      details.push(formatDuration(duration));
    }

    if (activity.intensity) {
      details.push(`intensidade ${activity.intensity}/5`);
    }

    if (distance > 0) {
      details.push(`${formatDecimal(distance)} km`);
    }

    if (activity.workoutPlan) {
      details.push(`treino ${activity.workoutPlan}`);
    }

    if (activity.workoutFeeling) {
      details.push(`sensacao ${activity.workoutFeeling}/5`);
    }

    item.className = "activity-item";
    title.className = "activity-title";
    type.textContent = activity.type;
    meta.className = "activity-meta";
    meta.textContent = details.join(" | ") || "Sem detalhes";

    title.appendChild(type);
    item.appendChild(title);
    item.appendChild(meta);

    if (activity.notes) {
      const notes = document.createElement("p");

      notes.className = "activity-notes";
      notes.textContent = activity.notes;
      item.appendChild(notes);
    }

    activityList.appendChild(item);
  });
}

function setupActivityForm() {
  updateActivityFields();
  renderActivities();

  activityForm.activityType.addEventListener("change", updateActivityFields);

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

    todayData.activities.push(activity);
    saveData(data);
    activityForm.reset();
    updateActivityFields();
    renderActivities();
    renderWeeklySummary();
  });
}

function renderGymExerciseList(container, exercises) {
  container.innerHTML = "";

  if (exercises.length === 0) {
    container.innerHTML = '<p class="activity-empty">Nenhum exercicio cadastrado.</p>';
    return;
  }

  exercises.forEach((exercise) => {
    const item = document.createElement("div");
    const content = document.createElement("div");
    const title = document.createElement("p");
    const meta = document.createElement("p");
    const details = [];

    item.className = "gym-exercise-item";
    content.className = "gym-exercise-content";
    title.className = "activity-title";
    title.textContent = `${exercise.order || "-"} - ${exercise.name || "Exercicio"}`;
    meta.className = "activity-meta";

    details.push(`${exercise.sets || "-"}x${exercise.reps || "-"}`);

    if (exercise.load) {
      details.push(`carga ${exercise.load}`);
    }

    meta.textContent = details.join(" | ");

    content.appendChild(title);
    content.appendChild(meta);

    if (exercise.note) {
      const note = document.createElement("p");

      note.className = "activity-notes";
      note.textContent = exercise.note;
      content.appendChild(note);
    }

    const editForm = document.createElement("form");
    const loadLabel = document.createElement("label");
    const loadInput = document.createElement("input");
    const noteLabel = document.createElement("label");
    const noteInput = document.createElement("input");
    const photoLabel = document.createElement("label");
    const photoInput = document.createElement("input");
    const submitButton = document.createElement("button");

    editForm.className = "gym-edit-form";
    loadLabel.textContent = "Carga";
    loadInput.name = "load";
    loadInput.type = "text";
    loadInput.value = exercise.load || "";
    loadInput.placeholder = "Ex: 40kg";
    noteLabel.textContent = "Observacao";
    noteInput.name = "note";
    noteInput.type = "text";
    noteInput.value = exercise.note || "";
    noteInput.placeholder = "Ajuste rapido";
    photoLabel.textContent = "Foto opcional";
    photoInput.name = "photo";
    photoInput.type = "file";
    photoInput.accept = "image/*";
    submitButton.type = "submit";
    submitButton.textContent = "Salvar ajuste";

    loadLabel.appendChild(loadInput);
    noteLabel.appendChild(noteInput);
    photoLabel.appendChild(photoInput);
    editForm.appendChild(loadLabel);
    editForm.appendChild(noteLabel);
    editForm.appendChild(photoLabel);
    editForm.appendChild(submitButton);
    editForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = loadData();
      const gymData = ensureGymData(data);
      const savedExercise = gymData.exercises.find((itemData) => itemData.id === exercise.id);

      if (!savedExercise) {
        return;
      }

      const photoDataUrl = await readFileAsDataUrl(photoInput.files[0]);

      savedExercise.load = loadInput.value.trim();
      savedExercise.note = noteInput.value.trim();

      if (photoDataUrl) {
        savedExercise.photoDataUrl = photoDataUrl;
      }

      saveData(data);
      renderGymExercises();
    });

    content.appendChild(editForm);

    if (exercise.photoDataUrl) {
      const image = document.createElement("img");

      image.className = "gym-exercise-photo";
      image.src = exercise.photoDataUrl;
      image.alt = `Foto de ${exercise.name || "exercicio"}`;
      item.appendChild(image);
    }

    item.appendChild(content);
    container.appendChild(item);
  });
}

function renderGymExercises() {
  const data = loadData();
  const gymData = ensureGymData(data);
  const sortedExercises = [...gymData.exercises].sort((first, second) => {
    const firstOrder = Number(first.order) || 0;
    const secondOrder = Number(second.order) || 0;

    return firstOrder - secondOrder;
  });

  renderGymExerciseList(
    gymWorkoutA,
    sortedExercises.filter((exercise) => exercise.workout === "A"),
  );
  renderGymExerciseList(
    gymWorkoutB,
    sortedExercises.filter((exercise) => exercise.workout === "B"),
  );
}

function setupGymForm() {
  const data = loadData();

  if (seedInitialGymExercises(data)) {
    saveData(data);
  }

  renderGymExercises();

  gymForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = loadData();
    const gymData = ensureGymData(data);
    const photoFile = gymForm.gymPhoto.files[0];
    const photoDataUrl = await readFileAsDataUrl(photoFile);

    const exercise = {
      id: String(Date.now()),
      workout: gymForm.gymWorkout.value,
      order: gymForm.gymOrder.value,
      name: gymForm.gymExerciseName.value.trim(),
      load: gymForm.gymLoad.value.trim(),
      sets: gymForm.gymSets.value.trim(),
      reps: gymForm.gymReps.value.trim(),
      note: gymForm.gymNote.value.trim(),
      photoDataUrl,
    };

    gymData.exercises.push(exercise);
    saveData(data);
    gymForm.reset();
    renderGymExercises();
  });
}

function renderWeeklySummary() {
  const data = loadData();
  const weekKeys = getCurrentWeekKeys();
  const sleepValues = [];
  const weightValues = [];
  let runCount = 0;
  let gymCount = 0;
  let activeDays = 0;
  let restDays = 0;
  let runKm = 0;
  let bikeKm = 0;
  let walkKm = 0;

  weekKeys.forEach((dayKey) => {
    const dayData = data.days[dayKey];

    if (!dayData) {
      return;
    }

    const sleepHours = getSleepHours(dayData.sleepHours);
    const weight = getNumber(dayData.weight);
    const dayStatus = dayData.dayStatus || "active";

    if (dayStatus === "active") {
      activeDays += 1;
    } else {
      restDays += 1;
    }

    if (sleepHours > 0) {
      sleepValues.push(sleepHours);
    }

    if (weight > 0) {
      weightValues.push(weight);
    }

    (dayData.activities || []).forEach((activity) => {
      const type = String(activity.type || "").toLowerCase();

      if (type === "corrida") {
        runCount += 1;
        runKm += getNumber(activity.distance);
      }

      if (type === "bike") {
        bikeKm += getNumber(activity.distance);
      }

      if (type === "caminhada") {
        walkKm += getNumber(activity.distance);
      }

      if (type === "academia") {
        gymCount += 1;
      }
    });
  });

  const sleepAverage = getAverage(sleepValues);
  const weightAverage = getAverage(weightValues);

  weeklyRuns.textContent = runCount;
  weeklyGym.textContent = gymCount;
  weeklyActiveDays.textContent = activeDays;
  weeklyRestDays.textContent = restDays;
  weeklyRunKm.textContent = runKm ? `${formatDecimal(runKm)} km` : "0";
  weeklyBikeKm.textContent = bikeKm ? `${formatDecimal(bikeKm)} km` : "0";
  weeklyWalkKm.textContent = walkKm ? `${formatDecimal(walkKm)} km` : "0";
  weeklySleep.textContent = sleepAverage ? formatSleepHours(sleepAverage) : "\u2014";
  weeklyWeight.textContent = weightAverage ? `${weightAverage.toFixed(2)} kg` : "\u2014";
}

setupDailyForm();
setupActivityForm();
setupGymForm();
renderCurrentDate();
renderWeeklySummary();
