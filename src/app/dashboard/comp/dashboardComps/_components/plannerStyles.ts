export type PlannerEventsResponse = {
  data: PlannerEventsResponseData;
  isLoading: boolean;
  isError: boolean;
};

export type PlannerEventsResponseData = {
  Planners: PlannerEvent[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type PlannerEventsOptions = {
  from?: string;
  to?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  fields?: string;
};

export type PlannerType =
  | "Study Session"
  | "Class"
  | "Assignment/deadline"
  | "Reminder"
  | "Personal Task";

export type PlannerEvent = {
  _id: string;
  PlannerTitle: string;
  completed: boolean;
  PlannerDate: string;
  startTime: string;
  endTime: string;
  notes: string;
  PlannerType: PlannerType;
  PlannerColor: string;
};

export const PLANNER_TYPE_LABELS = {
  "Study Session": "Study",
  Class: "Class",
  "Assignment/deadline": "Assignment",
  Reminder: "Reminder",
  "Personal Task": "Personal",
} as const;


export const PLANNER_TYPE_STYLES: Record<
  PlannerType,
  {
    label: string;
    color: string;
  }
> = {
  "Study Session": {
    label: "Study",
    color: "#3B82F6",
  },
  Class: {
    label: "Class",
    color: "#8B5CF6",
  },
  "Assignment/deadline": {
    label: "Assignment",
    color: "#22C55E",
  },
  Reminder: {
    label: "Reminder",
    color: "#F59E0B",
  },
  "Personal Task": {
    label: "Personal",
    color: "#EC4899",
  },
};
