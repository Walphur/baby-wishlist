import { CLOTHING_PICKER_TAG } from "@/lib/clothing";

export type DefaultGift = {
  name: string;
  category: string;
  // Si tiene maxQuantity, varias personas pueden anotarse para traerlo
  // (hasta ese número). Si es undefined, es un regalo de "una sola persona".
  maxQuantity?: number;
  notes?: string;
};

/**
 * Lista base pensada como ideas útiles (no decorativas), con talles 0-3 / 3-6 / 6-9
 * y categorías para que sea fácil de editar después de crear el evento.
 */
export const DEFAULT_GIFTS: DefaultGift[] = [
  // Higiene y cambio
  { name: "Pack de pañales talle P", category: "Higiene y cambio", maxQuantity: 8 },
  { name: "Pack de pañales talle M", category: "Higiene y cambio", maxQuantity: 6 },
  { name: "Toallitas húmedas sin perfume", category: "Higiene y cambio", maxQuantity: 10 },
  { name: "Óleo calcáreo", category: "Higiene y cambio", maxQuantity: 6 },
  { name: "Crema para paspaduras", category: "Higiene y cambio", maxQuantity: 6 },
  { name: "Cambiador portátil impermeable", category: "Higiene y cambio" },
  { name: "Kit para el cuidado del bebé", category: "Higiene y cambio" },
  { name: "Organizador para pañales", category: "Higiene y cambio" },
  { name: "Cesto para pañales", category: "Higiene y cambio" },
  { name: "Toallones adicionales", category: "Higiene y cambio", maxQuantity: 4 },
  { name: "Gasas / muselinas", category: "Higiene y cambio", maxQuantity: 6 },
  { name: "Neceser para bebé", category: "Higiene y cambio" },
  { name: "Cepillo y peine suave", category: "Higiene y cambio" },

  // Baño
  { name: "Bañera plástica liviana", category: "Baño" },
  { name: "Termómetro de agua / baño", category: "Baño" },
  { name: "Jabón neutro hipoalergénico", category: "Baño", maxQuantity: 4 },
  { name: "Shampoo sin lágrimas", category: "Baño", maxQuantity: 4 },
  { name: "Toallón de algodón con capucha", category: "Baño", maxQuantity: 4 },
  { name: "Esponja suave para bebé", category: "Baño", maxQuantity: 4 },
  { name: "Juguetes de baño", category: "Baño", maxQuantity: 4 },
  { name: "Organizador para productos de baño", category: "Baño" },

  // Alimentación
  { name: "Mamadera anticólico", category: "Alimentación", maxQuantity: 4 },
  { name: "Tetinas de repuesto", category: "Alimentación", maxQuantity: 4 },
  { name: "Esterilizador o kit para microondas", category: "Alimentación" },
  { name: "Cepillo para mamaderas", category: "Alimentación" },
  { name: "Baberos de tela", category: "Alimentación", maxQuantity: 8 },
  { name: "Baberos impermeables", category: "Alimentación", maxQuantity: 6 },
  { name: "Chupete ortodóntico + portachupetes", category: "Alimentación", maxQuantity: 6 },
  { name: "Plato / bol de silicona para bebé", category: "Alimentación", maxQuantity: 4 },
  { name: "Cuchara de silicona", category: "Alimentación", maxQuantity: 4 },
  { name: "Vaso antiderrame", category: "Alimentación", maxQuantity: 4 },
  { name: "Set de alimentación de silicona", category: "Alimentación" },

  // Dormir
  { name: "Mantita de algodón liviana", category: "Dormir", maxQuantity: 4 },
  { name: "Saco de dormir talle 0-6 meses", category: "Dormir", maxQuantity: 3 },
  { name: "Lucecita de noche tenue", category: "Dormir" },
  { name: "Libro de cuentos para leer antes de dormir", category: "Dormir", maxQuantity: 4 },
  { name: "Protector impermeable de colchón", category: "Dormir", maxQuantity: 3 },
  { name: "Sábanas adicionales para cuna", category: "Dormir", maxQuantity: 4 },
  { name: "Arrullo / manta de muselina", category: "Dormir", maxQuantity: 4 },
  { name: "Móvil para cuna", category: "Dormir" },

  // Ropa: el invitado elige talle y tipo (no se agota un pijama concreto).
  {
    name: "Ropa a elección",
    category: "Ropa",
    maxQuantity: 40,
    notes: CLOTHING_PICKER_TAG,
  },

  // Paseo y maternidad
  { name: "Bolso / pañalera maternal", category: "Paseo y maternidad" },
  { name: "Mochila portabebés ergonómica", category: "Paseo y maternidad" },
  { name: "Cambiador de viaje", category: "Paseo y maternidad" },
  { name: "Manta para cochecito", category: "Paseo y maternidad" },
  { name: "Sombrilla para cochecito", category: "Paseo y maternidad" },
  { name: "Bolso organizador", category: "Paseo y maternidad" },
  { name: "Protector de lluvia para cochecito", category: "Paseo y maternidad" },

  // Grandes
  { name: "Cochecito", category: "Grandes" },
  { name: "Butaca de auto", category: "Grandes" },
  { name: "Practicuna / cuna de viaje", category: "Grandes" },
  { name: "Hamaca (ej. Maxi-Cosi Kori)", category: "Grandes" },
  { name: "Gimnasio infantil", category: "Grandes" },
  { name: "Cámara de vigilancia para bebés", category: "Grandes" },
  { name: "Organizador para cochecito", category: "Grandes" },
  { name: "Trona / silla de comer", category: "Grandes" },

  // Juguetes
  { name: "Sonajero de tela", category: "Juguetes", maxQuantity: 4 },
  { name: "Juguetes constructores / mordedores", category: "Juguetes", maxQuantity: 4 },
  { name: "Libro de tela", category: "Juguetes", maxQuantity: 4 },
  { name: "Libro de baño", category: "Juguetes", maxQuantity: 3 },
  { name: "Cubos blandos", category: "Juguetes", maxQuantity: 3 },
  { name: "Juguetes sensoriales", category: "Juguetes", maxQuantity: 4 },
  { name: "Pelota blanda", category: "Juguetes", maxQuantity: 3 },

  // Seguridad
  { name: "Termómetro digital", category: "Seguridad" },
  { name: "Aspirador nasal", category: "Seguridad" },
  { name: "Protector de enchufes", category: "Seguridad", maxQuantity: 4 },

  // Recuerdos
  { name: "Álbum de fotos / mi primer año", category: "Recuerdos" },
  { name: "Set de huellitas en cerámica", category: "Recuerdos" },
  { name: "Body o mantita con nombre bordado", category: "Recuerdos" },
  { name: "Tarta de pañales", category: "Recuerdos" },
  { name: "Caja de cartas para el futuro", category: "Recuerdos" },
  { name: "Tarjeta de regalo (por si no sabés qué elegir)", category: "Recuerdos" },
];
