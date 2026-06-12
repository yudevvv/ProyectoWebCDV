import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.users?.length) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const email = data.users[0].email;
    const superAdminEmail = process.env.SUPERADMIN_EMAIL;

    if (!email || email !== superAdminEmail) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const secret = process.env.SUPERADMIN_SECRET;

    const response = NextResponse.json({ success: true, secret });
    response.cookies.set("__superadmin", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: `/${secret}`,
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
