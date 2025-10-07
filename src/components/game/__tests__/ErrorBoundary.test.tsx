import { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ErrorBoundary } from "@/components/game/ErrorBoundary";
import { I18nProvider } from "@/providers/i18n-provider";

function renderWithProviders(node: ReactNode) {
  return render(<I18nProvider overrides={{}}>{node}</I18nProvider>);
}

function ToggleableComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("boom");
  }
  return <div>resilient child</div>;
}

describe("ErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    localStorage.setItem("lang", "en");
    renderWithProviders(
      <ErrorBoundary>
        <ToggleableComponent shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("resilient child")).toBeInTheDocument();
  });

  it("shows the fallback UI when an error is thrown and recovers after reset", async () => {
    localStorage.setItem("lang", "en");

    const { rerender } = renderWithProviders(
      <ErrorBoundary>
        <ToggleableComponent shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("resilient child")).toBeInTheDocument();

    rerender(
      <I18nProvider overrides={{}}>
        <ErrorBoundary>
          <ToggleableComponent shouldThrow />
        </ErrorBoundary>
      </I18nProvider>,
    );

    const errorMessages = screen.getAllByText(/Game error occurred/i);
    expect(errorMessages.length).toBeGreaterThan(0);

    rerender(
      <I18nProvider overrides={{}}>
        <ErrorBoundary>
          <ToggleableComponent shouldThrow={false} />
        </ErrorBoundary>
      </I18nProvider>,
    );

    const resetButton = screen.getByTestId("reset-button");
    await userEvent.click(resetButton);

    expect(screen.getByText("resilient child")).toBeInTheDocument();
  });
});
