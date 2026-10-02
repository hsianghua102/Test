-- 揪呷 Prototype 使用單一 JSONB room state，方便快速驗證產品流程。
-- 請在 Supabase SQL Editor 執行此檔案，再把 Project URL / anon key 填入 config.js。

create table if not exists public.prototype_rooms (
  id text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.prototype_rooms enable row level security;

-- Prototype 專用：知道 room id 的匿名使用者都能讀寫。
-- 正式產品應改成 token-based room membership，切勿沿用此政策。
create policy "prototype rooms are readable by link"
on public.prototype_rooms for select
to anon
using (true);

create policy "prototype rooms can be created anonymously"
on public.prototype_rooms for insert
to anon
with check (true);

create policy "prototype rooms can be updated anonymously"
on public.prototype_rooms for update
to anon
using (true)
with check (true);

-- 讓 Realtime 可收到 room 更新。
alter publication supabase_realtime add table public.prototype_rooms;
