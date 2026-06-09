# Claude Prompts

Store reusable Claude session prompts here — workspace setup instructions, feature build prompts, debugging scripts, and any prompt that produced good results and should be repeatable.

## Naming Convention

```
YYYY-MM-DD_short-description.md
```

## Guidelines

- Paste the exact prompt that worked, not a summary.
- Note which Claude model and session context produced the result.
- Tag whether the prompt is for: `build`, `debug`, `review`, `deploy`, `strategy`.

## Active Workspace Context (include in most prompts)

```
Project path:  C:\AI-Projects\subzerometrix
GitHub:        https://github.com/SubZeroMetrix/subzerometrix.git
Vercel:        https://subzerometrix.vercel.app
Local dev:     http://localhost:3000
Bypass test:   http://localhost:3000/report?session_id=dev_bypass
```
