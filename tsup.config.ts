import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "node18",
  platform: "node",
  clean: true,
  sourcemap: false,
  splitting: false,
  dts: false,
});