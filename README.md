# Career Command Center

A 12-week sprint tracker for one goal: become job-ready for an **Applied AI / Solutions Architect** role focused on **secure agent deployment**.

It plans every day of the sprint, splits each day into theory and practical sessions, tracks what you finished and how many hours you put in, and exports the whole schedule to your calendar.

## Features

| Tab | What it does |
|---|---|
| Today | Each session with its time, type (theory or practical), topic and track. Tick sessions and topics, log hours and a note. |
| Timeline | Three phases across 12 weeks as a track-by-week chart, plus a checklist, milestone and algorithms topic for every week. |
| Skill map | 9 tracks → headings → subtopics, with free sources. Rate yourself from "Learning" to "Can explain it in an interview". |
| Daily timing | The weekly rhythm, theory/practical split and hours per block. Change your session times and sprint start date. Export and import backups. |
| Progress | Planned vs logged hours per week, task progress per track, logging streak. |
| Calendar | Export every session (with reminders) and weekly milestones as an `.ics` file for Google Calendar, Apple Calendar or Outlook. |

## Run it

No build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy on GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Your site will be at `https://<username>.github.io/career-command-center/`.

## Your data

Progress is stored in your browser's `localStorage`. Nothing is sent anywhere.

- It stays in the browser you used. Another browser or device starts empty.
- Use **Daily timing → Export backup** every week, and **Import backup** to move your progress.
- Clearing site data deletes your progress, so keep a backup.

## Add the plan to Google Calendar

1. Create a new calendar called **Career Sprint** (Other calendars → +).
2. In the **Calendar** tab, download `career-sprint.ics`.
3. Google Calendar → **Settings → Import & export → Import**, pick the file and choose **Career Sprint**.
4. Changed your session times? Delete the Career Sprint calendar and import a fresh file.

## Project structure

```
index.html            page shell
css/styles.css        design tokens and layout
js/data.js            curriculum: tracks, phases, weeks, skill map, daily templates
js/storage.js         state, localStorage, backup export/import
js/plan.js            dates (Sri Lanka time) and the plan engine
js/ui.js              header, tabs and shared render helpers
js/views/*.js         one file per tab
js/calendar.js        calendar tab and .ics export
js/app.js             router and event handling
```

## Change the plan

Everything the app shows comes from `js/data.js`:

- `WEEKS`: theory topics (`t`), practical tasks (`p`), algorithms topic, writing task and milestone for each week. Set `light: true` for a lighter week.
- `SKILLS`: the skill map's headings, subtopics and links.
- `TEMPLATE`: minutes per block for each day of a normal and a light week.

Keep the item ids (`w3p2` and so on) stable once you've started, or ticks saved against them will be lost.

## Stack

Plain HTML, CSS and JavaScript. Fonts: Chakra Petch, IBM Plex Sans and IBM Plex Mono from Google Fonts.