const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME    ?? "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "";
const JSONBIN_KEY   = import.meta.env.VITE_JSONBIN_API_KEY           ?? "";
const JSONBIN_BIN   = import.meta.env.VITE_JSONBIN_BIN_ID            ?? "";
const JSONBIN_URL   = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN}`;

export const isCloudEnabled = (): boolean =>
  !!(CLOUD_NAME && UPLOAD_PRESET && JSONBIN_KEY && JSONBIN_BIN);

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload  = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export async function uploadToCloudinary(file: File): Promise<string> {
  if (!isCloudEnabled()) return toBase64(file);
  try {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: form }
    );
    if (!res.ok) return toBase64(file);
    const json = await res.json();
    return json.secure_url as string;
  } catch {
    return toBase64(file);
  }
}

export async function fetchAndSyncFromCloud(): Promise<void> {
  if (!isCloudEnabled()) return;
  try {
    const res = await fetch(`${JSONBIN_URL}/latest`, {
      headers: { "X-Master-Key": JSONBIN_KEY, "X-Bin-Meta": "false" },
    });
    if (!res.ok) return;
    const record: Record<string, string> = await res.json();
    Object.entries(record).forEach(([k, v]) => {
      if (v != null) localStorage.setItem(k, v);
    });
  } catch { /* silent — use localStorage as fallback */ }
}

let _syncTimer: ReturnType<typeof setTimeout> | null = null;
export function syncAllToCloud(): void {
  if (!isCloudEnabled()) return;
  if (_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(async () => {
    try {
      const data: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith("upmc-")) continue;
        const val = localStorage.getItem(key);
        if (val && !val.startsWith("data:")) data[key] = val;
      }
      await fetch(JSONBIN_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Master-Key": JSONBIN_KEY },
        body: JSON.stringify(data),
      });
    } catch { /* silent */ }
  }, 600);
}
