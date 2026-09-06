"use client";

import { useState } from "react";
import InvitationCard from "@/components/InvitationCard";
import GeneratingInvitationOverlay from "@/components/GeneratingInvitationOverlay";
import {
  INVITATION_TEMPLATES,
  invitationTemplateId,
  isCustomInvitationUrl,
} from "@/lib/invitation";

type InvitationSetupProps = {
  allowCustom?: boolean;
  defaultBabyName?: string;
  defaultEventDate?: string;
  defaultEventTime?: string;
  defaultLocation?: string;
  defaultInvitationUrl?: string | null;
  defaultTemplateId?: string | null;
};

function normalizeTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return "";
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

export default function InvitationSetup({
  allowCustom = false,
  defaultBabyName = "",
  defaultEventDate = "",
  defaultEventTime = "",
  defaultLocation = "",
  defaultInvitationUrl = null,
  defaultTemplateId = null,
}: InvitationSetupProps) {
  const initialTemplate =
    invitationTemplateId(defaultInvitationUrl, defaultTemplateId) ??
    (allowCustom && isCustomInvitationUrl(defaultInvitationUrl) ? "custom" : "");
  const [babyName, setBabyName] = useState(defaultBabyName);
  const [eventDate, setEventDate] = useState(defaultEventDate);
  const [eventTime, setEventTime] = useState(normalizeTime(defaultEventTime));
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
      <div className="grid gap-4 sm:grid-cols-2">
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
          <span className="text-sm font-medium text-ink-800">Hora</span>
          <input
            type="time"
            name="event_time"
            value={eventTime}
            onChange={(event) => setEventTime(event.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
          />
        </label>
      </div>
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
          Elegí una. Al guardar, se completa sola con el nombre, el día, la hora y el lugar.
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
          <p className="mb-2 text-xs font-medium text-ink-700">
            Vista previa rápida. Al guardar, la IA completa la tarjeta sin
            cambiar el diseño original.
          </p>
          <div className="relative">
            <InvitationCard
              templateId={templateId}
              babyName={babyName}
              eventDate={eventDate}
              eventTime={eventTime}
              location={location}
            />
            <GeneratingInvitationOverlay />
          </div>
          <label className="mt-3 flex items-start gap-2 text-sm text-ink-800">
            <input
              type="checkbox"
              name="regenerate_invitation"
              className="mt-0.5 h-4 w-4 rounded border-ink-900/30 text-sage-600 focus:ring-sage-500"
            />
            <span>
              Regenerar la imagen con IA al guardar (si la anterior quedó mal)
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
