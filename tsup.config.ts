import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/serializer/*"],
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
});
