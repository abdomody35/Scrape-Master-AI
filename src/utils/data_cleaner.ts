const cleanup = (data: string) => {
  return data.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
};

export { cleanup };
