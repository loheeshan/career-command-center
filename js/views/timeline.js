"use strict";
/* ---------- TIMELINE ---------- */
function vTimeline() {
  const cw = weekOf(todayColombo());
  let g = `<div class="gt"><div class="hdc"><b>Track</b>week →</div>`;
  for (const W of WEEKS) {
    const [a] = weekRange(W.n);
    g += `<div class="hdc${W.n === cw ? " cur" : ""}"><b>W${W.n}</b>${nice(a, false)}</div>`;
  }
  g += `<div class="hdc">Phase</div>`;
  for (const P of PHASES) {
    g += `<div class="ph" style="grid-column:span 4">${P.n}</div>`;
  }
  for (const k of Object.keys(TRACKS)) {
    g += `<div class="rl"><i style="width:10px;height:10px;border-radius:3px;background:${TRACKS[k].c};display:inline-block;flex:none"></i>${esc(TRACKS[k].n)}</div>`;
    for (const W of WEEKS) {
      const its = [...W.t, ...W.p].filter((x) => x[2] === k);
      let n = its.length;
      if (k === "dsa") n = 1;
      const done = its.filter((x) => state.done[x[0]]).length;
      const op = n ? Math.min(0.35 + n * 0.18, 1) : 0;
      const title = n ? (k === "dsa" ? W.dsa : its.map((x) => x[1]).join(" · ")) : "";
      g += `<div class="cell${W.n === cw ? " cur" : ""}" title="${esc(title)}">${n ? `<span style="background:${TRACKS[k].c};opacity:${op};${its.length && done === its.length ? "outline:2px solid var(--ok);outline-offset:1px" : ""}"></span>` : ""}</div>`;
    }
  }
  g += `<div class="rl"><span class="dia"></span> Milestones</div>`;
  for (const W of WEEKS) {
    const [d, t] = weekDone(W);
    g += `<div class="ms${W.n === cw ? " cur" : ""}" title="${esc(W.ms)}"><span class="dia${d === t ? " hit" : ""}"></span></div>`;
  }
  g += `</div>`;
  const weeks = WEEKS.map((W) => {
    const [a, b] = weekRange(W.n);
    const [d, t] = weekDone(W);
    const wp = weekPlanned(W.n);
    const open = ui.openWeek ? ui.openWeek === W.n : cw ? cw === W.n : W.n === 1;
    return `<details class="wk" id="wk-${W.n}" ${open ? "open" : ""}><summary>
      <span class="wkn">W${W.n}</span>
      <span class="wkt"><b>${esc(W.title)}</b> ${W.light ? '<span class="pill lightflag">LIGHT · HOLIDAYS</span>' : ""}<span class="mono">${nice(a, false)} – ${nice(b, false)} · ${PHASES[W.phase].n} · ${fmtH(wp.t)} h theory + ${fmtH(wp.p)} h practical</span></span>
      <span class="wkr"><span class="mono">${d}/${t} done</span><span class="bar"><span style="width:${(d / t) * 100}%"></span></span></span></summary>
      <div class="wkbody">
       <div><div class="colh"><span class="pill T">Theory</span> topics</div>${W.t.map((x) => checkItem(x[0], x[1], x[2])).join("")}</div>
       <div><div class="colh"><span class="pill P">Practical</span> tasks</div>${W.p.map((x) => checkItem(x[0], x[1], x[2])).join("")}</div>
       <div class="wkfoot">
        <div><span class="mono">MILESTONE</span>${esc(W.ms)}</div>
        <div><span class="mono">ALGORITHMS</span>${esc(W.dsa)}</div>
        <div><span class="mono">WRITE & PRESENT</span>${esc(W.write)}</div>
       </div>
      </div></details>`;
  }).join("");
  return `<div class="sechd"><div><h2>Timeline</h2><p>12 weeks in three phases. Each bar shows which tracks a week works on; brighter means more tasks. Hover a cell for the tasks. Diamonds turn green when a week is complete.</p></div></div>
   <div class="gantt">${g}</div><div class="weeks">${weeks}</div>`;
}