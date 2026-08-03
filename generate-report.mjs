import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  PageBreak, Footer, Header, PageNumber, NumberFormat,
} from "docx";
import fs from "fs";

const TEAL = "0D9488";
const DARK = "0F172A";
const GRAY = "64748B";
const LIGHT_BG = "F0FDFA";
const WHITE = "FFFFFF";

function heading(text, level = HeadingLevel.HEADING_1, color = TEAL) {
  return new Paragraph({
    heading: level,
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text, bold: true, color, size: level === HeadingLevel.HEADING_1 ? 32 : 26 })],
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [new TextRun({ text, size: 22, color: opts.color || DARK, bold: opts.bold || false, italics: opts.italics || false })],
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    spacing: { after: 80, line: 320 },
    bullet: { level },
    children: [new TextRun({ text, size: 22, color: DARK })],
  });
}

function cell(text, opts = {}) {
  return new TableCell({
    shading: opts.bg ? { type: ShadingType.CLEAR, fill: opts.bg, color: "auto" } : undefined,
    width: { size: opts.width || 50, type: WidthType.PERCENTAGE },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({ text, size: 20, bold: opts.bold || false, color: opts.color || DARK })],
    })],
  });
}

function headerCell(text, width) {
  return cell(text, { bg: TEAL, color: WHITE, bold: true, align: AlignmentType.CENTER, width });
}

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" };

const tableBorders = {
  top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder,
  insideHorizontal: thinBorder, insideVertical: thinBorder,
};

// ── Title Page ──
const titlePage = [
  new Paragraph({ spacing: { before: 2000 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "UMURINZI PETROS MEDICAL CENTER", bold: true, size: 40, color: TEAL })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
    children: [new TextRun({ text: "Official Website — Project Report", size: 28, color: GRAY })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: "Prepared for Senior Management", size: 24, color: DARK, italics: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: "Shyogwe Sector, Muhanga District", size: 22, color: GRAY })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: "Southern Province, Rwanda", size: 22, color: GRAY })],
  }),
  new Paragraph({ spacing: { before: 800 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: `Date: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, size: 22, color: GRAY })],
  }),
  new Paragraph({
    children: [new PageBreak()],
  }),
];

// ── Table of Contents ──
const toc = [
  heading("Table of Contents", HeadingLevel.HEADING_1),
  para("1. Executive Summary"),
  para("2. Project Overview"),
  para("3. Website Features & Pages"),
  para("4. Content Management System (Admin Panel)"),
  para("5. Drag-and-Drop Reordering System"),
  para("6. Appointment Booking System"),
  para("7. Weekly Analytics Report System"),
  para("8. Multi-Language Support"),
  para("9. Technology Stack"),
  para("10. Deployment & Infrastructure"),
  para("11. Security & Data Management"),
  para("12. Recommendations & Future Enhancements"),
  para("13. Conclusion"),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── 1. Executive Summary ──
const execSummary = [
  heading("1. Executive Summary", HeadingLevel.HEADING_1),
  para("This report presents a comprehensive overview of the Umurinzi Petros Medical Center (UPMC) official website, developed to serve as the digital front door of the clinic. The website provides patients with access to information about medical services, doctors, staff, research activities, and a streamlined appointment booking system."),
  para("The website features a modern, responsive design accessible on desktop, tablet, and mobile devices. It includes a full content management system (CMS) that allows clinic administrators to update all content — including services, doctor profiles, staff listings, research publications, and contact information — without requiring technical expertise."),
  para("Key recent enhancements include:"),
  bullet("Addition of Laboratory Services as a new department across the website"),
  bullet("Correction of the clinic's location to Southern Province (Muhanga District, Shyogwe Sector)"),
  bullet("Drag-and-drop reordering system for all lists in the admin panel (doctors, staff, services, research team, research areas, and education items)"),
  bullet("Automated weekly analytics report sent to clinic email every Monday at 7:00 PM CAT"),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── 2. Project Overview ──
const projectOverview = [
  heading("2. Project Overview", HeadingLevel.HEADING_1),
  para("The UPMC website was built to establish a professional online presence for the clinic, making it easier for patients to:"),
  bullet("Discover available medical services and departments"),
  bullet("Learn about doctors and staff members"),
  bullet("Book appointments online with preferred doctors"),
  bullet("Access contact information and clinic location"),
  bullet("Explore research and education initiatives"),
  para("The website serves as a 24/7 information portal, reducing the need for phone calls for basic inquiries and providing a convenient appointment booking channel.", { spacing: { after: 200 } }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── 3. Website Features & Pages ──
const featuresSection = [
  heading("3. Website Features & Pages", HeadingLevel.HEADING_1),
  heading("3.1 Home Page", HeadingLevel.HEADING_2),
  para("The landing page features a hero section with the clinic's mission, quick navigation to key sections, highlights of services, and a call-to-action for appointment booking."),
  heading("3.2 Services Page", HeadingLevel.HEADING_2),
  para("Displays all medical services organized by department. Services include:"),
  bullet("Internal Medicine (Cardiology, Dermatology, Endocrinology, Gastroenterology, Neurology, Nephrology)"),
  bullet("Surgical Services (General Surgery, Orthopedics, Ophthalmology, ENT)"),
  bullet("Maternal & Child Health (Obstetrics & Gynecology, Pediatrics)"),
  bullet("Emergency & Critical Care"),
  bullet("Diagnostic Imaging (X-ray, Ultrasound, ECG)"),
  bullet("Pharmacy Services"),
  bullet("Laboratory Services (newly added)"),
  heading("3.3 Doctors Page", HeadingLevel.HEADING_2),
  para("Professional profiles of all doctors with photos, specialties, and biographical information."),
  heading("3.4 Staff Page", HeadingLevel.HEADING_2),
  para("Lists all clinic staff members with their positions, photos, and short bios."),
  heading("3.5 Departments Page", HeadingLevel.HEADING_2),
  para("Detailed information about the Medical Department and Research & Education Department, including services offered and key personnel."),
  heading("3.6 Research Page", HeadingLevel.HEADING_2),
  para("Showcases research areas, team members, education programs, publications with automatic citation counts from OpenAlex, and research partner logos."),
  heading("3.7 Appointment Page", HeadingLevel.HEADING_2),
  para("A user-friendly form where patients can request appointments by selecting department, preferred doctor, date, time, and providing their contact details. Submissions trigger automatic email notifications to clinic staff and confirmation emails to patients."),
  heading("3.8 Contact Page", HeadingLevel.HEADING_2),
  para("Displays the clinic's address (Southern Province, Muhanga District, Shyogwe Sector), phone numbers, email, and an embedded map."),
  heading("3.9 Our Story Page", HeadingLevel.HEADING_2),
  para("Tells the history and mission of Umurinzi Petros Medical Center."),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── 4. Content Management System ──
const cmsSection = [
  heading("4. Content Management System (Admin Panel)", HeadingLevel.HEADING_1),
  para("The website includes a built-in admin panel accessible via keyboard shortcut (Ctrl+U). It provides clinic administrators with full control over all website content without needing developer assistance."),
  heading("Admin Panel Sections", HeadingLevel.HEADING_2),
  para(""),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      new TableRow({ children: [headerCell("Section", 40), headerCell("Capabilities", 60)] }),
      new TableRow({ children: [cell("Services", { bold: true }), cell("Add, edit, delete, reorder service cards with translations")] }),
      new TableRow({ children: [cell("Doctors", { bold: true }), cell("Add, edit, delete, reorder doctor profiles with photos")] }),
      new TableRow({ children: [cell("Staff", { bold: true }), cell("Add, edit, delete, reorder staff member profiles")] }),
      new TableRow({ children: [cell("Research Team", { bold: true }), cell("Manage research team members with photos and bios")] }),
      new TableRow({ children: [cell("Research Areas", { bold: true }), cell("Add, edit, reorder research categories and topics")] }),
      new TableRow({ children: [cell("Education", { bold: true }), cell("Manage education program listings")] }),
      new TableRow({ children: [cell("Publications", { bold: true }), cell("Add publications with DOI, auto-fetches citations")] }),
      new TableRow({ children: [cell("Contact Info", { bold: true }), cell("Update address, phone, email, emergency contacts")] }),
      new TableRow({ children: [cell("News Ticker", { bold: true }), cell("Manage scrolling announcement bar messages")] }),
      new TableRow({ children: [cell("Department Info", { bold: true }), cell("Edit department descriptions and service lists")] }),
      new TableRow({ children: [cell("Appointments", { bold: true }), cell("View, confirm, reschedule, cancel appointments")] }),
    ],
  }),
  para(""),
  para("All changes made in the admin panel are saved to both local browser storage and Firebase Firestore cloud database, ensuring data persistence and synchronization across devices.", { spacing: { after: 200 } }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── 5. Drag-and-Drop Reordering ──
const reorderSection = [
  heading("5. Drag-and-Drop Reordering System", HeadingLevel.HEADING_1),
  para("A flexible drag-and-drop reordering system has been implemented across all list-based sections in the admin panel. This allows administrators to arrange the display order of items exactly as they want them to appear on the public website."),
  heading("How It Works", HeadingLevel.HEADING_2),
  bullet("Each card in the admin panel has a drag handle (⠿) with up (▲) and down (▼) arrow buttons on the left side"),
  bullet("The admin can drag any card up or down to any position in the list"),
  bullet("Alternatively, the admin can click ▲ to move a card one position up or ▼ to move it one position down"),
  bullet("Visual feedback: the dragged card becomes semi-transparent, and the drop target shows a dashed teal border"),
  bullet("Changes are saved immediately to local storage and synced to the Firebase cloud database"),
  heading("Sections with Drag-and-Drop", HeadingLevel.HEADING_2),
  bullet("Doctors list"),
  bullet("Staff members list"),
  bullet("Service cards (within and across departments)"),
  bullet("Research team members"),
  bullet("Research areas"),
  bullet("Education items"),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── 6. Appointment Booking ──
const apptSection = [
  heading("6. Appointment Booking System", HeadingLevel.HEADING_1),
  para("The website features a complete online appointment booking system that allows patients to request appointments without calling the clinic."),
  heading("Patient Flow", HeadingLevel.HEADING_2),
  bullet("Patient fills out the appointment form with: full name, phone, email (optional), department, preferred doctor, preferred date, preferred time, and reason for visit"),
  bullet("On submission, the appointment is saved to Firebase Firestore database"),
  bullet("An email notification is sent to the clinic staff email (umurinzipetrosmedicalcenter@gmail.com) with full appointment details"),
  bullet("A confirmation email is sent to the patient (if email provided) with appointment details and contact information"),
  bullet("The patient sees a success confirmation on the website"),
  heading("Admin Management", HeadingLevel.HEADING_2),
  bullet("All appointments appear in the admin panel under the Appointments section"),
  bullet("Admin can update appointment status: Pending → Confirmed → Completed, or Rescheduled / Cancelled"),
  bullet("Appointments are sorted by creation date (newest first)"),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── 7. Weekly Analytics Report ──
const analyticsSection = [
  heading("7. Weekly Analytics Report System", HeadingLevel.HEADING_1),
  para("An automated weekly analytics report system has been implemented to provide clinic management with regular insights into website performance and patient engagement."),
  heading("Report Schedule", HeadingLevel.HEADING_2),
  para("The report is automatically generated and emailed to umurinzipetrosmedicalcenter@gmail.com every Monday at 7:00 PM Central Africa Time (CAT)."),
  heading("Report Contents", HeadingLevel.HEADING_2),
  bullet("Executive Summary with three key metrics: Total Page Views, Unique Visitors, and Appointment Requests"),
  bullet("Week-over-week comparison showing percentage change (with ▲ increase / ▼ decrease indicators)"),
  bullet("Daily breakdown table showing page views and appointments for each day of the past week"),
  bullet("Most visited pages table (top 10)"),
  bullet("Appointment requests by department"),
  bullet("Recent appointment requests table (up to 10) with patient name, department, date/time, and status"),
  heading("Technical Implementation", HeadingLevel.HEADING_2),
  bullet("Page views are tracked in Firebase Firestore (upmc-analytics collection) every time a visitor navigates to a page"),
  bullet("Appointments are tracked in the appointments collection with timestamps"),
  bullet("The server generates a professional HTML email report with UPMC branding (teal gradient header, formatted tables, color-coded status badges)"),
  bullet("A self-ping mechanism keeps the server alive on Render's free tier"),
  bullet("A manual trigger endpoint is available for testing: GET /api/weekly-report"),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── 8. Multi-Language Support ──
const langSection = [
  heading("8. Multi-Language Support", HeadingLevel.HEADING_1),
  para("The website supports four languages to serve the diverse population of Rwanda and the broader East African region:"),
  bullet("English (default)"),
  bullet("Kinyarwanda (Ikinyarwanda)"),
  bullet("French (Français)"),
  bullet("Swahili (Kiswahili)"),
  para("A language switcher in the header allows visitors to instantly change the website language. Service descriptions and key content can have translations managed through the admin panel."),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── 9. Technology Stack ──
const techSection = [
  heading("9. Technology Stack", HeadingLevel.HEADING_1),
  para(""),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      new TableRow({ children: [headerCell("Component", 35), headerCell("Technology", 65)] }),
      new TableRow({ children: [cell("Frontend Framework", { bold: true }), cell("React 18 with TypeScript")] }),
      new TableRow({ children: [cell("Build Tool", { bold: true }), cell("Vite 6")] }),
      new TableRow({ children: [cell("Styling", { bold: true }), cell("Tailwind CSS + inline styles")] }),
      new TableRow({ children: [cell("Icons", { bold: true }), cell("Lucide React")] }),
      new TableRow({ children: [cell("Animations", { bold: true }), cell("Framer Motion")] }),
      new TableRow({ children: [cell("Routing", { bold: true }), cell("React Router DOM")] }),
      new TableRow({ children: [cell("Charts", { bold: true }), cell("Recharts")] }),
      new TableRow({ children: [cell("Backend", { bold: true }), cell("Node.js + Express")] }),
      new TableRow({ children: [cell("Database", { bold: true }), cell("Firebase Firestore (cloud) + LocalStorage (offline)")] }),
      new TableRow({ children: [cell("Email Service", { bold: true }), cell("Resend API")] }),
      new TableRow({ children: [cell("Hosting", { bold: true }), cell("Render (frontend + API)")] }),
      new TableRow({ children: [cell("Version Control", { bold: true }), cell("Git + GitHub")] }),
    ],
  }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── 10. Deployment ──
const deploySection = [
  heading("10. Deployment & Infrastructure", HeadingLevel.HEADING_1),
  heading("Frontend (Static Site)", HeadingLevel.HEADING_2),
  para("The website frontend is deployed as a static site on Render. It is built using Vite and served as optimized static files with proper caching headers (assets cached for 1 year, HTML not cached to ensure updates are always served)."),
  heading("API Backend", HeadingLevel.HEADING_2),
  para("The Express.js API server runs on Render as a Node.js web service. It handles:"),
  bullet("Appointment booking email notifications (via Resend)"),
  bullet("Page view tracking (backup endpoint)"),
  bullet("Weekly report generation and scheduling"),
  bullet("Health check endpoint for monitoring"),
  heading("Database", HeadingLevel.HEADING_2),
  para("Firebase Firestore serves as the cloud database, storing all website content, images, appointments, and analytics data. The website uses a hybrid storage model — data is saved to both LocalStorage (for instant offline access) and Firestore (for cloud sync and persistence)."),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── 11. Security ──
const securitySection = [
  heading("11. Security & Data Management", HeadingLevel.HEADING_1),
  bullet("Admin panel access is protected by a keyboard shortcut (Ctrl+U) known only to authorized staff"),
  bullet("Optional REPORT_TRIGGER_KEY environment variable secures the manual report trigger endpoint"),
  bullet("Firestore security rules restrict access to authorized collections only"),
  bullet("All data is synced to cloud storage, providing backup and recovery capabilities"),
  bullet("Patient appointment data is stored securely in Firebase Firestore"),
  bullet("Email notifications are sent via Resend, a trusted email API provider"),
  bullet("The website uses HTTPS for all communications"),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── 12. Recommendations ──
const recommendations = [
  heading("12. Recommendations & Future Enhancements", HeadingLevel.HEADING_1),
  heading("Short-Term", HeadingLevel.HEADING_2),
  bullet("Deploy updated Firestore security rules to enable analytics and appointment tracking"),
  bullet("Set up REPORT_TRIGGER_KEY environment variable on Render for report endpoint security"),
  bullet("Test the weekly report by visiting the manual trigger URL after deployment"),
  bullet("Add Google Analytics or similar for more detailed visitor insights"),
  heading("Medium-Term", HeadingLevel.HEADING_2),
  bullet("Implement SMS notifications for appointment confirmations (via Africa's Talking or similar)"),
  bullet("Add online payment integration for appointment fees"),
  bullet("Implement a patient portal where patients can view their appointment history"),
  bullet("Add a blog/news section for health education articles"),
  heading("Long-Term", HeadingLevel.HEADING_2),
  bullet("Develop a mobile app (React Native) for appointment booking and telemedicine"),
  bullet("Integrate with electronic health records (EHR) systems"),
  bullet("Add live chat support for real-time patient inquiries"),
  bullet("Implement AI-powered symptom checker for appointment routing"),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── 13. Conclusion ──
const conclusion = [
  heading("13. Conclusion", HeadingLevel.HEADING_1),
  para("The Umurinzi Petros Medical Center website is a comprehensive, modern web platform that serves both patients and clinic management. It provides patients with easy access to information and appointment booking, while giving administrators full control over all content through an intuitive admin panel."),
  para("Recent enhancements — including the Laboratory service addition, location correction, drag-and-drop reordering, and the automated weekly analytics report — have further strengthened the website's capabilities and usability."),
  para("The website is built on a scalable, modern technology stack and is ready for future enhancements as the clinic grows and expands its services. The automated weekly report will provide management with regular insights to make data-driven decisions about service delivery and patient engagement."),
  new Paragraph({ spacing: { before: 600 } }),
  para("— End of Report —", { align: AlignmentType.CENTER, color: GRAY, italics: true }),
];

// ── Build Document ──
const doc = new Document({
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "UPMC Website Report", size: 18, color: GRAY, italics: true })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", size: 18, color: GRAY }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: GRAY }),
            new TextRun({ text: " of ", size: 18, color: GRAY }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: GRAY }),
          ],
        })],
      }),
    },
    children: [
      ...titlePage,
      ...toc,
      ...execSummary,
      ...projectOverview,
      ...featuresSection,
      ...cmsSection,
      ...reorderSection,
      ...apptSection,
      ...analyticsSection,
      ...langSection,
      ...techSection,
      ...deploySection,
      ...securitySection,
      ...recommendations,
      ...conclusion,
    ],
  }],
});

const outPath = "UPMC_Website_Report.docx";
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outPath, buffer);
console.log(`Report generated: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
