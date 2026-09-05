import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateEvent } from "../actions";

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: event } = await supabase
    .from("baby_events")
    .select(
      "id, baby_name, event_date, location, host_names, message, ask_party_size, location_map_url, drive_url, invitation_image_url, guest_list_reveal_days"
    )
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!event) redirect("/dashboard");

  const updateEventWithId = updateEvent.bind(null, event.id);

  return (
    <div className="max-w-lg">
      <h1 className="font-serif text-2xl text-ink-900">Datos del evento</h1>
      <p className="mt-1 text-sm text-ink-700">
        Esta información aparece en la página que ven tus invitados.
      </p>
      <form action={updateEventWithId} className="mt-6 space-y-4">
        <Field label="Nombre del bebé/a" name="baby_name" defaultValue={event.baby_name ?? ""} />
        <Field
          label="Fecha del evento"
          name="event_date"
          type="date"
          defaultValue={event.event_date ?? ""}
        />
        <Field label="Lugar" name="location" defaultValue={event.location ?? ""} />
        <Field
          label="Nombre de los papás / anfitriones"
          name="host_names"
          defaultValue={event.host_names ?? ""}
        />
        <Field
          label="Mensaje para tus invitados"
          name="message"
          textarea
          defaultValue={event.message ?? ""}
        />
        <Field
          label="Link a Google Maps del lugar (opcional)"
          name="location_map_url"
          placeholder="https://maps.app.goo.gl/..."
          defaultValue={event.location_map_url ?? ""}
        />
        <Field
          label="Link a Google Drive con fotos (opcional)"
          name="drive_url"
          placeholder="https://drive.google.com/..."
          defaultValue={event.drive_url ?? ""}
        />
        <Field
          label="Link a una imagen de invitación (opcional)"
          name="invitation_image_url"
          placeholder="Subí tu invitación a Drive/Imgur y pegá el link público"
          defaultValue={event.invitation_image_url ?? ""}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="ask_party_size"
            defaultChecked={event.ask_party_size}
            className="h-4 w-4 rounded border-ink-900/30 text-sage-600 focus:ring-sage-500"
          />
          <span className="text-sm text-ink-800">
            Preguntar cuántas personas van al confirmar asistencia
          </span>
        </label>

        <Field
          label="Ocultar los nombres de invitados hasta X días antes del evento"
          name="guest_list_reveal_days"
          type="number"
          defaultValue={String(event.guest_list_reveal_days ?? 14)}
        />
        <p className="-mt-2 text-xs text-ink-700">
          Ayuda a que no se pueda relacionar quién confirmó asistencia con qué
          regalo reservó (los regalos son anónimos a propósito).
        </p>

        <button
          type="submit"
          className="rounded-xl2 bg-ink-900 px-6 py-3 text-sm font-medium text-cream-50 transition hover:bg-ink-800"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  textarea,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-800">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={3}
          className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
        />
      )}
    </label>
  );
}
