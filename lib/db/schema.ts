import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const workflowExecutions = pgTable("workflow_executions", {
  id: text("id").primaryKey(),
  workflowId: text("workflow_id").notNull(),
  status: text("status").notNull(),
  startedAt: timestamp("started_at", {
    withTimezone: true,
    mode: "string",
  }),
  completedAt: timestamp("completed_at", {
    withTimezone: true,
    mode: "string",
  }),
  errorCode: text("error_code"),
  errorMessage: text("error_message"),
});
