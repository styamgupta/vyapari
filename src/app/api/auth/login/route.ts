import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { name, password } = await req.json();

  // ab ye valid hai
  const user = await prisma.user.findUnique({
    where: { name },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = signToken(user.id);

  const res = NextResponse.json({ message: "Login successful" });
  res.cookies.set("token", token, { httpOnly: true, secure: false }); 
  return res;
}
