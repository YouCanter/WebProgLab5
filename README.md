# Керування користувачами — клієнт-серверний застосунок

Практичні роботи 04 («Архітектура та модульна організація»), 05 («Розширення архітектури станом застосунку» «Централізоване керування станом бекенду» — Redux Toolkit).

## Структура

- [server/](server) — Node.js + Express + Prisma + PostgreSQL (Пр.04, переиспользуется усіма клієнтами)
- [client/](client) — React + Vite (Пр.04 + Пр.05: useReducer + Context, демо за `/users-demo`)
- [client-redux/](client-redux) — React + Vite + **Redux Toolkit** 

Усі три можна запускати одночасно: backend на :4000, client на :5173, client-redux на :5174 — обидва клієнти проксують `/api` на той самий backend.

Реалізовано повноцінний клієнт-серверний застосунок для керування записами користувачів із підрозділами та службовими записами. Реалізація виконана відповідно до C4-діаграм (контейнерна, дві компонентні та діаграма послідовності) і повторює описаний в них поділ на шари.

## Стек

- **Сервер:** Node.js 20, Express 4, TypeScript, Prisma 5, Zod, PostgreSQL 16.
- **Клієнт:** React 18, TypeScript, Vite 5, React Router 6.
- **Інфраструктура:** Docker Compose (PostgreSQL).

## Структура репозиторію

```
curs/
  docker-compose.yml          # PostgreSQL 16
  server/                     # Node.js + Express + Prisma (REST API)
  client/                     # React + Vite (вебінтерфейс)
  README.md
```

## Швидкий старт

### 1. Підняти базу даних

```bash
docker compose up -d
```

PostgreSQL буде доступний на `localhost:5432`, БД `usersdb`, користувач `postgres / postgres`.

### 2. Запустити сервер

```bash
cd server
cp .env.example .env        # за потреби
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

API стартує на `http://localhost:4000/api`. Перевірка: `GET http://localhost:4000/api/health`.

### 3. Запустити клієнт

```bash
cd client
npm install
npm run dev
```

Інтерфейс відкриється на `http://localhost:5173`. Запити `/api/*` проксуються на сервер через Vite proxy.

## REST API

Усі списки повертають уніфіковану обгортку:

```json
{ "data": [...], "meta": { "page": 1, "pageSize": 10, "total": 42, "totalPages": 5 } }
```

Усі помилки нормалізовані до:

```json
{ "error": { "code": "VALIDATION_ERROR | NOT_FOUND | CONFLICT | BAD_REQUEST | INTERNAL", "message": "...", "details": {} } }
```

| Метод   | Шлях                               | Опис                                                       |
| ------- | ---------------------------------- | ---------------------------------------------------------- |
| GET     | `/api/health`                      | Перевірка живості                                          |
| GET     | `/api/users`                       | Список (пошук, сорт., пагінація, фільтри: department, active) |
| GET     | `/api/users/:id`                   | Один користувач                                            |
| POST    | `/api/users`                       | Створити                                                   |
| PATCH   | `/api/users/:id`                   | Оновити (часткове)                                         |
| DELETE  | `/api/users/:id`                   | Видалити                                                   |
| GET/POST/PATCH/DELETE | `/api/departments[/:id]` | Підрозділи (повний CRUD)                                   |
| GET/POST/PATCH/DELETE | `/api/service-records[/:id]` | Службові записи з фільтрами `userId`, `type`         |

Параметри списку користувачів: `search`, `departmentId`, `isActive`, `sort` (`id|fullName|email|position|createdAt`), `order` (`asc|desc`), `page`, `pageSize`.

## Архітектура

### Сервер (`server/src/`) — відповідає C4 «Серверний застосунок»

```
src/
  config/        env.ts, prisma.ts            # конфіг + PrismaClient
  routes/        *.routes.ts                  # «REST-маршрути»
  controllers/   *.controller.ts              # «Контролери»
  schemas/       *.schema.ts                  # «Схеми валідації DTO» (Zod)
  services/      *.service.ts                 # «Сервісний шар» — прикладна логіка + Prisma
  middleware/    validate.ts, errorHandler.ts # валідація + «Централізований обробник помилок»
  errors/        AppError.ts                  # доменні помилки
  utils/         asyncHandler.ts, buildListQuery.ts
  app.ts, server.ts
prisma/          schema.prisma, seed.ts       # «Міграції та початкове наповнення»
```

Запит проходить шлях: `route → validate (Zod) → controller → service → Prisma → PostgreSQL`. Винятки на будь-якому рівні перехоплює `errorHandler`, який нормалізує їх (включно з `ZodError`, `Prisma.PrismaClientKnownRequestError` P2002/P2025/P2003) до спільного формату.

### Клієнт (`client/src/`) — відповідає C4 «Клієнтський вебзастосунок»

```
src/
  app/          AppLayout.tsx, router.tsx
  pages/        users/, departments/, serviceRecords/   # «Сторінки» (сценарії)
  components/   DataTable, Pagination, SearchInput, Modal,
                ConfirmDialog, Button, FormField, Toaster, ErrorMessage   # «UI-компоненти»
  services/     usersService, departmentsService, serviceRecordsService   # модулі прикладної координації
  api/          httpClient.ts, errorAdapter.ts,                            # «API-клієнт» + «Адаптер помилок»
                usersApi.ts, departmentsApi.ts, serviceRecordsApi.ts
  types/        api.ts, user.ts, department.ts, serviceRecord.ts          # «Типи даних і DTO»
  utils/        buildQueryString.ts, formatDate.ts                        # «Утиліти»
  hooks/        useDebouncedValue, usePaginatedList, useToast
  index.css, main.tsx, vite-env.d.ts
```

#### Правила залежностей між шарами (без циклів)

```
pages    → services, components, hooks, utils, types
services → api, types
api      → httpClient, errorAdapter, types, utils
components → types, utils, hooks            (НЕ імпортують api/services/pages)
hooks    → api (лише типи), utils, types
```

Усі імпорти односпрямовані; `pages` ніколи не імпортується ніким, `api` ніколи не імпортує `services`/`pages`. Це гарантує відсутність циклічних імпортів і відповідає вимозі ТЗ.

### Сценарій «Завантаження списку користувачів»

Точно повторює sequence-діаграму з ТЗ:

```
UsersListPage  →  usersService.loadUsers(query)
              →  usersApi.getUsers(query)
              →  httpClient.get("/users?...")
              →  GET /api/users → users.routes → validate(Zod)
              →  users.controller → users.service → Prisma → PostgreSQL (SELECT ...)
              ←  JSON { data, meta }
              ←  через httpClient (нормалізація помилок через errorAdapter)
              ←  таблиця рендериться у DataTable
```

## Скрипти

### Server (`server/package.json`)

| Скрипт                | Дія                                            |
| --------------------- | ---------------------------------------------- |
| `npm run dev`         | Запуск у режимі watch (`tsx watch`)            |
| `npm run build`       | Компіляція TypeScript у `dist/`                |
| `npm run start`       | Продакшн-запуск з `dist/`                      |
| `npx prisma migrate dev` | Створити та застосувати міграцію            |
| `npm run prisma:generate`| Згенерувати Prisma Client                   |
| `npm run prisma:reset`| Скинути БД і застосувати міграції заново        |
| `npm run seed`        | Заповнити БД тестовими даними                  |

### Client (`client/package.json`)

| Скрипт              | Дія                                          |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Запустити Vite dev-сервер на `localhost:5173`|
| `npm run build`     | Збірка для продакшену                         |
| `npm run preview`   | Локальний попередній перегляд продакшн-збірки |
| `npm run typecheck` | Перевірка типів без компіляції                |


## Практична робота 05 — Централізований стан клієнта

У межах Пр05 додано окремий **рівень керування станом** користувачів, що відповідає рекомендованій архітектурі.

### Структура нових модулів

```
client/src/
  state/users/
    types.ts              # UsersState ({ data, ui, status }), UsersAction, initialUsersState
    reducer.ts            # usersReducer — чиста функція без побічних ефектів
    UsersContext.tsx      # split-context (state | dispatch | reload) + UsersProvider з useEffect-синхронізацією
    useUsers.ts           # координаційний hook: state + setSearch/setPage/selectUser/createUser/updateUser/deleteUser
  pages/usersDemo/
    UsersDemoPage.tsx     # composition root, обгортає в <UsersProvider>
    components/
      StatusCard.tsx      # «Стан запиту» — IDLE / LOADING / SUCCESS / ERROR
      FilterPanel.tsx     # пошук + «Скинути вибір»
      UserList.tsx        # список UserCard, статус-бейдж, помилка
      UserCard.tsx        # окрема картка (Редагувати / Видалити)
      UserForm.tsx        # форма створення/редагування (реагує на selectedUser)
      DemoPagination.tsx  # «Усього записів: N. Сторінка X із Y»
```

### Модель стану

```ts
interface UsersState {
  data: { users: User[]; selectedUser: User | null; meta: UsersMeta | null };
  ui:   { search: string; page: number; pageSize: number };
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}
```

### Перелік дій (actions)

| Action | Опис |
| ------ | ---- |
| `LOAD_START` | Розпочато запит до API → `status: "loading"` |
| `LOAD_SUCCESS` | Дані отримано → `status: "success"`, оновлення `data.users` і `data.meta` |
| `LOAD_ERROR` | Помилка → `status: "error"`, `error: message` |
| `SELECT_USER` | Вибір користувача для редагування / скидання вибору |
| `SET_SEARCH` | Зміна тексту пошуку (скидає `ui.page` у 1) |
| `SET_PAGE` | Перехід на іншу сторінку пагінації |
| `USER_CREATED` / `USER_UPDATED` / `USER_DELETED` | Локальне оновлення списку після CRUD |

### Потік даних

```
Користувач  ─►  UI-компоненти  ─►  useUsers (координація)
                       ▲                  │
                       │                  ▼
                 (новий стан)     UsersContext + usersReducer
                       ▲                  │
                       │                  ▼
                       └────────  usersApi  ◄──►  REST API сервер
```

- Усі компоненти отримують дані виключно з `useUsers()` (жодного prop drilling).
- `UsersProvider` через `useEffect` синхронізує стан з API при зміні `ui.search` або `ui.page` (із debounce 300мс), а також при інкременті внутрішнього `reloadToken` після CRUD-операцій.
- `usersReducer` — чиста функція без побічних ефектів; усі переходи описані явно через `switch` по `action.type`.
- Контексти розділено на три (`state`, `dispatch`, `reload`), щоб компоненти, яким потрібен лише `dispatch`/`reload`, не перерендерювалися на зміни даних.

## Практична робота 05 Частина 2 — Redux Toolkit (окремий клієнт)

Реалізовано в [client-redux/](client-redux) — повністю окремий проєкт із власним `package.json` і портом 5174. Backend і `client/` не змінено.

- `configureStore` + два slice (`usersSlice` + `uiSlice`)
- 5 async thunks (`fetchUsers`, `fetchUserById`, `createUser`, `updateUser`, `deleteUser`)
- Окремий API-модуль (`api/httpClient.ts`, `api/usersApi.ts`)
- Типізовані `useAppSelector` / `useAppDispatch`
- Персистентність UI-параметрів (search, page, sort, order, selectedUserId) у `localStorage`
- Інвалідація списку після CRUD через лічильник `dataVersion`
- Індикація `loading` / `success` / `error` через `StatusCard`, `ErrorMessage` і disabled-кнопки

Запуск:
```bash
cd client-redux
npm install
npm run dev   # http://localhost:5174
```

Деталі архітектури — у [client-redux/README.md](client-redux/README.md).
### Відповідність вимогам ТЗ 

- Стан як **окремий артефакт** — директорія `state/users/`.
- Структура `{ data, ui, status }` — відображено в `UsersState`.
- `useReducer` з **чистою функцією редуктора** і явним переліком actions.
- `useContext` для розповсюдження стану без prop drilling (split-pattern).
- `useEffect` для синхронізації з API; debounce пошуку і автоматичний refetch після CRUD.
- Власний хук `useUsers` як єдина точка доступу для UI.
- Loading / error indication — `StatusCard` + інлайн-баннер у `UserList`.
- Без циклічних залежностей: потік `api → state → coordination → presentation` односторонній.

## Як це відповідає ТЗ

- **Чіткий поділ data / logic / UI:** `components/` (UI), `services/` + `hooks/` (логіка), `api/` + `types/` (дані).
- **Сторінки координують сценарії; модулі логіки готують параметри і викликають API; модулі доступу до даних інкапсулюють HTTP.**
- **REST API із пошуком, сортуванням, пагінацією** для всіх трьох сутностей.
- **Сервер на Node.js / Express / Prisma / PostgreSQL** з шарами маршрутів, контролерів, сервісів і конфігом БД.
- **Клієнт на React + Vite + ES-модулях** із передбачуваною структурою залежностей і без циклічних імпортів.
- **Уніфіковані формати відповідей і помилок** для зручного клієнтського адаптера.
