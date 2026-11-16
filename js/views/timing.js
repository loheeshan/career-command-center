"use strict";
/* ---------- DAILY TIMING ---------- */
function tplTotals(kind) {
  const by = { dsa: 0, theory: 0, build: 0, write: 0, review: 0 };
  let t = 0,
    p = 0;
  for (const d of DOW_ORDER) {
    for (const [k, m] of TEMPLATE[kind][d]) {
      const key = k === "wbuild" ? "build" : k === "wwrite" ? "write" : k;
      by[key] += m;
      if (BLOCKS[k].ty === "T") t += m;
      else p += m;
    }
  }
  return { by, t: t / 60, p: p / 60 };
}
function vTiming() {
  const kind = ui.tplKind;
  const st = state.settings;
  const slot = {
    morning: toMin(st.morning),
    evening: toMin(st.evening),
    weekend: toMin(st.weekend),
    sunday: toMin(st.sunday),
  };
  const days = DOW_ORDER.map((d) => {
    const nx = { ...slot };
    let tot = 0;
    const bl = TEMPLATE[kind][d]
      .map(([k, m]) => {
        const B = BLOCKS[k];
        const s = nx[B.slot];
        nx[B.slot] += m;
        tot += m;
        return `<div class="tb ${B.ty}" style="min-height:${Math.max(m * 0.42, 34)}px"><b>${B.l}</b><span class="mono">${hhmm(s)}–${hhmm(s + m)} · ${m}m</span></div>`;
      })
      .join("");
    return `<div class="tday"><h4>${DOW[d]}<span class="mono">${fmtH(tot / 60)} h</span></h4>${bl}</div>`;
  }).join("");
  const N = tplTotals("normal"),
    L = tplTotals("light");
  const row = (l, a, b) =>
    `<tr><td>${l}</td><td class="n">${fmtH(a / 60)} h</td><td class="n">${fmtH(b / 60)} h</td></tr>`;
  const cur = tplTotals(kind);
  const tp = (cur.t / (cur.t + cur.p)) * 100;
  return `<div class="sechd"><div><h2>Daily timing</h2><p>Your weekly rhythm. Weekdays: 30 minutes of algorithms in the morning, theory then building in the evening. Saturday is the long build. Sunday is review. Holiday weeks 6 and 7 drop to about 15 hours.</p></div>
    <div class="seg" role="group" aria-label="Week type"><button data-tpl="normal" aria-pressed="${kind === "normal"}">Normal week</button><button data-tpl="light" aria-pressed="${kind === "light"}">Light week</button></div></div>
   <div class="tpl">${days}</div>
   <div class="grid2" style="margin-top:16px">
    <div class="panel"><h3>Where the hours go each week</h3>
     <table class="totals"><thead><tr><th>Block</th><th class="n">Normal</th><th class="n">Light</th></tr></thead><tbody>
      ${row("Algorithms (practical)", N.by.dsa, L.by.dsa)}${row("Theory", N.by.theory, L.by.theory)}${row("Build (practical)", N.by.build, L.by.build)}${row("Write & present (practical)", N.by.write, L.by.write)}${row("Review & plan (theory)", N.by.review, L.by.review)}
      <tr><th>Theory total</th><th class="n">${fmtH(N.t)} h</th><th class="n">${fmtH(L.t)} h</th></tr>
      <tr><th>Practical total</th><th class="n">${fmtH(N.p)} h</th><th class="n">${fmtH(L.p)} h</th></tr>
      <tr><th>Week total</th><th class="n">${fmtH(N.t + N.p)} h</th><th class="n">${fmtH(L.t + L.p)} h</th></tr>
     </tbody></table>
     <p class="small muted" style="margin:12px 0 6px">Theory vs practical (${kind} week): ${Math.round(tp)}% / ${Math.round(100 - tp)}%</p>
     <div class="ratio"><span class="t" style="width:${tp}%"></span><span class="p" style="width:${100 - tp}%"></span></div>
     <p class="small muted" style="margin-top:12px">Rule of thumb: about 1 hour of theory for every 2–3 hours of building. You learn the theory faster when you need it for the next commit.</p>
    </div>
    <div class="panel"><h3>Your times</h3>
     <div class="fields">
      <label class="fld" for="s-start">Sprint start (a Monday)<input type="date" id="s-start" data-set="start" value="${st.start}"></label>
      <label class="fld" for="s-morning">Morning block<input type="time" id="s-morning" data-set="morning" value="${st.morning}"></label>
      <label class="fld" for="s-evening">Evening blocks start<input type="time" id="s-evening" data-set="evening" value="${st.evening}"></label>
      <label class="fld" for="s-weekend">Saturday start<input type="time" id="s-weekend" data-set="weekend" value="${st.weekend}"></label>
      <label class="fld" for="s-sunday">Sunday review<input type="time" id="s-sunday" data-set="sunday" value="${st.sunday}"></label>
     </div>
     <p class="small muted" style="margin-top:12px">These times drive the Today view and the calendar export. Lectures or a client deadline on a day? Move that session rather than skip it, and log what you actually did.</p>
    </div>
   </div>
   <div class="panel" style="margin-top:16px"><h3>Backup your progress</h3>
    <p class="small muted" style="margin:0 0 10px">Your ticks, ratings and hours live in this browser only. Export a backup every Sunday, and import it to carry your progress to another device or browser.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
     <button class="btn primary" data-act="backup-export">Export backup (.json)</button>
     <button class="btn" data-act="backup-import">Import backup</button>
     <input type="file" id="backup-file" accept="application/json,.json" hidden>
    </div>
   </div>`;
}