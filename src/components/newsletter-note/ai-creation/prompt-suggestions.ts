import type { PromptSuggestion } from './types';

// ============================================================================
// CATEGORÍAS DE PROMPTS
// ============================================================================

/**
 * Prompts para Especies Marinas
 */
export const marineSpeciesPrompts: PromptSuggestion[] = [
  {
    id: 'species-1',
    category: 'Especies Marinas',
    title: 'Perfil de Especie',
    prompt:
      'Crea una guía completa sobre {especie_marina}. Incluye características físicas, hábitat natural, comportamiento, alimentación, requisitos para acuario, compatibilidad con otras especies, y consejos de cuidado.',
    variables: [
      {
        name: 'especie_marina',
        placeholder: 'ej: Pez Payaso, Anémona de Mar',
        description: 'Nombre de la especie marina',
      },
    ],
    tags: ['especies', 'perfil', 'cuidado', 'guía'],
  },
  {
    id: 'species-2',
    category: 'Especies Marinas',
    title: 'Descubrimiento de Nueva Especie',
    prompt:
      'Escribe sobre el descubrimiento de una nueva especie marina en {ubicación}. Describe sus características únicas, cómo fue descubierta, su importancia científica y el ecosistema donde habita.',
    variables: [
      {
        name: 'ubicación',
        placeholder: 'ej: Gran Barrera de Coral, Océano Pacífico',
        description: 'Lugar del descubrimiento',
      },
    ],
    tags: ['descubrimiento', 'investigación', 'biodiversidad'],
  },
  {
    id: 'species-3',
    category: 'Especies Marinas',
    title: 'Especies en Peligro',
    prompt:
      'Genera un artículo sobre {especie_amenazada} y su estado de conservación. Incluye las amenazas que enfrenta, esfuerzos de conservación actuales, y cómo los acuaristas pueden contribuir a su protección.',
    variables: [
      {
        name: 'especie_amenazada',
        placeholder: 'ej: Caballito de Mar, Tortuga Marina',
        description: 'Especie en peligro',
      },
    ],
    tags: ['conservación', 'amenazada', 'protección'],
  },
  {
    id: 'species-4',
    category: 'Especies Marinas',
    title: 'Comportamiento Animal',
    prompt:
      'Escribe sobre el comportamiento fascinante de {animal_marino} en su hábitat. Explica sus patrones de comportamiento, interacciones sociales, métodos de caza o alimentación, y cómo replicar estas condiciones en acuario.',
    variables: [
      {
        name: 'animal_marino',
        placeholder: 'ej: Pulpos, Mantarrayas, Peces Ángel',
        description: 'Animal marino a describir',
      },
    ],
    tags: ['comportamiento', 'etología', 'naturaleza'],
  },
];

/**
 * Prompts para Acuarios y Mantenimiento
 */
export const aquariumMaintenancePrompts: PromptSuggestion[] = [
  {
    id: 'aqua-1',
    category: 'Acuarios',
    title: 'Guía de Montaje de Acuario',
    prompt:
      'Crea una guía detallada sobre cómo montar un acuario {tipo_acuario} desde cero. Incluye lista de equipo necesario, proceso de ciclado, parámetros del agua, y cronograma de introducción de habitantes.',
    variables: [
      {
        name: 'tipo_acuario',
        placeholder: 'ej: marino de arrecife, de agua dulce plantado',
        description: 'Tipo de acuario',
      },
    ],
    tags: ['montaje', 'setup', 'principiantes', 'guía'],
  },
  {
    id: 'aqua-2',
    category: 'Acuarios',
    title: 'Mantenimiento Semanal',
    prompt:
      'Escribe una rutina completa de mantenimiento semanal para acuarios {tamaño}. Incluye cambios de agua, limpieza de equipos, pruebas de parámetros, alimentación, y señales de alerta a observar.',
    variables: [
      {
        name: 'tamaño',
        placeholder: 'ej: pequeños (40L), medianos (200L), grandes (500L+)',
        description: 'Tamaño del acuario',
      },
    ],
    tags: ['mantenimiento', 'rutina', 'cuidado'],
  },
  {
    id: 'aqua-3',
    category: 'Acuarios',
    title: 'Problemas Comunes y Soluciones',
    prompt:
      'Genera un artículo sobre {problema_acuario} en acuarios. Explica las causas, cómo identificarlo, soluciones paso a paso, y medidas preventivas para evitar que vuelva a ocurrir.',
    variables: [
      {
        name: 'problema_acuario',
        placeholder: 'ej: algas verdes, agua turbia, nivel de amoniaco alto',
        description: 'Problema común en acuarios',
      },
    ],
    tags: ['problemas', 'soluciones', 'troubleshooting'],
  },
  {
    id: 'aqua-4',
    category: 'Acuarios',
    title: 'Equipo y Tecnología',
    prompt:
      'Escribe una reseña sobre {equipo_acuario}. Incluye cómo funciona, ventajas y desventajas, recomendaciones de uso, comparación con alternativas, y si vale la pena la inversión.',
    variables: [
      {
        name: 'equipo_acuario',
        placeholder: 'ej: skimmers de proteínas, reactores de calcio, iluminación LED',
        description: 'Equipo o tecnología',
      },
    ],
    tags: ['equipo', 'tecnología', 'reseña'],
  },
];

/**
 * Prompts para Conservación Marina
 */
export const conservationPrompts: PromptSuggestion[] = [
  {
    id: 'cons-1',
    category: 'Conservación',
    title: 'Arrecifes de Coral',
    prompt:
      'Escribe sobre el estado actual de los arrecifes de coral en {región}. Incluye datos sobre blanqueamiento, esfuerzos de restauración, impacto del cambio climático, y cómo los acuaristas pueden ayudar mediante la acuariofilia sostenible.',
    variables: [
      {
        name: 'región',
        placeholder: 'ej: Gran Barrera de Coral, Caribe, Océano Índico',
        description: 'Región geográfica',
      },
    ],
    tags: ['arrecife', 'conservación', 'coral', 'sostenibilidad'],
  },
  {
    id: 'cons-2',
    category: 'Conservación',
    title: 'Acuariofilia Sostenible',
    prompt:
      'Genera un artículo sobre prácticas sostenibles en la acuariofilia. Habla sobre {tema_sostenible}, su importancia, cómo implementarlo, y el impacto positivo en los océanos.',
    variables: [
      {
        name: 'tema_sostenible',
        placeholder: 'ej: cría en cautiverio, corales cultivados, comercio ético',
        description: 'Aspecto de sostenibilidad',
      },
    ],
    tags: ['sostenibilidad', 'ética', 'cría'],
  },
  {
    id: 'cons-3',
    category: 'Conservación',
    title: 'Proyectos de Conservación',
    prompt:
      'Crea una noticia sobre un proyecto de conservación marina en {ubicación} liderado por {organización}. Describe los objetivos, metodología, resultados obtenidos, y cómo la comunidad acuarista puede participar o apoyar.',
    variables: [
      {
        name: 'ubicación',
        placeholder: 'ej: Islas Maldivas, Filipinas, Florida',
        description: 'Ubicación del proyecto',
      },
      {
        name: 'organización',
        placeholder: 'ej: Coral Restoration Foundation, The Nature Conservancy',
        description: 'Organización líder',
      },
    ],
    tags: ['proyecto', 'conservación', 'ONG', 'restauración'],
  },
];

/**
 * Prompts para Salud y Enfermedades
 */
export const healthPrompts: PromptSuggestion[] = [
  {
    id: 'health-1',
    category: 'Salud Marina',
    title: 'Enfermedades Comunes',
    prompt:
      'Crea una guía completa sobre {enfermedad_peces} en peces marinos. Incluye síntomas, causas, diagnóstico, tratamiento paso a paso, medicamentos recomendados, y prevención futura.',
    variables: [
      {
        name: 'enfermedad_peces',
        placeholder: 'ej: punto blanco marino, HLLE, brooklynella',
        description: 'Enfermedad o condición',
      },
    ],
    tags: ['enfermedad', 'salud', 'tratamiento', 'veterinaria'],
  },
  {
    id: 'health-2',
    category: 'Salud Marina',
    title: 'Nutrición y Alimentación',
    prompt:
      'Escribe sobre la nutrición óptima para {tipo_pez}. Incluye tipos de alimento, frecuencia, suplementos vitamínicos, señales de desnutrición, y dietas especializadas para reproducción o crecimiento.',
    variables: [
      {
        name: 'tipo_pez',
        placeholder: 'ej: peces herbívoros, carnívoros, filtradores',
        description: 'Tipo o grupo de peces',
      },
    ],
    tags: ['nutrición', 'alimentación', 'dieta', 'vitaminas'],
  },
  {
    id: 'health-3',
    category: 'Salud Marina',
    title: 'Cuarentena y Prevención',
    prompt:
      'Genera un artículo sobre protocolos de cuarentena para nuevos habitantes en acuarios marinos. Explica duración recomendada, tratamientos preventivos, observación de síntomas, y cuándo es seguro introducirlos al acuario principal.',
    variables: [],
    tags: ['cuarentena', 'prevención', 'protocolo', 'bioseguridad'],
  },
];

/**
 * Prompts para Cría y Reproducción
 */
export const breedingPrompts: PromptSuggestion[] = [
  {
    id: 'breed-1',
    category: 'Cría',
    title: 'Guía de Reproducción',
    prompt:
      'Crea una guía completa sobre la reproducción de {especie} en acuario. Incluye condiciones necesarias, comportamiento de cortejo, cuidado de huevos o larvas, alimentación de alevines, y tasas de supervivencia esperadas.',
    variables: [
      {
        name: 'especie',
        placeholder: 'ej: Pez Payaso, Caballitos de Mar, Gobios',
        description: 'Especie a reproducir',
      },
    ],
    tags: ['reproducción', 'cría', 'alevines', 'crianza'],
  },
  {
    id: 'breed-2',
    category: 'Cría',
    title: 'Montaje de Acuario de Cría',
    prompt:
      'Escribe sobre cómo montar un acuario especializado para cría de {tipo_organismo}. Detalla equipo necesario, parámetros del agua, iluminación, y diseño del tanque para maximizar el éxito reproductivo.',
    variables: [
      {
        name: 'tipo_organismo',
        placeholder: 'ej: corales, peces marinos, invertebrados',
        description: 'Tipo de organismo',
      },
    ],
    tags: ['setup', 'cría', 'acuario especializado'],
  },
  {
    id: 'breed-3',
    category: 'Cría',
    title: 'Cultivo de Alimento Vivo',
    prompt:
      'Genera un tutorial sobre cómo cultivar {alimento_vivo} para alimentar larvas y alevines. Incluye materiales necesarios, proceso de cultivo, mantenimiento de la colonia, y densidad de cosecha.',
    variables: [
      {
        name: 'alimento_vivo',
        placeholder: 'ej: rotíferos, copépodos, artemia, fitoplancton',
        description: 'Tipo de alimento vivo',
      },
    ],
    tags: ['cultivo', 'alimento vivo', 'larvas', 'plancton'],
  },
];

/**
 * Prompts para Noticias Externas
 */
export const newsPrompts: PromptSuggestion[] = [
  {
    id: 'news-1',
    category: 'Noticias',
    title: 'Reescribir Noticia Externa',
    prompt:
      'Analiza y mejora la siguiente noticia adaptándola para nuestra audiencia de acuaristas marinos. Reescribe el contenido de manera profesional, clara y atractiva. Mejora la estructura, corrige errores, optimiza el lenguaje para SEO, y añade contexto relevante para acuaristas cuando sea apropiado. Mantén los hechos principales pero presenta la información de forma más engaging. \n\nNoticia original:\n\n{noticia_completa}',
    variables: [
      {
        name: 'noticia_completa',
        placeholder:
          'Pega aquí el texto completo de la noticia externa que deseas mejorar y adaptar...',
        description: 'Texto completo de la noticia externa',
      },
    ],
    tags: ['noticia', 'externa', 'reescribir', 'mejorar', 'adaptar'],
  },
  {
    id: 'news-2',
    category: 'Noticias',
    title: 'Noticia con Enfoque Específico',
    prompt:
      'Basándote en la siguiente noticia, crea una versión mejorada con énfasis en {enfoque_especifico}. Reestructura el contenido para destacar este aspecto, añade análisis profundo sobre el tema, incluye datos relevantes, y proporciona contexto adicional que sea valioso para los lectores interesados en este enfoque particular.\n\nNoticia original:\n\n{noticia_completa}',
    variables: [
      {
        name: 'noticia_completa',
        placeholder: 'Pega aquí el texto completo de la noticia externa...',
        description: 'Texto completo de la noticia',
      },
      {
        name: 'enfoque_especifico',
        placeholder:
          'ej: conservación marina, impacto económico, tecnología, investigación científica',
        description: 'Aspecto específico a enfatizar',
      },
    ],
    tags: ['noticia', 'enfoque', 'análisis', 'especializado'],
  },
  {
    id: 'news-3',
    category: 'Noticias',
    title: 'Noticia Resumida y Mejorada',
    prompt:
      'Toma la siguiente noticia y crea una versión concisa, profesional y mejorada de aproximadamente {longitud_deseada} palabras. Extrae los puntos clave, mejora la redacción, estructura la información de forma clara con subtítulos apropiados, y asegúrate de que sea fácil de leer y comprender. Mantén los datos más importantes y elimina información redundante.\n\nNoticia original:\n\n{noticia_completa}',
    variables: [
      {
        name: 'noticia_completa',
        placeholder: 'Pega aquí el texto completo de la noticia que deseas resumir...',
        description: 'Texto completo de la noticia',
      },
      {
        name: 'longitud_deseada',
        placeholder: 'ej: 300, 500, 800',
        description: 'Número aproximado de palabras deseado',
      },
    ],
    tags: ['noticia', 'resumen', 'conciso', 'mejorar'],
  },
  {
    id: 'news-4',
    category: 'Noticias',
    title: 'Noticia con Perspectiva Local',
    prompt:
      'Reescribe la siguiente noticia internacional añadiendo una perspectiva local para {región_objetivo}. Explica cómo esta noticia afecta o se relaciona con la comunidad de acuaristas en esta región, menciona tiendas, organizaciones o eventos locales relevantes cuando sea apropiado, y adapta el tono y ejemplos para resonar con la audiencia local.\n\nNoticia original:\n\n{noticia_completa}',
    variables: [
      {
        name: 'noticia_completa',
        placeholder: 'Pega aquí el texto completo de la noticia internacional...',
        description: 'Texto completo de la noticia',
      },
      {
        name: 'región_objetivo',
        placeholder: 'ej: México, Latinoamérica, Ciudad de México',
        description: 'Región o audiencia objetivo',
      },
    ],
    tags: ['noticia', 'local', 'regional', 'adaptación'],
  },
];

// ============================================================================
// FUNCIONES HELPER
// ============================================================================

/**
 * Obtiene todas las sugerencias de prompts
 */
export function getAllPromptSuggestions(): PromptSuggestion[] {
  return [
    ...marineSpeciesPrompts,
    ...aquariumMaintenancePrompts,
    ...conservationPrompts,
    ...healthPrompts,
    ...breedingPrompts,
    ...newsPrompts,
  ];
}

/**
 * Obtiene sugerencias por categoría
 */
export function getPromptsByCategory(category: string): PromptSuggestion[] {
  const allPrompts = getAllPromptSuggestions();
  return allPrompts.filter((p) => p.category === category);
}

/**
 * Busca sugerencias por término
 */
export function searchPrompts(searchTerm: string): PromptSuggestion[] {
  const term = searchTerm.toLowerCase();
  const allPrompts = getAllPromptSuggestions();

  return allPrompts.filter(
    (p) =>
      p.title.toLowerCase().includes(term) ||
      p.prompt.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.tags?.some((tag) => tag.toLowerCase().includes(term))
  );
}

/**
 * Reemplaza variables en un prompt
 */
export function fillPromptVariables(prompt: string, variables: Record<string, string>): string {
  let filledPrompt = prompt;

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    filledPrompt = filledPrompt.replace(regex, value);
  });

  return filledPrompt;
}

/**
 * Obtiene categorías únicas
 */
export function getUniqueCategories(): string[] {
  const allPrompts = getAllPromptSuggestions();
  const categories = allPrompts.map((p) => p.category);
  return Array.from(new Set(categories));
}

/**
 * Obtiene una sugerencia por ID
 */
export function getPromptById(id: string): PromptSuggestion | undefined {
  const allPrompts = getAllPromptSuggestions();
  return allPrompts.find((p) => p.id === id);
}
