"use strict";
/* Shared render helpers, header and tabs. */
const esc = (s) =>
  String(s == null ? "" : s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const chip = (k) => `<span class="chip"><i style="background:${TRACKS[k].c}"></i>${esc(TRACKS[k].n)}</span>`;
function toast(m) {
  const t = document.getElementById("toast");
  t.textContent = m;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2600);
}
function checkItem(id, text, trk, extra = "") {
  const on = !!state.done[id];
  return `<div class="item${on ? " done" : ""}"><input type="checkbox" class="ck" id="ck-${id}" data-done="${id}" ${on ? "checked" : ""} aria-label="${esc(text)}"><label class="txt" for="ck-${id}"><span>${esc(text)}</span>${trk ? `<div style="margin-top:3px">${chip(trk)}${extra}</div>` : ""}</label></div>`;
}

const VIEWS = [
  ["today", "Today"],
  ["timeline", "Timeline"],
  ["map", "Skill map"],
  ["timing", "Daily timing"],
  ["progress", "Progress"],
  ["calendar", "Calendar"],
];

function renderHeader() {
  const today = todayColombo();
  const di = Math.min(Math.max(diffDays(state.settings.start, today) + 1, 0), TOTAL_DAYS);
  const done = ITEMS.filter((i) => state.done[i.id]).length;
  let planned = 0,
    logged = 0,
    plannedAll = 0;
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const d = addDays(state.settings.start, i);
    const p = plannedFor(d);
    plannedAll += p.t + p.p;
    if (d <= today) planned += p.t + p.p;
    const l = state.log[d];
    if (l) logged += (+l.t || 0) + (+l.p || 0);
  }
  const left = Math.max(TOTAL_DAYS - di, 0);
  document.getElementById("kpis").innerHTML = `
   <div class="kpi"><div class="mono">DAY</div><div class="v">${di}<small> / ${TOTAL_DAYS}</small></div></div>
   <div class="kpi"><div class="mono">TASKS DONE</div><div class="v">${done}<small> / ${ITEMS.length}</small></div></div>
   <div class="kpi"><div class="mono">HOURS LOGGED</div><div class="v">${fmtH(logged)}<small> / ${fmtH(planned)} due</small></div></div>
   <div class="kpi"><div class="mono">DAYS LEFT</div><div class="v">${left}<small> · ${fmtH(plannedAll)} h plan</small></div></div>`;
  const pct = (di / TOTAL_DAYS) * 100;
  const [, end] = weekRange(12);
  document.getElementById("run").innerHTML = `
   <div class="runbar" role="img" aria-label="Day ${di} of ${TOTAL_DAYS}"><div class="fill" style="width:${pct}%"></div><div class="tick" style="left:33.33%"></div><div class="tick" style="left:66.66%"></div></div>
   <div class="runlbl"><span class="mono">${nice(state.settings.start, false).toUpperCase()} · FOUNDATIONS</span><span class="mono">SECURITY & EVALS</span><span class="mono">ARCHITECT & APPLY · ${nice(end, false).toUpperCase()}</span>
   <span class="sync ${sync}" id="sync"><i></i><span>${SYNC_TXT[sync]}</span></span></div>`;
  document.getElementById("tabs").innerHTML = VIEWS.map(
    ([k, l]) =>
      `<button class="tab" data-view="${k}" ${ui.view === k ? 'aria-current="page"' : ""}>${l}</button>`,
  ).join("");
}