// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { LoginRequest, LoginResponse, AuthError } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { name, password }: LoginRequest = await req.json();

    // Validate input
    if (!name || !password) {
      return NextResponse.json<AuthError>(
        { error: "Name and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { name },
    });

    if (!user) {
      return NextResponse.json<AuthError>(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Validate password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json<AuthError>(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Create token
    const token = signToken(user.id);

    // Set cookie and return response
    const response = NextResponse.json<LoginResponse>(
      { message: "Login successful", user: { id: user.id, name: user.name } },
      { status: 200 }
    );
    
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || false,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json<AuthError>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}