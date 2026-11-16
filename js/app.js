"use strict";
/* Router and event handling. */
const RENDERERS = {
  today: vToday,
  timeline: vTimeline,
  map: vMap,
  timing: vTiming,
  progress: vProgress,
  calendar: vCalendar,
};
function render() {
  renderHeader();
  document.getElementById("view").innerHTML = (RENDERERS[ui.view] || vToday)();
}
function route() {
  const h = (location.hash || "").replace("#", "");
  ui.view = VIEWS.some(([k]) => k === h) ? h : "today";
  render();
}
window.addEventListener("hashchange", route);

document.addEventListener("click", async (e) => {
  const t = e.target.closest("[data-view],[data-day],[data-skill],[data-tpl],[data-act],[data-go]");
  if (!t) return;
  if (t.dataset.view) {
    location.hash = t.dataset.view;
    return;
  }
  if (t.dataset.go) {
    ui.openWeek = +t.dataset.week || null;
    location.hash = t.dataset.go;
    setTimeout(() => {
      const w = document.getElementById("wk-" + t.dataset.week);
      if (w) w.scrollIntoView({ block: "start" });
    }, 30);
    return;
  }
  if (t.dataset.day !== undefined) {
    const n = +t.dataset.day;
    ui.day = n === 0 ? todayColombo() : addDays(ui.day || todayColombo(), n);
    render();
    return;
  }
  if (t.dataset.skill) {
    const id = t.dataset.skill,
      lv = +t.dataset.lv;
    const cur = +state.skills[id] || 0;
    state.skills[id] = cur === lv ? lv - 1 : lv;
    if (!state.skills[id]) delete state.skills[id];
    changed();
    render();
    return;
  }
  if (t.dataset.tpl) {
    ui.tplKind = t.dataset.tpl;
    render();
    return;
  }

  const a = t.dataset.act;
  if (a === "ics-show") {
    ui.icsText = buildIcs().text;
    render();
    return;
  }
  if (a === "ics-copy") {
    try {
      await navigator.clipboard.writeText(ui.icsText);
      toast("Calendar text copied");
    } catch (err) {
      toast("Copy was blocked. Select the text and copy it by hand.");
    }
    return;
  }
  if (a === "ics-dl") {
    const { text, count } = buildIcs();
    downloadBlob(new Blob([text], { type: "text/calendar" }), "career-sprint.ics");
    toast(count + " events saved to career-sprint.ics");
    return;
  }
  if (a === "backup-export") {
    exportBackup();
    toast("Backup downloaded");
    return;
  }
  if (a === "backup-import") {
    document.getElementById("backup-file").click();
    return;
  }
});

document.addEventListener("change", async (e) => {
  const t = e.target;
  if (t.id === "backup-file") {
    const f = t.files && t.files[0];
    t.value = "";
    if (!f) return;
    try {
      await importBackup(f);
      render();
      toast("Backup restored");
    } catch (err) {
      toast("That file isn't a Command Center backup.");
    }
    return;
  }
  if (t.dataset.done) {
    if (t.checked) state.done[t.dataset.done] = true;
    else delete state.done[t.dataset.done];
    changed();
    render();
    return;
  }
  if (t.dataset.log) {
    const d = ui.day || todayColombo();
    const l = { ...(state.log[d] || {}) };
    if (t.dataset.log === "note") l.note = t.value.slice(0, 500);
    else {
      const v = t.value === "" ? undefined : Math.max(0, Math.min(16, +t.value));
      if (v === undefined) delete l[t.dataset.log];
      else l[t.dataset.log] = v;
    }
    if (!l.note) delete l.note;
    if (Object.keys(l).length) state.log[d] = l;
    else delete state.log[d];
    changed();
    render();
    return;
  }
  if (t.dataset.set) {
    const k = t.dataset.set;
    let v = t.value;
    if (k === "start") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
        toast("Pick a valid date");
        return;
      }
      if (dow(v) !== 1) toast("Tip: a Monday start keeps weeks Monday to Sunday");
    }
    if (k === "alarm") v = +v;
    state.settings[k] = v;
    ui.icsText = "";
    changed();
    render();
    return;
  }
  if (t.dataset.cal) {
    if (t.dataset.cal === "range") ui.calRange = t.value;
    if (t.dataset.cal === "ms") ui.calMs = t.checked;
    ui.icsText = "";
    render();
  }
});

document.addEventListener(
  "toggle",
  (e) => {
    if (e.target.matches && e.target.matches("details.wk") && e.target.open)
      ui.openWeek = +e.target.id.slice(3);
  },
  true,
);

route();