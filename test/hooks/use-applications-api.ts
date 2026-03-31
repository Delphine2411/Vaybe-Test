"use client";

import { useCallback, useState } from "react";
import type {
  ApplicationErrorResponse,
  ApplicationInput,
  ApplicationPostResponse,
  ApplicationStatusUpdatePayload,
  ApplicationStatusUpdateResponse,
  ApplicationSuccessResponse,
} from "@/lib/types";

type ApiErrorPayload = {
  error?: string;
  details?: string[];
};

function getErrorMessage(
  payload: ApiErrorPayload | null | undefined,
  fallback: string
) {
  if (payload?.details?.length) {
    return payload.details.join(" ");
  }

  return payload?.error || fallback;
}

async function parseJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export function useApplicationsApi() {
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [isDeletingApplication, setIsDeletingApplication] = useState(false);
  const [isClearingApplications, setIsClearingApplications] = useState(false);
  const [isUpdatingApplicationStatus, setIsUpdatingApplicationStatus] =
    useState(false);

  const submitApplication = useCallback(async (input: ApplicationInput) => {
    setIsSubmittingApplication(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const payload = (await parseJson<ApplicationPostResponse>(response)) as
        | ApplicationPostResponse
        | ApiErrorPayload;

      if (!response.ok) {
        throw new Error(
          getErrorMessage(payload as ApiErrorPayload, "Une erreur est survenue.")
        );
      }

      return payload as ApplicationSuccessResponse;
    } finally {
      setIsSubmittingApplication(false);
    }
  }, []);

  const deleteApplication = useCallback(async (id: string) => {
    setIsDeletingApplication(true);

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      const payload = (await parseJson<{ message?: string } & ApiErrorPayload>(
        response
      )) as { message?: string } & ApiErrorPayload;

      if (!response.ok) {
        throw new Error(
          getErrorMessage(payload, "Impossible de supprimer cette candidature.")
        );
      }
    } finally {
      setIsDeletingApplication(false);
    }
  }, []);

  const clearApplications = useCallback(async () => {
    setIsClearingApplications(true);

    try {
      const response = await fetch("/api/applications", {
        method: "DELETE",
      });

      const payload = (await parseJson<{ message?: string } & ApiErrorPayload>(
        response
      )) as { message?: string } & ApiErrorPayload;

      if (!response.ok) {
        throw new Error(
          getErrorMessage(payload, "Impossible de supprimer toutes les candidatures.")
        );
      }
    } finally {
      setIsClearingApplications(false);
    }
  }, []);

  const updateApplicationStatus = useCallback(
    async (id: string, payloadInput: ApplicationStatusUpdatePayload) => {
      setIsUpdatingApplicationStatus(true);

      try {
        const response = await fetch(`/api/applications/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadInput),
        });

        const payload = (await parseJson<
          ApplicationStatusUpdateResponse | ApplicationErrorResponse
        >(response)) as ApplicationStatusUpdateResponse | ApplicationErrorResponse;

        if (!response.ok || !("data" in payload)) {
          throw new Error(
            getErrorMessage(
              payload as ApiErrorPayload,
              "Impossible de mettre a jour cette candidature."
            )
          );
        }

        return payload;
      } finally {
        setIsUpdatingApplicationStatus(false);
      }
    },
    []
  );

  return {
    submitApplication,
    deleteApplication,
    clearApplications,
    updateApplicationStatus,
    isSubmittingApplication,
    isDeletingApplication,
    isClearingApplications,
    isUpdatingApplicationStatus,
  };
}
