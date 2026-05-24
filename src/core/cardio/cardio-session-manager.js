class CardioSessionManager {
  constructor() {
    this.sessions = [];
  }

  addSession(session) {
    if (!session || !session.type) {
      return;
    }

    const type = String(session.type);
    const allowedTypes = ["running", "walking", "bike"];

    if (!allowedTypes.includes(type)) {
      return;
    }

    this.sessions.push({
      type,
      durationMinutes: Number(session.durationMinutes) || 0,
      distanceKm: Number(session.distanceKm) || 0,
      notes: session.notes ? String(session.notes) : "",
    });
  }

  getSessions() {
    return this.sessions.map((session) => ({ ...session }));
  }

  getTotalDistance() {
    return this.sessions.reduce((total, session) => total + session.distanceKm, 0);
  }

  getTotalDuration() {
    return this.sessions.reduce((total, session) => total + session.durationMinutes, 0);
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = CardioSessionManager;
}

if (typeof window !== "undefined") {
  window.CardioSessionManager = CardioSessionManager;
}
