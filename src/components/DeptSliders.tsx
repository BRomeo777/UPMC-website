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
  const [index, setIndex] = useState(0);
  const count = photos.length || 1;
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  useEffect(() => {
    if (photos.length < 2) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [photos.length, next]);

  useEffect(() => { setIndex(0); }, [photos.length]);

  return (
    <section className="py-16 lg:py-20 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-gray-100"
          style={{ aspectRatio: "16/9" }}
        >
          {photos.length > 0 ? (
            <>
              <img
                src={photos[index]}
                alt="Gallery"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              />
              {photos.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {photos.map((_, i) => (
                      <button key={i} onClick={() => setIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-white scale-125" : "bg-white/50"}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                <ImageIcon className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-xs text-gray-400 font-semibold tracking-wide">Upload photos via Admin Panel</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
