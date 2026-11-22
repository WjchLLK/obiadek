---
project: Obiadek
version: 1
status: draft
created: 2026-11-22
updated: 2026-11-22
prd_version: 1
main_goal: low-complexity
top_blocker: capacity
milestone_id: family-meal-planning
milestone_seq: 1
milestone_status: open
---

# Roadmap: Obiadek

> Na podstawie `context/foundation/prd.md` oraz automatycznie zbadanego punktu bazowego kodu. Dokument jest rozwijany w miejscu; elementy poniżej występują w kolejności zależności.

## Milestone

**M-1: Rodzinne planowanie obiadu** — Status: open

- **Intent:** Umożliwić rodzinie wybór pasującego obiadu, odczyt przepisu i przygotowanie listy brakujących produktów do skopiowania lub udostępnienia.
- **Source materials:** `context/foundation/prd.md` (v1).
- **Done when:** wszystkie poniższe elementy F-NN i S-NN mają status `done`.
- **Scope anchors:** US-01, FR-001–FR-007, wymagania dotyczące telefonów i kontroli dostępu.

## Vision recap

Przygotowanie obiadu dla pięcioosobowej rodziny wymaga nużącego szukania potraw, podejmowania decyzji i planowania zakupów. Wygodniej byłoby wybrać spośród trzech propozycji spełniających wstępne kryteria.

## North star

Gwiazda przewodnia to najmniejszy wynik obejmujący cały fragment doświadczenia użytkownika, który sprawdza podstawową użyteczność produktu.

**S-03: Wybór potrawy i odczyt przepisu** — pozwala sprawdzić zarówno przydatność propozycji, jak i dostępność przepisu, zanim powstanie lista zakupów.

## At a glance

| ID | Change ID | Outcome (użytkownik może…) | Prerequisites | PRD refs | Status |
| --- | --- | --- | --- | --- | --- |
| S-01 | shared-family-access | Zalogować się do wspólnego konta i uzyskać dostęp do wspólnych danych. | — | FR-001 | ready |
| S-02 | matching-meal-proposals | Podać kryteria i otrzymać pasujące propozycje albo informację o ich braku. | S-01 | US-01, FR-002, FR-003, FR-004 | proposed |
| S-03 | choose-meal-recipe | Wybrać propozycję i odczytać przepis oraz składniki. | S-02 | US-01, FR-005 | proposed |
| S-04 | share-shopping-list | Wybrać brakujące składniki, utworzyć listę i skopiować ją lub udostępnić jako tekst. | S-03 | US-01, FR-006, FR-007 | proposed |

## Baseline

Stan zbadany automatycznie na podstawie repozytorium; deklaracje wyboru technologii nie są dowodem ukończenia funkcji.

- **Frontend: partial** — istnieją strony startowe, logowanie i przykładowy panel, bez interfejsu wyboru obiadu (`src/pages/`, `src/pages/dashboard.astro`).
- **Backend / API: partial** — istnieją operacje uwierzytelniania, bez odnalezionego API potraw (`src/pages/api/auth/`).
- **Data: absent** — nie znaleziono schematu, migracji ani danych początkowych dla potraw; istnieje konfiguracja dostawcy danych (`supabase/config.toml`).
- **Auth: partial** — istnieją sesje i ochrona panelu, lecz logowanie używa e-maila, a rejestracja jest dostępna; PRD wymaga wspólnego konta z loginem i hasłem (`src/middleware.ts`, `src/pages/api/auth/signin.ts`, `src/pages/api/auth/signup.ts`).
- **Deploy / infra: partial** — konfiguracja środowiska i CI istnieją; automatyczna publikacja po scaleniu nie jest skonfigurowana (`wrangler.jsonc`, `.github/workflows/ci.yml`, `context/foundation/infrastructure.md`).
- **Observability: partial** — włączona jest podstawowa obserwowalność platformy; nie znaleziono instrumentacji domenowej (`wrangler.jsonc`).

## Foundations

Brak osobnych elementów przygotowawczych: minimalne dane, dostęp i ścieżki weryfikacji należy wprowadzić w pierwszych wycinkach, które ich potrzebują.

## Slices

### S-01: Dostęp do wspólnego konta

- **Outcome:** Użytkownik może zalogować się loginem i hasłem do wspólnego konta i uzyskać dostęp do wspólnych danych.
- **Change ID:** shared-family-access
- **PRD refs:** FR-001
- **Prerequisites:** —
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Istniejący przykład obsługuje e-mail i rejestrację, więc nie dowodzi zgodności z modelem jednego wspólnego konta.
- **Status:** ready

### S-02: Pasujące propozycje obiadu

- **Outcome:** Użytkownik może podać liczbę osób i opcjonalne kryteria oraz otrzymać do trzech pasujących propozycji z kosztem i czasem albo informację o braku wyników i powrót do kryteriów.
- **Change ID:** matching-meal-proposals
- **PRD refs:** US-01, FR-002, FR-003, FR-004
- **Prerequisites:** S-01
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:**
  - Skąd pochodzą sprawdzone dane potraw i szacunki kosztów? — Owner: team. Block: no.
- **Risk:** Brak danych domenowych może ograniczyć jakość dopasowań; należy zachować reguły łączenia kryteriów i zaokrąglania kosztu z PRD.
- **Status:** proposed

### S-03: Wybór potrawy i odczyt przepisu

- **Outcome:** Użytkownik może wybrać zaproponowaną potrawę i odczytać jej przepis oraz składniki na telefonie.
- **Change ID:** choose-meal-recipe
- **PRD refs:** US-01, FR-005
- **Prerequisites:** S-02
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:**
  - Jak pozyskać i sprawdzić kompletne przepisy oraz składniki dla proponowanych potraw? — Owner: team. Block: no.
- **Risk:** Propozycje bez wiarygodnych przepisów nie realizują podstawowego przepływu rodziny.
- **Status:** proposed

### S-04: Lista brakujących zakupów

- **Outcome:** Użytkownik może wygodnie zaznaczyć brakujące składniki, utworzyć czytelną listę oraz skopiować ją lub udostępnić jako tekst z telefonu.
- **Change ID:** share-shopping-list
- **PRD refs:** US-01, FR-006, FR-007
- **Prerequisites:** S-03
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Udostępnianie zależy od możliwości urządzenia; kopiowanie pozostaje potrzebną ścieżką przekazania tekstu.
- **Status:** proposed

## Backlog Handoff

| Roadmap ID | Change ID | Suggested issue title | Ready for `/10x-plan` | Notes |
| --- | --- | --- | --- | --- |
| S-01 | shared-family-access | Dostęp do wspólnego konta | yes | Pierwszy warunek dalszego przepływu. |
| S-02 | matching-meal-proposals | Pasujące propozycje obiadu | no | Po S-01. |
| S-03 | choose-meal-recipe | Wybór potrawy i odczyt przepisu | no | Po S-02. |
| S-04 | share-shopping-list | Lista brakujących zakupów | no | Po S-03. |

## Open Roadmap Questions

Brak pytań przekrojowych zgłoszonych jako otwarte w PRD.

## Parked

- **Historia potraw i oceny** — poza zakresem pierwszej wersji według PRD.
- **Trwały zapis listy zakupów** — PRD wymaga kopiowania i udostępniania tekstu.
- **Eksport PDF** — PRD odkłada go na rzecz udostępniania tekstu.
- **Filtr wysokobiałkowy i szczegółowe wartości odżywcze** — poza zakresem pierwszej wersji według PRD.
- **Działanie offline** — niewymagane w pierwszej wersji według PRD.
- **Wiele kont** — PRD przewiduje jedno wspólne konto.

## Milestone History

## Done
