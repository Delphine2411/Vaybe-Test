import { NextResponse } from "next/server";
import { sendApplicationStatusEmail } from "@/lib/email";
import {
  getApplicationById,
  updateApplicationStatus,
  validateStatusUpdatePayload,
} from "@/lib/applications";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!getApplicationById(id)) {
    return NextResponse.json(
      {
        error: "Not found",
        details: ["Candidature introuvable."],
      },
      { status: 404 }
    );
  }

  try {
    const payload = await request.json();
    const validation = validateStatusUpdatePayload(payload);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const updatedApplication = updateApplicationStatus(id, validation.data);

    if (!updatedApplication) {
      return NextResponse.json(
        {
          error: "Not found",
          details: ["Candidature introuvable."],
        },
        { status: 404 }
      );
    }

    const email = await sendApplicationStatusEmail(updatedApplication);

    return NextResponse.json({
      message:
        updatedApplication.status === "validated"
          ? "Le candidat a ete valide et le message a ete traite."
          : "Le candidat a ete rejete et le message a ete traite.",
      data: updatedApplication,
      email,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request",
        details: ["Impossible de lire le JSON envoye."],
      },
      { status: 400 }
    );
  }
}
