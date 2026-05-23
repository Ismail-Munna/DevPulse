import { pool } from "../..";
import type { CustomJwtPayload } from "../../../types";
import type { ICreateIssue, IIssueQuery, IUpdateIssue } from "./issue.interface";

const validateIssuePayload = (payload: ICreateIssue) => {
  const { title, description, type } = payload;

  if (!title || title.length > 150) {
    throw new Error("title is required and maximum 150 characters");
  }

  if (!description || description.length < 20) {
    throw new Error("description is required and minimum 20 characters");
  }

  if (type !== "bug" && type !== "feature_request") {
    throw new Error("type must be bug or feature_request");
  }
};

const formatIssueWithReporter = async (issue: Record<string, unknown>) => {
  const reporter = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = $1
    `,
    [issue.reporter_id]
  );

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporter.rows[0] || null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const createIssueintoDB = async (
  payload: ICreateIssue,
  user: CustomJwtPayload
) => {
  validateIssuePayload(payload);

  const { title, description, type } = payload;

  const result = await pool.query(
    `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [title, description, type, user.id]
  );

  return result.rows[0];
};

const getAllIssuesfromDB = async (query: IIssueQuery) => {
  const sort = query.sort === "oldest" ? "ASC" : "DESC";

  const values: string[] = [];
  const conditions: string[] = [];

  if (query.type) {
    if (query.type !== "bug" && query.type !== "feature_request") {
      throw new Error("Invalid issue type");
    }

    values.push(query.type);
    conditions.push(`type = $${values.length}`);
  }

  if (query.status) {
    if (
      query.status !== "open" &&
      query.status !== "in_progress" &&
      query.status !== "resolved"
    ) {
      throw new Error("Invalid issue status");
    }

    values.push(query.status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query(
    `
    SELECT *
    FROM issues
    ${whereClause}
    ORDER BY created_at ${sort}
    `,
    values
  );

  const issues = [];

  for (const issue of result.rows) {
    const formattedIssue = await formatIssueWithReporter(issue);
    issues.push(formattedIssue);
  }

  return issues;
};

const getSingleIssuefromDB = async (id: string) => {
  const result = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const issue = await formatIssueWithReporter(result.rows[0]);

  return issue;
};

const updateIssuefromDB = async (
  id: string,
  payload: IUpdateIssue,
  user: CustomJwtPayload
) => {
  const existingIssue = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [id]
  );

  if (existingIssue.rows.length === 0) {
    throw new Error("issue not found");
  }

  const issue = existingIssue.rows[0];

  if (user.role === "contributor") {
    if (issue.reporter_id !== user.id) {
      throw new Error("You can update only your own issue");
    }

    if (issue.status !== "open") {
      throw new Error("Contributor can update only open issue");
    }

    if (payload.status) {
      throw new Error("Contributor cannot update issue status");
    }
  }

  if (payload.type && payload.type !== "bug" && payload.type !== "feature_request") {
    throw new Error("type must be bug or feature_request");
  }

  if (
    payload.status &&
    payload.status !== "open" &&
    payload.status !== "in_progress" &&
    payload.status !== "resolved"
  ) {
    throw new Error("status must be open, in_progress or resolved");
  }

  if (payload.title && payload.title.length > 150) {
    throw new Error("title maximum 150 characters");
  }

  if (payload.description && payload.description.length < 20) {
    throw new Error("description minimum 20 characters");
  }

  const result = await pool.query(
    `
    UPDATE issues
    SET title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        status = COALESCE($4, status),
        updated_at = NOW()
    WHERE id = $5
    RETURNING *
    `,
    [payload.title, payload.description, payload.type, payload.status, id]
  );

  return result.rows[0];
};

const deleteIssuefromDB = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("issue not found");
  }

  return result.rows[0];
};

export const issueService = {
  createIssueintoDB,
  getAllIssuesfromDB,
  getSingleIssuefromDB,
  updateIssuefromDB,
  deleteIssuefromDB,
};