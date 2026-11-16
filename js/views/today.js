"use strict";
/* ---------- TODAY ---------- */
function vToday() {
  const s = state.settings.start,
    last = addDays(s, TOTAL_DAYS - 1);
  let d = ui.day || todayColombo();
  let pre = "";
  if (d < s) {
    pre = `<div class="note" style="margin-bottom:14px">The sprint starts ${nice(s)}. Here is day 1.</div>`;
    d = s;
  }
  if (d > last) {
    pre = `<div class="note" style="margin-bottom:14px">The sprint ended ${nice(last)}. Showing the last day.</div>`;
    d = last;
  }
  ui.day = d;
  const P = dayPlan(d);
  const W = P.W;
  const idx = diffDays(s, d) + 1;
  const pl = plannedFor(d);
  const lg = state.log[d] || {};
  const at = +lg.t || 0,
    ap = +lg.p || 0;
  const [wd, wt] = weekDone(W);
  const wp = weekPlanned(W.n),
    wa = weekActual(W.n);
  const blocks = P.blocks
    .map((b) => {
      const sess = !!state.done[b.id];
      const itemCk = b.item
        ? `<label><input type="checkbox" class="ck" data-done="${b.item[0]}" ${state.done[b.item[0]] ? "checked" : ""}> Topic finished</label>`
        : "";
      return `<div class="blk ${b.ty}${sess ? " doneblk" : ""}">
      <div class="time">${hhmm(b.start)}–${hhmm(b.start + b.dur)}<small>${b.dur} min</small></div>
      <div><div class="lbl"><b>${b.label}</b><span class="pill ${b.ty}">${b.ty === "T" ? "Theory" : "Practical"}</span>${b.item ? chip(b.item[2]) : ""}</div>
      <div class="what">${esc(b.what)}</div><div class="muted small">${esc(b.sub)}</div>
      <div class="ctl"><label><input type="checkbox" class="ck" data-done="${b.id}" ${sess ? "checked" : ""}> Session done</label>${itemCk}</div></div></div>`;
    })
    .join("");
  const rowBar = (lbl, a, p, cls) =>
    `<div class="row"><span>${lbl}</span><div class="bar"><span class="${cls}" style="width:${p ? Math.min((a / p) * 100, 100) : 0}%"></span></div><span class="mono">${fmtH(a)}/${fmtH(p)} h</span></div>`;
  return `${pre}
  <div class="sechd"><div><div class="mono">WEEK ${W.n} · DAY ${idx} OF ${TOTAL_DAYS}${W.light ? ' · <span class="pill lightflag">LIGHT WEEK</span>' : ""}</div><h2>${esc(W.title)}</h2></div>
   <div class="daynav"><button class="btn" data-day="-1" aria-label="Previous day">◀</button><span class="d">${nice(d)}</span><button class="btn" data-day="1" aria-label="Next day">▶</button><button class="btn" data-day="0">Today</button></div></div>
  <div class="grid2">
   <div class="blocks">${blocks || '<div class="empty">Rest day.</div>'}</div>
   <div class="stack">
    <div class="panel"><h3>Log today's hours</h3>
      <div class="split2">
       <label class="fld" for="lg-t">Theory hours<input type="number" id="lg-t" min="0" max="16" step="0.25" value="${lg.t ?? ""}" placeholder="${fmtH(pl.t)}" data-log="t"></label>
       <label class="fld" for="lg-p">Practical hours<input type="number" id="lg-p" min="0" max="16" step="0.25" value="${lg.p ?? ""}" placeholder="${fmtH(pl.p)}" data-log="p"></label>
      </div>
      <label class="fld" for="lg-n" style="margin-top:10px">Note (what you finished, what blocked you)<textarea id="lg-n" data-log="note" placeholder="e.g. Webhook works; Telegram retries need dedupe">${esc(lg.note || "")}</textarea></label>
      <div class="mini">${rowBar("Theory", at, pl.t, "t")}${rowBar("Practical", ap, pl.p, "p")}</div>
    </div>
    <div class="panel"><h3>This week</h3>
      <div class="mono">${nice(weekRange(W.n)[0], false)} – ${nice(weekRange(W.n)[1], false)}</div>
      <p style="margin:8px 0"><b>Milestone:</b> ${esc(W.ms)}</p>
      <div class="mini">
       <div class="row"><span>Tasks</span><div class="bar"><span style="width:${(wd / wt) * 100}%"></span></div><span class="mono">${wd}/${wt}</span></div>
       ${rowBar("Theory", wa.t, wp.t, "t")}${rowBar("Practical", wa.p, wp.p, "p")}
      </div>
      <p class="small muted" style="margin:10px 0 0">Algorithms this week: ${esc(W.dsa)}</p>
      <button class="btn" style="margin-top:10px" data-go="timeline" data-week="${W.n}">Open week ${W.n} checklist</button>
    </div>
   </div>
  </div>`;
}