"use client";

/**
 * TEMPORARY PREVIEW PAGE: src/app/ui-preview/page.tsx
 * Dev-only preview rendering every UI primitive in both light and dark modes.
 * Note: This page is deleted in Phase 8 before release.
 */

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Tabs } from "@/components/ui/Tabs";
import { Toast } from "@/components/ui/Toast";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { EmptyState } from "@/components/ui/EmptyState";
import { setTheme } from "@/lib/theme";

export default function UiPreviewPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("tab1");

  const previewTabs = [
    { id: "tab1", label: "Chat" },
    { id: "tab2", label: "Connect" },
    { id: "tab3", label: "Ask" },
  ];

  return (
    <div className="min-h-screen bg-bg text-ink p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-headline tracking-tight">
              Skyline Design Tokens & UI Primitives
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Dev-only preview (Phase 1 Foundation). Note: Deleted in Phase 8.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setTheme("light")}
            >
              Force Light
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setTheme("dark")}
            >
              Force Dark
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Color Palette Tokens Palette Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-headline">Color Palette Tokens</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: "bg", bg: "bg-bg", text: "text-ink", border: "border-border" },
              { name: "surface", bg: "bg-surface", text: "text-ink", border: "border-border" },
              { name: "surface-2", bg: "bg-surface-2", text: "text-ink", border: "border-border" },
              { name: "border", bg: "bg-border", text: "text-ink", border: "border-border" },
              { name: "ink", bg: "bg-ink", text: "text-surface", border: "border-transparent" },
              { name: "ink-muted", bg: "bg-ink-muted", text: "text-white", border: "border-transparent" },
              { name: "primary", bg: "bg-primary", text: "text-white", border: "border-transparent" },
              { name: "ai", bg: "bg-ai", text: "text-white", border: "border-transparent" },
              { name: "live", bg: "bg-live", text: "text-white", border: "border-transparent" },
              { name: "danger", bg: "bg-danger", text: "text-white", border: "border-transparent" },
              { name: "sky-top", bg: "bg-sky-top", text: "text-ink", border: "border-border" },
            ].map((token) => (
              <div
                key={token.name}
                className={`p-3 rounded-[10px] border ${token.bg} ${token.text} ${token.border} shadow-xs text-xs font-mono`}
              >
                <div className="font-bold">{token.name}</div>
                <div className="opacity-75 mt-1">Skyline Token</div>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-4 bg-surface p-6 rounded-[14px] border border-border">
          <h2 className="text-xl font-bold font-headline">Buttons</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-4 bg-surface p-6 rounded-[14px] border border-border">
          <h2 className="text-xl font-bold font-headline">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="ai">AI Summary</Badge>
            <Badge variant="live">Live</Badge>
            <Badge variant="danger">Error</Badge>
            <Badge variant="slack">Slack</Badge>
            <Badge variant="discord">Discord</Badge>
          </div>
        </section>

        {/* Avatars */}
        <section className="space-y-4 bg-surface p-6 rounded-[14px] border border-border">
          <h2 className="text-xl font-bold font-headline">Avatars</h2>
          <div className="flex items-center gap-4">
            <Avatar name="Alex" size="sm" color="#2F6BFF" />
            <Avatar name="Sarah" size="md" color="#7C5CFF" />
            <Avatar name="David" size="lg" color="#16C79A" />
          </div>
        </section>

        {/* Inputs & Textareas */}
        <section className="space-y-4 bg-surface p-6 rounded-[14px] border border-border">
          <h2 className="text-xl font-bold font-headline">Form Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Standard text input..." />
            <Input placeholder="Input with error..." error="This field is required" />
            <div className="md:col-span-2">
              <Textarea placeholder="Type your message here..." rows={3} />
            </div>
          </div>
        </section>

        {/* Tabs & Spinner */}
        <section className="space-y-4 bg-surface p-6 rounded-[14px] border border-border">
          <h2 className="text-xl font-bold font-headline">Tabs & Loading</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Tabs tabs={previewTabs} activeTab={activeTab} onChange={setActiveTab} />
            <div className="flex items-center gap-4">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
          </div>
          <p className="text-sm text-ink-muted">
            Active tab selection: <span className="font-semibold text-ink">{activeTab}</span> (supports Left/Right arrow keys)
          </p>
        </section>

        {/* Toast */}
        <section className="space-y-4 bg-surface p-6 rounded-[14px] border border-border">
          <h2 className="text-xl font-bold font-headline">Toast Notifications</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Toast type="info" title="Information" message="Channel link verified with Slack." />
            <Toast type="success" title="Success" message="Workspace created successfully." />
            <Toast type="error" title="Error" message="Connection timed out. Please retry." />
          </div>
        </section>

        {/* Empty State & Modal Trigger */}
        <section className="space-y-4 bg-surface p-6 rounded-[14px] border border-border">
          <h2 className="text-xl font-bold font-headline">Empty State & Dialog Modal</h2>
          <EmptyState
            title="No channels linked yet"
            description="Connect a Slack or Discord channel to start bidirectional sync and AI analysis."
            action={
              <Button onClick={() => setModalOpen(true)}>
                Open Link Modal
              </Button>
            }
          />
        </section>

        {/* Dialog Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Connect Slack Channel"
        >
          <div className="space-y-4">
            <p className="text-sm text-ink-muted">
              Select an external channel to link to <span className="font-semibold text-ink">#general</span>.
            </p>
            <Input placeholder="e.g. C0123456789" />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setModalOpen(false)}>Save Link</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
