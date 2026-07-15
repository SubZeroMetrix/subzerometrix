-- Buster V2: retrieval now indexes content beyond help_articles (pricing,
-- resources, legal, about, customer care), so a matched source may not
-- have a help_articles row to foreign-key against. Adds generic source
-- fields (used for every match) alongside the existing FK (populated
-- only when the match is a real help_articles row), plus a retrieval
-- quality score (top-vs-runner-up score gap) for admin review of
-- ambiguous matches.

alter table public.buster_questions
  add column if not exists quality_score numeric(4,3),
  add column if not exists matched_source_title text,
  add column if not exists matched_source_path text;
