"use strict";
/* State: everything you tick, rate or log. Saved in this browser (localStorage). */
const DEFAULT_SETTINGS = {
  start: "2026-11-23",
  morning: "06:30",
  evening: "18:30",
  weekend: "09:00",
  sunday: "17:00",
  alarm: 10,
};
function freshState() {
  return { v: 1, done: {}, skills: {}, log: {}, settings: { ...DEFAULT_SETTINGS } };
}
function normalise(s) {
  const f = freshState();
  if (!s || typeof s !== "object") return f;
  return {
    v: 1,
    done: s.done && typeof s.done === "object" ? s.done : {},
    skills: s.skills && typeof s.skills === "object" ? s.skills : {},
    log: s.log && typeof s.log === "object" ? s.log : {},
    settings: { ...f.settings, ...(s.settings || {}) },
  };
}
const LS_KEY = "cc-state-v1";
const SYNC_TXT = { saved: "Saved in this browser", error: "Not saved: browser storage is blocked" };
let sync = "saved";
let state = freshState();
try {
  const c = localStorage.getItem(LS_KEY);
  if (c) state = normalise(JSON.parse(c));
} catch (e) {
  sync = "error";
}

let ui = { view: "today", day: null, tplKind: "normal", calRange: "all", calMs: true, icsText: "" };

function saveLocal() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
    sync = "saved";
  } catch (e) {
    sync = "error";
  }
}
function changed() {
  saveLocal();
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportBackup() {
  const body = JSON.stringify(
    { app: "career-command-center", exported: new Date().toISOString(), state },
    null,
    2,
  );
  downloadBlob(
    new Blob([body], { type: "application/json" }),
    "career-command-center-backup-" + todayColombo() + ".json",
  );
}
async function importBackup(file) {
  const j = JSON.parse(await file.text());
  const s = j && j.state ? j.state : j;
  if (!s || typeof s !== "object" || !("done" in s || "log" in s || "skills" in s))
    throw new Error("Not a Command Center backup");
  state = normalise(s);
  saveLocal();
}