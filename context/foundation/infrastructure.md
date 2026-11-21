---
project: obiadek
researched_at: 2026-11-14
recommended_platform: Cloudflare Workers
runner_up: Vercel
context_type: mvp
tech_stack:
  language: TypeScript
  framework: Astro 7, React 19
  runtime: Cloudflare Workers workerd; Node.js for tooling
---

## Recommendation

**Wdrażaj na Cloudflare Workers**, z zewnętrznym Supabase. Użytkownik zna Cloudflare, nie potrzebuje trwałych połączeń, akceptuje zewnętrzną bazę i traktuje koszt oraz wygodę równorzędnie; jeden region wystarczy. Istniejące `@astrojs/cloudflare` 14.4.3, `wrangler.jsonc` i `output: "server"` już celują w Workers, więc nie ma kosztu migracji adaptera. W punktacji Workers zajmuje pierwsze miejsce ex aequo; znajomość platformy oraz istniejąca konfiguracja rozstrzygają remis.

Handoff wskazywał Cloudflare Pages, ale repozytorium wdraża Worker, a nie projekt Pages. [Cloudflare zaleca Workers dla nowych projektów](https://developers.cloudflare.com/pages/); Pages pozostaje dostępne. Ta decyzja świadomie wybiera **Workers**, bez twierdzenia, że Pages zostało wycofane.

## Platform Comparison

Stan badania: 2026-11-14. Twardy filtr: brak potrzeby stałych procesów. Wszystkie platformy obsługują TypeScript/Astro SSR, lecz poza Cloudflare wymagają zmiany adaptera i runtime; zgodność konkretnej aplikacji po migracji wymaga testu. Workers `workerd` nie jest zamienny z Node.js. Supabase i jego opłaty pozostają niezależne od hostingu.

Pass = 1, Partial = 0,5, Fail = 0. Wagi: CLI 3, managed 3, dokumentacja 2, API deploymentów i rollback 3, integracje 1; maksimum 12. Koszt i DX są równorzędne; znajomość Cloudflare i brak migracji rozstrzygają remis, bez dodatkowych punktów. Jeden region i zewnętrzny Supabase nie premiują ani edge, ani współlokalizacji.

| Platforma | CLI-first | Managed | Dokumentacja dla agenta | API wdrożeń | MCP / integracja | Suma / 12 |
|---|---|---|---|---|---|---:|
| Cloudflare Workers | Pass | Pass | Pass | Pass | Pass | 12 |
| Vercel | Pass | Pass | Pass | Pass | Pass | 12 |
| Netlify | Pass | Pass | Pass | Pass | Pass | 12 |
| Railway | Partial | Pass | Pass | Pass | Pass | 10,5 |
| Render | Partial | Pass | Pass | Pass | Pass | 10,5 |
| Fly.io | Partial | Pass | Pass | Partial | Pass | 9 |

- **Cloudflare:** Wrangler obsługuje deploy, rollback i logi; dokumentacja jest dostępna w Markdown, istnieją integracje agentowe. Free obejmuje 100 000 żądań dziennie i 10 ms CPU na wywołanie. Przy 10–100 tys. żądań miesięcznie koszt Workers może wynieść $0, jeśli nie zostaną przekroczone pozostałe limity, w tym dzienne i CPU; płatny plan startuje od $5/mies. [Cennik](https://developers.cloudflare.com/workers/platform/pricing/) · [Dokumentacja](https://developers.cloudflare.com/workers/llms.txt).
- **Vercel:** CLI, zarządzane funkcje, dokumentacja, API i oficjalny MCP spełniają kryteria. Hobby kosztuje $0 i obejmuje milion wywołań funkcji; 10–100 tys. żądań może się zmieścić, ale CPU, pamięć i transfer mają niezależne limity. Hobby ogranicza rollback do poprzedniego deployu i retencję logów do godziny. Potrzebny adapter `@astrojs/vercel`; należy sprawdzić warunki użycia Hobby i kod zależny od Workers. [Hobby](https://vercel.com/docs/plans/hobby) · [Adapter](https://docs.astro.build/en/guides/integrations-guide/vercel/) · [MCP](https://vercel.com/docs/agent-resources/vercel-mcp).
- **Netlify:** CLI i API wspierają deploy i publikację poprzedniej wersji; dostępne są dokumentacja i oficjalny MCP. Free to 300 kredytów/mies.; 10–100 tys. wszystkich żądań to 2–20 kredytów za same żądania, plus transfer, compute i deploye. Wyczerpanie limitu wstrzymuje projekty. Astro wymaga adaptera Netlify. Netlify Server ma status **Early Access** i obecnie nie obsługuje Astro; zwykłe Functions nie zapewniają trwałych procesów ani WebSocketów. [Cennik](https://www.netlify.com/pricing/) · [Kredyty](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work) · [Adapter](https://docs.astro.build/en/guides/integrations-guide/netlify/) · [Server](https://docs.netlify.com/build/server/) · [MCP](https://docs.netlify.com/build/build-with-ai/agent-setup-guides/agent-setup-overview/).
- **Railway:** zarządzane procesy Node, dokumentacja, API GraphQL i oficjalny MCP; CLI obsługuje deploy i logi, ale udokumentowany rollback jest przez UI/API, stąd częściowa ocena CLI. Wymaga `@astrojs/node` i migracji runtime. Hobby $5/mies. zawiera $5 zużycia; koszt zależy od czasu CPU, pamięci i transferu, nie liczby żądań. Przykładowo 1 GB RAM przez miesiąc to około $10 przed CPU i transferem; 10–100 tys. żądań nie wyznacza rachunku. [Cennik](https://railway.com/pricing) · [Astro](https://docs.railway.com/guides/astro) · [Rollback](https://docs.railway.com/deployments/reference) · [MCP](https://docs.railway.com/ai/mcp-server).
- **Render:** zarządzany serwis Node, deploy i rollback API, dokumentacja Markdown i MCP; CLI nie dokumentuje pełnej procedury rollbacku, stąd Partial. Wymaga adaptera Node. Free usypia usługę po 15 minutach bez ruchu, a wybudzenie może trwać około minuty; najtańsza płatna usługa web to $7/mies. plus ewentualne dodatki. 10–100 tys. żądań nie określa zużycia transferu ani czasu instancji. MCP do wyszukiwania dokumentacji jest **eksperymentalny**; podstawowa integracja agentowa jest oddzielna. [Free](https://render.com/docs/free) · [Cennik](https://render.com/pricing) · [Rollback](https://render.com/docs/rollbacks) · [Agenci](https://render.com/docs/llm-support).
- **Fly.io:** zarządzane maszyny, dokumentacja, CLI i integracja MCP; rollback wymaga osobnej procedury, a nie prostego odwrócenia `fly deploy`, więc CLI i API otrzymują Partial. Wymaga adaptera Node oraz kontenera. Nie ma ogólnego planu Free; jedna stale działająca maszyna 256 MB kosztuje od $2,19 za 30 dni w najtańszych regionach USA, przed transferem i innymi zasobami; nie wiadomo, czy wystarczy jej pamięci dla aplikacji. Lokalizacja wpływa na cenę. [Cennik](https://fly.io/docs/about/pricing) · [Astro](https://fly.io/docs/js/frameworks/astro) · [Rollback](https://fly.io/docs/blueprints/rollback-guide) · [MCP](https://docs.fly.io/model-context-protocol/flyctl-server).

Brak oznaczenia preview w powyższych źródłach nie jest dowodem gwarancji SLA ani statusu GA każdej integracji. Wszystkie statusy sprawdzono w dniu badania. Porównanie społecznościowe z perspektywą dostawcy: [Railway — benchmark SSR, 2025](https://blog.railway.com/p/server-rendering-benchmarks-railway-vs-cloudflare-vs-vercel); nie traktować go jako niezależnego pomiaru Obiadka.

### Shortlisted Platforms

1. **Cloudflare Workers — wybrana:** istniejący adapter i konfiguracja, znajomość użytkownika, niska bariera kosztowa. Ryzyko to granice `workerd`, CPU i izolacja preview.
2. **Vercel — druga opcja:** pełny zestaw narzędzi i Free dla małego ruchu; zmiana adaptera oraz ograniczenia Hobby, rollbacku i logów.
3. **Netlify — trzecia opcja:** dobry workflow i rollback; zmiana adaptera, kredytowy limit i brak trwałych procesów w obecnej ścieżce Astro.

## Anti-Bias Cross-Check: Cloudflare Workers

### Devil's Advocate — Weaknesses

1. Biblioteka zależna od nieobsługiwanego API Node może zbudować się w Node, lecz zawieść w `workerd` podczas SSR mimo `nodejs_compat`.
2. Free ogranicza CPU pojedynczego wywołania do 10 ms; złożone renderowanie może powodować błędy nawet przy małym miesięcznym ruchu.
3. Publiczny preview ze współdzielonym projektem Supabase może ujawnić lub zmodyfikować dane produkcyjne.
4. Rollback Workera nie cofa migracji ani danych Supabase; starszy kod może nie rozumieć nowego schematu.
5. Limity dzienne oraz osobne koszty Supabase, ewentualnych usług i obserwowalności oznaczają, że liczba żądań nie gwarantuje zerowego rachunku ani dostępności.

### Pre-Mortem — How This Could Fail

Sześć miesięcy po wdrożeniu dodano bibliotekę przetwarzającą przepisy. Build przebiega w Node, więc założono, że biblioteka działa także w produkcji. Przy pierwszym żądaniu SSR używa jednak API niedostępnego w `workerd`; część użytkowników widzi błąd. Jednocześnie podgląd nowej wersji korzysta z produkcyjnego Supabase, bo nie utworzono osobnych danych testowych. Test formularza nieświadomie zmienia dane rodziny. Próba rollbacku przywraca starszy Worker, ale nie cofa danych ani migracji schematu, więc stara wersja nadal nie potrafi odczytać nowych rekordów. Diagnozę utrudnia krótka retencja logów i brak monitorowania zużycia. Zespół wcześniej przyjął, że darmowy plan wystarczy, nie mierząc CPU na żądanie; cięższy przepis przekracza limit mimo niewielkiej liczby odwiedzin. Naprawa wymaga przywrócenia danych z dostępnej kopii, zgodnej migracji i zastąpienia biblioteki. Ten scenariusz nie jest stwierdzeniem, że projekt ma już takie błędy. Zapobiega mu testowanie rzeczywistej ścieżki SSR w `workerd`, izolacja Supabase dla preview, kontrola limitów oraz sprawdzona procedura odtwarzania danych.

### Unknown Unknowns

- Adapter **14.4.3** domyślnie prerenderuje w `workerd`. Opcja `prerenderEnvironment: 'node'` dotyczy wyłącznie prerenderingu; SSR nadal działa w `workerd`. `npm run dev` używa integracji Cloudflare/Vite; osobny `wrangler dev` nie jest wymagany do zwykłego developmentu. [Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) · [wersja 14.4.3](https://raw.githubusercontent.com/withastro/astro/%40astrojs%2Fcloudflare%4014.4.3/packages/integrations/cloudflare/README.md).
- Workers Previews wymagają Wrangler >= 4.135.0; repo ma 4.156.0. Sekrety i ustawienia preview są osobne, ale zasoby izoluje się przez osobne bindingi, a service bindings mogą wskazywać produkcję. [Previews](https://developers.cloudflare.com/workers/previews/).
- Rollback obejmuje do 100 ostatnio opublikowanych wersji, nie przywraca zasobów i może powodować brak pasujących zasobów statycznych w otwartych kartach. [Rollback](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/).
- Cloudflare zapowiada zmianę cennika Workers Logs od 1 grudnia 2026; sprawdzić koszt i retencję przed wdrożeniem. [Cennik](https://developers.cloudflare.com/workers/platform/pricing/).

## Operational Story

- **Preview deploys:** po skonfigurowaniu Workers Builds lub osobnego workflow buduj gałąź i publikuj `npx wrangler preview`; każda gałąź otrzymuje URL. To nie jest obecnie skonfigurowane w repo. URL jest publiczny domyślnie: użyj Cloudflare Access oraz oddzielnego projektu Supabase i sekretów. Nie zakładaj, że PR z forka otrzyma sekrety lub deploy — zależy to od uprawnień i konfiguracji integracji. [Previews](https://developers.cloudflare.com/workers/previews/).
- **Secrets:** lokalnie `.env` i `.dev.vars` poza repo; produkcyjnie `npx wrangler secret put SUPABASE_URL` i `npx wrangler secret put SUPABASE_KEY`. Dostęp administracyjny i tokeny ograniczyć do właściciela oraz niezbędnego CI; sekrety runtime nie są widoczne jako tekst po ustawieniu, ale kod Workera może ich użyć. Rotacja: utworzyć nowy klucz u dostawcy, podmienić sekret we właściwych środowiskach, sprawdzić logowanie, unieważnić stary. Nie wystawiać wartości w kodzie klienta. [Sekrety](https://developers.cloudflare.com/workers/configuration/secrets/).
- **Rollback:** `npx wrangler deployments list`, następnie `npx wrangler rollback <VERSION_ID>`; propagacja wymaga czasu, brak gwarantowanego czasu przywrócenia. To nie cofa bazy, migracji ani usuniętych zasobów; sprawdź zgodność schematu i assetów. [Rollback](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/).
- **Approval:** człowiek zatwierdza publikację produkcyjną, rotację głównego sekretu i destrukcyjne zmiany bazy. Agent może bez nadzoru czytać logi i tworzyć odizolowane preview tylko przy odpowiednich ograniczonych uprawnieniach. Automatyczny deploy po merge z handoffu wymaga uznania zatwierdzenia merge za zgodę na produkcję; obecne CI nie realizuje deployu.
- **Logs:** `npx wrangler tail obiadek` odczytuje logi runtime na żywo; logi buildów odczytać w GitHub Actions (`gh run list`, `gh run view <run-id> --log`) lub Workers Builds, zależnie od skonfigurowanego pipeline. Nie logować tokenów ani danych użytkowników. [Logi](https://developers.cloudflare.com/workers/observability/logs/real-time-logs/).

## Risk Register

| Ryzyko | Źródło | Prawdopodobieństwo | Wpływ | Mitygacja |
|---|---|---|---|---|
| Niezgodny pakiet Node w SSR | Devil's advocate / Pre-mortem | M | H | Sprawdzić zależności w `workerd` i wykonać produkcyjny smoke po zmianie pakietów. |
| Limit CPU lub dzienny limit Free | Devil's advocate / Pre-mortem | M | M | Mierzyć CPU i błędy, ustawić alerty; przed wzrostem potrzeb ocenić płatny plan. |
| Publiczny preview i produkcyjne dane | Devil's advocate / Unknown unknowns | M | H | Zabezpieczyć Access, utworzyć osobny projekt Supabase i sekrety preview; sprawdzić bindingi. |
| Nieodwrócona migracja lub utrata danych | Devil's advocate / Pre-mortem | M | H | Migracje kompatybilne wstecz, kopia oraz przećwiczone przywracanie niezależne od rollbacku Workera. |
| Niepasujące assety po rollbacku | Unknown unknowns | L | M | Testować rollback z otwartą kartą; zapewnić zgodność wersji assetów. |
| Niewystarczające logi lub zmiana cennika | Pre-mortem / Unknown unknowns | M | M | Monitorować błędy i sprawdzić retencję oraz cennik po 1 grudnia 2026. |
| Starsza procedura Pages nie pasuje do Workers | Research finding | M | M | Używać konfiguracji Workers i komend adaptera v14; nie mieszać workflow Pages. |
| Early Access Netlify Server nie wspiera Astro | Research finding | L | M | W razie zmiany dostawcy traktować Netlify Functions jako aktualną ścieżkę SSR, ponownie sprawdzić status. |

## Getting Started

1. Użyj Node w wersji z `.nvmrc` i `npm ci`; istniejące repo ma już adapter `@astrojs/cloudflare` 14.4.3, Wrangler 4.156.0 oraz `wrangler.jsonc`. Nie uruchamiaj ponownie inicjalizacji adaptera ani Pages.
2. Skonfiguruj lokalnie `.env` i `.dev.vars` zgodnie z README; uruchom `npm run dev` i sprawdź logowanie oraz chronioną stronę z dostępnym Supabase.
3. Zaloguj Wrangler do docelowego konta, zbuduj `npm run build` i po zatwierdzeniu opublikuj `npx wrangler deploy`. Komenda tworzy produkcyjne wdrożenie; przygotowanie preview i polityki dostępu wymaga osobnej konfiguracji.
4. Ustaw serwerowe `SUPABASE_URL` i `SUPABASE_KEY` przez `npx wrangler secret put <NAZWA>`, a następnie sprawdź działanie logowania na wdrożeniu. Wartości produkcyjne dostarczaj poza repo i nigdy do klienta.
5. Przed użyciem rzeczywistych danych skonfiguruj oddzielny Supabase i Access dla preview, zweryfikuj logi i przećwicz rollback oraz procedurę odtwarzania danych.

Polecenia deploy i adapter sprawdzono względem [przewodnika Astro dla Workers](https://docs.astro.build/en/guides/deploy/cloudflare/) i konfiguracji repozytorium; lokalny development działa przez integrację adaptera, a `wrangler dev` po buildzie jest dodatkowym sposobem podglądu artefaktu, nie wymogiem zwykłej pracy.

## Out of Scope

- Konfiguracja obrazów Docker.
- Implementacja pipeline CI/CD.
- Architektura produkcyjna w dużej skali, w tym multi-region, HA i disaster recovery.
