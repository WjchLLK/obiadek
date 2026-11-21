---
project: Obiadek
version: 1
status: draft
created: 2026-10-31
context_type: greenfield
product_type: web-app
target_scale:
  users: small
timeline_budget:
  mvp_weeks: 5
  hours_per_week: 5
  hard_deadline: null
  after_hours_only: true
---

# Obiadek

## Vision & Problem Statement

Przygotowanie obiadu dla pięcioosobowej rodziny wiąże się z nużącym wymyślaniem lub szukaniem potraw, co zabiera cenny czas. Trudność obejmuje znalezienie dań spełniających warunki, codzienne podejmowanie decyzji oraz sprawdzenie składników i zaplanowanie zakupów.

Wygodniej byłoby wybrać spośród trzech propozycji spełniających wstępne kryteria.

## User & Persona

Głównymi użytkownikami są autor pomysłu i jego żona, planujący obiad dla rodziny: dwojga dorosłych i trojga dzieci.

## Success Criteria

### Primary

- Pełny przepływ: podanie kryteriów, trzy propozycje, wybór potrawy, przepis i składniki, wskazanie produktów do zakupów oraz utworzenie listy zakupów.
- Korzystanie z pełnego przepływu średnio cztery dni w tygodniu.

### Secondary

- Pozytywny feedback od żony udzielony słownie.

### Guardrails

- Przepis i lista zakupów są czytelne na telefonie bez powiększania i przewijania w poziomie.
- Składniki można wygodnie zaznaczać palcem.
- Listę można skopiować lub udostępnić jako tekst z telefonu; systemowe menu udostępniania, jeśli jest dostępne.

## User Stories

### US-01: Wybór potrawy i lista zakupów

- **Given** użytkownik korzysta z aplikacji i podaje liczbę osób oraz wybrane kryteria.
- **When** użytkownik otrzymuje propozycje i wybiera potrawę.
- **Then** otrzymuje przepis przygotowania oraz listę składników. Po zaznaczeniu brakujących składników może utworzyć listę zakupów, skopiować ją lub udostępnić jako tekst.

## Functional Requirements

### Dostęp

- FR-001: Użytkownik może korzystać ze wspólnego konta i wspólnych danych. Priority: must-have
  > Socrates: Osobne konta zwiększają zakres prac nad wspólnymi danymi; decyzja: uprościć MVP do wspólnego konta.

### Wybór potrawy

- FR-002: Użytkownik może podać liczbę osób i opcjonalnie wybrać kryteria dotyczące kuchni, mięsa, węglowodanów, rodzaju dania, temperatury i obróbki; w temperaturze i obróbce dopuszczalny jest wielokrotny wybór, w pozostałych kategoriach pojedynczy. Priority: must-have
  > Socrates: Łączenie wszystkich kryteriów może ograniczyć liczbę wyników; decyzja: zachować wszystkie kryteria.
- FR-003: Użytkownik może otrzymać do trzech pasujących propozycji z nazwą, szacunkowym kosztem całości zaokrąglonym w górę do wielokrotności 5 zł i czasem przygotowania. Priority: must-have
  > Socrates: Szacunki kosztu i czasu mogą być niedokładne; decyzja: zachować oba na liście propozycji.
- FR-004: Użytkownik może otrzymać informację o braku propozycji i wrócić do określenia kryteriów. Priority: must-have
  > Socrates: Obsługę braku wyników można uprościć do pustej listy; decyzja: zachować informację i powrót do kryteriów.
- FR-005: Użytkownik może wybrać potrawę i zobaczyć jej przepis oraz składniki. Priority: must-have
  > Socrates: Pełny przepis wymaga pozyskania i sprawdzenia treści; decyzja: zachować przepis i składniki w MVP.

### Lista zakupów

- FR-006: Użytkownik może zaznaczyć brakujące składniki i utworzyć z nich listę zakupów. Priority: must-have
  > Socrates: Zaznaczanie brakujących składników dodaje krok; decyzja: zachować ten sposób tworzenia listy.
- FR-007: Użytkownik może skopiować listę zakupów i udostępnić ją jako tekst z telefonu. Priority: must-have
  > Socrates: Trwały zapis listy zwiększa zakres; decyzja: zachować tylko kopiowanie i udostępnianie.

## Non-Functional Requirements

- Aplikacja działa na telefonach z systemem Android 15 i nowszym.
- Przepis i lista zakupów są czytelne na telefonie bez powiększania i przewijania w poziomie; składniki można wygodnie zaznaczać palcem.

## Business Logic

Propozycja potrawy musi spełniać wszystkie wybrane kategorie kryteriów, przy czym w kategorii z wieloma wybranymi opcjami wystarczy dopasowanie do jednej z nich.

Użytkownik podaje liczbę osób i może wybrać kryteria kuchni, mięsa, węglowodanów, rodzaju dania, temperatury oraz sposobu obróbki. W temperaturze i sposobie obróbki można wybrać kilka opcji; w pozostałych kategoriach jedną. Wynikiem jest do trzech pasujących propozycji, a przy braku dopasowania użytkownik otrzymuje informację i może wrócić do kryteriów.

Szacunkowy koszt zaokrągla się w górę do najbliższej wielokrotności 5 zł; kwota będąca już wielokrotnością 5 zł pozostaje bez zmian. Przykłady: 9,99 zł → 10 zł; 10,00 zł → 10 zł; 10,01 zł → 15 zł; 12,50 zł → 15 zł.

## Access Control

Użytkownik i jego żona korzystają w MVP ze wspólnego konta i wspólnych danych. Logowanie odbywa się przy użyciu loginu i hasła.

## Non-Goals

- Historia potraw i oceny — nie są konieczne w pierwszej wersji.
- Trwały zapis listy zakupów — w MVP wystarczy kopiowanie i udostępnianie.
- Eksport PDF — odłożony na rzecz udostępniania tekstu.
- Filtr wysokobiałkowy i szczegółowe wartości odżywcze — poza pierwszą wersją.
- Działanie offline — nie jest wymagane w MVP.
- Wiele kont — MVP ogranicza się do wspólnego konta.

## Open Questions

Brak otwartych pytań z dotychczasowej kontroli.
