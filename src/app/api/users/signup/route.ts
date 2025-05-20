/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connect();

// Update the POST function in your signup route
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password, fullName } = reqBody;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with all fields
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullName: fullName || "", // Set default if not provided
      bio: "", // Default empty bio
      status: "offline", // Default status
      isVerified: false,
      isAdmin: false,
      friends: [],
    });

    const savedUser = await newUser.save();

    // Return response without sensitive data
    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        user: {
          _id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          fullName: savedUser.fullName,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
