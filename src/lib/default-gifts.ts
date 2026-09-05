export type DefaultGift = {
  name: string;
  category: string;
  // Si tiene maxQuantity, varias personas pueden anotarse para traerlo
  // (hasta ese número). Si es undefined, es un regalo de "una sola persona".
  maxQuantity?: number;
};

export const DEFAULT_GIFTS: DefaultGift[] = [
  // Grandes / de una sola persona
  { name: "Cochecito", category: "Grandes" },
  { name: "Cuna", category: "Grandes" },
  { name: "Colchón para la cuna", category: "Grandes" },
  { name: "Cambiador", category: "Grandes" },
  { name: "Hamaca o columpio para bebé", category: "Grandes" },
  { name: "Mecedora", category: "Grandes" },
  { name: "Trona", category: "Grandes" },
  { name: "Centro de juegos", category: "Grandes" },

  // Cuarto del bebé
  { name: "Cubo para pañales sucios", category: "Cuarto del bebé" },
  { name: "Móvil musical", category: "Cuarto del bebé" },
  { name: "Luz de noche", category: "Cuarto del bebé" },
  { name: "Máquina de ruido blanco", category: "Cuarto del bebé" },
  { name: "Termómetro ambiente", category: "Cuarto del bebé" },
  { name: "Sábanas para la cuna", category: "Cuarto del bebé", maxQuantity: 6 },
  { name: "Mantas de porteo", category: "Cuarto del bebé", maxQuantity: 4 },

  // Higiene (se puede repetir, son cosas baratas)
  { name: "Pañales talle recién nacido", category: "Higiene", maxQuantity: 10 },
  { name: "Pañales talle 1", category: "Higiene", maxQuantity: 10 },
  { name: "Toallitas húmedas", category: "Higiene", maxQuantity: 10 },
  { name: "Crema para la cola", category: "Higiene", maxQuantity: 6 },
  { name: "Jabón / shampoo neutro", category: "Higiene", maxQuantity: 6 },

  // Ropa (también se puede repetir)
  { name: "Bodies (varios talles)", category: "Ropa", maxQuantity: 8 },
  { name: "Conjuntos de ropa", category: "Ropa", maxQuantity: 8 },
  { name: "Medias y escarpines", category: "Ropa", maxQuantity: 8 },
  { name: "Gorritos", category: "Ropa", maxQuantity: 6 },
  { name: "Baberos", category: "Ropa", maxQuantity: 8 },

  // Alimentación
  { name: "Mamaderas", category: "Alimentación" },
  { name: "Chupetes", category: "Alimentación", maxQuantity: 6 },
  { name: "Extractor de leche", category: "Alimentación" },
  { name: "Esterilizador o calentador de biberones", category: "Alimentación" },
  { name: "Preparador de comidas para bebé", category: "Alimentación" },
  { name: "Paños para tomas", category: "Alimentación", maxQuantity: 6 },

  // Paseo y viaje
  { name: "Bolso / bolsa de pañales", category: "Paseo y viaje" },
  { name: "Mochila portabebé", category: "Paseo y viaje" },
  { name: "Cuna de viaje / corral portátil", category: "Paseo y viaje" },
  { name: "Alfombra de juegos", category: "Paseo y viaje" },
  { name: "Accesorios para el cochecito", category: "Paseo y viaje" },

  // Cuidado y seguridad
  { name: "Bañera para bebé", category: "Cuidado y seguridad" },
  { name: "Botiquín de primeros auxilios", category: "Cuidado y seguridad" },
  { name: "Artículos de seguridad (protectores, traba puertas)", category: "Cuidado y seguridad" },

  // Otros
  { name: "Libros de tela / sonajeros", category: "Otros", maxQuantity: 4 },
  { name: "Juguetes de estimulación", category: "Otros" },
  { name: "Tarjeta de regalo (por si no sabés qué elegir)", category: "Otros" },
];

