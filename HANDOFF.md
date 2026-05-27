# Handoff

## Current State

- Portfolio workbench is updated and saved locally.
- Project set remains:
  - `groundtruth`
  - `codetune`
  - `tracepilot`
  - `executiondesk`
  - `robbymd`
- Demo embeds are wired into both the project detail views and the case-file routes.
- About window now shows the actual photo and name in the same view without scrolling.
- Sidequests are still open for final selection. `AQI-Prediction` is a strong candidate because it is a published paper. Chess can be included only if it has a concrete artifact or outcome.

## Local Assets

- Stacked proof image:
  - `C:\Users\Lenovo\Downloads\built-with-opus-proof-stack.png`

## Key Changes

- Resume-derived skills were added to the skills section while keeping the original top skills first.
- Timeline and chat facts were refreshed from resume, education, work experience, and projects.
- Project demos now render from GitHub-hosted media when available.
- The About panel was tightened so the name and photo fit in one static view.
- The proof screenshots from the hackathon email were cropped and stacked for portfolio use.

## Verified

- `npm run lint`
- `npm run build`
- Local preview was reachable at `http://127.0.0.1:5174/`

## Local Commits

- `0dab321 feat: embed project demos`
- `0f1a72a fix: show about identity block`
- `ec4bdfd fix: fit about panel without scroll`
- `40cb2e1 fix: refresh skills from resume`

## Notes

- Keep RobbyMD in the earlier project list for now.
- Do not add the hackathon acceptance item until the screenshot is shared.
- The repo is currently clean after the latest commit.
