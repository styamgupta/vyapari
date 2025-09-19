// app/api/sales/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/app/api/auth/api-utils";
import { SaleCreateData } from "@/lib/types";

export async function GET() {
  try {
    const authResult = await authenticateRequest();
    if (authResult instanceof NextResponse) {
      return authResult; // Returns error response if authentication failed
    }

    const userId = authResult.userId;

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
    const authResult = await authenticateRequest();
    if (authResult instanceof NextResponse) {
      return authResult; // Returns error response if authentication failed
    }

    const userId = authResult.userId;
    const body = await req.json();
    const { productId, weight, rate, total, type }: SaleCreateData = body;

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