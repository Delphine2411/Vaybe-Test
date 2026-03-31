import { NextResponse } from "next/server";
import {
  clearApplications,
  createApplication,
  listApplications,
  validateApplicationPayload,
} from "@/lib/applications";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    data: listApplications(),
  });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validateApplicationPayload(payload);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const application = createApplication(validation.data);

    return NextResponse.json(
      {
        message: "Votre candidature a ete enregistree avec succes.",
        data: application,
      },
      { status: 201 }
    );
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

export async function DELETE() {
  clearApplications();

  return NextResponse.json({
    message: "Toutes les candidatures ont ete supprimees.",
  });
}
