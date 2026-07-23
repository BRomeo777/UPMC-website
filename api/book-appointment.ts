import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

const CLINIC_EMAIL = "umurinzipetrosmedicalcenter@gmail.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = req.body;
  if (!data || !data.full_name || !data.phone || !data.department || !data.preferred_date || !data.preferred_time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const gmailUser = process.env.GMAIL_USER || "bana.romeo77@gmail.com";
  const gmailPass = process.env.GMAIL_APP_PASSWORD || "";

  if (!gmailPass) {
    return res.status(500).json({ error: "GMAIL_APP_PASSWORD not configured" });
  }

  const subject = `New appointment request — ${data.full_name} — ${data.department} — ${data.preferred_date}`;
  const submittedAt = new Date().toLocaleString("en-GB", { timeZone: "Africa/Kigali" });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #0d9488; margin-bottom: 8px;">New Appointment Request</h2>
      <p style="color: #94a3b8; font-size: 13px; margin-bottom: 24px;">
        This is a new appointment request. Please confirm or reschedule via the admin panel or by contacting the patient directly.
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; font-weight: bold; color: #374151; width: 160px;">Full Name:</td><td style="padding: 8px 0; color: #475569;">${data.full_name}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td><td style="padding: 8px 0; color: #475569;"><a href="tel:${data.phone}" style="color: #0d9488; text-decoration: none;">${data.phone}</a></td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td><td style="padding: 8px 0; color: #475569;">${data.email || "Not provided"}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Department:</td><td style="padding: 8px 0; color: #475569;">${data.department}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Preferred Doctor:</td><td style="padding: 8px 0; color: #475569;">${data.preferred_doctor}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Preferred Date:</td><td style="padding: 8px 0; color: #475569;">${data.preferred_date}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Preferred Time:</td><td style="padding: 8px 0; color: #475569;">${data.preferred_time}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #374151; vertical-align: top;">Reason for Visit:</td><td style="padding: 8px 0; color: #475569;">${data.reason || "Not provided"}</td></tr>
      </table>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #94a3b8;">
        Submitted at: ${submittedAt} (Africa/Kigali)<br/>
        Umurinzi Petros Medical Center — Appointment System
      </p>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    const info = await transporter.sendMail({
      from: `"UPMC Appointments" <${gmailUser}>`,
      to: CLINIC_EMAIL,
      subject,
      html,
    });

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (err: any) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send email", details: err?.message || "" });
  }
}
