"use client";

import { useState } from "react";
import InvitationCard from "@/components/InvitationCard";
import GeneratingInvitationOverlay from "@/components/GeneratingInvitationOverlay";
import {
  INVITATION_AI_ENABLED,
  INVITATION_TEMPLATES,
  INVITATION_UPLOAD_ACCEPT,
  MAX_INVITATION_UPLOAD_BYTES,
  MAX_INVITATION_UPLOAD_MB,
  invitationTemplateId,
  isCustomInvitationUrl,
} from "@/lib/invitation";

type InvitationSetupProps = {
  allowCustom?: boolean;
  /** Mostrar checkbox para regenerar con IA (solo al editar evento). */
  showAiRegenerate?: boolean;
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
  showAiRegenerate = false,
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
  const [templateId, setTemplateId] = useState(
    INVITATION_AI_ENABLED ? initialTemplate : isCustomInvitationUrl(defaultInvitationUrl) ? "custom" : ""
  );
  const [customUrl, setCustomUrl] = useState(
    isCustomInvitationUrl(defaultInvitationUrl) ? defaultInvitationUrl ?? "" : ""
  );
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [clearImage, setClearImage] = useState(false);
  const usingCustom = templateId === "custom";

  function onFileChange(file: File | null) {
    setFileError("");
    setFileName("");
    if (!file) return;
    if (file.size > MAX_INVITATION_UPLOAD_BYTES) {
      setFileError(`La imagen pesa demasiado. Máximo ${MAX_INVITATION_UPLOAD_MB} MB.`);
      return;
    }
    setClearImage(false);
    setTemplateId("custom");
    setFileName(file.name);
  }

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
        <input type="hidden" name="invitation_template" value={templateId} />
        {clearImage ? <input type="hidden" name="invitation_clear" value="on" /> : null}

        {!INVITATION_AI_ENABLED ? (
          <div className="mt-2 space-y-3">
            <p className="text-xs text-ink-700">
              Por ahora las plantillas con IA están pausadas. Podés subir tu propia
              tarjeta (máximo {MAX_INVITATION_UPLOAD_MB} MB, JPG / PNG / WebP) o dejar
              la página sin imagen.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setTemplateId("");
                  setClearImage(true);
                  setFileName("");
                  setFileError("");
                  setCustomUrl("");
                }}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  templateId === "" || clearImage
                    ? "bg-ink-900 text-cream-50"
                    : "border border-ink-900/15 text-ink-700 hover:bg-ink-900/5"
                }`}
              >
                Sin tarjeta
              </button>
              <button
                type="button"
                onClick={() => {
                  setTemplateId("custom");
                  setClearImage(false);
                }}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  usingCustom && !clearImage
                    ? "bg-ink-900 text-cream-50"
                    : "border border-ink-900/15 text-ink-700 hover:bg-ink-900/5"
                }`}
              >
                Subir imagen
              </button>
            </div>

            {usingCustom && !clearImage ? (
              <div className="space-y-3 rounded-xl2 border border-ink-900/10 bg-white/70 p-4">
                <label className="block">
                  <span className="text-sm font-medium text-ink-800">
                    Archivo (máx. {MAX_INVITATION_UPLOAD_MB} MB)
                  </span>
                  <input
                    type="file"
                    name="invitation_image"
                    accept={INVITATION_UPLOAD_ACCEPT}
                    onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
                    className="mt-1 block w-full text-sm text-ink-800 file:mr-3 file:rounded-lg file:border-0 file:bg-sage-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-sage-800 hover:file:bg-sage-200"
                  />
                  <p className="mt-1 text-xs text-ink-700">
                    JPG, PNG o WebP. No más de {MAX_INVITATION_UPLOAD_MB} megabytes.
                  </p>
                  {fileName ? (
                    <p className="mt-1 text-xs text-sage-700">Elegida: {fileName}</p>
                  ) : null}
                  {fileError ? (
                    <p className="mt-1 text-xs text-red-700">{fileError}</p>
                  ) : null}
                </label>
                {defaultInvitationUrl && isCustomInvitationUrl(defaultInvitationUrl) ? (
                  <div>
                    <p className="text-xs font-medium text-ink-700">Tarjeta actual</p>
                    <img
                      src={defaultInvitationUrl}
                      alt="Invitación actual"
                      className="mt-2 max-h-40 rounded-lg border border-ink-900/10 object-contain"
                    />
                  </div>
                ) : null}
                <label className="block">
                  <span className="text-sm font-medium text-ink-800">
                    O pegá un link a la imagen (opcional)
                  </span>
                  <input
                    type="url"
                    name="invitation_image_url"
                    value={customUrl}
                    onChange={(event) => {
                      setCustomUrl(event.target.value);
                      setClearImage(false);
                      setTemplateId("custom");
                    }}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
                  />
                </label>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <p className="mt-1 text-xs text-ink-700">
              Elegí una. Al guardar, se completa sola con el nombre, el día, la hora y el lugar.
            </p>
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

            {usingCustom && (
              <label className="mt-3 block">
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
              <div className="mt-3">
                <p className="mb-2 text-xs font-medium text-ink-700">
                  {showAiRegenerate
                    ? "Vista previa rápida. Al guardar con regenerar, la IA completa la tarjeta sin cambiar el diseño."
                    : "Vista previa rápida. La tarjeta queda lista al crear; podés regenerarla con IA después en Evento."}
                </p>
                <div className="relative">
                  <InvitationCard
                    templateId={templateId}
                    babyName={babyName}
                    eventDate={eventDate}
                    eventTime={eventTime}
                    location={location}
                  />
                  {showAiRegenerate ? <GeneratingInvitationOverlay /> : null}
                </div>
                {showAiRegenerate ? (
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
                ) : null}
              </div>
            )}
          </>
        )}
      </fieldset>
    </div>
  );
}
