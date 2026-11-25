# Dostęp do wspólnego konta — Plan Brief

> Pełny plan: `context/changes/shared-family-access/plan.md`

## What & Why

Rodzina korzysta z jednego konta zamiast osobnych kont użytkowników. Zmiana dostosowuje starterowy przepływ uwierzytelniania i usuwa publiczną rejestrację, zachowując istniejący Supabase Auth.

## Starting Point

Aplikacja już obsługuje e-mail/hasło, sesję SSR i chroniony dashboard, ale nadal oferuje rejestrację. Dokument wdrożenia odnotowuje wyłączony signup w produkcji i potwierdzone logowanie; bieżący stan chmurowego Supabase nie był sprawdzany podczas planowania.

## Desired End State

Dwie osoby logują się tym samym adresem i hasłem w niezależnych sesjach; wylogowanie jednej nie wylogowuje drugiej. Publiczne tworzenie kont jest niedostępne w aplikacji i odpowiednio skonfigurowanym Supabase, a właściciel odzyskuje dostęp administracyjnie.

## Key Decisions Made

| Decyzja | Wybór | Dlaczego |
| --- | --- | --- |
| Login | Wspólny adres e-mail i hasło | Wykorzystuje istniejące konto i mechanizm Supabase. |
| Odzyskiwanie | Administrator w Supabase, poza aplikacją | Nie rozszerza MVP o publiczny przepływ resetowania. |
| Rejestracja | Usunąć z aplikacji i wyłączyć w Supabase | Ukrycie formularza nie zabezpiecza bezpośredniego API Auth. |
| Testy | Syntetyczne konto tworzone administracyjnie tylko lokalnie | Smoke nie wymaga publicznego signup ani danych produkcyjnych. |

## Scope

**W zakresie:**
- Logowanie i wylogowanie wspólnego konta; ochrona istniejącego dashboardu.
- Usunięcie ścieżek rejestracji, konfiguracja lokalna, izolowane smoke/CI i instrukcje utrzymania.
- Ręczne potwierdzenie konta oraz blokady rejestracji w docelowym Supabase.

**Poza zakresem:**
- Nazwa użytkownika inna niż e-mail, wiele kont, reset hasła w aplikacji, MFA.
- Model potraw i jego RLS, usuwanie innych istniejących kont lub automatyczna zmiana produkcyjnego Supabase.

## Architecture / Approach

Formularz Astro/React wysyła dane do istniejącego serwerowego endpointu Supabase Auth; SSR obsługuje cookies, a middleware sprawdza użytkownika. Lokalny i zdalny Supabase muszą osobno blokować publiczny signup. Konto testowe tworzy się administracyjnie tylko w izolowanym lokalnym stosie, bez przekazywania klucza administracyjnego do aplikacji.

## Phases at a Glance

| Faza | Rezultat | Główne ryzyko |
| --- | --- | --- |
| 1. Dostęp do wspólnego konta | Logowanie bez rejestracji i działający lokalny smoke/CI | Usunięcie UI nie blokuje bezpośredniego signup. |
| 2. Weryfikacja i instrukcje operacyjne | Test niezależnych sesji i instrukcje utrzymania | Konfiguracja chmurowa może różnić się od lokalnej. |

**Prerequisites:** dostęp właściciela do docelowego Supabase; lokalny Docker/Supabase do izolowanego smoke; nie umieszczać sekretów w repozytorium ani logach.
**Estimated effort:** orientacyjnie 2 sesje w 2 fazach; zależne od dostępności środowiska Supabase.

## Open Risks & Assumptions

- Wcześniejsze potwierdzenie produkcyjnych ustawień nie dowodzi ich bieżącego stanu; właściciel musi je sprawdzić.
- Wyłączenie signup nie odbiera dostępu innym już istniejącym kontom; stan kont trzeba sprawdzić bez ich automatycznego usuwania.
- Przyszłe tabele danych wymagają osobnych polityk dostępu; obecny dashboard nie stanowi dowodu zabezpieczenia przyszłych danych.

## Success Criteria (Summary)

- Wspólny e-mail i hasło zapewniają dostęp, błędne dane go nie zapewniają, a sesje dwóch przeglądarek są niezależne.
- Publiczna rejestracja jest niedostępna w aplikacji i odrzucana przez skonfigurowany Supabase.
- Izolowany smoke i build przechodzą; właściciel potwierdza docelowe konto i ustawienia.

## References

- `context/foundation/prd.md`
- `context/foundation/roadmap.md`
- `context/changes/deployment/deploy-plan.md`
