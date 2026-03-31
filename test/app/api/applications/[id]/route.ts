import { NextResponse } from "next/server";
import {
  getApplicationById,
  removeApplicationById,
} from "@/lib/applications";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function DELETE(_: Request, context: RouteContext) {
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

  removeApplicationById(id);

  return NextResponse.json({
    message: "La candidature a ete supprimee.",
  });
}
