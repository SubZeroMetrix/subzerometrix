-- Curated Help Center content. Human-authored, grounded in the site's
-- own verified positioning (homepage, pricing, resource pages). No LLM
-- generation, no invented claims. Applied directly to sskgceffpkiuxjhlyjjr
-- via `supabase db query --linked -f`.

insert into public.help_articles (slug, title, category, answer, source_path, status, escalation_rule) values

('what-is-metrix', 'What is Metrix Command Center?', 'What Metrix Does',
 'Metrix helps contractors find the leads, estimates, follow-ups, reviews, and customer relationships that are slipping through the cracks, and shows you what deserves attention next. A supervised AI team drafts the recommended next step — every one of them waits for your approval before anything reaches a customer.',
 '/', 'VERIFIED', null),

('who-is-metrix-for', 'Who is Metrix built for?', 'What Metrix Does',
 'Metrix is built for contractor and service businesses — HVAC, electrical, plumbing, facility management, and similar trades — that are already generating leads and jobs but losing revenue to inconsistent follow-up.',
 '/', 'VERIFIED', null),

('revenue-leak-meaning', 'What does "revenue leak" actually mean?', 'Revenue Recovery',
 'A revenue leak is real, existing opportunity that goes unrealized because nobody followed up in time — a lead that went unanswered, an estimate that went cold, a customer who quietly stopped calling. Metrix surfaces these so they can be acted on instead of forgotten.',
 '/', 'VERIFIED', null),

('estimate-recovery', 'How does Metrix help with estimate follow-up?', 'Leads and Estimate Follow-Up',
 'Metrix tracks how long an estimate has been open and flags ones that are aging past your typical close window, so you know which ones are worth a follow-up before they go cold.',
 '/resources/business-operations', 'VERIFIED', null),

('lead-response-time', 'Why does lead response time matter this much?', 'Leads and Estimate Follow-Up',
 'A lead that doesn''t get a timely response often goes to whichever competitor calls back first. Metrix surfaces which leads are waiting so none go unanswered simply because nobody was tracking them.',
 '/resources/business-operations', 'VERIFIED', null),

('estimate-calculator', 'Is there a free tool to check my own estimate follow-up priority?', 'Resources and Calculators',
 'Yes — the Estimate Follow-Up Priority Calculator scores which of your open estimates need attention first based on age, customer response, urgency, and value. It runs entirely in your browser; nothing you enter is sent to a server or stored.',
 '/resources/tools/estimate-follow-up-priority-calculator', 'VERIFIED', null),

('revenue-calculator', 'Is there a free tool to estimate revenue sitting in my pipeline?', 'Resources and Calculators',
 'Yes — the Follow-Up Revenue Calculator estimates how much revenue is realistically sitting in your open estimates and overdue follow-ups, using only the numbers you provide.',
 '/resources/tools/follow-up-revenue-calculator', 'VERIFIED', null),

('who-is-buster', 'Who or what is Buster?', 'Buster',
 'Buster is Metrix''s AI Chief of Staff. Every day, Buster reviews what actually happened in your business and tells you what needs attention first — grounded in your real data, not a guess. Buster drafts recommendations; it never acts without your approval.',
 '/#buster', 'VERIFIED', null),

('buster-morning-brief', 'What is the morning brief?', 'Buster',
 'Each day Buster produces a summary of what changed, what''s at risk, and what it recommends doing next — so you can start the day with a real list instead of a guess.',
 '/#buster', 'VERIFIED', null),

('approval-gated-meaning', 'What does "owner approval required" actually mean?', 'Owner Approval and AI Controls',
 'It means exactly what it says: no AI-drafted message, record change, or recommendation reaches a customer or takes effect without you explicitly approving it first. This is a hard rule built into the product, not a setting you can turn off.',
 '/#trust', 'VERIFIED', null),

('can-ai-be-paused', 'Can AI assistance be paused or turned off?', 'Owner Approval and AI Controls',
 'Yes. Every automation is visible and controllable, and you can stop it instantly.',
 '/#trust', 'VERIFIED', null),

('is-metrix-autonomous', 'Is Metrix fully autonomous?', 'Owner Approval and AI Controls',
 'No. There is no autonomous mode anywhere in the product. Metrix prepares the work; you approve what happens next.',
 '/#trust', 'VERIFIED', null),

('recommendation-wrong', 'What happens if a recommendation is wrong?', 'Owner Approval and AI Controls',
 'Every recommendation shows the evidence behind it so you can judge it before approving. Nothing executes automatically — if a recommendation doesn''t hold up, you simply don''t approve it, and nothing happens.',
 '/#trust', 'VERIFIED', null),

('setup-time', 'How long does setup take?', 'Setup and First Value',
 'You can start entering your customers, properties, and jobs directly, or bring in your existing data. There is no lengthy implementation process — the trial starts working from the data you give it.',
 '/', 'VERIFIED', null),

('replace-existing-crm', 'Does Metrix replace my current CRM or field-service software?', 'Existing CRM and Field-Service Software',
 'Metrix is a full CRM on its own — customers, properties, leads, estimates, jobs, and follow-ups are all managed in one governed pipeline. If you''re currently relying on spreadsheets, notes, or a patchwork of tools, Metrix is built to replace that. If you''re on established field-service software, talk to us about your specific workflow before switching.',
 '/', 'VERIFIED', 'contact_support'),

('pricing-plans', 'How much does Metrix cost?', 'Pricing and Trial',
 'Command Center is $99/month. Founder CRM is $39/month and requires an approved founder code. Both are monthly only — no annual plans.',
 '/#pricing', 'VERIFIED', null),

('free-trial-details', 'What does the free trial include?', 'Pricing and Trial',
 'Every plan includes a 7-day free trial with full access to that plan''s features.',
 '/#pricing', 'VERIFIED', null),

('cancel-anytime', 'Can I cancel anytime?', 'Billing and Cancellation',
 'Yes. Cancel anytime — access continues through the end of your current billing period.',
 '/#pricing', 'VERIFIED', null),

('refund-policy', 'What happens to my billing if I cancel mid-cycle?', 'Billing and Cancellation',
 'No prorated or discretionary refunds. Refunds are issued only where legally required or to correct a genuine billing error.',
 '/terms', 'VERIFIED', null),

('data-security', 'How is my data kept secure?', 'Security and Privacy',
 'Your account is workspace-isolated with secure authentication. See the Privacy Policy for full detail on how your data is collected, used, and protected.',
 '/privacy', 'VERIFIED', null),

('audit-trail', 'Is there a record of what the AI has done?', 'Security and Privacy',
 'Yes. Every AI recommendation and every decision you make is logged permanently and is searchable.',
 '/#trust', 'VERIFIED', null),

('sms-availability', 'Is SMS or text messaging available?', 'Troubleshooting',
 'Not yet. SMS and social messaging are in active development and not currently available. Today, communications are handled through governed email.',
 '/', 'LIMITED', null),

('integrations-available', 'What integrations are available today?', 'Troubleshooting',
 'Google login and secure workspace access are available today. Additional integrations are being added over time.',
 '/', 'LIMITED', null),

('contact-support', 'How do I reach support?', 'Contact Support',
 'Email info@subzerometrix.com and we will get back to you, or use the Customer Care Center to submit a specific request.',
 '/customer-care', 'VERIFIED', null),

('mcc-account-help', 'I have a question about my existing Metrix Command Center account.', 'Contact Support',
 'This public site does not handle account-specific support. Log in to your account at mcc.subzerometrix.com and use the support option there, or email info@subzerometrix.com — never share your password or payment details through this site.',
 '/customer-care', 'VERIFIED', 'contact_support');
