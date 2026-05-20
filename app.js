const STORAGE_KEY = "ltracker.data";
const dailyForm = document.querySelector("#daily-form");
const activityForm = document.querySelector("#activity-form");
const activityList = document.querySelector("#activity-list");
const distanceField = document.querySelector(".distance-field");
const gymFields = document.querySelectorAll(".gym-field");
const weeklyRuns = document.querySelector("#weekly-runs");
const weeklyGym = document.querySelector("#weekly-gym");
const weeklyRunKm = document.querySelector("#weekly-run-km");
const weeklyBikeKm = document.querySelector("#weekly-bike-km");
const weeklySleep = document.querySelector("#weekly-sleep");
const weeklyWeight = document.querySelector("#weekly-weight");

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

function getNumber(value) {
  const number = Number(String(value).replace(",", "."));

  return Number.isFinite(number) ? number : 0;
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
      weight: dailyForm.weight.value,
      sleepHours: dailyForm.sleepHours.value,
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

    if (activity.duration) {
      details.push(`${activity.duration} min`);
    }

    if (activity.intensity) {
      details.push(`intensidade ${activity.intensity}/5`);
    }

    if (activity.distance) {
      details.push(`${activity.distance} km`);
    }

    if (activity.workoutPlan) {
      details.push(`treino ${activity.workoutPlan}`);
    }

    if (activity.workoutFeeling) {
      details.push(activity.workoutFeeling);
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
      duration: activityForm.activityDuration.value,
      intensity: activityForm.activityIntensity.value,
      notes: activityForm.activityNotes.value,
    };

    if (isGym) {
      activity.workoutPlan = activityForm.workoutPlan.value;
      activity.workoutFeeling = activityForm.workoutFeeling.value;
    } else {
      activity.distance = activityForm.activityDistance.value;
    }

    todayData.activities.push(activity);
    saveData(data);
    activityForm.reset();
    updateActivityFields();
    renderActivities();
    renderWeeklySummary();
  });
}

function renderWeeklySummary() {
  const data = loadData();
  const weekKeys = getCurrentWeekKeys();
  const sleepValues = [];
  const weightValues = [];
  let runCount = 0;
  let gymCount = 0;
  let runKm = 0;
  let bikeKm = 0;

  weekKeys.forEach((dayKey) => {
    const dayData = data.days[dayKey];

    if (!dayData) {
      return;
    }

    const sleepHours = getNumber(dayData.sleepHours);
    const weight = getNumber(dayData.weight);

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

      if (type === "academia") {
        gymCount += 1;
      }
    });
  });

  const sleepAverage = getAverage(sleepValues);
  const weightAverage = getAverage(weightValues);

  weeklyRuns.textContent = runCount;
  weeklyGym.textContent = gymCount;
  weeklyRunKm.textContent = runKm ? `${runKm.toFixed(1)} km` : "0";
  weeklyBikeKm.textContent = bikeKm ? `${bikeKm.toFixed(1)} km` : "0";
  weeklySleep.textContent = sleepAverage ? `${sleepAverage.toFixed(1)} h` : "\u2014";
  weeklyWeight.textContent = weightAverage ? `${weightAverage.toFixed(1)} kg` : "\u2014";
}

setupDailyForm();
setupActivityForm();
renderWeeklySummary();
