import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { nameOrEmail, description } = await req.json();

    if (!nameOrEmail || !description) {
      return NextResponse.json(
        { error: "Name/Email and Description are required." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "krupkantesariya000@gmail.com",
        pass: "atbw ukjs zivf zzjj",
      },
    });

    const mailOptions = {
      from: "krupkantesariya000@gmail.com",
      to: "krupkantesariya000@gmail.com",
      subject: `New Feedback Received from ${nameOrEmail}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Feedback Submission</h2>
          <p style="font-size: 16px; color: #555;"><strong>From:</strong> ${nameOrEmail}</p>
          <p style="font-size: 16px; color: #555;"><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; border-radius: 4px;">
            <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.5;">
              ${description.replace(/\n/g, "<br>")}
            </p>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px; text-align: center;">
            This is an automated message from your FileShare Feedback Form.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Feedback sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending feedback email:", error);
    return NextResponse.json(
      { error: "Failed to send feedback. Please try again later." },
      { status: 500 }
    );
  }
}
