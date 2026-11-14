// Clock-driven state, independent of rendering and browser timer throttling.
export const IDLE_MS = 45000;
export const OVERLOOKED_MS = 90000;
export function createMood(now = 0) {
  let activityAt = now, attentionAt = now, away = false, crystalUntil = 0, clock = now, reason = '';
  return {
    get mode() { return reason ? 'angry' : clock < crystalUntil ? 'crystal' : 'normal'; },
    get reason() { return reason; },
    activity(time, pet = false) {
      clock = time; activityAt = time;
      if (pet || reason) attentionAt = time;
      if (!away) reason = '';
    },
    leave() { away = true; reason = 'away'; },
    return(time) { clock = time; away = false; activityAt = attentionAt = time; reason = ''; },
    spark(time, duration = 3400) { clock = time; crystalUntil = time + duration; },
    tick(time) {
      clock = time;
      if (away) reason = 'away';
      else if (time - activityAt >= IDLE_MS) reason = 'idle';
      else if (time - attentionAt >= OVERLOOKED_MS) reason = 'overlooked';
      return this.mode;
    }
  };
}
