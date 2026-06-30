import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

const GALLERY_KEYS = [
  { key: "gallery-1", label: "Gallery Photo 1" },
  { key: "gallery-2", label: "Gallery Photo 2" },
  { key: "gallery-3", label: "Gallery Photo 3" },
  { key: "gallery-4", label: "Gallery Photo 4" },
  { key: "gallery-5", label: "Gallery Photo 5" },
  { key: "gallery-6", label: "Gallery Photo 6" },
  { key: "gallery-7", label: "Gallery Photo 7" },
  { key: "gallery-8", label: "Gallery Photo 8" },
  { key: "gallery-9", label: "Gallery Photo 9" },
  { key: "gallery-10", label: "Gallery Photo 10" },
];

export const DEPT_SLIDER_KEYS = GALLERY_KEYS;

function useGalleryPhotos() {
  const load = () =>
    GALLERY_KEYS.map((s) => localStorage.getItem(`upmc-service-img-${s.key}`) || "").filter(Boolean);
  const [photos, setPhotos] = useState<string[]>(load);
  useEffect(() => {
    const refresh = () => setPhotos(load());
    window.addEventListener("service-photos-updated", refresh);
    return () => window.removeEventListener("service-photos-updated", refresh);
  });
  return photos;
}

export function DeptSliders() {
  const photos = useGalleryPhotos();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const closeLightbox = () => setLightbox(null);
  const prevLight = () => setLightbox(i => i !== null ? (i - 1 + photos.length) % photos.length : null);
  const nextLight = () => setLightbox(i => i !== null ? (i + 1) % photos.length : null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevLight();
      if (e.key === "ArrowRight") nextLight();
    };
    if (lightbox !== null) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  return (
    <section className="py-16 lg:py-20 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {photos.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {photos.map((photo, i) => (
              <div
                key={i}
                onClick={() => setLightbox(i)}
                style={{
                  position: "relative", height: 220, borderRadius: 14,
                  overflow: "hidden", cursor: "zoom-in",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  background: "#f1f5f9",
                }}
              >
                <img
                  src={photo}
                  alt={`Gallery ${i + 1}`}
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    objectFit: "cover", objectPosition: "center",
                    display: "block",
                  }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "rgba(0,0,0,0)",
                  transition: "background 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.12)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0)")}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", background: "#f8fafc", borderRadius: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <ImageIcon style={{ width: 26, height: 26, color: "#cbd5e1" }} />
            </div>
            <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.05em" }}>Upload gallery photos via Admin Panel</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={closeLightbox}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <button onClick={e => { e.stopPropagation(); prevLight(); }}
            style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 48, height: 48, color: "#fff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft style={{ width: 24, height: 24 }} />
          </button>
          <img
            src={photos[lightbox]}
            alt="Full"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 12, boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
          />
          <button onClick={e => { e.stopPropagation(); nextLight(); }}
            style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 48, height: 48, color: "#fff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronRight style={{ width: 24, height: 24 }} />
          </button>
          <button onClick={closeLightbox}
            style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 40, height: 40, color: "#fff", fontSize: 20, cursor: "pointer" }}>
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
