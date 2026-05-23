export type IssueType = "bug" | "feature_request";
export type IssueStatus = "open" | "in_progress" | "resolved";

export interface ICreateIssue {
  title: string;
  description: string;
  type: IssueType;
}

export interface IUpdateIssue {
  title?: string;
  description?: string;
  type?: IssueType;
  status?: IssueStatus;
}

export interface IIssueQuery {
  sort?: "newest" | "oldest";
  type?: IssueType;
  status?: IssueStatus;
}