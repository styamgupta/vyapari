// app/api/items/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/app/api/auth/api-utils";
import { ItemApiRequest } from "@/lib/types";

export async function GET() {
  try {
    const authResult = await authenticateRequest();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const userId = authResult.userId;

    const items = await prisma.item.findMany({
      where: { userId }
    });
    return NextResponse.json(items);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authResult = await authenticateRequest();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const userId = authResult.userId;
    const body: ItemApiRequest = await req.json();
    const { id, name, rate = 0 } = body;

    if (!name) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    let item;

    if (id) {
      // Update existing item
      item = await prisma.item.update({
        where: { id, userId },
        data: {
          name,
          rate: Number(rate)
        },
      });
    } else {
      // Create new item - use Prisma's exact expected structure
      item = await prisma.item.create({
        data: {
          name,
          rate: Number(rate),
          userId,
          preference: false // Default value
        },
      });
    }

    return NextResponse.json(item, { status: id ? 200 : 201 });
  } catch (err: unknown) {
    console.error("Error in items API:", err);

    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}