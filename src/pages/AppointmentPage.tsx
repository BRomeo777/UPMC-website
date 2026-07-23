import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { CheckCircle } from "lucide-react";
import { saveAppointment } from "../lib/appointments";

const DEPARTMENTS = [
  "General Consultation",
  "Internal Medicine",
  "Pulmonology",
  "Cardiology",
  "Pediatrics",
  "Hospitalisation",
  "CPD Training",
];

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30",
];

export default function AppointmentPage() {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    department: "",
    doctor: "",
    date: "",
    time: "",
    reason: "",
    honeypot: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const today = new Date().toISOString().split("T")[0];

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-()]/g, "");
    return /^\+?\d{8,15}$/.test(cleaned);
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const checkRateLimit = (): boolean => {
    try {
      const key = "upmc-apt-rate";
      const now = Date.now();
      const times: number[] = JSON.parse(localStorage.getItem(key) || "[]").filter((t: number) => now - t < 600000);
      if (times.length >= 3) return false;
      times.push(now);
      localStorage.setItem(key, JSON.stringify(times));
      return true;
    } catch { return true; }
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!form.fullName.trim()) errors.fullName = "Full name is required";
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    else if (!validatePhone(form.phone)) errors.phone = "Please enter a valid phone number (8-15 digits, international format allowed)";
    if (form.email && !validateEmail(form.email)) errors.email = "Please enter a valid email address";
    if (!form.department) errors.department = "Please select a department";
    if (!form.date) errors.date = "Please select a date";
    if (!form.time) errors.time = "Please select a time";

    if (form.honeypot) return;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please correct the errors below.");
      return;
    }

    if (!checkRateLimit()) {
      setError("Too many submissions. Please wait 10 minutes before trying again.");
      return;
    }

    setSubmitting(true);
    setError("");
    setFieldErrors({});

    const appointmentData = {
      full_name: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      department: form.department,
      preferred_doctor: form.doctor || "Any available doctor",
      preferred_date: form.date,
      preferred_time: form.time,
      reason: form.reason.trim(),
    };

    try {
      await saveAppointment(appointmentData);

      try {
        const emailRes = await fetch("/api/book-appointment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointmentData),
        });
        if (!emailRes.ok) {
          const errData = await emailRes.json().catch(() => ({}));
          console.error("Email send failed:", emailRes.status, errData);
        }
      } catch (err) { console.error("Email send error:", err); }

      setSuccess(true);
    } catch (err) {
      console.error("Appointment submission error:", err);
      setError("Something went wrong. Please try again or call/WhatsApp us at +250 795 161 628 or +250 783 644 479.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ fullName: "", phone: "", email: "", department: "", doctor: "", date: "", time: "", reason: "", honeypot: "" });
    setSuccess(false);
    setError("");
  };

  if (success) {
    return (
      <div className="pt-16 min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-50">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.appointment.success}</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{t.appointment.successDesc}</p>
          <button
            onClick={resetForm}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {t.appointment.bookAnother}
          </button>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-gray-900 placeholder-gray-400 bg-white text-base";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="pt-16">
      {/* Hero */}
      <section style={{ background: "#fff", padding: "20px 24px 8px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 900, color: "#0f172a", margin: 0 }}>
            {t.appointment.heading}
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", maxWidth: 540, margin: "10px auto 0", lineHeight: 1.6 }}>
            {t.appointment.subtitle}
          </p>
        </div>
      </section>

      {/* Form */}
      <section style={{ background: "#fff", padding: "40px 24px 80px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {/* Honeypot — hidden from real users */}
            <input
              type="text"
              name="company_name"
              tabIndex={-1}
              autoComplete="off"
              value={form.honeypot}
              onChange={e => handleChange("honeypot", e.target.value)}
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              aria-hidden="true"
            />

            {/* Full Name */}
            <div>
              <label htmlFor="apt-fullname" className={labelClass}>
                {t.appointment.fullName} <span className="text-red-500">*</span>
              </label>
              <input
                id="apt-fullname"
                type="text"
                required
                value={form.fullName}
                onChange={e => handleChange("fullName", e.target.value)}
                placeholder={t.appointment.fullNamePlaceholder}
                className={inputClass}
              />
              {fieldErrors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.fullName}</p>}
            </div>

            {/* Phone + Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="apt-phone" className={labelClass}>
                  {t.appointment.phone} <span className="text-red-500">*</span>
                </label>
                <input
                  id="apt-phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => handleChange("phone", e.target.value)}
                  placeholder={t.appointment.phonePlaceholder}
                  className={inputClass}
                />
                {fieldErrors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.phone}</p>}
              </div>
              <div>
                <label htmlFor="apt-email" className={labelClass}>{t.appointment.email}</label>
                <input
                  id="apt-email"
                  type="email"
                  value={form.email}
                  onChange={e => handleChange("email", e.target.value)}
                  placeholder={t.appointment.emailPlaceholder}
                  className={inputClass}
                />
                {fieldErrors.email && <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.email}</p>}
              </div>
            </div>

            {/* Department */}
            <div>
              <label htmlFor="apt-dept" className={labelClass}>
                {t.appointment.department} <span className="text-red-500">*</span>
              </label>
              <select
                id="apt-dept"
                required
                value={form.department}
                onChange={e => handleChange("department", e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">{t.appointment.selectDepartment}</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {fieldErrors.department && <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.department}</p>}
            </div>

            {/* Date + Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="apt-date" className={labelClass}>
                  {t.appointment.date} <span className="text-red-500">*</span>
                </label>
                <input
                  id="apt-date"
                  type="date"
                  required
                  min={today}
                  value={form.date}
                  onChange={e => handleChange("date", e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                />
                {fieldErrors.date && <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.date}</p>}
              </div>
              <div>
                <label htmlFor="apt-time" className={labelClass}>
                  {t.appointment.time} <span className="text-red-500">*</span>
                </label>
                <select
                  id="apt-time"
                  required
                  value={form.time}
                  onChange={e => handleChange("time", e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">{t.appointment.selectTime}</option>
                  {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {fieldErrors.time && <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.time}</p>}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="apt-reason" className={labelClass}>{t.appointment.reason}</label>
              <textarea
                id="apt-reason"
                value={form.reason}
                onChange={e => handleChange("reason", e.target.value)}
                placeholder={t.appointment.reasonPlaceholder}
                rows={4}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none bg-white text-base"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-4 rounded-xl transition-all text-base shadow-sm hover:shadow-md disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.appointment.submitting}
                  </span>
                ) : (
                  t.appointment.submit
                )}
              </button>
              <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 14 }}>
                We will confirm your appointment via phone or email.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
