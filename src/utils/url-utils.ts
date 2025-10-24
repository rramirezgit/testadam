/**
 * Construye un query string a partir de un objeto de parámetros
 * Filtra valores vacíos, null o undefined
 * Los valores booleanos siempre se incluyen (incluso false)
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    // Solo agregar el parámetro si tiene un valor válido
    if (value !== '' && value !== null && value !== undefined) {
      // Para booleanos, siempre agregar incluso si es false
      if (typeof value === 'boolean' || value !== false) {
        searchParams.set(key, String(value));
      }
    }
  });
  return searchParams.toString();
}

/**
 * Parsea un URLSearchParams a un objeto plano
 */
export function parseQueryParams(searchParams: URLSearchParams): Record<string, any> {
  const params: Record<string, any> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}
