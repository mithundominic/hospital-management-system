// Responsibility: Convert JSON to CSV format

export const jsonToCSV = (data: Record<string, unknown>): string => {
  const rows: string[] = [];

  const flattenObject = (
    obj: Record<string, unknown>,
    prefix = "",
  ): Record<string, string> => {
    const flattened: Record<string, string> = {};
    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value === null || value === undefined) {
        flattened[newKey] = "";
      } else if (Array.isArray(value)) {
        flattened[newKey] = JSON.stringify(value);
      } else if (typeof value === "object") {
        Object.assign(
          flattened,
          flattenObject(value as Record<string, unknown>, newKey),
        );
      } else {
        flattened[newKey] = String(value);
      }
    }
    return flattened;
  };

  for (const section in data) {
    const sectionData = data[section];
    rows.push(`\n[${section.toUpperCase()}]`);

    if (Array.isArray(sectionData)) {
      if (sectionData.length === 0) {
        rows.push("No data");
      } else {
        const headers = Object.keys(flattenObject(sectionData[0]));
        rows.push(headers.join(","));
        sectionData.forEach((item) => {
          const flatItem = flattenObject(item);
          const values = headers.map(
            (h) => `"${String(flatItem[h] || "").replace(/"/g, '""')}"`,
          );
          rows.push(values.join(","));
        });
      }
    } else if (sectionData && typeof sectionData === "object") {
      const flatData = flattenObject(sectionData as Record<string, unknown>);
      Object.entries(flatData).forEach(([key, value]) => {
        rows.push(`${key},"${String(value).replace(/"/g, '""')}"`);
      });
    }
  }

  return rows.join("\n");
};
