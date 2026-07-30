import express from "express";
import cors from "cors";
import { Resend } from "resend";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore, collection, addDoc, getDocs, query, where, orderBy,
  serverTimestamp,
} from "firebase/firestore";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const CLINIC_EMAIL = "umurinzipetrosmedicalcenter@gmail.com";
const FROM_EMAIL = "UPMC Reports <reports@upmc.org.rw>";

// ── Firebase init (client SDK, same config as frontend) ──
const firebaseConfig = {
  apiKey:            "AIzaSyBAO1aOwvJja2tzwrFy7blWPzuX2xbxgtc",
  authDomain:        "upmc-fa85e.firebaseapp.com",
  projectId:         "upmc-fa85e",
  storageBucket:     "upmc-fa85e.firebasestorage.app",
  messagingSenderId: "848453582874",
  appId:             "1:848453582874:web:ad1c44fdcebbe3c13511a3",
};

let fbApp: ReturnType<typeof initializeApp> | null = null;
function getFirebaseApp() {
  if (!fbApp) {
    fbApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return fbApp;
}

function getDb() {
  return getFirestore(getFirebaseApp());
}

// ── Health check ──
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ── Track page view (backup endpoint) ──
app.post("/api/track-view", (req, res) => {
  const { path: pagePath, sessionId, referrer, userAgent, language } = req.body || {};
  if (!pagePath) return res.status(400).json({ error: "Missing path" });

  (async () => {
    try {
      const db = getDb();
      await addDoc(collection(db, "upmc-analytics"), {
        type: "page_view",
        path: pagePath,
        sessionId: sessionId || "server",
        referrer: referrer || "",
        userAgent: userAgent || "",
        language: language || "",
        timestamp: serverTimestamp(),
        ts: Date.now(),
      });
      res.status(200).json({ success: true });
    } catch (err: any) {
      console.error("[track-view] Error:", err?.message || err);
      res.status(500).json({ error: "Failed to track" });
    }
  })();
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

// ─────────────────────────────────────────────────────────────────────────────
//  WEEKLY REPORT
// ─────────────────────────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Kigali" });
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Kigali" });
}

async function generateAndSendWeeklyReport(): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY || "";
  if (!apiKey) return { success: false, error: "RESEND_API_KEY not configured" };

  const resend = new Resend(apiKey);
  const db = getDb();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  try {
    // ── Fetch analytics (page views) for this week ──
    const analyticsQ = query(
      collection(db, "upmc-analytics"),
      where("ts", ">=", weekAgo.getTime()),
      where("ts", "<=", now.getTime())
    );
    const analyticsSnap = await getDocs(analyticsQ);
    const pageViews = analyticsSnap.docs.map(d => d.data() as any);

    // ── Fetch analytics for previous week (for comparison) ──
    const prevAnalyticsQ = query(
      collection(db, "upmc-analytics"),
      where("ts", ">=", twoWeeksAgo.getTime()),
      where("ts", "<", weekAgo.getTime())
    );
    const prevAnalyticsSnap = await getDocs(prevAnalyticsQ);
    const prevPageViews = prevAnalyticsSnap.docs.map(d => d.data() as any);

    // ── Fetch appointments for this week ──
    const apptQ = query(
      collection(db, "appointments"),
      where("created_at", ">=", weekAgo)
    );
    const apptSnap = await getDocs(apptQ);
    const appointments = apptSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));

    // ── Fetch appointments for previous week ──
    const prevApptQ = query(
      collection(db, "appointments"),
      where("created_at", ">=", twoWeeksAgo),
      where("created_at", "<", weekAgo)
    );
    const prevApptSnap = await getDocs(prevApptQ);
    const prevAppointments = prevApptSnap.docs.map(d => d.data() as any);

    // ── Calculate stats ──
    const totalViews = pageViews.length;
    const prevTotalViews = prevPageViews.length;
    const uniqueSessions = new Set(pageViews.map(v => v.sessionId)).size;
    const prevUniqueSessions = new Set(prevPageViews.map(v => v.sessionId)).size;
    const totalAppointments = appointments.length;
    const prevTotalAppointments = prevAppointments.length;

    // ── Page breakdown ──
    const pageBreakdown: Record<string, number> = {};
    pageViews.forEach(v => {
      const p = v.path || "/";
      pageBreakdown[p] = (pageBreakdown[p] || 0) + 1;
    });
    const topPages = Object.entries(pageBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // ── Daily breakdown ──
    const dailyViews: Record<string, number> = {};
    const dailyAppts: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Africa/Kigali" });
      dailyViews[key] = 0;
      dailyAppts[key] = 0;
    }
    pageViews.forEach(v => {
      if (v.timestamp) {
        const d = new Date(v.timestamp.seconds ? v.timestamp.seconds * 1000 : v.timestamp);
        const key = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Africa/Kigali" });
        if (key in dailyViews) dailyViews[key]++;
      }
    });
    appointments.forEach(a => {
      if (a.created_at) {
        const d = new Date(a.created_at.seconds ? a.created_at.seconds * 1000 : a.created_at);
        const key = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Africa/Kigali" });
        if (key in dailyAppts) dailyAppts[key]++;
      }
    });

    // ── Department breakdown for appointments ──
    const deptBreakdown: Record<string, number> = {};
    appointments.forEach(a => {
      const dept = a.department || "Unknown";
      deptBreakdown[dept] = (deptBreakdown[dept] || 0) + 1;
    });
    const topDepts = Object.entries(deptBreakdown).sort((a, b) => b[1] - a[1]);

    // ── Comparison helpers ──
    const viewsChange = prevTotalViews > 0 ? ((totalViews - prevTotalViews) / prevTotalViews * 100).toFixed(1) : "N/A";
    const sessionsChange = prevUniqueSessions > 0 ? ((uniqueSessions - prevUniqueSessions) / prevUniqueSessions * 100).toFixed(1) : "N/A";
    const apptChange = prevTotalAppointments > 0 ? ((totalAppointments - prevTotalAppointments) / prevTotalAppointments * 100).toFixed(1) : "N/A";

    const arrow = (val: string) => val === "N/A" ? "" : Number(val) >= 0 ? ` ▲${val}%` : ` ▼${Math.abs(Number(val))}%`;
    const arrowColor = (val: string) => val === "N/A" ? "#94a3b8" : Number(val) >= 0 ? "#16a34a" : "#dc2626";

    // ── Daily table rows ──
    const dailyRows = Object.entries(dailyViews).map(([day, views]) => {
      const appts = dailyAppts[day] || 0;
      return `<tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #374151;">${day}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #475569; text-align: center;">${views}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #475569; text-align: center;">${appts}</td>
      </tr>`;
    }).join("");

    // ── Top pages rows ──
    const topPagesRows = topPages.map(([page, count]) => {
      return `<tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #374151;">${page}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #475569; text-align: center;">${count}</td>
      </tr>`;
    }).join("");

    // ── Department rows ──
    const deptRows = topDepts.length > 0 ? topDepts.map(([dept, count]) => {
      return `<tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #374151;">${dept}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #475569; text-align: center;">${count}</td>
      </tr>`;
    }).join("") : `<tr><td colspan="2" style="padding: 16px; text-align: center; color: #94a3b8; font-size: 13px;">No appointments this week</td></tr>`;

    // ── Recent appointments list ──
    const recentAppts = appointments.slice(0, 10).map(a => {
      const date = a.preferred_date || "N/A";
      const time = a.preferred_time || "N/A";
      const name = a.full_name || "Unknown";
      const dept = a.department || "N/A";
      const status = a.status || "pending";
      const statusColor = status === "pending" ? "#f59e0b" : status === "confirmed" ? "#16a34a" : status === "completed" ? "#0d9488" : "#dc2626";
      return `<tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #374151;">${name}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #475569;">${dept}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #475569;">${date} ${time}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 12px; text-align: center;"><span style="background: ${statusColor}15; color: ${statusColor}; padding: 2px 8px; border-radius: 6px; font-weight: 600; text-transform: capitalize;">${status}</span></td>
      </tr>`;
    }).join("");

    const reportPeriod = `${formatDate(weekAgo)} — ${formatDate(now)}`;
    const generatedAt = `${formatDate(now)} at ${formatTime(now)} (CAT)`;

    // ── Build professional HTML report ──
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background: #f8fafc; font-family: Arial, sans-serif;">

  <div style="max-width: 680px; margin: 0 auto; padding: 24px;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); border-radius: 16px 16px 0 0; padding: 32px 28px; text-align: center;">
      <h1 style="color: #fff; font-size: 22px; margin: 0 0 6px; font-weight: 800; letter-spacing: -0.02em;">Umurinzi Petros Medical Center</h1>
      <p style="color: #ccfbf1; font-size: 14px; margin: 0; font-weight: 600;">Weekly Analytics Report</p>
      <p style="color: #99f6e4; font-size: 12px; margin: 8px 0 0;">${reportPeriod}</p>
    </div>

    <!-- Summary Cards -->
    <div style="background: #fff; padding: 28px 24px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
      <h2 style="color: #0f172a; font-size: 16px; margin: 0 0 20px; font-weight: 800;">Executive Summary</h2>

      <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;">
        <div style="flex: 1; min-width: 140px; background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 12px; padding: 18px 16px; text-align: center;">
          <p style="color: #0d9488; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px;">Page Views</p>
          <p style="color: #0f172a; font-size: 28px; font-weight: 900; margin: 0;">${totalViews}</p>
          <p style="color: ${arrowColor(viewsChange)}; font-size: 11px; font-weight: 700; margin: 4px 0 0;">vs last week${arrow(viewsChange)}</p>
        </div>
        <div style="flex: 1; min-width: 140px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 18px 16px; text-align: center;">
          <p style="color: #2563eb; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px;">Unique Visitors</p>
          <p style="color: #0f172a; font-size: 28px; font-weight: 900; margin: 0;">${uniqueSessions}</p>
          <p style="color: ${arrowColor(sessionsChange)}; font-size: 11px; font-weight: 700; margin: 4px 0 0;">vs last week${arrow(sessionsChange)}</p>
        </div>
        <div style="flex: 1; min-width: 140px; background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 18px 16px; text-align: center;">
          <p style="color: #d97706; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px;">Appointments</p>
          <p style="color: #0f172a; font-size: 28px; font-weight: 900; margin: 0;">${totalAppointments}</p>
          <p style="color: ${arrowColor(apptChange)}; font-size: 11px; font-weight: 700; margin: 4px 0 0;">vs last week${arrow(apptChange)}</p>
        </div>
      </div>

      <!-- Daily Breakdown -->
      <h2 style="color: #0f172a; font-size: 16px; margin: 0 0 16px; font-weight: 800;">Daily Breakdown</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
        <thead>
          <tr style="background: #f8fafc;">
            <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 2px solid #e2e8f0;">Day</th>
            <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 2px solid #e2e8f0;">Views</th>
            <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 2px solid #e2e8f0;">Appointments</th>
          </tr>
        </thead>
        <tbody>${dailyRows}</tbody>
      </table>

      <!-- Top Pages -->
      ${topPagesRows ? `
      <h2 style="color: #0f172a; font-size: 16px; margin: 0 0 16px; font-weight: 800;">Most Visited Pages</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
        <thead>
          <tr style="background: #f8fafc;">
            <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 2px solid #e2e8f0;">Page</th>
            <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 2px solid #e2e8f0;">Views</th>
          </tr>
        </thead>
        <tbody>${topPagesRows}</tbody>
      </table>` : ""}

      <!-- Department Breakdown -->
      <h2 style="color: #0f172a; font-size: 16px; margin: 0 0 16px; font-weight: 800;">Appointment Requests by Department</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
        <thead>
          <tr style="background: #f8fafc;">
            <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 2px solid #e2e8f0;">Department</th>
            <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 2px solid #e2e8f0;">Requests</th>
          </tr>
        </thead>
        <tbody>${deptRows}</tbody>
      </table>

      <!-- Recent Appointments -->
      ${recentAppts ? `
      <h2 style="color: #0f172a; font-size: 16px; margin: 0 0 16px; font-weight: 800;">Recent Appointment Requests</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <thead>
          <tr style="background: #f8fafc;">
            <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 2px solid #e2e8f0;">Patient</th>
            <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 2px solid #e2e8f0;">Department</th>
            <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 2px solid #e2e8f0;">Date / Time</th>
            <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 2px solid #e2e8f0;">Status</th>
          </tr>
        </thead>
        <tbody>${recentAppts}</tbody>
      </table>
      ${appointments.length > 10 ? `<p style="font-size: 12px; color: #94a3b8; margin: 8px 0 0;">Showing 10 of ${appointments.length} appointments</p>` : ""}` : ""}

    </div>

    <!-- Footer -->
    <div style="background: #0f172a; border-radius: 0 0 16px 16px; padding: 20px 28px; text-align: center;">
      <p style="color: #94a3b8; font-size: 12px; margin: 0 0 4px;">Report generated on ${generatedAt}</p>
      <p style="color: #64748b; font-size: 11px; margin: 0;">Umurinzi Petros Medical Center &middot; Shyogwe Sector, Muhanga District, Southern Province, Rwanda</p>
      <p style="color: #475569; font-size: 11px; margin: 8px 0 0;">This is an automated weekly report. Replies to this email are not monitored.</p>
    </div>

  </div>
</body>
</html>
    `;

    // ── Send the report ──
    await resend.emails.send({
      from: FROM_EMAIL,
      to: CLINIC_EMAIL,
      subject: `Weekly Report — ${formatDate(weekAgo)} to ${formatDate(now)} — UPMC`,
      html,
    });

    console.log("[weekly-report] Report sent successfully at", generatedAt);
    return { success: true };

  } catch (err: any) {
    console.error("[weekly-report] Error:", err?.message || err);
    return { success: false, error: err?.message || "Unknown error" };
  }
}

// ── Manual trigger endpoint (for external cron or testing) ──
app.post("/api/weekly-report", (req, res) => {
  const triggerKey = process.env.REPORT_TRIGGER_KEY || "";
  if (triggerKey && req.body?.key !== triggerKey) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  (async () => {
    const result = await generateAndSendWeeklyReport();
    if (result.success) {
      res.status(200).json({ success: true, message: "Weekly report sent" });
    } else {
      res.status(500).json({ error: result.error || "Failed to send report" });
    }
  })();
});

// ── GET version for external cron services ──
app.get("/api/weekly-report", (req, res) => {
  const triggerKey = process.env.REPORT_TRIGGER_KEY || "";
  if (triggerKey && req.query?.key !== triggerKey) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  (async () => {
    const result = await generateAndSendWeeklyReport();
    if (result.success) {
      res.status(200).json({ success: true, message: "Weekly report sent" });
    } else {
      res.status(500).json({ error: result.error || "Failed to send report" });
    }
  })();
});

// ─────────────────────────────────────────────────────────────────────────────
//  SCHEDULER — sends weekly report every Monday at 7:00 PM CAT (UTC+2 = 17:00 UTC)
// ─────────────────────────────────────────────────────────────────────────────
let lastReportSent = "";

function checkAndSendWeeklyReport() {
  const now = new Date();
  // CAT = UTC+2, so 7 PM CAT = 17:00 UTC
  const utcDay = now.getUTCDay(); // 0=Sun, 1=Mon
  const utcHour = now.getUTCHours();
  const utcMin = now.getUTCMinutes();
  const dateKey = now.toISOString().slice(0, 10);

  if (utcDay === 1 && utcHour === 17 && utcMin < 5) {
    if (lastReportSent !== dateKey) {
      lastReportSent = dateKey;
      console.log("[scheduler] Monday 7 PM CAT reached — sending weekly report...");
      generateAndSendWeeklyReport().catch(err => console.error("[scheduler] Report error:", err));
    }
  }
}

// Check every minute
setInterval(checkAndSendWeeklyReport, 60 * 1000);

// ── Keep-alive self-ping (prevents Render free tier from sleeping) ──
const SELF_PING_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
setInterval(() => {
  fetch(`${SELF_PING_URL}/api/health`).catch(() => {});
}, 5 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`UPMC API server running on port ${PORT}`);
  console.log("[scheduler] Weekly report scheduled for every Monday at 7:00 PM CAT (17:00 UTC)");
});
