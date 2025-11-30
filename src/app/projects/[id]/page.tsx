/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Project, Task, TaskStatus } from "@/lib/types";

const STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();

  // Safely derive numeric projectId
  const projectId = useMemo(() => {
    const raw = params?.id;
    if (!raw) return null;
    const n = Number(raw);
    return Number.isNaN(n) ? null : n;
  }, [params]);

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (projectId == null) return; // don’t call API with NaN/undefined
    setLoading(true);
    setError(null);
    try {
      const p = await api<Project>(`/api/projects/${projectId}`);
      const t = await api<Task[]>(`/api/tasks?projectId=${projectId}`);
      setProject(p);
      setTasks(t ?? []);
    } catch (e: any) {
      setError(e.message ?? "Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const canCreate = useMemo(
    () => title.trim().length >= 2 && !busy && projectId != null,
    [title, busy, projectId]
  );

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    if (!canCreate || projectId == null) return;

    setBusy(true);
    setError(null);
    try {
      await api<Task>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          status,
          projectId,
        }),
      });
      setTitle("");
      setStatus("TODO");
      await load();
    } catch (e: any) {
      setError(e.message ?? "Failed to create task");
    } finally {
      setBusy(false);
    }
  }

  if (projectId == null) {
    return <p className="text-slate-600">Invalid project id in URL.</p>;
  }

  if (loading) return <p className="text-slate-600">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!project) return <p className="text-slate-600">Project not found.</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Project #{project.id}</p>
            <h1 className="text-xl font-semibold">{project.name}</h1>
            {project.description && (
              <p className="mt-2 text-slate-600">{project.description}</p>
            )}
          </div>
          <Link
            className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
            href="/projects"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Create Task</h2>
        <p className="mt-1 text-sm text-slate-600">
          Maps to <code className="rounded bg-slate-100 px-1">POST /api/tasks</code>.
        </p>

        <form onSubmit={createTask} className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            className="rounded-xl border px-3 py-2 sm:col-span-2"
            placeholder="Task title (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className="rounded-xl border px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            className="w-fit rounded-xl bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
            disabled={!canCreate}
            type="submit"
          >
            {busy ? "Creating..." : "Create"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">Tasks</h2>
            <p className="mt-1 text-sm text-slate-600">
              Loaded from{" "}
              <code className="rounded bg-slate-100 px-1">
                GET /api/tasks?projectId={projectId}
              </code>
              .
            </p>
          </div>
          <button
            onClick={load}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="mt-4 text-slate-600">No tasks yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {tasks.map((t) => (
              <li key={t.id} className="rounded-2xl border bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Status: {t.status}
                    </p>
                  </div>
                  <Link
                    className="rounded-xl bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-100"
                    href={`/tasks/${t.id}`}
                  >
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
