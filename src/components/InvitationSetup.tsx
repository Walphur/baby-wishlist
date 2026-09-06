"use client";

import { useState } from "react";
import InvitationCard from "@/components/InvitationCard";
import {
  INVITATION_TEMPLATES,
  invitationTemplateId,
  isCustomInvitationUrl,
} from "@/lib/invitation";

type InvitationSetupProps = {
  allowCustom?: boolean;
  defaultBabyName?: string;
  defaultEventDate?: string;
  defaultLocation?: string;
  defaultInvitationUrl?: string | null;
};

export default function InvitationSetup({
  allowCustom = false,
  defaultBabyName = "",
  defaultEventDate = "",
  defaultLocation = "",
  defaultInvitationUrl = null,
}: InvitationSetupProps) {
  const initialTemplate = invitationTemplateId(defaultInvitationUrl) ?? "";
  const [babyName, setBabyName] = useState(defaultBabyName);
  const [eventDate, setEventDate] = useState(defaultEventDate);
  const [location, setLocation] = useState(defaultLocation);
  const [templateId, setTemplateId] = useState(initialTemplate);
  const [customUrl, setCustomUrl] = useState(
    isCustomInvitationUrl(defaultInvitationUrl) ? defaultInvitationUrl ?? "" : ""
  );
  const usingCustom = allowCustom && templateId === "custom";

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-ink-800">Nombre del bebé/a (opcional)</span>
        <input
          type="text"
          name="baby_name"
          value={babyName}
          onChange={(event) => setBabyName(event.target.value)}
          className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-ink-800">Fecha del evento</span>
        <input
          type="date"
          name="event_date"
          value={eventDate}
          onChange={(event) => setEventDate(event.target.value)}
          className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-ink-800">Lugar</span>
        <input
          type="text"
          name="location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Ej: Salón Los Aromos"
          className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
        />
      </label>

      <fieldset>
        <legend className="text-sm font-medium text-ink-800">Tarjeta de invitación</legend>
        <p className="mt-1 text-xs text-ink-700">
          Elegí una. Se completa sola con el nombre, el día y el lugar.
        </p>
        <input type="hidden" name="invitation_template" value={templateId} />
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {INVITATION_TEMPLATES.map((template) => {
            const selected = templateId === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setTemplateId(template.id)}
                className={`overflow-hidden rounded-xl border-2 transition ${
                  selected
                    ? "border-sage-600 ring-2 ring-sage-600/20"
                    : "border-ink-900/10 hover:border-sage-400"
                }`}
              >
                <img
                  src={template.src}
                  alt={`Tarjeta ${template.id}`}
                  className="aspect-[1400/993] w-full object-cover"
                />
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTemplateId("")}
            className={`rounded-full px-3 py-1 text-xs transition ${
              templateId === ""
                ? "bg-ink-900 text-cream-50"
                : "border border-ink-900/15 text-ink-700 hover:bg-ink-900/5"
            }`}
          >
            Sin tarjeta
          </button>
          {allowCustom && (
            <button
              type="button"
              onClick={() => setTemplateId("custom")}
              className={`rounded-full px-3 py-1 text-xs transition ${
                usingCustom
                  ? "bg-ink-900 text-cream-50"
                  : "border border-ink-900/15 text-ink-700 hover:bg-ink-900/5"
              }`}
            >
              Imagen propia
            </button>
          )}
        </div>
      </fieldset>

      {usingCustom && (
        <label className="block">
          <span className="text-sm font-medium text-ink-800">
            Link a tu imagen de invitación
          </span>
          <input
            type="url"
            name="invitation_image_url"
            value={customUrl}
            onChange={(event) => setCustomUrl(event.target.value)}
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
          />
        </label>
      )}

      {templateId && !usingCustom && (
        <div>
          <p className="mb-2 text-xs font-medium text-ink-700">Así la van a ver</p>
          <InvitationCard
            templateId={templateId}
            babyName={babyName}
            eventDate={eventDate}
            location={location}
          />
        </div>
      )}
    </div>
  );
}
