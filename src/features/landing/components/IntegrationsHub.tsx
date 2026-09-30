import * as React from "react";
import { UniChatLogo } from "@/components/ui/UniChatLogo";
import { FolderPlus } from "lucide-react";

export function IntegrationsHub() {
  return (
    <section id="integrations" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-12">
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-headline text-ink">
          Connect your favorite platforms
        </h2>
        <p className="text-base sm:text-lg text-ink-muted">
          All your team conversations flow naturally into one unified stream. Bridge Slack and Discord channels with zero friction.
        </p>
      </div>

      {/* SVG Diagram Container */}
      <div className="max-w-4xl mx-auto p-8 rounded-[24px] bg-surface border border-border shadow-lg relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Spoke 1: Slack */}
          <div className="p-5 rounded-[16px] bg-surface-2 border border-border flex flex-col items-center space-y-3 shadow-sm hover:border-[#4A154B] transition-colors">
            <div className="w-12 h-12 rounded-[12px] bg-[#4A154B] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              Slack
            </div>
            <span className="font-bold text-sm text-ink">Slack Integration</span>
            <span className="text-xs font-medium text-ink-muted">Two-way live sync</span>
          </div>

          {/* Center Hub: UniChat Core */}
          <div className="p-6 rounded-[20px] bg-primary/10 border-2 border-primary flex flex-col items-center space-y-3 shadow-md relative">
            <UniChatLogo className="w-14 h-14" />
            <span className="font-headline font-extrabold text-lg text-ink">UniChat Core</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-surface text-primary border border-primary/30 font-semibold">
              Unified stream
            </span>
          </div>

          {/* Spoke 2: Discord */}
          <div className="p-5 rounded-[16px] bg-surface-2 border border-border flex flex-col items-center space-y-3 shadow-sm hover:border-[#5865F2] transition-colors">
            <div className="w-12 h-12 rounded-[12px] bg-[#5865F2] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              Discord
            </div>
            <span className="font-bold text-sm text-ink">Discord Integration</span>
            <span className="text-xs font-medium text-ink-muted">Instant channel relay</span>
          </div>
        </div>

        {/* Dashed Spoke 3: Open Adapter Folder */}
        <div className="mt-8 pt-8 border-t border-dashed border-border max-w-md mx-auto">
          <div className="p-4 rounded-[14px] border-2 border-dashed border-primary/40 bg-primary/5 flex items-center justify-center gap-3">
            <FolderPlus className="w-5 h-5 text-primary" />
            <span className="text-xs sm:text-sm font-semibold text-ink">
              Custom platforms: extensible adapter architecture
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
