"use strict";
/* Dates (Sri Lanka time) and the plan engine: which session happens when. */
const pad = (n) => String(n).padStart(2, "0");
function parseD(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function fmtD(dt) {
  return dt.getUTCFullYear() + "-" + pad(dt.getUTCMonth() + 1) + "-" + pad(dt.getUTCDate());
}
function addDays(s, n) {
  const d = parseD(s);
  d.setUTCDate(d.getUTCDate() + n);
  return fmtD(d);
}
function diffDays(a, b) {
  return Math.round((parseD(b) - parseD(a)) / 86400000);
}
function dow(s) {
  return parseD(s).getUTCDay();
}
function todayColombo() {
  return fmtD(new Date(Date.now() + 330 * 60000));
}
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function nice(s, withDow = true) {
  const d = parseD(s);
  return (withDow ? DOW[d.getUTCDay()] + " " : "") + d.getUTCDate() + " " + MON[d.getUTCMonth()];
}
function weekRange(w) {
  const a = addDays(state.settings.start, (w - 1) * 7);
  return [a, addDays(a, 6)];
}
function toMin(t) {
  const [h, m] = String(t || "0:0")
    .split(":")
    .map(Number);
  return (h || 0) * 60 + (m || 0);
}
function hhmm(m) {
  m = ((m % 1440) + 1440) % 1440;
  return pad(Math.floor(m / 60)) + ":" + pad(m % 60);
}
const TOTAL_DAYS = 84;

/* ============================== PLAN ENGINE ============================== */
function weekOf(dateStr) {
  const i = diffDays(state.settings.start, dateStr);
  if (i < 0 || i >= TOTAL_DAYS) return null;
  return Math.floor(i / 7) + 1;
}
function dayPlan(dateStr) {
  const wn = weekOf(dateStr);
  if (!wn) return null;
  const W = WEEKS[wn - 1];
  const tpl = TEMPLATE[W.light ? "light" : "normal"];
  const [ws] = weekRange(wn);
  let tI = 0,
    bI = 0;
  // count theory/build blocks on earlier days of this week so topics rotate
  for (let d = ws; d !== dateStr; d = addDays(d, 1)) {
    for (const [k] of tpl[dow(d)] || []) {
      if (k === "theory") tI++;
      if (k === "build" || k === "wbuild") bI++;
    }
  }
  const slotNext = {
    morning: toMin(state.settings.morning),
    evening: toMin(state.settings.evening),
    weekend: toMin(state.settings.weekend),
    sunday: toMin(state.settings.sunday),
  };
  const blocks = [];
  for (const [k, dur] of tpl[dow(dateStr)] || []) {
    const B = BLOCKS[k];
    const start = slotNext[B.slot];
    slotNext[B.slot] += dur;
    let what = "",
      item = null,
      sub = "";
    if (k === "dsa") {
      what = W.dsa;
      sub = "Practice problems, then read one solution you did not write.";
    } else if (k === "theory") {
      if (tI < W.t.length) {
        item = W.t[tI];
        what = item[1];
      } else {
        item = W.t.find((x) => !state.done[x[0]]) || null;
        what = item
          ? "Catch up: " + item[1]
          : "Revisit your weakest topic this week and re-explain it in writing";
      }
      tI++;
      sub = "Read or watch, then write 5 lines of notes in your own words.";
    } else if (k === "build" || k === "wbuild") {
      if (bI < W.p.length) {
        item = W.p[bI];
        what = item[1];
      } else {
        item = W.p.find((x) => !state.done[x[0]]) || null;
        what = item ? "Finish: " + item[1] : "Polish: tests, README, and push clean commits";
      }
      bI++;
      sub = "Ship something small. Commit and push before you stop.";
    } else if (k === "write" || k === "wwrite") {
      what = W.write;
      sub = "Writing and explaining out loud: the architect skill.";
    } else if (k === "review") {
      what = "Review week " + wn + ": tick items, log hours, read next week's plan";
      sub = wn < 12 ? "Next week: " + WEEKS[wn].title : "Final review of the sprint";
    }
    blocks.push({ key: k, ty: B.ty, label: B.l, start, dur, what, sub, item, id: "d:" + dateStr + ":" + k });
  }
  blocks.sort((a, b) => a.start - b.start);
  return { wn, W, blocks };
}
function plannedFor(dateStr) {
  const p = dayPlan(dateStr);
  if (!p) return { t: 0, p: 0 };
  let t = 0,
    pr = 0;
  for (const b of p.blocks) {
    if (b.ty === "T") t += b.dur;
    else pr += b.dur;
  }
  return { t: t / 60, p: pr / 60 };
}
function weekPlanned(w) {
  const [a] = weekRange(w);
  let t = 0,
    p = 0;
  for (let i = 0; i < 7; i++) {
    const x = plannedFor(addDays(a, i));
    t += x.t;
    p += x.p;
  }
  return { t, p };
}
function weekActual(w) {
  const [a] = weekRange(w);
  let t = 0,
    p = 0;
  for (let i = 0; i < 7; i++) {
    const l = state.log[addDays(a, i)];
    if (l) {
      t += +l.t || 0;
      p += +l.p || 0;
    }
  }
  return { t, p };
}
function allItems() {
  const out = [];
  for (const W of WEEKS) {
    for (const x of W.t) out.push({ id: x[0], tx: x[1], tr: x[2], ty: "T", w: W.n });
    for (const x of W.p) out.push({ id: x[0], tx: x[1], tr: x[2], ty: "P", w: W.n });
  }
  return out;
}
const ITEMS = allItems();
function weekDone(W) {
  const ids = [...W.t, ...W.p].map((x) => x[0]);
  const d = ids.filter((i) => state.done[i]).length;
  return [d, ids.length];
}
const fmtH = (h) => (Math.round(h * 10) / 10).toString().replace(/\.0$/, "");