// Transferencia al alias: 0% (no es link de pago ni QR de cobro).
export const MP_DONATION_ALIAS = (
  process.env.NEXT_PUBLIC_MP_DONATION_ALIAS || "dsl.store"
).trim();

// QR oficial de la app (Tu QR / Recibir). Un QR hecho con el texto del alias
// Mercado Pago no lo cobra: "no se puede pagar con este código".
export const MP_DONATION_QR_SRC = "/brand/mp-qr.png";
