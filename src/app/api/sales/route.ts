import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;

    // ✅ Sellings fetch करो
    const sellings = await prisma.selling.findMany({
      where: { userId },
      include: { item: true },
      orderBy: { createdAt: "desc" },
    });

    // ✅ Calculate totals
    const totalBuy = sellings
      .filter((s) => s.type === "BUY")
      .reduce((sum, s) => sum + s.total, 0);

    const totalSell = sellings
      .filter((s) => s.type === "SELL")
      .reduce((sum, s) => sum + s.total, 0);

    const profit = totalSell - totalBuy;

    return NextResponse.json({
      summary: {
        totalBuy,
        totalSell,
        profit,
      },
      sellings,
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;
    const body = await req.json();
    const { productId, weight, rate, total, type } = body;

    if (!productId || !weight || !rate || !total || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newSale = await prisma.selling.create({
      data: {
        weight: Number(weight),
        rate: Number(rate),
        total: Number(total),
        type, // "BUY" | "SELL"
        itemId: Number(productId),
        userId,
      },
      include: { item: true },
    });

    return NextResponse.json(newSale, { status: 201 });
  } catch (err) {
    console.error("Error in POST /api/sales:", err);
    return NextResponse.json({ error: "Failed to add sale" }, { status: 500 });
  }
}