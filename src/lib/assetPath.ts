const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const normalizedBasePath =
  rawBasePath && rawBasePath !== "/"
    ? rawBasePath.replace(/\/$/, "")
    : "";

export const withBasePath = (path: string): string => {
  if (!path.startsWith("/")) {
    throw new Error("withBasePath requires an absolute path that starts with '/'.");
  }

  return `${normalizedBasePath}${path}`;
};
