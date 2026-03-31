import { isValidEmail, isValidHttpUrl } from "@/lib/application-helpers";
import type {
  ApplicationInput,
  ApplicationRecord,
  ApplicationRole,
  ApplicationStatusUpdatePayload,
  StatusUpdateValidationResult,
  ValidationResult,
} from "@/lib/types";

const scoringKeywords = [
  "impact",
  "product",
  "design",
  "frontend",
  "backend",
  "fullstack",
  "ux",
  "team",
  "collaboration",
  "performance",
];

const globalStore = globalThis as typeof globalThis & {
  __vaybeApplications__?: ApplicationRecord[];
};

const applications = globalStore.__vaybeApplications__ ?? [
  {
    id: "seed-1",
    name: "Aminata Dossou",
    email: "aminata.dossou@example.com",
    role: "designer" as const,
    motivation:
      "Je veux rejoindre une equipe produit ambitieuse pour creer des experiences UX claires avec un vrai impact.",
    portfolio: "https://portfolio-aminata.example.com",
    cv: "https://docs.example.com/cv-aminata.pdf",
    score: 3,
    status: "pending" as const,
    createdAt: new Date("2026-03-28T09:15:00.000Z").toISOString(),
  },
  {
    id: "seed-2",
    name: "Junior Kiki",
    email: "junior.kiki@example.com",
    role: "dev" as const,
    motivation:
      "Developpeur fullstack oriente performance, j'aime construire des produits utiles et collaborer avec l'equipe design.",
    portfolio: "",
    cv: "https://docs.example.com/cv-junior.pdf",
    score: 2,
    status: "validated" as const,
    createdAt: new Date("2026-03-29T15:45:00.000Z").toISOString(),
    decisionAt: new Date("2026-03-30T11:15:00.000Z").toISOString(),
  },
  {
    id: "seed-3",
    name: "Kevin Assogba",
    email: "kevin.assogba@example.com",
    role: "dev" as const,
    motivation:
      "Je souhaite rejoindre une equipe backend ambitieuse et progresser sur des produits robustes a fort impact.",
    portfolio: "https://kevin.dev",
    cv: "https://docs.example.com/cv-kevin.pdf",
    score: 3,
    status: "rejected" as const,
    createdAt: new Date("2026-03-27T14:30:00.000Z").toISOString(),
    decisionAt: new Date("2026-03-29T08:20:00.000Z").toISOString(),
    rejectionReason:
      "Votre profil est interessant, mais nous recherchons actuellement une experience plus avancee en architecture distribuee.",
  },
];

if (!globalStore.__vaybeApplications__) {
  globalStore.__vaybeApplications__ = applications;
}

export function calculateApplicationScore(input: ApplicationInput) {
  let score = 0;
  const normalizedMotivation = input.motivation.toLowerCase();

  if (scoringKeywords.some((keyword) => normalizedMotivation.includes(keyword))) {
    score += 1;
  }

  if (input.portfolio.trim()) {
    score += 1;
  }

  if (isValidEmail(input.email)) {
    score += 1;
  }

  return score;
}

export function validateApplicationPayload(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object") {
    return {
      success: false,
      errors: ["Le corps de la requete doit etre un objet JSON valide."],
    };
  }

  const candidate = payload as Record<string, unknown>;
  const name = String(candidate.name ?? "").trim();
  const email = String(candidate.email ?? "").trim();
  const role = String(candidate.role ?? "").trim() as ApplicationRole;
  const motivation = String(candidate.motivation ?? "").trim();
  const portfolio = String(candidate.portfolio ?? "").trim();
  const cv = String(candidate.cv ?? "").trim();

  const errors: string[] = [];

  if (!name) {
    errors.push("Le nom est obligatoire.");
  }

  if (!email) {
    errors.push("L'email est obligatoire.");
  } else if (!isValidEmail(email)) {
    errors.push("Le format de l'email est invalide.");
  }

  if (role !== "dev" && role !== "designer") {
    errors.push("Le role doit etre 'dev' ou 'designer'.");
  }

  if (!motivation) {
    errors.push("Le message de motivation est obligatoire.");
  } else if (motivation.length < 30) {
    errors.push("Le message de motivation doit contenir au moins 30 caracteres.");
  }

  if (!cv) {
    errors.push("Le CV est obligatoire.");
  } else if (!isValidHttpUrl(cv)) {
    errors.push("Le CV doit etre une URL valide commencant par http:// ou https://.");
  }

  if (portfolio && !isValidHttpUrl(portfolio)) {
    errors.push(
      "Le portfolio doit etre une URL valide commencant par http:// ou https://."
    );
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name,
      email,
      role,
      motivation,
      portfolio,
      cv,
    },
  };
}

export function validateStatusUpdatePayload(
  payload: unknown
): StatusUpdateValidationResult {
  if (!payload || typeof payload !== "object") {
    return {
      success: false,
      errors: ["Le corps de la requete doit etre un objet JSON valide."],
    };
  }

  const candidate = payload as Record<string, unknown>;
  const status = String(candidate.status ?? "").trim() as ApplicationStatusUpdatePayload["status"];
  const rejectionReason = String(candidate.rejectionReason ?? "").trim();
  const errors: string[] = [];

  if (status !== "validated" && status !== "rejected") {
    errors.push("Le statut doit etre 'validated' ou 'rejected'.");
  }

  if (status === "rejected" && rejectionReason.length < 10) {
    errors.push("Merci d'indiquer une raison de rejet d'au moins 10 caracteres.");
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      status,
      rejectionReason,
    },
  };
}

export function listApplications() {
  return [...applications].sort((left, right) => {
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

export function getApplicationById(id: string) {
  return applications.find((application) => application.id === id) ?? null;
}

export function createApplication(input: ApplicationInput): ApplicationRecord {
  const record: ApplicationRecord = {
    ...input,
    id: crypto.randomUUID(),
    score: calculateApplicationScore(input),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  applications.unshift(record);

  return record;
}

export function updateApplicationStatus(
  id: string,
  payload: ApplicationStatusUpdatePayload
) {
  const application = getApplicationById(id);

  if (!application) {
    return null;
  }

  application.status = payload.status;
  application.decisionAt = new Date().toISOString();
  application.rejectionReason =
    payload.status === "rejected" ? payload.rejectionReason?.trim() || "" : undefined;

  return application;
}

export function removeApplicationById(id: string) {
  const index = applications.findIndex((application) => application.id === id);

  if (index === -1) {
    return null;
  }

  const [deletedApplication] = applications.splice(index, 1);

  return deletedApplication;
}

export function clearApplications() {
  applications.splice(0, applications.length);
}
