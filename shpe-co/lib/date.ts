export function toMDY(input?: string) {
  if (!input) return "";

  // Google gviz style: Date(2025,7,26) -> 08/26/2025
  const gviz = input.match(/Date\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (gviz) {
    const y = Number(gviz[1]);
    const m = Number(gviz[2]) + 1; // 0-based
    const d = Number(gviz[3]);
    return `${m.toString().padStart(2, "0")}/${d
      .toString()
      .padStart(2, "0")}/${y}`;
  }

  // ISO-like YYYY-MM-DD -> 08/26/2025
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const [y, m, d] = input.split("-").map(Number);
    return `${m.toString().padStart(2, "0")}/${d
      .toString()
      .padStart(2, "0")}/${y}`;
  }

  // Fallback as-is
  return input;
}
