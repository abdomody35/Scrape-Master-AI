const snakeToCamel = (s: string): string => {
  return s.replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
};

const camelToSnake = (s: string): string => {
  return s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export { snakeToCamel, camelToSnake };
