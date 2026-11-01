-- نفّذ هذا الملف في SQL Editor داخل مشروع Supabase.
create extension if not exists pgcrypto;

create table if not exists public.students (
 id uuid primary key default gen_random_uuid(),
 full_name text not null,
 grade text not null,
 group_name text,
 created_at timestamptz not null default now()
);

create table if not exists public.assessment_results (
 id uuid primary key default gen_random_uuid(),
 subject text not null check (subject in ('arabic','math')),
 skill text not null,
 question text not null,
 answer text,
 correct boolean not null default false,
 score integer not null default 0 check(score between 0 and 100),
 created_at timestamptz not null default now()
);

alter table public.students enable row level security;
alter table public.assessment_results enable row level security;

-- وصول الأستاذ المسجل فقط. لا تنشئ حسابات دخول للتلاميذ في النسخة الأولى.
create policy "teacher manages students"
on public.students for all to authenticated
using (true) with check (true);

create policy "teacher manages results"
on public.assessment_results for all to authenticated
using (true) with check (true);
