/**
 * WXT creates richer declarations in .wxt during extension builds. Keep the
 * entrypoint macros declared here too so typechecking and Vitest work directly
 * after npm ci, before WXT has generated that build directory.
 */
declare const defineBackground: (entrypoint: () => void) => unknown;
declare const defineContentScript: (entrypoint: Record<string, unknown>) => unknown;
