-- Buster Landing Assistant: logs every question asked, what it matched
-- (if anything) in help_articles, and whether it was resolved. This is
-- the "learning" system -- unanswered/low-confidence questions become
-- the backlog for future Help Center content, reviewed by a human before
-- any new article is published (matches the existing help_articles
-- human-approval model -- nothing here auto-publishes).
--
-- Applied directly to sskgceffpkiuxjhlyjjr via `supabase db query --linked -f`,
-- consistent with 0003/0005.

create table if not exists public.buster_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  matched_article_id uuid references public.help_articles(id) on delete set null,
  confidence numeric(4,3) not null default 0,
  resolved boolean not null default false,
  route text,
  visitor_id text,
  session_id text,
  escalated_to text check (escalated_to in ('care_request', 'contact', 'help_center', null)),
  created_at timestamptz not null default now()
);

create index if not exists buster_questions_resolved_idx on public.buster_questions (resolved);
create index if not exists buster_questions_created_at_idx on public.buster_questions (created_at desc);
create index if not exists buster_questions_matched_article_idx on public.buster_questions (matched_article_id);

alter table public.buster_questions enable row level security;
-- No public read/write policies -- all access goes through the service
-- role via /api/buster/ask, matching the mcc_leads pattern.
