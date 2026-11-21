---
starter_id: 10x-astro-starter
package_manager: npm
project_name: obiadek
hints:
  language_family: js
  team_size: solo
  deployment_target: cloudflare-pages
  ci_provider: github-actions
  ci_default_flow: auto-deploy-on-merge
  bootstrapper_confidence: first-class
  path_taken: standard
  quality_override: false
  self_check_answers: null
  has_auth: true
  has_payments: false
  has_realtime: false
  has_ai: false
  has_background_jobs: false
---

## Why this stack

Obiadek to mała aplikacja webowa z pięciotygodniowym budżetem czasu i wymaganiem wspólnego konta. Wybrany standardowy starter łączy TypeScript, Astro i React z Supabase zapewniającym bazę danych i uwierzytelnianie. Wdrożenie wybrano na Cloudflare Pages, a CI/CD na GitHub Actions z automatycznym wdrażaniem po scaleniu. Obsługę logowania loginem i hasłem należy dopasować do wymagań PRD; pewność tworzenia szkieletu to first-class.
