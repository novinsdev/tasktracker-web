import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Hero / intro */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Overview
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Quick entry point into your projects, tasks, and time logs.
            </p>
            <p className="mt-3 text-sm text-slate-500">
              This UI sits in front of your{" "}
              <span className="font-mono text-sky-600">
                tasktracker-backend
              </span>{" "}
              and maps each interaction directly to a REST endpoint, so it feels
              like an internal tool designed for engineers.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Link href="/projects">
              <Button>Go to Projects</Button>
            </Link>
            <span className="code-chip">
              GET /api/projects &nbsp;·&nbsp; POST /api/projects
            </span>
          </div>
        </div>
      </Card>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card
          title="Projects"
          description="High-level containers for your work."
          className="h-full"
        >
          <p className="text-sm text-slate-600">
            Model product areas, clients, or initiatives. Tasks and time entries
            roll up under each project.
          </p>
        </Card>

        <Card
          title="Tasks"
          description="Actionable items inside each project."
          className="h-full"
        >
          <p className="text-sm text-slate-600">
            Track work in discrete units with a status (
            <span className="font-mono text-xs">TODO</span>,{" "}
            <span className="font-mono text-xs">IN_PROGRESS</span>,{" "}
            <span className="font-mono text-xs">DONE</span>).
          </p>
        </Card>

        <Card
          title="Time entries"
          description="Hours logged per task and date."
          className="h-full"
        >
          <p className="text-sm text-slate-600">
            Capture when and how long you worked, filtered by task and date
            range, mirroring your backend API contract.
          </p>
        </Card>
      </div>
    </div>
  );
}
