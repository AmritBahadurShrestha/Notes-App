# DevOps Workflow

How a change moves from your laptop to production, using Render for both the
frontend (static site) and backend (web service), split into staging and
production environments by git branch.

## The pipeline at a glance

```
feature/xyz  --PR-->  staging  --PR-->  main
     |                    |                |
  (local dev)      auto-deploys to    auto-deploys to
                    *-staging          *-prod
                    on Render          on Render
```

- **`main`** = production. Always deployable. Only updated via PR from `staging`.
- **`staging`** = pre-production. Where feature branches land and get tested against a real deployed environment before going live.
- **`feature/*`** = one branch per feature/fix, branched off `staging`.

Render is wired to auto-deploy:
| Branch    | Backend service      | Frontend service       |
|-----------|-----------------------|--------------------------|
| `staging` | `notes-api-staging`   | `notes-web-staging`      |
| `main`    | `notes-api-prod`      | `notes-web-prod`         |

This is defined in `render.yaml` at the repo root (a Render "Blueprint") — see the comments in that file for one-time setup.

GitHub Actions (`.github/workflows/ci.yml`) runs build/compile checks on every PR into `staging` or `main`, so a broken build never reaches Render in the first place. Render itself does the actual deploying — no deploy step needed in Actions.

---

## One-time setup

1. Push this repo to GitHub.
2. On Render: **New → Blueprint**, point it at the repo. Render reads `render.yaml` and creates all 4 services.
3. In each service's **Settings**, confirm the branch matches the table above (Render usually gets this right from `render.yaml`, but double check).
4. In each service's **Environment**, fill in the secrets marked `sync: false` in `render.yaml` (e.g. `MONGODB_URI`). Consider using a separate MongoDB Atlas database (or even a separate cluster) for staging vs. production so test data never touches real data.
5. (Recommended) In GitHub repo settings, add a branch protection rule on `main` and `staging` requiring the CI workflow to pass before merging.

---

## Day-to-day workflow — worked example: the "pin a note" feature

This is exactly how the pin/favorite feature was shipped, and the pattern to repeat for the next one.

**1. Branch off staging**
```bash
git checkout staging
git pull
git checkout -b feature/pin-notes
```

**2. Build the feature locally**, testing against your local backend + Atlas dev data as usual (`uvicorn app.main:app --reload` + `npm run dev`).

**3. Commit and push**
```bash
git add .
git commit -m "Add pin/favorite notes feature"
git push -u origin feature/pin-notes
```

**4. Open a PR into `staging`**
GitHub Actions runs automatically (backend compiles, frontend builds). Fix anything red before merging.

**5. Merge → staging auto-deploys**
Merging the PR pushes to `staging`, which Render picks up automatically and redeploys `notes-api-staging` + `notes-web-staging` — usually live within a minute or two. No manual "deploy" step.

**6. Test on staging**
Open your `notes-web-staging` URL and click through the new feature for real, against the staging API and staging database. This is the gate before production — catch issues here, not after users see them.

**7. Promote to production**
Once staging looks good, open a PR from `staging` into `main`:
```bash
git checkout staging
git pull
# (PR staging -> main via GitHub UI, or:)
git checkout main
git pull
git merge staging
git push
```
Merging into `main` triggers Render to redeploy `notes-api-prod` + `notes-web-prod` automatically.

**8. Tag the release (optional but recommended)**
```bash
git tag -a v1.1.0 -m "Add pin/favorite notes"
git push origin v1.1.0
```

---

## Rolling back

Render keeps a deploy history per service. If production breaks, open the `notes-api-prod` or `notes-web-prod` service on Render and use **Rollback** to redeploy the previous successful build — faster than reverting in git while you investigate.

## Hotfixes

For an urgent production-only fix, branch off `main` instead of `staging` (`git checkout -b hotfix/xyz main`), PR it straight into `main`, then immediately merge `main` back into `staging` so the two don't drift apart:
```bash
git checkout staging
git merge main
git push
```
