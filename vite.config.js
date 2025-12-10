import path from "path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import solidPlugin from "vite-plugin-solid";
import solidSvg from "vite-plugin-solid-svg";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [solid(), tailwindcss(), solidPlugin(), solidSvg()],
  resolve: {
    alias: {
      api: path.resolve(__dirname, "src/api"),
      pages: path.resolve(__dirname, "src/pages"),
      layouts: path.resolve(__dirname, "src/layouts"),
      components: path.resolve(__dirname, "src/components"),
      stores: path.resolve(__dirname, "src/stores"),
      assets: path.resolve(__dirname, "src/assets"),
      icons: path.resolve(__dirname, "src/icons"),
    },
  },
});
