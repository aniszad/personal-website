"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";

export function RetroComputerShell({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const isFrench = language === "fr";

  return (
    <div className="retro-workspace">
      <div className="retro-machine">
        <header className="retro-machine-header">
          <div className="retro-brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <p className="retro-machine-title">ANIS // PORTFOLIO SYSTEM</p>
            <p className="retro-machine-subtitle">
              {isFrench ? "Terminal personnel · Lille, FR" : "Personal terminal · Lille, FR"}
            </p>
          </div>
          <div className="retro-machine-status" aria-label={isFrench ? "Système en ligne" : "System online"}>
            <span className="retro-status-light" />
            <span>ONLINE</span>
          </div>
        </header>

        <div className="retro-screen-shell">
          <div className="retro-screen-glass" aria-hidden="true" />
          <div className="retro-screen-content">{children}</div>
        </div>

        <footer className="retro-machine-footer">
          <span>SYS.PRTF // v1.0</span>
          <span>{isFrench ? "Navigation clavier disponible" : "Keyboard navigation available"}</span>
          <span className="hidden sm:inline">60Hz / phosphor display</span>
        </footer>
      </div>
    </div>
  );
}
