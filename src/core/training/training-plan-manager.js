class TrainingPlanManager {
  constructor() {
    this.currentPlan = "";
    this.completedWorkouts = [];
    this.targetCompletedWorkouts = 0;
  }

  setCurrentPlan(plan) {
    if (!plan || !plan.code) {
      return;
    }

    this.currentPlan = String(plan.code).toUpperCase();
    this.targetCompletedWorkouts = Number(plan.targetCompletedWorkouts) || 0;
    this.completedWorkouts = [];
  }

  registerCompletedWorkout(workoutCode) {
    if (!workoutCode) {
      return;
    }

    this.completedWorkouts.push(String(workoutCode).toUpperCase());
  }

  getCompletedWorkouts() {
    return this.completedWorkouts.length;
  }

  getProgress() {
    const completed = this.completedWorkouts.length;
    const target = this.targetCompletedWorkouts;
    const ratio = target ? Math.min(completed / target, 1) : 0;

    return {
      completed,
      target,
      ratio,
      percent: Math.round(ratio * 100),
      remaining: Math.max(target - completed, 0),
    };
  }

  getNextSuggestedWorkout() {
    if (!this.currentPlan) {
      return "";
    }

    const nextIndex = this.completedWorkouts.length % this.currentPlan.length;

    return this.currentPlan[nextIndex];
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = TrainingPlanManager;
}

if (typeof window !== "undefined") {
  window.TrainingPlanManager = TrainingPlanManager;
}
