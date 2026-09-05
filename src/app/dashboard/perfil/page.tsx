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
    .select("id, baby_name, event_date, location, host_names, message")
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
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-800">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={3}
          className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
        />
      )}
    </label>
  );
}
