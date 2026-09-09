export type DefaultGift = {
  name: string;
  category: string;
  // Si tiene maxQuantity, varias personas pueden anotarse para traerlo
  // (hasta ese número). Si es undefined, es un regalo de "una sola persona".
  maxQuantity?: number;
};

/**
 * Lista base pensada como ideas útiles (no decorativas), con talles 0-3 / 3-6 / 6-9
 * y categorías para que sea fácil de editar después de crear el evento.
 */
export const DEFAULT_GIFTS: DefaultGift[] = [
  // Higiene y cambio
  { name: "Pack de pañales talle RN", category: "Higiene y cambio", maxQuantity: 8 },
  { name: "Pack de pañales talle P", category: "Higiene y cambio", maxQuantity: 8 },
  { name: "Toallitas húmedas sin perfume", category: "Higiene y cambio", maxQuantity: 10 },
  { name: "Óleo calcáreo", category: "Higiene y cambio", maxQuantity: 6 },
  { name: "Crema para paspaduras", category: "Higiene y cambio", maxQuantity: 6 },
  { name: "Cambiador portátil impermeable", category: "Higiene y cambio" },
  { name: "Kit para el cuidado del bebé", category: "Higiene y cambio" },

  // Baño
  { name: "Bañera plástica liviana", category: "Baño" },
  { name: "Termómetro de agua / baño", category: "Baño" },
  { name: "Jabón neutro hipoalergénico", category: "Baño", maxQuantity: 4 },
  { name: "Shampoo sin lágrimas", category: "Baño", maxQuantity: 4 },
  { name: "Toallón de algodón con capucha", category: "Baño", maxQuantity: 4 },

  // Alimentación
  { name: "Mamadera anticólico", category: "Alimentación", maxQuantity: 4 },
  { name: "Tetinas de repuesto", category: "Alimentación", maxQuantity: 4 },
  { name: "Esterilizador o kit para microondas", category: "Alimentación" },
  { name: "Cepillo para mamaderas", category: "Alimentación" },
  { name: "Baberos de tela", category: "Alimentación", maxQuantity: 8 },
  { name: "Chupete ortodóntico + portachupetes", category: "Alimentación", maxQuantity: 6 },

  // Dormir
  { name: "Mantita de algodón liviana", category: "Dormir", maxQuantity: 4 },
  { name: "Saco de dormir talle 0-6 meses", category: "Dormir", maxQuantity: 3 },
  { name: "Lucecita de noche tenue", category: "Dormir" },
  { name: "Libro de cuentos para leer antes de dormir", category: "Dormir", maxQuantity: 4 },

  // Ropa
  { name: "Bodies algodón talle 0-3 meses", category: "Ropa", maxQuantity: 8 },
  { name: "Bodies / ranitas talle 3-6 meses", category: "Ropa", maxQuantity: 8 },
  { name: "Conjuntos talle 6-9 meses", category: "Ropa", maxQuantity: 6 },
  { name: "Medias y escarpines de algodón", category: "Ropa", maxQuantity: 8 },
  { name: "Body o mantita con nombre bordado", category: "Ropa" },

  // Paseo y maternidad
  { name: "Bolso / pañalera maternal", category: "Paseo y maternidad" },
  { name: "Mochila portabebés ergonómica", category: "Paseo y maternidad" },
  { name: "Cambiador de viaje", category: "Paseo y maternidad" },

  // Grandes
  { name: "Cochecito", category: "Grandes" },
  { name: "Butaca de auto", category: "Grandes" },
  { name: "Practicuna / cuna de viaje", category: "Grandes" },
  { name: "Hamaca (ej. Maxi-Cosi Kori)", category: "Grandes" },
  { name: "Gimnasio infantil", category: "Grandes" },
  { name: "Cámara de vigilancia para bebés", category: "Grandes" },

  // Juguetes
  { name: "Sonajero de tela", category: "Juguetes", maxQuantity: 4 },
  { name: "Juguetes constructores / mordedores", category: "Juguetes", maxQuantity: 4 },

  // Recuerdos
  { name: "Álbum de fotos / mi primer año", category: "Recuerdos" },
  { name: "Set de huellitas en cerámica", category: "Recuerdos" },
  { name: "Tarta de pañales", category: "Recuerdos" },
  { name: "Caja de cartas para el futuro", category: "Recuerdos" },
  { name: "Tarjeta de regalo (por si no sabés qué elegir)", category: "Recuerdos" },
];
