# Project Instructions

Refer to @agents.md for Design OS specific instructions.

---

## Git Workflow

**IMPORTANT**: For ALL code changes in this project, follow this automated branch-based workflow:

### Before Starting Any Work

1. **Always create a new branch** before making changes:
   ```bash
   git checkout main && git pull origin main
   git checkout -b <branch-name>
   ```

   Branch naming convention:
   - Features: `feature/<short-description>` (e.g., `feature/onboarding-wizard`)
   - Fixes: `fix/<short-description>` (e.g., `fix/venue-detail-types`)
   - Updates: `update/<short-description>` (e.g., `update/clubs-venues-spec`)
   - Refactors: `refactor/<short-description>`

### After Completing Work

2. **Stage and commit changes** with a comprehensive message:
   ```bash
   git add <specific-files>
   git commit -m "<message>"
   ```

   Commit message format:
   ```
   <type>: <concise summary>

   ## Summary
   - Bullet point describing what changed
   - Another bullet point

   ## Files Changed
   - path/to/file1.tsx - description of change
   - path/to/file2.ts - description of change

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
   ```

   Types: `feat`, `fix`, `update`, `refactor`, `docs`, `style`, `test`

3. **Push the branch and create a PR**:
   ```bash
   git push -u origin <branch-name>
   gh pr create --title "<PR title>" --body "<PR body>"
   ```

4. **Merge the PR and clean up**:
   ```bash
   gh pr merge --squash --delete-branch
   git checkout main && git pull origin main
   ```

### Complete Automated Workflow

When the user asks to commit, create a PR, or save work, execute this full workflow automatically:

```bash
# 1. Create branch (if not already on a feature branch)
git checkout -b <branch-name>

# 2. Stage specific files (avoid git add -A)
git add <files>

# 3. Commit with comprehensive message
git commit -m "$(cat <<'EOF'
<type>: <summary>

## Summary
<bullet points>

## Files Changed
<file list>

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"

# 4. Push and create PR
git push -u origin <branch-name>
gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
<description>

## Changes
<bullet points>

## Test Plan
- [ ] Verify TypeScript compiles without errors
- [ ] Review changes in Design OS preview

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"

# 5. Merge PR
gh pr merge --squash --delete-branch

# 6. Return to main
git checkout main && git pull origin main
```

### Important Notes

- **Never commit directly to main** - always use feature branches
- **Never use `git add -A` or `git add .`** - stage specific files to avoid including sensitive data
- **Always include `Co-Authored-By`** in commit messages
- **Run `npx tsc --noEmit`** before committing to verify no TypeScript errors
- **Use squash merge** to keep main branch history clean
- If the user says "commit this" or "save my work" or "push changes", execute the full workflow above
