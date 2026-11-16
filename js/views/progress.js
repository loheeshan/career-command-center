"use strict";
/* ---------- PROGRESS ---------- */
function vProgress() {
  const today = todayColombo();
  let lt = 0,
    lp = 0,
    pt = 0,
    pp = 0,
    sess = 0,
    sessDue = 0;
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const d = addDays(state.settings.start, i);
    const l = state.log[d];
    if (l) {
      lt += +l.t || 0;
      lp += +l.p || 0;
    }
    if (d <= today) {
      const p = plannedFor(d);
      pt += p.t;
      pp += p.p;
      const P = dayPlan(d);
      for (const b of P.blocks) {
        sessDue++;
        if (state.done[b.id]) sess++;
      }
    }
  }
  let streak = 0;
  for (let d = today; diffDays(state.settings.start, d) >= 0; d = addDays(d, -1)) {
    const l = state.log[d];
    if (l && (+l.t || 0) + (+l.p || 0) > 0) streak++;
    else if (d !== today) break;
  }
  // chart
  const W = 760,
    H = 230,
    pl = 36,
    pb = 26,
    pt2 = 12,
    cw = (W - pl - 10) / 12;
  let max = 0;
  for (const w of WEEKS) {
    const a = weekPlanned(w.n),
      b = weekActual(w.n);
    max = Math.max(max, a.t + a.p, b.t + b.p);
  }
  max = Math.ceil(max / 5) * 5 || 30;
  const y = (v) => pt2 + (H - pt2 - pb) * (1 - v / max);
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Planned versus logged hours per week">`;
  for (let v = 0; v <= max; v += 5) {
    svg += `<line x1="${pl}" x2="${W - 10}" y1="${y(v)}" y2="${y(v)}" stroke="#262A31"/><text x="${pl - 6}" y="${y(v) + 4}" fill="#6B707A" font-size="10" text-anchor="end" font-family="IBM Plex Mono">${v}</text>`;
  }
  for (const w of WEEKS) {
    const a = weekPlanned(w.n),
      b = weekActual(w.n);
    const x = pl + (w.n - 1) * cw + cw * 0.18,
      bw = cw * 0.64;
    svg += `<rect x="${x}" y="${y(a.t + a.p)}" width="${bw}" height="${y(0) - y(a.t + a.p)}" fill="none" stroke="#4A505B" stroke-dasharray="3 3" rx="3"/>`;
    if (b.t + b.p > 0) {
      svg += `<rect x="${x + 3}" y="${y(b.p)}" width="${bw - 6}" height="${y(0) - y(b.p)}" fill="#FF8A3D" rx="2"/><rect x="${x + 3}" y="${y(b.t + b.p)}" width="${bw - 6}" height="${y(b.p) - y(b.t + b.p)}" fill="#86AEFF" rx="2"/>`;
    }
    svg += `<text x="${x + bw / 2}" y="${H - 8}" fill="#959AA4" font-size="11" text-anchor="middle" font-family="IBM Plex Mono">W${w.n}</text>`;
  }
  svg += `</svg>`;
  const tr = Object.keys(TRACKS)
    .filter((k) => k !== "dsa")
    .map((k) => {
      const its = ITEMS.filter((i) => i.tr === k);
      const d = its.filter((i) => state.done[i.id]).length;
      return `<div class="trkrow"><span>${chip(k)}</span><div class="bar"><span style="width:${its.length ? (d / its.length) * 100 : 0}%;background:${TRACKS[k].c}"></span></div><span class="n">${d}/${its.length}</span></div>`;
    })
    .join("");
  const days = Object.keys(state.log)
    .filter((d) => state.log[d] && ((+state.log[d].t || 0) + (+state.log[d].p || 0) > 0 || state.log[d].note))
    .sort()
    .reverse()
    .slice(0, 14);
  const logT = days.length
    ? `<table class="log"><thead><tr><th>Day</th><th class="n">Theory</th><th class="n">Practical</th><th>Note</th></tr></thead><tbody>${days
        .map((d) => {
          const l = state.log[d];
          const p = plannedFor(d);
          return `<tr><td>${nice(d)}</td><td class="n">${fmtH(+l.t || 0)}/${fmtH(p.t)}</td><td class="n">${fmtH(+l.p || 0)}/${fmtH(p.p)}</td><td>${esc(l.note || "")}</td></tr>`;
        })
        .join("")}</tbody></table>`
    : `<p class="muted">No hours logged yet. Log them on the Today view at the end of each day.</p>`;
  const ratio = lt + lp ? Math.round((lt / (lt + lp)) * 100) : 0;
  let allT = 0,
    allP = 0;
  for (const w of WEEKS) {
    const x = weekPlanned(w.n);
    allT += x.t;
    allP += x.p;
  }
  const planRatio = Math.round((allT / (allT + allP)) * 100);
  return `<div class="sechd"><div><h2>Progress</h2><p>Planned against what you logged. Dashed outline = planned hours for the week; blue = theory logged, orange = practical logged.</p></div></div>
   <div class="kgrid">
    <div class="panel"><div class="mono">HOURS LOGGED / DUE</div><div class="v">${fmtH(lt + lp)} <span class="muted small">/ ${fmtH(pt + pp)}</span></div></div>
    <div class="panel"><div class="mono">THEORY · PRACTICAL</div><div class="v"><span style="color:var(--theory)">${fmtH(lt)}</span> · <span style="color:var(--practical)">${fmtH(lp)}</span></div><div class="small muted">${ratio}% theory (plan: ${planRatio}%)</div></div>
    <div class="panel"><div class="mono">SESSIONS DONE</div><div class="v">${sess} <span class="muted small">/ ${sessDue} due</span></div></div>
    <div class="panel"><div class="mono">LOGGING STREAK</div><div class="v">${streak} <span class="muted small">days</span></div></div>
   </div>
   <div class="panel chart" style="margin-top:16px"><h3>Hours per week</h3>${svg}</div>
   <div class="grid2" style="margin-top:16px">
    <div class="panel"><h3>Tasks by track</h3>${tr}</div>
    <div class="panel"><h3>Recent days</h3>${logT}</div>
   </div>`;
}