import { NextResponse } from "next/server";

// Dummy in-memory store (replace with DB)
let sales: any[] = [];

export async function GET() {
  try {
    return NextResponse.json(sales);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, weight, rate, total ,type} = body;

    if (!productId || !weight || !rate || !total) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newSale = {
      id: Date.now(), // unique ID
      productId,
      weight,
      rate,
      total,
      type,
      createdAt: new Date().toISOString(),
    };

    sales.push(newSale);

    return NextResponse.json(newSale, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add sale" }, { status: 500 });
  }
}
