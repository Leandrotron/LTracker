class WorkoutHistoryManager {
  constructor() {
    this.entries = [];
  }

  addEntry(entry) {
    if (!entry || !entry.date || !entry.status) {
      return;
    }

    const status = String(entry.status);
    const workoutCode = entry.workoutCode ? String(entry.workoutCode).toUpperCase() : null;

    this.entries.push({
      date: String(entry.date),
      status,
      workoutCode: status === "workout" ? workoutCode : null,
      countsTowardPlan: Boolean(entry.countsTowardPlan),
      notes: entry.notes ? String(entry.notes) : "",
    });
  }

  getEntries() {
    return this.entries.map((entry) => ({ ...entry }));
  }

  getEntriesByStatus(status) {
    return this.entries
      .filter((entry) => entry.status === status)
      .map((entry) => ({ ...entry }));
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = WorkoutHistoryManager;
}

if (typeof window !== "undefined") {
  window.WorkoutHistoryManager = WorkoutHistoryManager;
}
