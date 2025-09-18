import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Preference update (per user only one true)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemId, userId } = body;

    if (!itemId || !userId) {
      return NextResponse.json(
        { error: "itemId and userId required" },
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
      where: { id: itemId },
      data: { preference: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
