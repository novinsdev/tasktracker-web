/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Task, TimeEntry } from "@/lib/types";

export default function TaskDetail() {
  const params = useParams<{ id: string }>();

  // Safely derive numeric taskId
  const taskId = useMemo(() => {
    const raw = params?.id;
    if (!raw) return null;
    const n = Number(raw);
    return Number.isNaN(n) ? null : n;
  }, [params]);

  const [task, setTask] = useState<Task | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [workDate, setWorkDate] = useState<string>(
    () => new Date().toISOString().slice(0, 10)
  );
  const [hours, setHours] = useState<string>("1");
  const [note, setNote] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(which: "all" | "range" = "all") {
    if (taskId == null) return; // don’t call API with NaN/undefined
    setLoading(true);
    setError(null);
    try {
      const t = await api<Task>(`/api/tasks/${taskId}`);

      const qs = new URLSearchParams({ taskId: String(taskId) });
      if (which === "range" && startDate && endDate) {
        qs.set("startDate", startDate);
        qs.set("endDate", endDate);
      }
      const e = await api<TimeEntry[]>(`/api/time-entries?${qs.toString()}`);

      setTask(t);
      setEntries(e ?? []);
    } catch (e: any) {
      setError(e.message ?? "Failed to load task");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const totalHours = useMemo(
    () => entries.reduce((sum, x) => sum + (Number(x.hours) || 0), 0),
    [entries]
  );

  const canCreate = useMemo(() => {
    if (taskId == null) return false;
    const h = Number(hours);
    return !busy && workDate.length === 10 && !Number.isNaN(h) && h > 0;
  }, [busy, workDate, hours, taskId]);

  async function createEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!canCreate || taskId == null) return;

    setBusy(true);
    setError(null);
    try {
      await api<TimeEntry>("/api/time-entries", {
        method: "POST",
        body: JSON.stringify({
          taskId,
          workDate,
          hours: Number(hours),
          note: note.trim() || null,
        }),
      });
      setNote("");
      await load(startDate && endDate ? "range" : "all");
    } catch (e: any) {
      setError(e.message ?? "Failed to create time entry");
    } finally {
      setBusy(false);
    }
  }

  if (taskId == null) {
    return <p className="text-slate-600">Invalid task id in URL.</p>;
  }

  if (loading) return <p className="text-slate-600">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!task) return <p className="text-slate-600">Task not found.</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Task #{task.id}</p>
            <h1 className="text-xl font-semibold">{task.title}</h1>
            <p className="mt-2 text-slate-600">Status: {task.status}</p>
            {task.project?.id ? (
              <p className="mt-1 text-sm text-slate-500">
                Project:{" "}
                <Link
                  className="underline"
                  href={`/projects/${task.project.id}`}
                >
                  {task.project.name ?? `#${task.project.id}`}
                </Link>
              </p>
            ) : null}
          </div>
          <Link
            className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
            href="/projects"
          >
            Projects
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Log Time</h2>
        <p className="mt-1 text-sm text-slate-600">
          Maps to{" "}
          <code className="rounded bg-slate-100 px-1">POST /api/time-entries</code>
          .
        </p>

        <form onSubmit={createEntry} className="mt-4 grid gap-3 sm:grid-cols-4">
          <input
            className="rounded-xl border px-3 py-2"
            type="date"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
          />
          <input
            className="rounded-xl border px-3 py-2"
            inputMode="decimal"
            placeholder="Hours (e.g. 2.5)"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <input
            className="rounded-xl border px-3 py-2 sm:col-span-2"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            className="w-fit rounded-xl bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
            disabled={!canCreate}
            type="submit"
          >
            {busy ? "Saving..." : "Save"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Time Entries</h2>
            <p className="mt-1 text-sm text-slate-600">
              Loaded from{" "}
              <code className="rounded bg-slate-100 px-1">
                GET /api/time-entries?taskId={taskId}
              </code>
              .
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Total hours in view:{" "}
              <span className="font-semibold">{totalHours.toFixed(2)}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <div className="grid gap-1">
              <label className="text-xs text-slate-500">Start</label>
              <input
                className="rounded-xl border px-3 py-2"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <label className="text-xs text-slate-500">End</label>
              <input
                className="rounded-xl border px-3 py-2"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button
              onClick={() => load(startDate && endDate ? "range" : "all")}
              className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                load("all");
              }}
              className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </div>

        {entries.length === 0 ? (
          <p className="mt-4 text-slate-600">No time entries yet.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border">
            <table className="w-full bg-white">
              <thead className="bg-slate-50 text-left text-sm">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Hours</th>
                  <th className="p-3">Note</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {entries.map((x) => (
                  <tr key={x.id} className="border-t">
                    <td className="p-3">{x.workDate}</td>
                    <td className="p-3">{Number(x.hours).toFixed(2)}</td>
                    <td className="p-3 text-slate-600">{x.note ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
