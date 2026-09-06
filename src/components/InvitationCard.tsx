import {
  formatInvitationDate,
  getInvitationTemplate,
  type OverlayAlign,
  type OverlayFont,
} from "@/lib/invitation";

const fontClass: Record<OverlayFont, string> = {
  script: "font-invite-script",
  serif: "font-invite-serif",
  sans: "font-invite-sans",
  display: "font-invite-display",
};

function translate(align: OverlayAlign) {
  if (align === "center") return "translate(-50%, -50%)";
  if (align === "right") return "translate(-100%, -50%)";
  return "translate(0, -50%)";
}

export default function InvitationCard({
  templateId,
  babyName,
  eventDate,
  location,
  className = "",
}: {
  templateId: string;
  babyName?: string | null;
  eventDate?: string | null;
  location?: string | null;
  className?: string;
}) {
  const template = getInvitationTemplate(templateId);
  if (!template) return null;

  const values = {
    name: babyName?.trim() ?? "",
    date: formatInvitationDate(eventDate),
    location: location?.trim() ?? "",
  };

  return (
    <div
      className={`invitation-card relative w-full overflow-hidden rounded-xl2 shadow-sm ${className}`}
      style={{ aspectRatio: "1400 / 993" }}
    >
      <img
        src={template.src}
        alt="Invitación del baby shower"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {template.lines.map((line) => {
        const text = values[line.key];
        if (!text) return null;
        return (
          <p
            key={line.key}
            className={`absolute leading-snug ${fontClass[line.font]}`}
            style={{
              left: `${line.x}%`,
              top: `${line.y}%`,
              width: `${line.w}%`,
              transform: translate(line.align),
              textAlign: line.align,
              fontSize: `${line.size}cqw`,
              color: line.color,
              fontWeight: line.weight,
              textTransform: line.uppercase ? "uppercase" : undefined,
              overflowWrap: "anywhere",
              hyphens: "auto",
            }}
          >
            {text}
          </p>
        );
      })}
    </div>
  );
}
