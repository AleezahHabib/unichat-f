import * as React from "react";
import { Folder, FileCode, Terminal, CheckCircle2 } from "lucide-react";

export function SpecFirst() {
  return (
    <section id="specs" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-headline text-ink">
          Built spec-first with zero drift
        </h2>
        <p className="text-base sm:text-lg text-ink-muted">
          Every endpoint, event, database table, and acceptance criterion flows strictly from checked-in specifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Left Card: File Tree */}
        <div className="p-6 rounded-[18px] bg-surface border border-border shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-border">
              <Folder className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm text-ink">Specification Hierarchy</span>
            </div>

            <div className="font-mono text-xs text-ink space-y-2.5">
              <div className="flex items-center gap-2 text-ink-muted">
                <Folder className="w-4 h-4 text-primary" />
                <span className="text-ink font-semibold">specs/</span>
              </div>
              <div className="pl-6 space-y-2 border-l border-border">
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-ink-muted" />
                  <span>constitution.md</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-ink-muted" />
                  <span>openapi.yaml</span>
                </div>
                <div className="flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary font-bold">features/</span>
                </div>
                <div className="pl-6 space-y-1.5 border-l border-border text-[11px] text-ink-muted">
                  <div>├── 01-authentication/ (spec, plan, tasks)</div>
                  <div>├── 02-workspaces-and-channels/</div>
                  <div>├── 03-messaging/</div>
                  <div>├── 04-realtime/</div>
                  <div>├── 05-integrations/</div>
                  <div>├── 06-ai-assistant/</div>
                  <div>└── 07-landing-page/</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-[10px] bg-surface-2 border border-border text-xs text-ink-muted flex items-center justify-between">
            <span>Sync Rule Enforced</span>
            <span className="text-live font-semibold">100% Alignment</span>
          </div>
        </div>

        {/* Right Card: Terminal Output */}
        <div className="p-6 rounded-[18px] bg-[#070B16] border border-[#22304A] text-slate-200 font-mono text-xs shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#22304A]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-live" />
                <span className="font-bold text-slate-300">pytest execution &amp; trace check</span>
              </div>
              <span className="text-[10px] text-slate-400">bash / zsh</span>
            </div>

            <div className="space-y-2 leading-relaxed">
              <p className="text-slate-400">$ python scripts/trace.py</p>
              <p className="text-live">✓ AC-01-01 .. AC-01-04 Verified (100%)</p>
              <p className="text-live">✓ AC-02-01 .. AC-02-05 Verified (100%)</p>
              <p className="text-live">✓ AC-03-01 .. AC-03-06 Verified (100%)</p>
              <p className="text-live">✓ AC-04-01 .. AC-04-05 Verified (100%)</p>
              <p className="text-live">✓ AC-05-01 .. AC-05-08 Verified (100%)</p>
              <p className="text-live">✓ AC-06-01 .. AC-06-06 Verified (100%)</p>
              <p className="text-live">✓ AC-07-01 .. AC-07-05 Verified (100%)</p>
              <p className="text-slate-300 pt-2">
                ================ 39 passed in 4.12s ================
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#22304A] flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5 text-live">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Traceability Matrix Synced
            </span>
            <span>Zero Docker Required</span>
          </div>
        </div>
      </div>
    </section>
  );
}
