import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logout successful" });
  res.cookies.set("token", "", { maxAge: 0 }); // delete cookie
  return res;
}
