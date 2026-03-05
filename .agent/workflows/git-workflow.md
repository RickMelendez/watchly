---
description: commit, squash merge to main, delete branch, create new dev branch
---

// turbo-all

After every set of changes, follow this Git workflow:

## 1. Stage and commit all changes
```
git add -A
git commit -m "type: short description of changes"
```
Use conventional commit prefixes: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`

## 2. Push the current feature branch
```
git push origin <current-branch-name>
```

## 3. Switch to main and squash merge
```
git checkout main
git pull origin main
git merge --squash <current-branch-name>
git commit -m "squash: <summary of everything in the branch>"
```

## 4. Push main
```
git push origin main
```

## 5. Delete the old branch (local and remote)
```
git branch -D <current-branch-name>
git push origin --delete <current-branch-name>
```

## 6. Create a new dev branch from main and push it
```
git checkout -b feat/development
git push -u origin feat/development
```

> This keeps `main` clean with one squash commit per feature/fix, and always leaves a fresh branch ready for development.
