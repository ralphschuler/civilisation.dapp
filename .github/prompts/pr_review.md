Zweck: LLM erstellt PR-Zusammenfassung, Risiko-, Security- und Test-Empfehlungen.

Erwartete Ausgabe (strict):

{
"summary": "string",
"risks": ["string", "..."],
"test_recommendations": ["string", "..."],
"security_notes": ["string", "..."],
"breaking_changes": true | false
}

Platzhalter: {{PR_TITLE}}, {{PR_BODY}}, {{PR_DIFF}} (partieller unified diff).
