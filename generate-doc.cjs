const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, PageBreak, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType,
} = require("docx");

const ROOT = path.resolve(__dirname);
const SRC = path.join(ROOT, "src");

// Collect all source files (excluding ui/ components which are standard shadcn)
const filesToInclude = [];
function collectFiles(dir, base) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const fullPath = path.join(dir, e.name);
    const relPath = path.relative(ROOT, fullPath).replace(/\\/g, "/");
    if (e.isDirectory()) {
      // Skip ui/ components (standard shadcn/ui), node_modules, dist, .git
      if (relPath.includes("node_modules") || relPath.includes("dist") || relPath.includes(".git")) continue;
      collectFiles(fullPath, base);
    } else if (e.isFile()) {
      const ext = path.extname(e.name);
      if ([".tsx", ".ts", ".css", ".md", ".json", ".html", ".yaml", ".env"].includes(ext)) {
        // Skip ui/ components and package-lock.json
        if (relPath.includes("/ui/") || relPath === "package-lock.json") continue;
        filesToInclude.push({ relPath, fullPath, ext });
      }
    }
  }
}

// Also include root config files
const rootFiles = [
  "package.json", "vite.config.ts", "index.html", "render.yaml",
  "vercel.json", ".env.example", ".gitignore", "README.md",
];
for (const f of rootFiles) {
  const fp = path.join(ROOT, f);
  if (fs.existsSync(fp)) {
    filesToInclude.push({ relPath: f, fullPath: fp, ext: path.extname(f) });
  }
}
collectFiles(SRC, SRC);

// Sort files by path
filesToInclude.sort((a, b) => a.relPath.localeCompare(b.relPath));

// File descriptions
const fileDescriptions = {
  "package.json": "Project dependencies and scripts. Uses React 18, Vite 6, TypeScript, Firebase, Cloudinary, Nodemailer, Radix UI components, Lucide icons, Recharts, and Tailwind CSS.",
  "vite.config.ts": "Vite configuration with a custom email proxy plugin. The plugin intercepts POST requests to /api/book-appointment and sends appointment emails via Nodemailer/Gmail SMTP to the clinic email. Also configures build chunking for vendor and icons.",
  "index.html": "HTML entry point. Loads the React app, includes Google Fonts, and sets up the root div.",
  "src/main.tsx": "React DOM entry point. Renders the App component into the #root element and imports the global CSS.",
  "src/App.tsx": "Main application component. Manages page routing (home, services, about, doctors, staff, departments, contact, research, appointment), admin panel toggle (Ctrl+U), cloud sync on mount, and layout structure (AnnouncementBar + Header + main content + Footer).",
  "src/index.css": "Global CSS styles including Tailwind CSS imports, custom animations, marquee keyframes, and responsive utilities.",
  "src/styles/globals.css": "Additional global CSS styles.",
  "src/i18n/LanguageContext.tsx": "React Context for internationalization. Supports English, Kinyarwanda, French, and Swahili. Stores language preference in localStorage.",
  "src/i18n/translations.ts": "All UI translations for 4 languages (en, kin, fr, sw). Contains text for navigation, home, services, doctors, staff, departments, contact, research, appointment, footer, and emergency sections.",
  "src/lib/cloud.ts": "Cloud sync utilities. Uses Firebase Firestore for data persistence and Cloudinary for image uploads. Fetches and syncs localStorage data to/from Firestore. Includes debounced sync to prevent excessive writes.",
  "src/lib/appointments.ts": "Appointment management. Uses Firebase Firestore for storing appointments with localStorage fallback. CRUD operations: save, fetch, update status, delete. Status types: pending, confirmed, rescheduled, cancelled, completed.",
  "src/components/Header.tsx": "Navigation header. Contains logo, navigation menu (Home, Services, Departments, Doctors, Staff, Research, About, Contact, Appointment), phone numbers display, language switcher, and mobile menu toggle.",
  "src/components/AnnouncementBar.tsx": "Top announcement bar. Displays scrolling news ticker, phone number (WhatsApp link), email, and operating hours. Data loaded from localStorage with cloud sync support.",
  "src/components/Footer.tsx": "Footer with clinic description, quick links, contact info (two phone numbers, email with mailto, address, hours), social media links (Instagram, LinkedIn, X), and admin panel access button.",
  "src/components/AdminPanel.tsx": "Comprehensive admin panel (117KB). Manages: doctors (add/edit/delete, photos, single biography), staff (add/edit/delete, photos, bios), departments (add/edit/delete, photos, items), research team, research areas, publications, education items, partner logos, contacts, news ticker, and appointments. Accessed via Ctrl+U.",
  "src/components/HeroSection.tsx": "Homepage hero section with headline, subtitle, and call-to-action buttons.",
  "src/components/AboutSection.tsx": "Homepage about section with clinic description and values.",
  "src/components/ServicesSection.tsx": "Homepage services preview section.",
  "src/components/DepartmentsSection.tsx": "Homepage departments preview section.",
  "src/components/DeptSliders.tsx": "Department image sliders/carousel component.",
  "src/components/CTASection.tsx": "Call-to-action section on homepage.",
  "src/components/PhilosophySection.tsx": "Clinic philosophy/values section on homepage.",
  "src/components/TestimonialsSection.tsx": "Patient testimonials section on homepage.",
  "src/components/PartnerCarousel.tsx": "Research partner logos carousel.",
  "src/components/figma/ImageWithFallback.tsx": "Image component with error fallback to placeholder.",
  "src/pages/HomePage.tsx": "Homepage. Composes hero, about, services, departments, philosophy, CTA, and testimonials sections.",
  "src/pages/ServicesPage.tsx": "Services page. Lists all medical services offered by the clinic.",
  "src/pages/DoctorsPage.tsx": "Doctors page. Vertical card layout with photo floating left, name, specialty, and unified biography wrapping around the photo. Uses 3:4 portrait aspect ratio with object-fit: cover.",
  "src/pages/StaffPage.tsx": "Staff page. Same vertical card layout as doctors. Photo floats left, name, position, and bio wrap around. Bio uses pre-wrap for paragraph breaks and justified text.",
  "src/pages/DepartmentsPage.tsx": "Departments page. Grid layout with department cards, photos, and department items.",
  "src/pages/ResearchPage.tsx": "Research & Education page. Contains team member cards (same style as doctors/staff), research areas, publications (with DOI links), education programs, and partner logos slider.",
  "src/pages/AppointmentPage.tsx": "Appointment booking page. Form with full name, phone, email, department, date, time, reason. Submits to Firestore and sends email via Vite proxy. Success/error states.",
  "src/pages/ContactPage.tsx": "Contact page. Shows clinic address, phone numbers (WhatsApp link), email (mailto), hours, emergency info, and Google Maps embed.",
  "src/pages/OurStoryPage.tsx": "Our Story page. Single narrative block about Umurinzi Petros Medical Center's mission, values, and partnerships.",
  "src/pages/AboutPage.tsx": "About page (may redirect to Our Story).",
};

function getLanguageForFile(ext) {
  switch (ext) {
    case ".tsx": case ".ts": return "TypeScript/React";
    case ".css": return "CSS";
    case ".md": return "Markdown";
    case ".json": return "JSON";
    case ".html": return "HTML";
    case ".yaml": return "YAML";
    default: return "Text";
  }
}

// Build document sections
const children = [];

// Title page
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 2000, after: 200 },
  children: [new TextRun({ text: "UMURINZI PETROS MEDICAL CENTER", size: 48, bold: true, color: "0D9488" })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 100, after: 100 },
  children: [new TextRun({ text: "UPMC Clinic Website", size: 36, bold: true, color: "0F172A" })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 100, after: 400 },
  children: [new TextRun({ text: "Comprehensive Technical Documentation", size: 28, color: "475569" })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 100, after: 100 },
  children: [new TextRun({ text: "Full Source Code, Architecture, and File-by-File Explanation", size: 22, color: "64748B" })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 200, after: 100 },
  children: [new TextRun({ text: `Generated: ${new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}`, size: 20, color: "94A3B8" })],
}));
children.push(new Paragraph({ children: [new PageBreak()] }));

// Table of Contents
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 200, after: 200 },
  children: [new TextRun({ text: "Table of Contents", size: 32, bold: true, color: "0D9488" })],
}));
const tocItems = [
  "1. Project Overview",
  "2. Technology Stack",
  "3. Architecture & Data Flow",
  "4. File Structure",
  "5. Configuration Files",
  "6. Core Application Files",
  "7. Internationalization (i18n)",
  "8. Library Utilities (lib/)",
  "9. Components",
  "10. Pages",
  "11. Styling",
  "12. Deployment Configuration",
];
for (const item of tocItems) {
  children.push(new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: item, size: 22, color: "334155" })],
  }));
}
children.push(new Paragraph({ children: [new PageBreak()] }));

// 1. Project Overview
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 200, after: 200 },
  children: [new TextRun({ text: "1. Project Overview", size: 32, bold: true, color: "0D9488" })],
}));
children.push(new Paragraph({
  spacing: { before: 100, after: 100 },
  children: [new TextRun({
    text: "The UPMC (Umurinzi Petros Medical Center) Clinic Website is a comprehensive, multi-page React application built for a medical center in Rwanda. It provides information about the clinic's services, doctors, staff, departments, research, and education programs. The website includes an appointment booking system with email notifications, a multilingual interface (English, Kinyarwanda, French, Swahili), and a full-featured admin panel for managing all content.",
    size: 22, color: "334155",
  })],
}));
children.push(new Paragraph({
  spacing: { before: 100, after: 100 },
  children: [new TextRun({
    text: "Key features include: responsive design with Tailwind CSS, cloud sync via Firebase Firestore, image uploads via Cloudinary, appointment management with Firestore, email notifications via Nodemailer/Gmail, WhatsApp integration, Google Maps embed, news ticker, and a comprehensive admin panel accessible via Ctrl+U.",
    size: 22, color: "334155",
  })],
}));
children.push(new Paragraph({ children: [new PageBreak()] }));

// 2. Technology Stack
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 200, after: 200 },
  children: [new TextRun({ text: "2. Technology Stack", size: 32, bold: true, color: "0D9488" })],
}));
const stack = [
  ["Frontend Framework", "React 18.3 with TypeScript"],
  ["Build Tool", "Vite 6.4 with SWC (Speedy Web Compiler)"],
  ["Routing", "Custom state-based routing (no React Router for pages, but react-router-dom is installed)"],
  ["Styling", "Tailwind CSS + inline styles + custom CSS"],
  ["UI Components", "shadcn/ui (Radix UI primitives)"],
  ["Icons", "Lucide React"],
  ["Charts", "Recharts"],
  ["Internationalization", "Custom i18n with 4 languages (en, kin, fr, sw)"],
  ["Backend/Database", "Firebase Firestore"],
  ["Image Storage", "Cloudinary"],
  ["Email", "Nodemailer with Gmail SMTP (via Vite middleware proxy)"],
  ["State Persistence", "localStorage with cloud sync to Firestore"],
  ["Deployment", "Vercel / Render"],
  ["Admin Access", "Ctrl+U keyboard shortcut"],
];
const stackTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.SOLID, color: "0D9488" },
          children: [new Paragraph({ children: [new TextRun({ text: "Category", bold: true, color: "FFFFFF", size: 22 })] })],
        }),
        new TableCell({
          width: { size: 70, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.SOLID, color: "0D9488" },
          children: [new Paragraph({ children: [new TextRun({ text: "Technology", bold: true, color: "FFFFFF", size: 22 })] })],
        }),
      ],
    }),
    ...stack.map(([cat, tech]) => new TableRow({
      children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: cat, bold: true, size: 20, color: "334155" })] })],
        }),
        new TableCell({
          width: { size: 70, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: tech, size: 20, color: "475569" })] })],
        }),
      ],
    })),
  ],
});
children.push(stackTable);
children.push(new Paragraph({ children: [new PageBreak()] }));

// 3. Architecture
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 200, after: 200 },
  children: [new TextRun({ text: "3. Architecture & Data Flow", size: 32, bold: true, color: "0D9488" })],
}));
const archText = [
  "The application follows a single-page application (SPA) architecture with state-based routing. The App.tsx component manages the current page state and renders the appropriate page component.",
  "",
  "Data Flow:",
  "1. On application mount, App.tsx calls fetchAndSyncFromCloud() which pulls all data from Firebase Firestore and writes it to localStorage.",
  "2. All components read data from localStorage. When data changes (via admin panel), it is saved to localStorage and then synced to Firestore via syncAllToCloud().",
  "3. Images are uploaded to Cloudinary via uploadToCloudinary(), which returns a URL stored in localStorage.",
  "4. Appointments are saved directly to Firestore (with localStorage fallback) via the appointments.ts module.",
  "5. Appointment emails are sent via a Vite dev server middleware proxy (/api/book-appointment) using Nodemailer and Gmail SMTP.",
  "",
  "Admin Panel:",
  "The admin panel is accessed via Ctrl+U and provides full CRUD operations for: doctors, staff, departments, research team, research areas, publications, education items, partner logos, contacts, news ticker, and appointments.",
  "",
  "Internationalization:",
  "The LanguageContext provides translations for 4 languages. The language preference is stored in localStorage under 'upmc-lang'.",
];
for (const line of archText) {
  children.push(new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: line, size: 22, color: "334155" })],
  }));
}
children.push(new Paragraph({ children: [new PageBreak()] }));

// 4. File Structure
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 200, after: 200 },
  children: [new TextRun({ text: "4. File Structure", size: 32, bold: true, color: "0D9488" })],
}));
children.push(new Paragraph({
  spacing: { before: 100, after: 200 },
  children: [new TextRun({ text: "The project contains the following source files (excluding shadcn/ui components and node_modules):", size: 22, color: "334155" })],
}));
for (const f of filesToInclude) {
  const desc = fileDescriptions[f.relPath] || "";
  children.push(new Paragraph({
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({ text: f.relPath, bold: true, size: 20, color: "0D9488", font: "Consolas" }),
      new TextRun({ text: desc ? " — " + desc : "", size: 20, color: "64748B" }),
    ],
  }));
}
children.push(new Paragraph({ children: [new PageBreak()] }));

// 5-12. File contents with descriptions
const sections = [
  { title: "5. Configuration Files", filter: f => ["package.json", "vite.config.ts", "index.html", "render.yaml", "vercel.json", ".env.example", ".gitignore", "README.md"].includes(f.relPath) },
  { title: "6. Core Application Files", filter: f => ["src/main.tsx", "src/App.tsx", "src/vite-env.d.ts"].includes(f.relPath) },
  { title: "7. Internationalization (i18n)", filter: f => f.relPath.startsWith("src/i18n/") },
  { title: "8. Library Utilities (lib/)", filter: f => f.relPath.startsWith("src/lib/") },
  { title: "9. Components", filter: f => f.relPath.startsWith("src/components/") && !f.relPath.includes("/ui/") && !f.relPath.includes("/figma/") },
  { title: "10. Pages", filter: f => f.relPath.startsWith("src/pages/") },
  { title: "11. Styling", filter: f => f.relPath.endsWith(".css") || f.relPath.includes("styles/") },
  { title: "12. Additional Files", filter: f => f.relPath.endsWith(".md") || f.relPath.includes("figma/") },
];

for (const section of sections) {
  const sectionFiles = filesToInclude.filter(section.filter);
  if (sectionFiles.length === 0) continue;

  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 200, after: 200 },
    children: [new TextRun({ text: section.title, size: 32, bold: true, color: "0D9488" })],
  }));

  for (const file of sectionFiles) {
    // File header
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
      children: [new TextRun({ text: file.relPath, size: 26, bold: true, color: "0F172A", font: "Consolas" })],
    }));

    // Language label
    const lang = getLanguageForFile(file.ext);
    children.push(new Paragraph({
      spacing: { before: 40, after: 80 },
      children: [new TextRun({ text: `Language: ${lang}`, size: 18, italics: true, color: "94A3B8" })],
    }));

    // Description
    const desc = fileDescriptions[file.relPath];
    if (desc) {
      children.push(new Paragraph({
        spacing: { before: 40, after: 120 },
        children: [new TextRun({ text: desc, size: 21, color: "475569" })],
      }));
    }

    // File content
    let content = "";
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch (e) {
      content = "[Error reading file: " + e.message + "]";
    }

    // Split content into lines and add as code block
    const lines = content.split("\n");
    const maxLines = 2000; // Safety limit
    const truncated = lines.length > maxLines;
    const displayLines = truncated ? lines.slice(0, maxLines) : lines;

    for (const line of displayLines) {
      // Truncate very long lines
      const displayLine = line.length > 200 ? line.substring(0, 200) + "..." : line;
      children.push(new Paragraph({
        spacing: { before: 0, after: 0 },
        indent: { left: 200 },
        children: [new TextRun({ text: displayLine || " ", size: 16, font: "Consolas", color: "1E293B" })],
      }));
    }
    if (truncated) {
      children.push(new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [new TextRun({ text: `[... file truncated, ${lines.length - maxLines} more lines ...]`, size: 16, italics: true, color: "EF4444", font: "Consolas" })],
      }));
    }

    children.push(new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [new TextRun({ text: `— End of ${file.relPath} —`, size: 16, italics: true, color: "CBD5E1", font: "Consolas" })],
    }));
  }

  children.push(new Paragraph({ children: [new PageBreak()] }));
}

// Build and save document
const doc = new Document({
  sections: [{
    properties: {
      page: {
        margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
      },
    },
    children,
  }],
});

const outputPath = path.join(ROOT, "UPMC-Website-Documentation.docx");
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("Document generated: " + outputPath);
  console.log("Total files included: " + filesToInclude.length);
}).catch(err => {
  console.error("Error generating document:", err);
});
