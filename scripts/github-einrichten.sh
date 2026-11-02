#!/usr/bin/env bash
# Richtet Sicherheitsregeln für das GitHub-Repository ein.
# Nutzung: scripts/github-einrichten.sh <besitzer>/<repo>
# Voraussetzung: gh ist angemeldet, das Repository existiert und die CI hat mindestens einmal gelaufen.
set -euo pipefail

REPO="${1:?Bitte Repository angeben, zum Beispiel schroepa/hello-lena-yoga}"

echo "→ Sicherheitsfunktionen aktivieren ($REPO)"
gh api -X PUT "repos/$REPO/vulnerability-alerts" --silent
gh api -X PUT "repos/$REPO/automated-security-fixes" --silent
gh api -X PATCH "repos/$REPO" --silent \
  -f 'security_and_analysis[secret_scanning][status]=enabled' \
  -f 'security_and_analysis[secret_scanning_push_protection][status]=enabled' \
  -F delete_branch_on_merge=true \
  -F allow_squash_merge=true \
  -F allow_merge_commit=false \
  -F allow_rebase_merge=false

echo "→ Branch-Schutz für main"
gh api -X PUT "repos/$REPO/branches/main/protection" --silent --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Qualität (Format, Lint, Typen, Tests, Build)",
      "Ende-zu-Ende und Barrierefreiheit (Playwright, axe)",
      "Lighthouse (alle Kategorien 100)",
      "Lieferkette (Abhängigkeiten prüfen)",
      "Analyse (JavaScript und TypeScript)"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false
  },
  "required_linear_history": true,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "restrictions": null
}
JSON

echo "✓ Fertig. Prüfe die Einstellungen unter https://github.com/$REPO/settings"
