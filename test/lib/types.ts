export type ApplicationRole = "dev" | "designer";

export type ApplicationStatus = "pending" | "validated" | "rejected";

export type ApplicationInput = {
  name: string;
  email: string;
  role: ApplicationRole;
  motivation: string;
  portfolio: string;
  cv: string;
};

export type ApplicationRecord = ApplicationInput & {
  id: string;
  score: number;
  status: ApplicationStatus;
  createdAt: string;
  decisionAt?: string;
  rejectionReason?: string;
};

export type ValidationResult =
  | { success: true; data: ApplicationInput }
  | { success: false; errors: string[] };

export type StatusUpdateValidationResult =
  | {
      success: true;
      data: {
        status: Extract<ApplicationStatus, "validated" | "rejected">;
        rejectionReason: string;
      };
    }
  | { success: false; errors: string[] };

export type FormState = ApplicationInput;

export type FieldProps = {
  label: string;
  name: keyof FormState | string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
};

export type SortOption = "score-high" | "score-medium" | "score-low";

export type RoleFilter = "all" | ApplicationRole;

export type SidebarFilter = "all" | "validated" | "rejected";

export type AdminDashboardProps = {
  initialApplications: ApplicationRecord[];
};

export type ApplicationsApiResponse = {
  data: ApplicationRecord[];
};

export type ApplicationSuccessResponse = {
  message: string;
  data: ApplicationRecord;
};

export type ApplicationErrorResponse = {
  error: string;
  details: string[];
};

export type ApplicationPostResponse =
  | ApplicationSuccessResponse
  | ApplicationErrorResponse;

export type ApplicationStatusUpdatePayload = {
  status: Extract<ApplicationStatus, "validated" | "rejected">;
  rejectionReason?: string;
};

export type EmailSendResult = {
  sent: boolean;
  provider: "nodemailer" | "resend" | "console";
  error?: string;
};

export type ApplicationStatusUpdateResponse = {
  message: string;
  data: ApplicationRecord;
  email: EmailSendResult;
};

export type ApplicationsStats = {
  total: number;
  dev: number;
  designer: number;
};
