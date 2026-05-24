const TrainingPlanManager = require("../training/training-plan-manager");
const WorkoutHistoryManager = require("../history/workout-history-manager");
const CardioSessionManager = require("../cardio/cardio-session-manager");

console.log("=== LTracker manual training test ===");

const trainingPlan = new TrainingPlanManager();

trainingPlan.setCurrentPlan({
  code: "AB",
  targetCompletedWorkouts: 40,
});

trainingPlan.registerCompletedWorkout("A");
trainingPlan.registerCompletedWorkout("B");
trainingPlan.registerCompletedWorkout("A");

console.log("\nTraining plan");
console.log("completedWorkouts:", trainingPlan.getCompletedWorkouts());
console.log("progress:", trainingPlan.getProgress());
console.log("nextSuggestedWorkout:", trainingPlan.getNextSuggestedWorkout());

const history = new WorkoutHistoryManager();

history.addEntry({
  date: "2026-05-22",
  status: "workout",
  workoutCode: "A",
  countsTowardPlan: true,
  notes: "Treino bom",
});

history.addEntry({
  date: "2026-05-23",
  status: "rest",
  workoutCode: null,
  countsTowardPlan: false,
  notes: "Descanso planejado",
});

history.addEntry({
  date: "2026-05-24",
  status: "sick",
  workoutCode: null,
  countsTowardPlan: false,
  notes: "Dia doente",
});

console.log("\nWorkout history");
console.log("all entries:", history.getEntries());
console.log('workout entries:', history.getEntriesByStatus("workout"));

const cardio = new CardioSessionManager();

cardio.addSession({
  type: "running",
  durationMinutes: 32,
  distanceKm: 5.1,
  notes: "Corrida leve",
});

cardio.addSession({
  type: "bike",
  durationMinutes: 45,
  distanceKm: 14.2,
  notes: "Bike moderada",
});

cardio.addSession({
  type: "walking",
  durationMinutes: 28,
  distanceKm: 2.3,
  notes: "Caminhada leve",
});

console.log("\nCardio sessions");
console.log("sessions:", cardio.getSessions());
console.log("total distance:", Number(cardio.getTotalDistance().toFixed(2)));
console.log("total duration:", cardio.getTotalDuration());
