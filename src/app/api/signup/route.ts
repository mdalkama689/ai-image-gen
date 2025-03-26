import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import signUpSchema from "@/types/signup-schema";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const safeParsed = signUpSchema.safeParse(body);

    if (!safeParsed.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid Input!",
      });
    }

    const { fullName, email, password } = safeParsed.data;

    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userExists) {
      return NextResponse.json({
        success: false,
        message: "Email already registered!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Signup successfully!",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Somthing went wrong during signup!";
    return NextResponse.json({
      success: false,
      message: errorMessage,
    });
  }
}
