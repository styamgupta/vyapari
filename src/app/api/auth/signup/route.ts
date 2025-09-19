// app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignupRequest, SignupResponse, AuthError } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { name, email, password }: SignupRequest = await req.json();

    // Validate input
    if (!name || !password) {
      return NextResponse.json<AuthError>(
        { error: "Name and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ 
      where: { name } 
    });
    
    if (existingUser) {
      return NextResponse.json<AuthError>(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { 
        name, 
        email: email || null, // Handle optional email
        password: hashedPassword 
      },
      select: {
        id: true,
        name: true,
        email: true,
        // Exclude password from response
      }
    });

    return NextResponse.json<SignupResponse>(
      { 
        message: "Signup successful", 
        user 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json<AuthError>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}