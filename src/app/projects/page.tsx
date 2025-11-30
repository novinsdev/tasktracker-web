"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const data = await api<Project[]>("/api/projects");
      setProjects(data ?? []);
    } catch (e: any) {
      setError(e.message ?? "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const canCreate = useMemo(
    () => name.trim().length >= 2 && !busy,
    [name, busy]
  );

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    if (!canCreate) return;

    setBusy(true);
    setError(null);
    try {
      await api<Project>("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
        }),
      });
      setName("");
      setDescription("");
      await load();
    } catch (e: any) {
      setError(e.message ?? "Failed to create project");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Create project */}
      <Card
        title="Create project"
        description="Map your backlog into API-backed project objects."
        headerRight={<span className="code-chip">POST /api/projects</span>}
      >
        <form
          onSubmit={createProject}
          className="mt-2 grid gap-3 sm:grid-cols-3"
        >
          <div className="sm:col-span-1">
            <label className="text-xs font-medium text-slate-700">
              Name
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="e.g. Frontend Migration"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-700">
              Description
            </label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Optional context for the team."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="sm:col-span-3 flex flex-wrap items-center gap-3">
            <Button disabled={!canCreate} type="submit">
              {busy ? "Creating…" : "Create project"}
            </Button>
            {error && (
              <p className="text-xs text-red-500">
                {error}
              </p>
            )}
          </div>
        </form>
      </Card>

      {/* Projects list */}
      <Card
        title="Projects"
        description="Everything currently tracked in the system."
        headerRight={
          <Button size="sm" variant="ghost" onClick={load}>
            Refresh
          </Button>
        }
      >
        {loading ? (
          <p className="text-sm text-slate-600">Loading projects…</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-slate-500">
            No projects yet. Create your first project above.
          </p>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {p.name}
                    </p>
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                      id: {p.id}
                    </span>
                  </div>
                  {p.description && (
                    <p className="mt-1 text-xs text-slate-600">
                      {p.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/projects/${p.id}`}>
                    <Button size="sm" variant="primary">
                      Open
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
