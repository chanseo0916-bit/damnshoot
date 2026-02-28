-- ============================================================
-- Damnshoot - Database Schema
-- Supabase SQL Editor에서 실행하세요
-- ============================================================
-- Enable UUID extension
create extension if not exists "uuid-ossp";
-- ============================================================
-- 1. Foods (음식)
-- ============================================================
create table public.foods (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete cascade not null,
    name text not null,
    category text check (
        category in (
            'korean',
            'chinese',
            'japanese',
            'western',
            'fastfood',
            'dessert'
        )
    ) not null,
    description text,
    image_url text,
    is_favorite boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
-- ============================================================
-- 2. Food Lists (음식 그룹)
-- ============================================================
create table public.food_lists (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete cascade not null,
    name text not null,
    created_at timestamptz default now()
);
-- ============================================================
-- 3. Food List Items (그룹 ↔ 음식 연결)
-- ============================================================
create table public.food_list_items (
    id uuid default gen_random_uuid() primary key,
    list_id uuid references public.food_lists on delete cascade not null,
    food_id uuid references public.foods on delete cascade not null,
    created_at timestamptz default now(),
    unique(list_id, food_id)
);
-- ============================================================
-- 4. Selection History (선택 히스토리)
-- ============================================================
create table public.selection_history (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete
    set null,
        food_id uuid references public.foods on delete
    set null,
        food_name text not null,
        selection_method text check (
            selection_method in (
                'random',
                'spinwheel',
                'dice',
                'filter',
                'lottery',
                'balance'
            )
        ) not null,
        selected_at timestamptz default now()
);
-- ============================================================
-- 5. Balance Games (밸런스게임 — 비로그인 가능)
-- ============================================================
create table public.balance_games (
    id uuid default gen_random_uuid() primary key,
    food_a text not null,
    food_b text not null,
    selected text not null,
    session_id text,
    user_id uuid references auth.users on delete
    set null,
        created_at timestamptz default now()
);
-- ============================================================
-- 6. Anonymous Status (실시간 현황)
-- ============================================================
create table public.anonymous_status (
    id uuid default gen_random_uuid() primary key,
    food_name text not null,
    session_id text not null,
    created_at timestamptz default now(),
    expires_at timestamptz default (now() + interval '5 minutes')
);
-- ============================================================
-- RLS (Row Level Security) 정책
-- ============================================================
-- Foods: 본인 것만 CRUD
alter table public.foods enable row level security;
create policy "Users can view own foods" on public.foods for
select using (auth.uid() = user_id);
create policy "Users can insert own foods" on public.foods for
insert with check (auth.uid() = user_id);
create policy "Users can update own foods" on public.foods for
update using (auth.uid() = user_id);
create policy "Users can delete own foods" on public.foods for delete using (auth.uid() = user_id);
-- Food Lists: 본인 것만 CRUD
alter table public.food_lists enable row level security;
create policy "Users can view own lists" on public.food_lists for
select using (auth.uid() = user_id);
create policy "Users can insert own lists" on public.food_lists for
insert with check (auth.uid() = user_id);
create policy "Users can update own lists" on public.food_lists for
update using (auth.uid() = user_id);
create policy "Users can delete own lists" on public.food_lists for delete using (auth.uid() = user_id);
-- Food List Items: 본인 리스트의 아이템만
alter table public.food_list_items enable row level security;
create policy "Users can manage own list items" on public.food_list_items for all using (
    exists (
        select 1
        from public.food_lists
        where food_lists.id = food_list_items.list_id
            and food_lists.user_id = auth.uid()
    )
);
-- Selection History: 본인 것 조회, 누구나 삽입(통계용)
alter table public.selection_history enable row level security;
create policy "Users can view own history" on public.selection_history for
select using (auth.uid() = user_id);
create policy "Anyone can insert history" on public.selection_history for
insert with check (true);
create policy "Anyone can view for stats" on public.selection_history for
select using (true);
-- Balance Games: 누구나 참여 가능 (비로그인)
alter table public.balance_games enable row level security;
create policy "Anyone can insert balance games" on public.balance_games for
insert with check (true);
create policy "Anyone can view balance games" on public.balance_games for
select using (true);
-- Anonymous Status: 누구나 CRUD
alter table public.anonymous_status enable row level security;
create policy "Anyone can manage anonymous status" on public.anonymous_status for all using (true);
-- ============================================================
-- Indexes (성능 최적화)
-- ============================================================
create index idx_foods_user_id on public.foods(user_id);
create index idx_foods_category on public.foods(category);
create index idx_foods_user_category on public.foods(user_id, category);
create index idx_food_lists_user_id on public.food_lists(user_id);
create index idx_food_list_items_list_id on public.food_list_items(list_id);
create index idx_selection_history_user_id on public.selection_history(user_id);
create index idx_selection_history_food_id on public.selection_history(food_id);
create index idx_selection_history_selected_at on public.selection_history(selected_at);
create index idx_balance_games_created_at on public.balance_games(created_at);
create index idx_anonymous_status_expires_at on public.anonymous_status(expires_at);
-- ============================================================
-- Updated_at 자동 업데이트 트리거
-- ============================================================
create or replace function public.handle_updated_at() returns trigger as $$ begin new.updated_at = now();
return new;
end;
$$ language plpgsql;
create trigger on_foods_updated before
update on public.foods for each row execute function public.handle_updated_at();