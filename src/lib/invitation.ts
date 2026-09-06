export const INVITATION_TEMPLATE_PREFIX = "template:";

export type OverlayAlign = "left" | "center" | "right";
export type OverlayFont = "script" | "serif" | "sans" | "display";
export type OverlayKey = "name" | "date" | "location";

export type OverlayLine = {
  key: OverlayKey;
  x: number;
  y: number;
  w: number;
  align: OverlayAlign;
  font: OverlayFont;
  size: number;
  color: string;
  weight?: number;
  uppercase?: boolean;
};

export type InvitationTemplate = {
  id: string;
  src: string;
  lines: OverlayLine[];
};

export const INVITATION_TEMPLATES: InvitationTemplate[] = [
  {
    id: "1",
    src: "/invitations/1.webp",
    lines: [
      { key: "name", x: 62, y: 48, w: 36, align: "center", font: "script", size: 4.8, color: "#5D4037" },
      { key: "date", x: 62, y: 58, w: 44, align: "center", font: "sans", size: 1.9, color: "#5D4037", weight: 600 },
      { key: "location", x: 62, y: 65, w: 44, align: "center", font: "sans", size: 1.8, color: "#5D4037" },
    ],
  },
  {
    id: "2",
    src: "/invitations/2.webp",
    lines: [
      { key: "name", x: 58, y: 48, w: 48, align: "center", font: "display", size: 4.4, color: "#C4787A" },
      { key: "date", x: 58, y: 68, w: 48, align: "center", font: "sans", size: 1.7, color: "#4A463D", uppercase: true },
      { key: "location", x: 58, y: 74, w: 48, align: "center", font: "sans", size: 1.6, color: "#4A463D", uppercase: true },
    ],
  },
  {
    id: "3",
    src: "/invitations/3.webp",
    lines: [
      { key: "name", x: 70, y: 70, w: 42, align: "center", font: "display", size: 3.4, color: "#6E8464" },
      { key: "date", x: 70, y: 80, w: 42, align: "center", font: "script", size: 2.4, color: "#7A5C33" },
      { key: "location", x: 70, y: 88, w: 42, align: "center", font: "script", size: 2.1, color: "#7A5C33" },
    ],
  },
  {
    id: "4",
    src: "/invitations/4.webp",
    lines: [
      { key: "name", x: 70, y: 58, w: 40, align: "center", font: "script", size: 4.4, color: "#5D3A2E" },
      { key: "date", x: 70, y: 78, w: 38, align: "center", font: "sans", size: 1.7, color: "#5D3A2E" },
      { key: "location", x: 70, y: 86, w: 38, align: "center", font: "sans", size: 1.6, color: "#5D3A2E" },
    ],
  },
  {
    id: "5",
    src: "/invitations/5.webp",
    lines: [
      { key: "name", x: 50, y: 42, w: 54, align: "center", font: "script", size: 4.8, color: "#6B4334" },
      { key: "date", x: 50, y: 54, w: 54, align: "center", font: "sans", size: 1.9, color: "#6B4334", weight: 500 },
      { key: "location", x: 50, y: 61, w: 54, align: "center", font: "sans", size: 1.7, color: "#6B4334" },
    ],
  },
  {
    id: "6",
    src: "/invitations/6.webp",
    lines: [
      { key: "name", x: 50, y: 50, w: 66, align: "center", font: "serif", size: 4.2, color: "#6E8464" },
      { key: "date", x: 50, y: 62, w: 66, align: "center", font: "serif", size: 2.1, color: "#4A6B8A" },
      { key: "location", x: 50, y: 71, w: 66, align: "center", font: "serif", size: 1.9, color: "#4A6B8A" },
    ],
  },
  {
    id: "7",
    src: "/invitations/7.webp",
    lines: [
      { key: "name", x: 68, y: 50, w: 46, align: "center", font: "script", size: 4.4, color: "#7A5A8C" },
      { key: "date", x: 68, y: 62, w: 46, align: "center", font: "serif", size: 1.9, color: "#7A5A8C" },
      { key: "location", x: 68, y: 70, w: 46, align: "center", font: "serif", size: 1.7, color: "#7A5A8C" },
    ],
  },
  {
    id: "8",
    src: "/invitations/8.webp",
    lines: [
      { key: "name", x: 50, y: 52, w: 38, align: "center", font: "script", size: 3.8, color: "#6B5344" },
      { key: "date", x: 50, y: 62, w: 38, align: "center", font: "serif", size: 1.6, color: "#5A4638" },
      { key: "location", x: 50, y: 69, w: 38, align: "center", font: "serif", size: 1.5, color: "#5A4638" },
    ],
  },
  {
    id: "9",
    src: "/invitations/9.webp",
    lines: [
      { key: "name", x: 28, y: 48, w: 34, align: "center", font: "script", size: 3.2, color: "#1F6B73" },
      { key: "date", x: 28, y: 62, w: 34, align: "center", font: "sans", size: 1.5, color: "#1F6B73" },
      { key: "location", x: 28, y: 72, w: 34, align: "center", font: "sans", size: 1.4, color: "#1F6B73" },
    ],
  },
  {
    id: "10",
    src: "/invitations/10.webp",
    lines: [
      { key: "name", x: 28, y: 40, w: 38, align: "left", font: "script", size: 4.4, color: "#3A362E" },
      { key: "date", x: 28, y: 56, w: 38, align: "left", font: "sans", size: 1.8, color: "#3A362E" },
      { key: "location", x: 28, y: 68, w: 38, align: "left", font: "sans", size: 1.7, color: "#3A362E" },
    ],
  },
  {
    id: "11",
    src: "/invitations/11.webp",
    lines: [
      { key: "name", x: 50, y: 60, w: 54, align: "center", font: "script", size: 4.6, color: "#6E8464" },
      { key: "date", x: 50, y: 72, w: 54, align: "center", font: "serif", size: 1.9, color: "#4A463D" },
      { key: "location", x: 50, y: 80, w: 54, align: "center", font: "serif", size: 1.7, color: "#4A463D" },
    ],
  },
  {
    id: "12",
    src: "/invitations/12.webp",
    lines: [
      { key: "name", x: 75, y: 36, w: 40, align: "center", font: "script", size: 4, color: "#1D3A6E" },
      { key: "date", x: 75, y: 52, w: 40, align: "center", font: "sans", size: 1.7, color: "#1D3A6E", weight: 600 },
      { key: "location", x: 75, y: 64, w: 40, align: "center", font: "sans", size: 1.6, color: "#1D3A6E" },
    ],
  },
  {
    id: "13",
    src: "/invitations/13.webp",
    lines: [
      { key: "name", x: 55, y: 34, w: 48, align: "center", font: "script", size: 4.2, color: "#6B4334" },
      { key: "date", x: 72, y: 68, w: 30, align: "left", font: "sans", size: 1.6, color: "#3A6B9A" },
      { key: "location", x: 72, y: 82, w: 30, align: "left", font: "sans", size: 1.5, color: "#3A6B9A" },
    ],
  },
  {
    id: "14",
    src: "/invitations/14.webp",
    lines: [
      { key: "name", x: 50, y: 56, w: 42, align: "center", font: "sans", size: 3, color: "#1D3A6E", weight: 700 },
      { key: "date", x: 50, y: 72, w: 54, align: "center", font: "sans", size: 1.9, color: "#1D3A6E", weight: 600 },
      { key: "location", x: 50, y: 80, w: 54, align: "center", font: "sans", size: 1.7, color: "#1D3A6E" },
    ],
  },
  {
    id: "15",
    src: "/invitations/15.webp",
    lines: [
      { key: "name", x: 50, y: 48, w: 40, align: "center", font: "sans", size: 3, color: "#FFFFFF", weight: 700 },
      { key: "date", x: 50, y: 66, w: 58, align: "center", font: "sans", size: 2, color: "#C45C6A", weight: 600 },
      { key: "location", x: 50, y: 76, w: 58, align: "center", font: "sans", size: 1.8, color: "#C45C6A" },
    ],
  },
];

export function getInvitationTemplate(id: string | null | undefined) {
  if (!id) return null;
  return INVITATION_TEMPLATES.find((template) => template.id === id) ?? null;
}

export function invitationTemplateId(
  url: string | null | undefined,
  templateId?: string | null
) {
  if (templateId && getInvitationTemplate(templateId)) return templateId;
  if (!url?.startsWith(INVITATION_TEMPLATE_PREFIX)) return null;
  const id = url.slice(INVITATION_TEMPLATE_PREFIX.length);
  return getInvitationTemplate(id) ? id : null;
}

export function isCustomInvitationUrl(url: string | null | undefined) {
  return Boolean(url && !url.startsWith(INVITATION_TEMPLATE_PREFIX) && /^https?:\/\//i.test(url));
}

export function isGeneratedInvitationUrl(url: string | null | undefined) {
  return Boolean(url && /^https?:\/\//i.test(url) && !url.startsWith(INVITATION_TEMPLATE_PREFIX));
}

/** Fecha corta para que entre en las tarjetas (día + fecha, sin año). */
export function formatInvitationDate(isoDate: string | null | undefined) {
  if (!isoDate) return "";
  const formatted = new Date(`${isoDate}T00:00:00`).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/** Hora HH:MM (24h o del input type=time) → "16:30 hs". */
export function formatInvitationTime(time: string | null | undefined) {
  if (!time) return "";
  const match = String(time).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return "";
  const hours = match[1].padStart(2, "0");
  const minutes = match[2];
  return `${hours}:${minutes} hs`;
}
