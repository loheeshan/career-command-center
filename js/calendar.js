"use strict";
/* Calendar view and .ics export. */
function icsEsc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}
function fold(line) {
  const enc = new TextEncoder();
  const parts = [];
  let cur = "",
    n = 0,
    lim = 75;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (n + b > lim) {
      parts.push(cur);
      cur = "";
      n = 0;
      lim = 74;
    }
    cur += ch;
    n += b;
  }
  parts.push(cur);
  return parts.join("\r\n ");
}
function utcStamp(dateStr, min) {
  const d = parseD(dateStr);
  const ms = d.getTime() + (min - 330) * 60000;
  const x = new Date(ms);
  return (
    x.getUTCFullYear() +
    pad(x.getUTCMonth() + 1) +
    pad(x.getUTCDate()) +
    "T" +
    pad(x.getUTCHours()) +
    pad(x.getUTCMinutes()) +
    "00Z"
  );
}
function calDays() {
  const s = state.settings.start;
  const today = todayColombo();
  let a = s,
    n = TOTAL_DAYS;
  if (ui.calRange === "week") {
    const w = weekOf(today) || 1;
    a = weekRange(w)[0];
    n = 7;
  } else if (ui.calRange === "fromtoday") {
    if (today > s && weekOf(today)) {
      a = today;
      n = TOTAL_DAYS - diffDays(s, today);
    }
  }
  return Array.from({ length: n }, (_, i) => addDays(a, i)).filter((d) => weekOf(d));
}
function buildIcs() {
  const now = new Date();
  const stamp =
    now.getUTCFullYear() +
    pad(now.getUTCMonth() + 1) +
    pad(now.getUTCDate()) +
    "T" +
    pad(now.getUTCHours()) +
    pad(now.getUTCMinutes()) +
    pad(now.getUTCSeconds()) +
    "Z";
  const L = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Loheeshan//Career Command Center//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Career Sprint",
    "X-WR-TIMEZONE:Asia/Colombo",
  ];
  let count = 0;
  const alarm = +state.settings.alarm || 0;
  const days = calDays();
  const weeksSeen = new Set();
  for (const d of days) {
    const P = dayPlan(d);
    weeksSeen.add(P.wn);
    for (const b of P.blocks) {
      count++;
      const title = (b.ty === "T" ? "[Theory] " : "[Practical] ") + b.label + ": " + b.what;
      const desc =
        "Week " +
        P.wn +
        " · " +
        P.W.title +
        "\n" +
        b.what +
        "\n" +
        b.sub +
        (b.item ? "\nTrack: " + TRACKS[b.item[2]].n : "") +
        "\nMilestone this week: " +
        P.W.ms;
      L.push(
        "BEGIN:VEVENT",
        "UID:cc-" + d + "-" + b.key + "@career-command-center",
        "DTSTAMP:" + stamp,
        "DTSTART:" + utcStamp(d, b.start),
        "DTEND:" + utcStamp(d, b.start + b.dur),
        "SUMMARY:" + icsEsc(title),
        "DESCRIPTION:" + icsEsc(desc),
        "CATEGORIES:" + (b.ty === "T" ? "Theory" : "Practical"),
        "TRANSP:OPAQUE",
      );
      if (alarm > 0)
        L.push(
          "BEGIN:VALARM",
          "ACTION:DISPLAY",
          "DESCRIPTION:" + icsEsc(b.label + " starts in " + alarm + " min"),
          "TRIGGER:-PT" + alarm + "M",
          "END:VALARM",
        );
      L.push("END:VEVENT");
    }
  }
  if (ui.calMs) {
    for (const w of weeksSeen) {
      const W = WEEKS[w - 1];
      const end = weekRange(w)[1];
      count++;
      L.push(
        "BEGIN:VEVENT",
        "UID:cc-ms-w" + w + "@career-command-center",
        "DTSTAMP:" + stamp,
        "DTSTART;VALUE=DATE:" + end.replace(/-/g, ""),
        "DTEND;VALUE=DATE:" + addDays(end, 1).replace(/-/g, ""),
        "SUMMARY:" + icsEsc("Milestone W" + w + ": " + W.ms),
        "DESCRIPTION:" + icsEsc("Week " + w + " · " + W.title),
        "TRANSP:TRANSPARENT",
        "END:VEVENT",
      );
    }
  }
  L.push("END:VCALENDAR");
  return { text: L.map(fold).join("\r\n") + "\r\n", count };
}
function vCalendar() {
  const { count } = buildIcs();
  const days = calDays();
  return `<div class="sechd"><div><h2>Calendar</h2><p>Turn the plan into calendar events: every session with its time, topic and a reminder, plus a milestone at the end of each week. Times are Sri Lanka time (UTC+05:30).</p></div></div>
   <div class="grid2">
    <div class="panel"><h3>Export</h3>
     <div class="fields">
      <label class="fld" for="c-range">Range<select id="c-range" data-cal="range">
        <option value="all" ${ui.calRange === "all" ? "selected" : ""}>Whole sprint (12 weeks)</option>
        <option value="fromtoday" ${ui.calRange === "fromtoday" ? "selected" : ""}>From today to the end</option>
        <option value="week" ${ui.calRange === "week" ? "selected" : ""}>This week only</option></select></label>
      <label class="fld" for="c-alarm">Reminder<select id="c-alarm" data-set="alarm">
        ${[0, 5, 10, 15, 30].map((m) => `<option value="${m}" ${+state.settings.alarm === m ? "selected" : ""}>${m ? m + " min before" : "None"}</option>`).join("")}</select></label>
     </div>
     <label style="display:flex;gap:8px;align-items:center;margin-top:12px;font-size:14px"><input type="checkbox" class="ck" id="c-ms" data-cal="ms" ${ui.calMs ? "checked" : ""}> Add weekly milestones as all-day events</label>
     <p class="small muted" style="margin:12px 0">${count} events across ${days.length} days (${days.length ? nice(days[0], false) + " – " + nice(days[days.length - 1], false) : "none"}).</p>
     <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-act="ics-dl">Download .ics file</button><button class="btn" data-act="ics-show">Show calendar text</button></div>
     ${ui.icsText ? `<div style="margin-top:12px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span class="mono">CAREER-SPRINT.ICS</span><button class="btn" data-act="ics-copy">Copy</button></div><pre class="ics">${esc(ui.icsText)}</pre><p class="small muted">If the download doesn't start, copy this text into a file named career-sprint.ics.</p></div>` : ""}
    </div>
    <div class="panel"><h3>Add it to Google Calendar</h3>
     <ol class="steps">
      <li>In Google Calendar on the web, create a new calendar called <b>Career Sprint</b> (Other calendars → +). If the plan changes, you can delete that whole calendar in one go.</li>
      <li>Open Settings → Import &amp; export → Import.</li>
      <li>Choose the career-sprint.ics file and pick <b>Career Sprint</b> as the destination.</li>
      <li>Change a time in Daily timing? Delete the Career Sprint calendar and import a fresh file.</li>
     </ol>
     <p class="small muted" style="margin-top:10px">Apple Calendar and Outlook open the same .ics file directly.</p>
    </div>
   </div>`;
}