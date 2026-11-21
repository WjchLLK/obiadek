---
bootstrapped_at: 2026-11-04T20:50:45Z
starter_id: 10x-astro-starter
starter_name: "10x Astro Starter (Astro + Supabase + Cloudflare)"
project_name: obiadek
language_family: js
package_manager: npm
cwd_strategy: git-clone
bootstrapper_confidence: first-class
phase_3_status: ok
audit_command: npm audit --json
---

## Hand-off

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

## Pre-scaffold verification

| Signal | Value | Severity | Notes |
| --- | --- | --- | --- |
| npm package | not run | — | git clone, no create-* package |
| GitHub repo | https://github.com/przeprogramowani/10x-astro-starter; pushed 2026-10-29T22:28:56Z | fresh | gh unavailable (command not found); GitHub API read succeeded |

## Scaffold log

**Resolved invocation**: `git clone https://github.com/przeprogramowani/10x-astro-starter .bootstrap-scaffold && cd .bootstrap-scaffold && npm install`

**Strategy**: git-clone
**Exit code**: 0
**Moved entries**: 20; directories listed below include their contents.
**Conflicts**: AGENTS.md.scaffold, CLAUDE.md.scaffold
**.gitignore handling**: moved silently
**Cleanup**: cloned .git removed; .bootstrap-scaffold removed

Moved: `.env.example`, `.github/`, `.gitignore`, `.husky/`, `.nvmrc`, `.prettierrc.json`, `.vscode/`, `astro.config.mjs`, `components.json`, `eslint.config.js`, `node_modules/`, `package-lock.json`, `package.json`, `public/`, `README.md`, `scripts/`, `src/`, `supabase/`, `tsconfig.json`, `wrangler.jsonc`. No scaffold context/ was present. The starter-provided .github/ directory was moved unchanged.

**CLI output**:

```text
Cloning into '.bootstrap-scaffold'...
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'astro-eslint-parser@3.1.0',
npm warn EBADENGINE   required: { node: '^22.22.3 || ^24.16.0 || >=26.3.0' },
npm warn EBADENGINE   current: { node: 'v24.15.0', npm: '11.12.1' }
npm warn EBADENGINE }
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'eslint-plugin-astro@3.2.1',
npm warn EBADENGINE   required: { node: '^22.22.3 || ^24.16.0 || >=26.3.0' },
npm warn EBADENGINE   current: { node: 'v24.15.0', npm: '11.12.1' }
npm warn EBADENGINE }

added 636 packages in 16s
```

**Smoke verification**: npm run build exited 0; sitemap skipped because site is not configured. Development server returned HTTP 200 and HTML title 10x Astro Starter. Browser visual check unavailable: browser daemon could not start. Supabase authentication was not exercised.

## Post-scaffold audit

**Tool**: npm audit --json; exit code 1
**Summary**: 0 CRITICAL, 0 HIGH, 14 MODERATE, 0 LOW, 0 INFO.
**Direct vs transitive**: 6 direct, 8 transitive affected packages (npm isDirect); direct severity counts: critical: 0, high: 0, moderate: 6, low: 0. Package counts are not independent advisory counts.

- **@eslint-community/eslint-utils** (transitive): moderate; affected ; via eslint; fix true.
- **@eslint/config-array** (transitive): moderate; affected >=0.23.0; via minimatch; fix true.
- **@eslint/js** (direct): moderate; affected >=10.0.1; via eslint; fix {"name":"@eslint/js","version":"9.39.5","isSemVerMajor":true}.
- **@typescript-eslint/eslint-plugin** (transitive): moderate; affected >=6.16.0; via @typescript-eslint/parser, @typescript-eslint/type-utils, @typescript-eslint/utils; fix true.
- **@typescript-eslint/parser** (transitive): moderate; affected >=6.16.0; via @typescript-eslint/typescript-estree; fix {"name":"typescript-eslint","version":"8.36.0","isSemVerMajor":true}.
- **@typescript-eslint/type-utils** (transitive): moderate; affected >=6.16.0; via @typescript-eslint/typescript-estree, @typescript-eslint/utils; fix true.
- **@typescript-eslint/typescript-estree** (transitive): moderate; affected >=6.16.0; via minimatch; fix {"name":"typescript-eslint","version":"8.36.0","isSemVerMajor":true}.
- **@typescript-eslint/utils** (transitive): moderate; affected >=6.16.0; via @typescript-eslint/typescript-estree; fix {"name":"typescript-eslint","version":"8.36.0","isSemVerMajor":true}.
- **eslint** (direct): moderate; affected >=10.0.0-alpha.0; via @eslint/config-array, minimatch; fix {"name":"eslint","version":"9.39.5","isSemVerMajor":true}.
- **eslint-plugin-astro** (direct): moderate; affected >=2.0.0; via @typescript-eslint/parser, eslint, eslint-plugin-jsx-a11y, typescript-eslint; fix {"name":"eslint-plugin-astro","version":"1.7.0","isSemVerMajor":true}.
- **eslint-plugin-jsx-a11y** (direct): moderate; affected ; via eslint; fix true.
- **eslint-plugin-react** (direct): moderate; affected ; via eslint; fix true.
- **minimatch** (transitive): moderate; affected 7.0.0 - 11.0.0; via minimatch has potential denial of service via globparts amplification (https://github.com/advisories/GHSA-g3hv-75wg-m249; >=7.0.0 <11.0.1); fix {"name":"eslint","version":"9.39.5","isSemVerMajor":true}.
- **typescript-eslint** (direct): moderate; affected *; via @typescript-eslint/eslint-plugin, @typescript-eslint/parser, @typescript-eslint/typescript-estree, @typescript-eslint/utils; fix {"name":"typescript-eslint","version":"8.36.0","isSemVerMajor":true}.

**Full raw stdout**:

```json
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "@eslint-community/eslint-utils": {
      "name": "@eslint-community/eslint-utils",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "eslint"
      ],
      "effects": [],
      "range": "",
      "nodes": [
        "node_modules/@eslint-community/eslint-utils"
      ],
      "fixAvailable": true
    },
    "@eslint/config-array": {
      "name": "@eslint/config-array",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "minimatch"
      ],
      "effects": [],
      "range": ">=0.23.0",
      "nodes": [
        "node_modules/@eslint/config-array"
      ],
      "fixAvailable": true
    },
    "@eslint/js": {
      "name": "@eslint/js",
      "severity": "moderate",
      "isDirect": true,
      "via": [
        "eslint"
      ],
      "effects": [],
      "range": ">=10.0.1",
      "nodes": [
        "node_modules/@eslint/js"
      ],
      "fixAvailable": {
        "name": "@eslint/js",
        "version": "9.39.5",
        "isSemVerMajor": true
      }
    },
    "@typescript-eslint/eslint-plugin": {
      "name": "@typescript-eslint/eslint-plugin",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "@typescript-eslint/parser",
        "@typescript-eslint/type-utils",
        "@typescript-eslint/utils"
      ],
      "effects": [],
      "range": ">=6.16.0",
      "nodes": [
        "node_modules/@typescript-eslint/eslint-plugin"
      ],
      "fixAvailable": true
    },
    "@typescript-eslint/parser": {
      "name": "@typescript-eslint/parser",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "@typescript-eslint/typescript-estree"
      ],
      "effects": [
        "@typescript-eslint/eslint-plugin",
        "typescript-eslint"
      ],
      "range": ">=6.16.0",
      "nodes": [
        "node_modules/@typescript-eslint/parser"
      ],
      "fixAvailable": {
        "name": "typescript-eslint",
        "version": "8.36.0",
        "isSemVerMajor": true
      }
    },
    "@typescript-eslint/type-utils": {
      "name": "@typescript-eslint/type-utils",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "@typescript-eslint/typescript-estree",
        "@typescript-eslint/utils"
      ],
      "effects": [
        "@typescript-eslint/eslint-plugin"
      ],
      "range": ">=6.16.0",
      "nodes": [
        "node_modules/@typescript-eslint/type-utils"
      ],
      "fixAvailable": true
    },
    "@typescript-eslint/typescript-estree": {
      "name": "@typescript-eslint/typescript-estree",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "minimatch"
      ],
      "effects": [
        "@typescript-eslint/parser",
        "@typescript-eslint/type-utils",
        "@typescript-eslint/utils",
        "typescript-eslint"
      ],
      "range": ">=6.16.0",
      "nodes": [
        "node_modules/@typescript-eslint/typescript-estree"
      ],
      "fixAvailable": {
        "name": "typescript-eslint",
        "version": "8.36.0",
        "isSemVerMajor": true
      }
    },
    "@typescript-eslint/utils": {
      "name": "@typescript-eslint/utils",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "@typescript-eslint/typescript-estree"
      ],
      "effects": [
        "typescript-eslint"
      ],
      "range": ">=6.16.0",
      "nodes": [
        "node_modules/@typescript-eslint/utils"
      ],
      "fixAvailable": {
        "name": "typescript-eslint",
        "version": "8.36.0",
        "isSemVerMajor": true
      }
    },
    "eslint": {
      "name": "eslint",
      "severity": "moderate",
      "isDirect": true,
      "via": [
        "@eslint/config-array",
        "minimatch"
      ],
      "effects": [
        "@eslint-community/eslint-utils",
        "@eslint/js",
        "eslint-plugin-astro",
        "eslint-plugin-jsx-a11y",
        "eslint-plugin-react"
      ],
      "range": ">=10.0.0-alpha.0",
      "nodes": [
        "node_modules/eslint"
      ],
      "fixAvailable": {
        "name": "eslint",
        "version": "9.39.5",
        "isSemVerMajor": true
      }
    },
    "eslint-plugin-astro": {
      "name": "eslint-plugin-astro",
      "severity": "moderate",
      "isDirect": true,
      "via": [
        "@typescript-eslint/parser",
        "eslint",
        "eslint-plugin-jsx-a11y",
        "typescript-eslint"
      ],
      "effects": [],
      "range": ">=2.0.0",
      "nodes": [
        "node_modules/eslint-plugin-astro"
      ],
      "fixAvailable": {
        "name": "eslint-plugin-astro",
        "version": "1.7.0",
        "isSemVerMajor": true
      }
    },
    "eslint-plugin-jsx-a11y": {
      "name": "eslint-plugin-jsx-a11y",
      "severity": "moderate",
      "isDirect": true,
      "via": [
        "eslint"
      ],
      "effects": [],
      "range": "",
      "nodes": [
        "node_modules/eslint-plugin-jsx-a11y"
      ],
      "fixAvailable": true
    },
    "eslint-plugin-react": {
      "name": "eslint-plugin-react",
      "severity": "moderate",
      "isDirect": true,
      "via": [
        "eslint"
      ],
      "effects": [],
      "range": "",
      "nodes": [
        "node_modules/eslint-plugin-react"
      ],
      "fixAvailable": true
    },
    "minimatch": {
      "name": "minimatch",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        {
          "source": 1244623,
          "name": "minimatch",
          "dependency": "minimatch",
          "title": "minimatch has potential denial of service via globparts amplification",
          "url": "https://github.com/advisories/GHSA-g3hv-75wg-m249",
          "severity": "moderate",
          "cwe": [
            "CWE-405"
          ],
          "cvss": {
            "score": 0,
            "vectorString": null
          },
          "range": ">=7.0.0 <11.0.1"
        }
      ],
      "effects": [
        "@eslint/config-array",
        "@typescript-eslint/typescript-estree",
        "eslint"
      ],
      "range": "7.0.0 - 11.0.0",
      "nodes": [
        "node_modules/minimatch"
      ],
      "fixAvailable": {
        "name": "eslint",
        "version": "9.39.5",
        "isSemVerMajor": true
      }
    },
    "typescript-eslint": {
      "name": "typescript-eslint",
      "severity": "moderate",
      "isDirect": true,
      "via": [
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser",
        "@typescript-eslint/typescript-estree",
        "@typescript-eslint/utils"
      ],
      "effects": [
        "eslint-plugin-astro"
      ],
      "range": "*",
      "nodes": [
        "node_modules/typescript-eslint"
      ],
      "fixAvailable": {
        "name": "typescript-eslint",
        "version": "8.36.0",
        "isSemVerMajor": true
      }
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 0,
      "moderate": 14,
      "high": 0,
      "critical": 0,
      "total": 14
    },
    "dependencies": {
      "prod": 347,
      "dev": 294,
      "optional": 157,
      "peer": 0,
      "peerOptional": 0,
      "total": 780
    }
  }
}
```

**stderr**: (empty)

## Hints recorded but not acted on

| Hint | Value |
| --- | --- |
| bootstrapper_confidence | first-class |
| quality_override | false |
| path_taken | standard |
| self_check_answers | null |
| team_size | solo |
| deployment_target | cloudflare-pages |
| ci_provider | github-actions |
| ci_default_flow | auto-deploy-on-merge |
| has_auth | true |
| has_payments | false |
| has_realtime | false |
| has_ai | false |
| has_background_jobs | false |

## Next steps

A future skill will set up agent context. Review the .scaffold siblings and audit findings, configure Supabase and Cloudflare, and use a Node version compatible with the dependencies. Initialize your own Git history if needed.
