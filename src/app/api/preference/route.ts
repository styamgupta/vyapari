// Updated version with authentication
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/app/api/auth/api-utils";
import { PreferenceUpdateRequest } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const authResult = await authenticateRequest();
    if (authResult instanceof NextResponse) {
      return authResult; // Returns error response if authentication failed
    }

    const body = await req.json();
    const { itemId }: Omit<PreferenceUpdateRequest, 'userId'> = body;
    const userId = authResult.userId; // Get userId from authenticated user

    if (!itemId) {
      return NextResponse.json(
        { error: "itemId required" },
        { status: 400 }
      );
    }

    // ✅ Step 1: Purane preference ko false karo
    await prisma.item.updateMany({
      where: { userId },
      data: { preference: false },
    });

    // ✅ Step 2: Naye wale ko true karo
    const updated = await prisma.item.update({
      where: { id: itemId, userId }, // Ensure user owns this item
      data: { preference: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: unknown) {
 const errorMessage = err instanceof Error ? err.message : "Internal server error";
  return NextResponse.json({ error: errorMessage }, { status: 500 });  }
}