/**
 * Warmup ramp schedule.
 *
 * Legitimate deliverability practice: start from a low daily volume and
 * increase gradually so mailbox providers see steady, organic-looking growth
 * instead of a sudden spike (which looks like spam). This module computes the
 * target volume for each day of the warmup.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Default 28-day ramp. `start` is the day-1 volume, growth compounds daily and
 * is capped at `max`. Tune per plan tier.
 */
export const DEFAULT_RAMP = {
  days: 28,
  start: 4,
  growth: 1.18, // ~18% more each day
  max: 40,
};

/**
 * Build the full schedule: an array of { day, target } for each warmup day.
 * @param {object} [ramp]
 * @returns {{day:number, target:number}[]}
 */
export function buildSchedule(ramp = DEFAULT_RAMP) {
  const { days, start, growth, max } = { ...DEFAULT_RAMP, ...ramp };
  const schedule = [];
  let volume = start;
  for (let day = 1; day <= days; day++) {
    schedule.push({ day, target: Math.min(Math.round(volume), max) });
    volume *= growth;
  }
  return schedule;
}

/**
 * Which day of warmup are we on (1-based), given when it started?
 * Returns 0 if warmup hasn't started.
 */
export function currentDay(startedAt, now = Date.now()) {
  if (!startedAt) return 0;
  const elapsedDays = Math.floor((now - startedAt) / DAY_MS);
  return elapsedDays + 1; // day 1 on the start date
}

/**
 * Today's target volume, clamped to the schedule. Once warmup completes,
 * holds at the final (max) target as a steady maintenance volume.
 */
export function targetForDay(day, ramp = DEFAULT_RAMP) {
  const schedule = buildSchedule(ramp);
  if (day <= 0) return 0;
  if (day > schedule.length) return schedule[schedule.length - 1].target;
  return schedule[day - 1].target;
}

/**
 * Convenience summary for the API/UI.
 * @param {object} warmup
 * @param {{ now?: number, cap?: number }} [opts] - `cap` is the plan's daily
 *   email limit (Infinity for paid tiers).
 */
export function warmupProgress(warmup, opts = {}) {
  const now = opts.now ?? Date.now();
  const cap = opts.cap ?? Infinity;
  const ramp = warmup?.ramp || DEFAULT_RAMP;
  const day = currentDay(warmup?.startedAt, now);
  const totalDays = (ramp.days ?? DEFAULT_RAMP.days);
  const rampTarget = targetForDay(day, ramp);
  // The plan cap can only lower the day's target, never raise it.
  const target = Math.min(rampTarget, cap);
  const sentToday = warmup?.dailySent?.[dateKey(now)] ?? 0;
  return {
    started: Boolean(warmup?.startedAt),
    startedAt: warmup?.startedAt ?? null,
    day: Math.min(day, totalDays),
    totalDays,
    completed: day > totalDays,
    targetToday: target,
    rampTarget,
    dailyCap: cap === Infinity ? null : cap,
    capReached: sentToday >= cap,
    sentToday,
    remainingToday: Math.max(target - sentToday, 0),
    totalSent: warmup?.totalSent ?? 0,
  };
}

/** UTC date key (YYYY-MM-DD) used to bucket per-day send counts. */
export function dateKey(ts = Date.now()) {
  return new Date(ts).toISOString().slice(0, 10);
}
