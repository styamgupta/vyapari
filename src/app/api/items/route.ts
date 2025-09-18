import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.item.findMany();
    return NextResponse.json(items);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, rate = 0, userId = 1 } = body;

    if (!name) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    let item;

    if (id) {
      // 👇 Update existing item
      item = await prisma.item.update({
        where: { id },
        data: { name, rate},
      });
    } else {
      // 👇 Create new item
      item = await prisma.item.create({
        data: { name, rate, userId },
      });
    }

    return NextResponse.json(item, { status: id ? 200 : 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
