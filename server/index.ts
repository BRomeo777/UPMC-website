import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const CLINIC_EMAIL = "umurinzipetrosmedicalcenter@gmail.com";
const FROM_EMAIL = "UPMC Appointments <appointments@upmc.org.rw>";

// ── Health check ──
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ── Book appointment endpoint ──
app.post("/api/book-appointment", (req, res) => {
  const data = req.body;

  if (!data || !data.full_name || !data.phone || !data.department || !data.preferred_date || !data.preferred_time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const apiKey = process.env.RESEND_API_KEY || "";
  if (!apiKey) {
    return res.status(500).json({ error: "RESEND_API_KEY not configured" });
  }

  const resend = new Resend(apiKey);
  const submittedAt = new Date().toLocaleString("en-GB", { timeZone: "Africa/Kigali" });

  // ── Email to clinic staff ──
  const clinicHtml = `
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

  // ── Confirmation email to patient (if email provided) ──
  const patientHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #0d9488; font-size: 24px; margin: 0 0 8px;">Umurinzi Petros Medical Center</h1>
        <p style="color: #94a3b8; font-size: 14px; margin: 0;">Appointment Request Received</p>
      </div>
      <p style="color: #374151; font-size: 15px; line-height: 1.6;">Dear ${data.full_name},</p>
      <p style="color: #475569; font-size: 15px; line-height: 1.6;">
        Thank you for booking an appointment with us. We have received your request and our team will contact you shortly to confirm your appointment.
      </p>
      <div style="background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h3 style="color: #0f766e; font-size: 14px; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.05em;">Appointment Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; color: #374151; width: 140px;">Department:</td><td style="padding: 6px 0; color: #475569;">${data.department}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #374151;">Doctor:</td><td style="padding: 6px 0; color: #475569;">${data.preferred_doctor}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #374151;">Date:</td><td style="padding: 6px 0; color: #475569;">${data.preferred_date}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #374151;">Time:</td><td style="padding: 6px 0; color: #475569;">${data.preferred_time}</td></tr>
        </table>
      </div>
      <p style="color: #475569; font-size: 15px; line-height: 1.6;">
        If you need to reschedule or have any questions, please contact us at:<br/>
        <strong>Phone:</strong> +250 795 161 628 | +250 783 644 479<br/>
        <strong>Email:</strong> umurinzipetros@gmail.com
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        Umurinzi Petros Medical Center<br/>
        Shyogwe Sector, Muhanga District, Rwanda
      </p>
    </div>
  `;

  (async () => {
    try {
      // Send email to clinic
      const clinicRes = await resend.emails.send({
        from: FROM_EMAIL,
        to: CLINIC_EMAIL,
        subject: `New appointment request — ${data.full_name} — ${data.department} — ${data.preferred_date}`,
        html: clinicHtml,
      });

      // Send confirmation to patient if email provided
      if (data.email && data.email.includes("@")) {
        try {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: data.email,
            subject: "Appointment Request Received — Umurinzi Petros Medical Center",
            html: patientHtml,
          });
        } catch (patientErr: any) {
          console.error("Patient email send error:", patientErr);
        }
      }

      return res.status(200).json({ success: true, messageId: clinicRes.data?.id || "sent" });
    } catch (err: any) {
      console.error("Email send error:", err);
      return res.status(500).json({ error: "Failed to send email", details: err?.message || "" });
    }
  })();
});

app.listen(PORT, () => {
  console.log(`UPMC API server running on port ${PORT}`);
});
