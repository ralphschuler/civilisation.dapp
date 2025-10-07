Zweck: LLM klassifiziert Issues (Labels, Priorität), erzeugt Summary & Start-Checklist.

Erwartete Ausgabe (strict):

{
"labels": ["bug","feature","documentation","triage","..."],
"priority": "low" | "medium" | "high",
"summary": "string",
"checklist": ["string", "..."]
}

Platzhalter: {{ISSUE_TITLE}}, {{ISSUE_BODY}}.
