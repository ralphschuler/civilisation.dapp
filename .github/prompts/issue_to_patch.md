Zweck: LLM erzeugt minimalen unified-diff Patch, der git apply-kompatibel ist.

Erwartung: Patch in einem ```diff-Fence zurückgeben (kein Fließtext!).

Platzhalter: {{ISSUE_TITLE}}, {{ISSUE_BODY}}, {{REPO_FILES}} (Dateiliste für Kontext).