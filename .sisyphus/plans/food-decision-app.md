# 음식 결정장애 해결 웹 앱 ("Damnshoot")

## TL;DR

> **Quick Summary**: 사용자가 입력한 음식 목록에서 다양한 방식(랜덤, 스핀휠, 주사위, 조건 필터링, 제비뽑기, 다트 맞추기)으로 결정을 도와주는 웹 앱. Supabase 기반 인증 + 데이터 저장 + Anonymous 실시간 현황 제공
> 
> **Deliverables**:
> - 사용자 인증 (Supabase Auth)
> - 음식 CRUD (생성, 조회, 수정, 삭제)
> - 다양한 결정 알고리즘 (랜덤/스핀휠/주사위/조건 필터링)
> - 즐겨찾기 & 히스토리
> - Anonymous 실시간 현황 ("지금 N명이 이 음식 먹고 있음")
> - 주간 통계 ("이번주 가장 선호된 음식 Top 10")
> 
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Supabase 설정 → Auth → Food CRUD → Decision Engines → Real-time → Analytics

---

## Context

### Original Request
사용자가 음식 목록을 직접 입력하고, 다양한 방식으로 결정장애를 해결할 수 있는 웹 앱. 추후 다른カテゴリー(영화, 여행 등)로 확장 가능

### Interview Summary
**Key Discussions**:
1. **결정 방식**: 모두 포함 (복합) - 랜덤, 조건 기반, 스핀휠, 주사위
2. **데이터 소스**: 외부 API 없이 사용자가 직접 입력하는 음식만
3. **프로젝트 규모**: 본격적 - Supabase Auth, 히스토리, 통계
4. **음식 카테고리**: 전체 - 한식, 중식, 일식, 양식, 패스트푸드, 디저트
5. **인증**: Supabase Auth (Email + Social)
6. **주요 기능**:
   - 즐겨찾기
   - 지금 다른 사람들을 이런걸 먹고 있다 (실시간 현황 - Anonymous)
   - 이번주 최고 선호된 음식 통계 (analytics)
7. **UI 스타일**: Minimal Modern (나중에 Stitch AI로 확장)
8. **테스트**: 구현 후 (基础设施 설정 후)

### Technical Stack
- **Frontend**: Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript
- **Backend/Auth/DB**: Supabase (신규 프로젝트 생성 필요)
- **Testing**: 나중에 설정

---

## Work Objectives

### Core Objective
음식 결정장애를 겪는 사용자들이 입력한 음식 목록에서 다양한 알고리즘으로 빠르게 결정을 내릴 수 있게 도와주는 앱

### Concrete Deliverables

#### Phase 1: Foundation
- [ ] Supabase 프로젝트 생성 및 설정
- [ ] Supabase Auth 연동 (Email + Social Providers)
- [ ] Database Schema 설계 및 마이그레이션

#### Phase 2: Food Management
- [ ] 음식 CRUD API + UI
- [ ] 카테고리 관리 (한식/중식/일식/양식/패스트푸드/디저트)
- [ ] 음식 리스트 관리 (그룹화)

#### Phase 3: Decision Engines
- [ ] Random Picker (단일 랜덤 선택)
- [ ] Spin Wheel (스핀휠 인터랙티브)
- [ ] Dice Roll (주사위)
- [ ] Condition Filter (조건 기반 필터링)

#### Phase 4: User Features
- [ ] 즐겨찾기
- [ ] 선택 히스토리
- [ ] 사용자별 통계 대시보드

#### Phase 5: Real-time & Analytics
- [ ] Anonymous 실시간 현황 (Supabase Realtime)
- [ ] 주간 통계 (이번주 가장 선호된 음식)
- [ ] 전체 사용자 집계 통계

### Definition of Done
- [ ] 사용자가 음식 추가/수정/삭제 가능
- [ ] 4가지 결정 방식으로 음식 선택 가능
- [ ] 로그인 사용자의 히스토리 저장
- [ ] 비로그인 사용자도 실시간 현황 조회 가능
- [ ] 주간 Top 10 통계 표시

### Must Have
- Supabase Auth (Email + Google OAuth)
- Anonymous 실시간 현황 (로그인 불필요)
- 4가지 결정 알고리즘
- 음식 CRUD + 카테고리
- 즐겨찾기 + 히스토리

### Must NOT Have (Guardrails)
- 외부 Food API 연동 (배달앱 등)
- 결제 기능
- 푸시 알림
- 모바일 푸시

---

## Verification Strategy

> **이 프로젝트는 기획 단계입니다. 구현은 안티그래비티에서 수행합니다.**

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: 구현 후 설정
- **Framework**: TBD (bun test / vitest / pytest)

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation):
├── Task 1: Supabase 프로젝트 생성 + 설정
├── Task 2: Supabase Auth 구현 (Email + Google OAuth)
├── Task 3: Database Schema 설계
├── Task 4: Supabase Client 설정 (lib/supabase.ts)
└── Task 5: 프로젝트 구조 설계 (app directory)

Wave 2 (Food CRUD - MAX PARALLEL):
├── Task 6: Food Model + Type Definitions
├── Task 7: Food Create API + UI
├── Task 8: Food Read/List API + UI
├── Task 9: Food Update API + UI
├── Task 10: Food Delete API + UI
├── Task 11: Category Management
└── Task 12: Food List Management (그룹화)

Wave 3 (Decision Engines):
├── Task 13: Random Picker Component + Logic
├── Task 14: Spin Wheel Component + Logic
├── Task 15: Dice Roll Component + Logic
├── Task 16: Condition Filter Component + Logic
└── Task 17: Decision Result Display

Wave 4 (User Features + Real-time):
├── Task 18: Favorites CRUD
├── Task 19: History CRUD
├── Task 20: Anonymous Real-time Status (Supabase Realtime)
├── Task 21: Weekly Analytics Dashboard
├── Task 22: User Statistics Page
└── Task 23: Global Statistics Page
```

### Dependencies

- **1**: — — 2, 3, 4, 5
- **2**: 1 — 6, 7, 8, 9, 10, 11, 12
- **3**: 1 — 6, 7, 8, 9, 10, 11, 12
- **4**: 1 — 13, 14, 15, 16, 17
- **5**: 1 — 13, 14, 15, 16, 17
- **6-12**: 2, 3, 4 — 13-17, 18, 19
- **13-17**: 6-12 — 18, 19, 20
- **18-19**: 13-17 — 20, 21, 22, 23

---

## TODOs

### Wave 1: Foundation

- [ ] 1. **Supabase 프로젝트 생성 + 설정**

  **What to do**:
  - Supabase Dashboard에서 새 프로젝트 생성
  - 프로젝트 URL + Anon Key 저장
  - .env.local 설정

  **Recommended Agent Profile**:
  > **Category**: `quick`
  > **Skills**: []

- [ ] 2. **Supabase Auth 구현 (Email + Google OAuth)**

  **What to do**:
  - Supabase Auth 설정 (Email + Google Provider 활성화)
  - Middleware로 Route Protection
  - Login/Register UI 페이지

  **Recommended Agent Profile**:
  > **Category**: `unspecified-high`
  > **Skills**: []

- [ ] 3. **Database Schema 설계**

  **What to do**:
  ```sql
  -- foods table
  create table foods (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    name text not null,
    category text check (category in ('korean', 'chinese', 'japanese', 'western', 'fastfood', 'dessert')),
    description text,
    is_favorite boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );

  -- food_lists table (그룹화)
  create table food_lists (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    name text not null,
    created_at timestamptz default now()
  );

  -- food_list_items table
  create table food_list_items (
    id uuid default gen_random_uuid() primary key,
    list_id uuid references food_lists on delete cascade,
    food_id uuid references foods on delete cascade
  );

  -- selection_history table
  create table selection_history (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users,
    food_id uuid references foods,
    selection_method text check (selection_method in ('random', 'spinwheel', 'dice', 'filter')),
    selected_at timestamptz default now()
  );

  -- anonymous_status table (실시간 현황용 -Anonymous)
  create table anonymous_status (
    id uuid default gen_random_uuid() primary key,
    food_name text not null,
    viewer_count integer default 1,
    created_at timestamptz default now(),
    expires_at timestamptz default (now() + interval '5 minutes')
  );
  ```

  **Recommended Agent Profile**:
  > **Category**: `quick`
  > **Skills**: []

- [ ] 4. **Supabase Client 설정**

  **What to do**:
  - `lib/supabase/client.ts` 생성
  - Server Component용 `lib/supabase/server.ts` 생성
  - Type definitions

  **Recommended Agent Profile**:
  > **Category**: `quick`
  > **Skills**: []

- [ ] 5. **프로젝트 구조 설계**

  **What to do**:
  ```
  app/
  ├── (auth)/
  │   ├── login/
  │   └── register/
  ├── (app)/
  │   ├── page.tsx (대시보드/홈)
  │   ├── foods/
  │   ├── decisions/
  │   ├── favorites/
  │   ├── history/
  │   └── stats/
  ├── api/
  │   └── foods/
  └── layout.tsx
  ```

  **Recommended Agent Profile**:
  > **Category**: `quick`
  > **Skills**: []

### Wave 2: Food CRUD

- [ ] 6. **Food Model + Type Definitions**

  **What to do**:
  - TypeScript interfaces (Food, FoodList, SelectionHistory, AnonymousStatus)
  - Zod validation schemas

  **Recommended Agent Profile**:
  > **Category**: `quick`
  > **Skills**: []

- [ ] 7. **Food Create API + UI**

  **What to do**:
  - POST /api/foods
  - "음식 추가" 폼 UI (이름, 카테고리, 설명)
  - React Hook Form + Zod

  **Recommended Agent Profile**:
  > **Category**: `unspecified-high`
  > **Skills**: []

- [ ] 8. **Food Read/List API + UI**

  **What to do**:
  - GET /api/foods
  - 음식 목록 페이지 (카테고리 필터, 검색)
  - 카드 그리드 레이아웃

  **Recommended Agent Profile**:
  > **Category**: `unspecified-high`
  > **Skills**: []

- [ ] 9. **Food Update API + UI**

  **What to do**:
  - PATCH /api/foods/[id]
  - 편집 모달/페이지
  - Optimistic UI update

  **Recommended Agent Profile**:
  > **Category**: `quick`
  > **Skills**: []

- [ ] 10. **Food Delete API + UI**

  **What to do**:
  - DELETE /api/foods/[id]
  - 삭제 확인 모달
  - Soft delete vs Hard delete 결정

  **Recommended Agent Profile**:
  > **Category**: `quick`
  > **Skills**: []

- [ ] 11. **Category Management**

  **What to do**:
  - 카테고리별 필터 UI
  - 카테고리 아이콘/색상 매핑
  - 카테고리 통계

  **Recommended Agent Profile**:
  > **Category**: `quick`
  > **Skills**: []

- [ ] 12. **Food List Management (그룹화)**

  **What to do**:
  - 리스트 CRUD
  - 음식 ↔ 리스트 연결
  - 리스트 선택 후 결정하기

  **Recommended Agent Profile**:
  > **Category**: `unspecified-high`
  > **Skills**: []

### Wave 3: Decision Engines

- [ ] 13. **Random Picker Component + Logic**

  **What to do**:
  - 버튼 클릭 → 목록에서 1개 랜덤 선택
  - 애니메이션 (흔들림, 스핀)
  - 결과 표시 모달

  **Recommended Agent Profile**:
  > **Category**: `visual-engineering`
  > **Skills**: []

- [ ] 14. **Spin Wheel Component + Logic**

  **What to do**:
  - Canvas/SVG 기반 스핀휠
  - 드래그 또는 버튼으로 회전
  - 포인터 지점에서 결과 결정
  - 효과음 (선택사항)

  **Recommended Agent Profile**:
  > **Category**: `visual-engineering`
  > **Skills**: []

- [ ] 15. **Dice Roll Component + Logic**

  **What to do**:
  - 3D 애니메이션 주사위
  - 버튼 클릭 → 굴러감 → 결과
  - 1-6 범위内的 결과 선택

  **Recommended Agent Profile**:
  > **Category**: `visual-engineering`
  > **Skills**: []

- [ ] 16. **Condition Filter Component + Logic**

  **What to do**:
  - 필터 조건 UI (카테고리, 키워드)
  - 필터 적용 후 결과 목록
  - "여기서 골라" 버튼

  **Recommended Agent Profile**:
  > **Category**: `unspecified-high`
  > **Skills**: []

- [ ] 17. **Decision Result Display**

  **What to do**:
  - 결과 표시 컴포넌트 (카드, 모달)
  - "다시 하기" 버튼
  - "이 음식으로 결정!" → 히스토리에 저장

  **Recommended Agent Profile**:
  > **Category**: `visual-engineering`
  > **Skills**: []

### Wave 4: User Features + Real-time

- [ ] 18. **Favorites CRUD**

  **What to do**:
  - 음식에 ★ 버튼 (즐겨찾기 토글)
  - 즐겨찾기 목록 페이지
  - Supabase RLS 정책

  **Recommended Agent Profile**:
  > **Category**: `unspecified-high`
  > **Skills**: []

- [ ] 19. **History CRUD**

  **What to do**:
  - 선택 완료 → 히스토리에 자동 저장
  - 히스토리 목록 (날짜별 그룹화)
  - 다시 선택하기

  **Recommended Agent Profile**:
  > **Category**: `unspecified-high`
  > **Skills**: []

- [ ] 20. **Anonymous Real-time Status (Supabase Realtime)**

  **What to do**:
  - Anonymous 상태 테이블 구독
  - "지금 N명이 [음식명] 먹고 있음" 표시
  - 5분 후 자동 만료
  - 로그인 불필요 (쿠키/IP 기반)

  **Recommended Agent Profile**:
  > **Category**: `unspecified-high`
  > **Skills**: []

- [ ] 21. **Weekly Analytics Dashboard**

  **What to do**:
  - 이번주 선택된 음식 Top 10
  - 차트/그래프 시각화
  - 카테고리별 분포

  **Recommended Agent Profile**:
  > **Category**: `unspecified-high`
  > **Skills**: []

- [ ] 22. **User Statistics Page**

  **What to do**:
  - 내 선택 히스토리 분석
  - 가장 많이 선택한 음식
  - 카테고리 선호도

  **Recommended Agent Profile**:
  > **Category**: `unspecified-high`
  > **Skills**: []

- [ ] 23. **Global Statistics Page**

  **What to do**:
  - 전체 사용자 통계
  - 실시간 업데이트
  - 인기도티 (선택 횟수 기반)

  **Recommended Agent Profile**:
  > **Category**: `unspecified-high`
  > **Skills**: []

---

## Database Schema (Detailed)

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users (Supabase Auth 연동)
-- auth.users 테이블은 Supabase가 관리

-- Foods table
create table public.foods (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  category text check (category in ('korean', 'chinese', 'japanese', 'western', 'fastfood', 'dessert')) not null,
  description text,
  is_favorite boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Food Lists (그룹화)
create table public.food_lists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamptz default now()
);

-- Food List Items
create table public.food_list_items (
  id uuid default gen_random_uuid() primary key,
  list_id uuid references public.food_lists on delete cascade,
  food_id uuid references public.foods on delete cascade,
  created_at timestamptz default now(),
  unique(list_id, food_id)
);

-- Selection History
create table public.selection_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users, -- Anonymous는 NULL
  food_id uuid references public.foods,
  selection_method text check (selection_method in ('random', 'spinwheel', 'dice', 'filter')) not null,
  selected_at timestamptz default now()
);

-- Anonymous Status (실시간 현황)
create table public.anonymous_status (
  id uuid default gen_random_uuid() primary key,
  food_name text not null,
  viewer_count integer default 1,
  session_id text not null, -- Anonymous 세션 ID
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '5 minutes')
);

-- RLS Policies
alter table public.foods enable row level security;
create policy "Users can manage own foods" on public.foods
  for all using (auth.uid() = user_id);

-- Indexes
create index idx_foods_user_id on public.foods(user_id);
create index idx_foods_category on public.foods(category);
create index idx_selection_history_food_id on public.selection_history(food_id);
create index idx_selection_history_selected_at on public.selection_history(selected_at);
create index idx_anonymous_status_expires_at on public.anonymous_status(expires_at);
```

---

## API Endpoints

### Foods
- `POST /api/foods` - 음식 추가
- `GET /api/foods` - 음식 목록 (필터링 가능)
- `GET /api/foods/[id]` - 음식 상세
- `PATCH /api/foods/[id]` - 음식 수정
- `DELETE /api/foods/[id]` - 음식 삭제
- `POST /api/foods/[id]/favorite` - 즐겨찾기 토글

### Food Lists
- `POST /api/lists` - 리스트 생성
- `GET /api/lists` - 내 리스트 목록
- `PATCH /api/lists/[id]` - 리스트 수정
- `DELETE /api/lists/[id]` - 리스트 삭제
- `POST /api/lists/[id]/items` - 음식 추가
- `DELETE /api/lists/[id]/items/[foodId]` - 음식 제거

### History
- `GET /api/history` - 내 선택 히스토리
- `POST /api/history` - 선택 기록 (자동)

### Stats
- `GET /api/stats/weekly` - 주간 통계
- `GET /api/stats/global` - 전체 통계
- `GET /api/stats/user` - 내 통계

### Real-time
- `GET /api/realtime/status` - 현재 실시간 현황
- `POST /api/realtime/view` - 조회 알림 (Anonymous)
- `GET /api/realtime/subscribe` - Realtime 구독

---

## UI Pages Structure

```
/                           # 랜딩 + 주요 결정 도구
/login                      # 로그인
/register                   # 회원가입

/foods                      # 내 음식 관리
  /new                      # 음식 추가
  /[id]/edit                # 음식 편집

/lists                      # 음식 리스트 관리
  /new                      # 새 리스트
  /[id]                     # 리스트 상세 + 결정

/decisions                  # 결정 도구 모음
  /random                   # Random Picker
  /spinwheel                # Spin Wheel
  /dice                     # Dice Roll
  /filter                   # Condition Filter

/favorites                  # 즐겨찾기

/history                    # 선택 히스토리

/stats                     # 통계
  /weekly                   # 주간 통계
  /global                   # 전체 통계
```

---

## Component Library

### Core Components
- Button, Input, Select, Card, Modal, Toast
- Loading Spinner, Skeleton
- Error Boundary

### Feature Components
- FoodCard, FoodForm, FoodList
- CategoryBadge, CategoryFilter
- FavoriteButton
- DecisionCard, DecisionModal
- SpinWheel, Dice3D
- StatCard, Chart

### Layout Components
- Header, Sidebar, Footer
- AppLayout, AuthLayout

---

## Dependencies (package.json 추가)

```json
{
  "@supabase/supabase-js": "^2",
  "@supabase/ssr": "^0.5",
  "zod": "^3",
  "react-hook-form": "^7",
  "@hookform/resolvers": "^3",
  "clsx": "^2",
  "tailwind-merge": "^2",
  "lucide-react": "^0.400",
  "framer-motion": "^11",
  "recharts": "^2",
  "@supabase/realtime-js": "^2"
}
```

---

## Success Criteria

### Phase 1
- [ ] Supabase 프로젝트 정상 작동
- [ ] 사용자 注册/로그인 가능
- [ ] DB 테이블 생성 완료

### Phase 2
- [ ] 음식 추가/조회/수정/삭제 가능
- [ ] 카테고리별 필터링 가능
- [ ] 음식 리스트 그룹화 가능

### Phase 3
- [ ] Random Picker로 랜덤 선택 가능
- [ ] Spin Wheel으로 인터랙티브 선택 가능
- [ ] Dice Roll으로 랜덤 선택 가능
- [ ] Condition Filter로 필터링 후 선택 가능

### Phase 4
- [ ] 즐겨찾기 추가/제거 가능
- [ ] 선택 히스토리 저장/조회 가능
- [ ] Anonymous 실시간 현황 표시
- [ ] 주간/전체 통계 확인 가능
