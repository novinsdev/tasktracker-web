export type Project = {
  id: number;
  name: string;
  description?: string | null;
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
  project?: Project; // backend returns nested project in examples
};

export type TimeEntry = {
  id: number;
  task?: Task;       // may be nested depending on serialization
  workDate: string;  // "YYYY-MM-DD"
  hours: number;
  note?: string | null;
};
