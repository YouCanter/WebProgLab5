export const buildQueryString = (params: object): string => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "boolean") {
      search.append(key, value ? "true" : "false");
      continue;
    }
    search.append(key, String(value));
  }
  const str = search.toString();
  return str ? `?${str}` : "";
};
