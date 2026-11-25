# Dostęp do wspólnego konta — plan implementacji

## Overview

Dostosować istniejące uwierzytelnianie do jednego wspólnego konta rodziny: logowanie adresem e-mail i hasłem, bez publicznej rejestracji. Zachować Supabase Auth i serwerową obsługę sesji; nie budować jeszcze modelu danych potraw.

## Current State Analysis

- PRD wymaga jednego wspólnego konta i logowania loginem i hasłem (`context/foundation/prd.md:56-59,92-103`); podczas planowania uzgodniono, że loginem jest adres e-mail.
- Formularz i endpoint przekazują e-mail i hasło do Supabase (`src/components/auth/SignInForm.tsx:12-29`, `src/pages/api/auth/signin.ts:4-19`). Middleware sprawdza użytkownika przez `getUser()` i chroni tylko `/dashboard` (`src/middleware.ts:4-21`).
- Aplikacja oferuje rejestrację (`src/pages/api/auth/signup.ts:4-19`, `src/components/Topbar.astro:20-30`), a lokalny Supabase ją dopuszcza (`supabase/config.toml:168-169,202-209`). Usunięcie UI nie chroni bezpośredniego API Supabase.
- Dokument wdrożenia odnotowuje wyłączenie publicznej rejestracji w produkcji oraz potwierdzony przez właściciela przepływ logowania; bieżący stan produkcji nie był sprawdzany podczas planowania (`context/changes/deployment/deploy-plan.md:28-32,39-42,54-57`).
- Obecny smoke test zakłada rejestrację przez aplikację (`scripts/smoke.mjs:38-58`), a CI uruchamia go przeciw lokalnemu Supabase (`.github/workflows/ci.yml:27-52`).

## Desired End State

Obie osoby mogą równocześnie zalogować się tym samym adresem e-mail i hasłem, wejść na chroniony dashboard i wylogować własną sesję. Nieudane logowanie nie daje dostępu; publiczne tworzenie kont jest niedostępne zarówno w aplikacji, jak i w skonfigurowanym Supabase. Właściciel może utworzyć konto i odzyskać dostęp czynnościami administracyjnymi poza aplikacją. Potwierdzenie bezpieczeństwa produkcji wymaga osobnego sprawdzenia ustawień przez właściciela.

### Key Discoveries:

- Supabase SSR przechowuje sesję w cookies obsługiwanych po stronie serwera (`src/lib/supabase.ts:5-20`); zachować ten mechanizm.
- Usunięcie endpointu aplikacji nie blokuje bezpośredniego endpointu Auth: ograniczenie rejestracji musi istnieć w konfiguracji lokalnej i zdalnej.
- Konto testowe musi być tworzone administracyjnie w izolowanym lokalnym Supabase, a nie przez endpoint aplikacji ani w produkcji.

## What We're NOT Doing

- Dowolny login niebędący adresem e-mail, oddzielne konta członków rodziny ani samodzielna rejestracja.
- Reset hasła w aplikacji, system zaproszeń, MFA ani osobny panel administracyjny.
- Schemat, dane lub polityki RLS potraw; przyszłe dane wymagają własnej ochrony w odpowiedniej zmianie.
- Automatyczna zmiana konfiguracji produkcyjnej, usuwanie istniejących kont ani uruchamianie testów tworzących konta przeciw produkcji.

## Implementation Approach

Wykorzystać istniejące logowanie e-mail/hasło i zweryfikowaną przez Supabase sesję. Usunąć wszystkie ścieżki i odwołania do rejestracji aplikacji; wyłączyć signup w lokalnej konfiguracji Supabase i udokumentować analogiczne wymaganie dla projektu produkcyjnego. Dostosować smoke i CI już w fazie 1, aby usunięcie endpointu nie pozostawiło zepsutego pipeline'u. Faza 2 rozszerza dowody zachowania i opisuje operacje właściciela.

## Critical Implementation Details

Administrator musi najpierw zapewnić istnienie i dostępność właściwego konta, a następnie potwierdzić blokadę rejestracji w docelowym Supabase; lokalny `config.toml` sam nie zmienia ustawień chmurowych. Testowy klucz administracyjny może być używany wyłącznie do uruchamiania izolowanego lokalnego Supabase i nie może trafić do klienta, repozytorium ani logów.

## Phase 1: Dostęp do wspólnego konta

### Overview

Usunąć publiczną rejestrację, zachować istniejący przepływ logowania i utrzymać działającą weryfikację CI na izolowanym koncie testowym.

### Changes Required:

#### 1. Logowanie i nawigacja

**Files**: `src/pages/auth/signin.astro`, `src/components/auth/SignInForm.tsx`, `src/components/Topbar.astro`, `src/components/Welcome.astro`, `src/pages/api/auth/signin.ts`, `src/pages/api/auth/signout.ts`, `src/middleware.ts`

**Intent**: Udostępnić czytelny przepływ logowania istniejącym adresem e-mail i hasłem oraz usunąć odnośniki i opisy zachęcające do rejestracji, także na stronie głównej. Zachować serwerową weryfikację sesji; wylogowanie przez `signOut({ scope: "local" })` kończy wyłącznie bieżącą sesję, a błędne dane nie mogą ustanowić sesji.

**Contract**: POST `/api/auth/signin` przyjmuje `email` i `password`; istniejąca ochrona `/dashboard` wymaga użytkownika potwierdzonego przez Supabase. Nie wprowadzać nowego mechanizmu haseł ani klucza administracyjnego do aplikacji.

#### 2. Usunięcie rejestracji i lokalna konfiguracja

**Files**: `src/pages/api/auth/signup.ts`, `src/pages/auth/signup.astro`, `src/pages/auth/confirm-email.astro`, `src/components/auth/SignUpForm.tsx`, `supabase/config.toml`

**Intent**: Usunąć nieużywane strony, endpoint i komponent rejestracji oraz wyłączyć publiczne tworzenie kont w lokalnym Supabase. Usunąć wyłącznie pomocniczy kod, który po tej zmianie nie ma innych odbiorców.

**Contract**: `/auth/signup`, `/api/auth/signup` i `/auth/confirm-email` nie oferują rejestracji; bezpośredni publiczny signup Supabase jest wyłączony, w tym `auth.enable_signup` i `auth.email.enable_signup`. Nie zakładać, że zmiana lokalnego pliku aktualizuje produkcję.

#### 3. Działający smoke test i CI

**Files**: `scripts/smoke.mjs`, `.github/workflows/ci.yml`, `supabase/config.toml`

**Intent**: Zastąpić tworzenie konta przez aplikację jednorazowym administracyjnym przygotowaniem syntetycznego konta w lokalnym Supabase. Utrzymać test w CI bez włączania publicznej rejestracji i bez zależności od produkcji.

**Contract**: Skrypt lub etap przygotowania jawnie odmawia operacji tworzenia konta dla nielokalnego adresu Supabase; używa wyłącznie lokalnego klucza administracyjnego pobranego z uruchomionego lokalnego stosu, bez wypisywania sekretów. Smoke korzysta z tego konta do sprawdzenia logowania, dashboardu i wylogowania; CI uruchamia go na izolowanym lokalnym stosie. Sekrety administracyjne nie są przekazywane do buildu ani runtime aplikacji.

Testy wykonujące próby signup lub administracyjne tworzenie kont odmawiają działania dla nielokalnego `BASE_URL` aplikacji lub adresu Supabase. CI i instrukcje lokalne uruchamiają aplikację z konfiguracją wskazującą ten sam izolowany lokalny stos Supabase; samo sprawdzenie `BASE_URL` nie dowodzi konfiguracji backendu.

### Success Criteria:

#### Automated Verification:

- Kontrole jakości przechodzą: `npm run lint` i `npx astro check`.
- Izolowany lokalny smoke test przechodzi po przygotowaniu konta administracyjnie: poprawne i błędne hasło, dostęp anonimowy i po zalogowaniu oraz wylogowanie.

#### Manual Verification:

- Na telefonowym widoku formularza można zalogować się wspólnym adresem i hasłem; aplikacja nie pokazuje opcji rejestracji.
- Sprawdzić na stronie głównej brak odnośników i opisów zachęcających do rejestracji.

**Implementation Note**: Po automatycznej weryfikacji zatrzymaj się na ręczne potwierdzenie przed fazą 2.

---

## Phase 2: Weryfikacja i instrukcje operacyjne

### Overview

Rozszerzyć weryfikację izolacji sesji i blokady rejestracji oraz opisać bezpieczne utrzymanie jednego konta.

### Changes Required:

#### 1. Scenariusze bezpieczeństwa i sesji

**Files**: `scripts/smoke.mjs`, `.github/workflows/ci.yml`

**Intent**: Sprawdzić rzeczywiste granice dostępu i niezależność sesji obu osób, zamiast polegać na samym ukryciu interfejsu.

**Contract**: W izolowanym stosie test sprawdza, że bezpośredni publiczny signup Supabase jest odrzucony, usunięty endpoint aplikacji nie tworzy konta, dwa niezależne słoiki cookies mogą zalogować się tym samym kontem, a wylogowanie pierwszego nie pozbawia drugiego dostępu, także po odświeżeniu jego sesji. Test nie wykonuje operacji tworzenia kont w produkcji ani nie ujawnia danych konta.

#### 2. Utrzymanie i wdrożenie

**File**: `README.md`

**Intent**: Zastąpić instrukcje starterowej rejestracji operacyjnym opisem jednego konta i testów; umożliwić właścicielowi bezpieczne przygotowanie oraz odzyskanie dostępu.

**Contract**: Opisać ręczne utworzenie lub potwierdzenie konta w Supabase, wyłączenie publicznej rejestracji w lokalnym i zdalnym projekcie, odzyskanie hasła przez administratora, izolowane przygotowanie konta testowego i uruchomienie smoke. Nie umieszczać sekretów ani nie sugerować testów tworzących konta przeciw produkcji; zaznaczyć, że przyszłe tabele wymagają własnych polityk dostępu.

### Success Criteria:

#### Automated Verification:

- Rozszerzony izolowany smoke test potwierdza odrzucony signup oraz niezależne sesje dwóch klientów i przechodzi w CI.
- Produkcyjny build przechodzi: `npm run build`.

#### Manual Verification:

- Właściciel potwierdza istnienie właściwego konta oraz wyłączenie publicznego signup w docelowym Supabase bez ujawniania danych dostępowych.
- Dwie przeglądarki lub urządzenia logują się wspólnym kontem; wylogowanie jednego nie wylogowuje drugiego.

**Implementation Note**: Po automatycznej weryfikacji zatrzymaj się na potwierdzenie ręczne przed zamknięciem fazy.

---

## Testing Strategy

### Unit Tests:

- Nie dodawać testów jednostkowych dla prostego usunięcia ścieżek; zachowanie użytkownika sprawdza smoke integracyjny.

### Integration Tests:

- Uruchomić lokalny Supabase z wyłączoną rejestracją; utworzyć syntetyczne konto administracyjnie, a następnie wykonać smoke przeciw aplikacji.
- Sprawdzić błędne hasło, dostęp anonimowy, poprawne logowanie, dwa niezależne cookie jars, wylogowanie i odmowę bezpośredniego signup.

### Manual Testing Steps:

1. W izolowanym środowisku otworzyć formularz w widoku telefonu, zalogować się i sprawdzić dashboard oraz brak rejestracji.
2. Zalogować to samo konto w dwóch niezależnych przeglądarkach i wylogować jedną; druga pozostaje zalogowana.
3. Właściciel sprawdza w docelowym panelu Auth właściwe konto i wyłączony signup; nie podaje haseł ani kluczy w rozmowie.

## Performance Considerations

Bez nowych usług ani zapytań poza istniejącą weryfikacją sesji; skala to dwa urządzenia rodzinne. Nie wprowadzać cache uwierzytelnienia osłabiającego weryfikację sesji.

## Migration Notes

Zachować istniejące konto i sesje; przed wdrożeniem właściciel potwierdza dostęp do konta oraz konfigurację Supabase. Zdalne ustawienia są niezależne od lokalnego pliku. Nie usuwać innych kont bez osobnej zgody; jeśli inne konta istnieją, wyłączenie signup nie odbierze im dostępu — właściciel musi zweryfikować stan przed uznaniem modelu jednego konta za spełniony. Przy wycofaniu aplikacji nie włączać publicznej rejestracji jako skutku ubocznego.

## References

- `context/foundation/roadmap.md:64-74`
- `context/foundation/prd.md:56-59,92-103`
- `context/changes/deployment/deploy-plan.md:28-32,54-57`
- `src/middleware.ts:4-21`, `src/pages/api/auth/signin.ts:4-19`
- `scripts/smoke.mjs:38-58`, `.github/workflows/ci.yml:27-52`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Dostęp do wspólnego konta

#### Automated

- [x] 1.1 Kontrole jakości przechodzą: `npm run lint` i `npx astro check`. — 97485ea3c8
- [x] 1.2 Izolowany lokalny smoke test przechodzi po przygotowaniu konta administracyjnie: poprawne i błędne hasło, dostęp anonimowy i po zalogowaniu oraz wylogowanie. — 97485ea3c8

#### Manual

- [x] 1.3 Na telefonowym widoku formularza można zalogować się wspólnym adresem i hasłem; aplikacja nie pokazuje opcji rejestracji. — 97485ea3c8
- [x] 1.4 Sprawdzić na stronie głównej brak odnośników i opisów zachęcających do rejestracji. — 97485ea3c8

### Phase 2: Weryfikacja i instrukcje operacyjne

#### Automated

- [ ] 2.1 Rozszerzony izolowany smoke test potwierdza odrzucony signup oraz niezależne sesje dwóch klientów i przechodzi w CI.
- [x] 2.2 Produkcyjny build przechodzi: `npm run build`.

#### Manual

- [x] 2.3 Właściciel potwierdza istnienie właściwego konta oraz wyłączenie publicznego signup w docelowym Supabase bez ujawniania danych dostępowych.
- [x] 2.4 Dwie przeglądarki lub urządzenia logują się wspólnym kontem; wylogowanie jednego nie wylogowuje drugiego.
