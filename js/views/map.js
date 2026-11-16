"use strict";
/* ---------- SKILL MAP ---------- */
function vMap() {
  const cards = SKILLS.map((T) => {
    const tr = TRACKS[T.k];
    let sum = 0,
      cnt = 0;
    const hs = T.h
      .map((H, hi) => {
        const subs = H.s
          .map((s, si) => {
            const id = T.k + "-" + hi + "-" + si;
            const lv = +state.skills[id] || 0;
            sum += lv;
            cnt++;
            const pips = [1, 2, 3]
              .map(
                (n) =>
                  `<button class="pip${lv >= n ? " on" : ""}" style="${lv >= n ? `background:${tr.c}` : ""}" data-skill="${id}" data-lv="${n}" aria-label="${esc(s)}: ${LEVELS[n]}" title="${LEVELS[n]}"></button>`,
              )
              .join("");
            return `<div class="sub"><span>${esc(s)}</span><span class="pips">${pips}</span></div>`;
          })
          .join("");
        const res = H.r.length
          ? `<div class="res">${H.r.map(([l, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(l)} ↗</a>`).join("")}</div>`
          : "";
        return `<div class="hd2"><h4>${esc(H.n)}<span class="mono">WEEK ${H.w.join(", ")}</span></h4>${subs}${res}</div>`;
      })
      .join("");
    const pct = cnt ? (sum / (cnt * 3)) * 100 : 0;
    return `<div class="trk"><div class="top" style="background:${tr.c}"></div><div class="in">
      <h3>${esc(tr.n)}<span class="mono">${Math.round(pct)}%</span></h3><div class="bar" style="margin-top:6px"><span style="width:${pct}%;background:${tr.c}"></span></div>
      <p class="why">${esc(T.why)}</p>${hs}</div></div>`;
  }).join("");
  return `<div class="sechd"><div><h2>Skill map</h2><p>Every track, heading and subtopic in the plan, with free sources. Rate yourself honestly as you go: tap a bar to set your level; tap your current level again to step back one.</p></div>
   <div class="legend">${[1, 2, 3].map((n) => `<span><span class="pips">${[1, 2, 3].map((i) => `<i class="pip${i <= n ? " on" : ""}" style="display:inline-block;cursor:default;${i <= n ? "background:var(--accent)" : ""}"></i>`).join("")}</span>${LEVELS[n]}</span>`).join("")}</div></div>
   <div class="mapgrid">${cards}</div>`;
}