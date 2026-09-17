import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    EnvironmentPlugin({
      REACT_APP_BC_BASE_MAP_TILES_URL:
       "https://services.pacificclimate.org/tiles/bc-albers-lite/{z}/{x}/{y}.png",
      REACT_APP_EEZ_GEOJSON_URL:
        "https://beehive.pacificclimate.org/tiles/eez/eez_boundaries_bc_v12.geojson"
    }),
  ],
  base: "/chyp",
  build: {
    sourcemap: true,
  },
  // Local Dev only
  server: {
    warmup: {
      clientFiles: [
        "src/styles.js",
        "src/components/map/MapComponent.jsx",
        "src/components/map/InteractionLayer.jsx",
        "src/components/map/PointPlotter.jsx",
      ],
    },
    port: 3000,
    host: true,
    proxy: {
      "/bbox-server": {
        target: "https://beehive.pacificclimate.org",
        changeOrigin: true,
      },
      "/hydromosaic": {
        target: "https://beehive.pacificclimate.org",
        changeOrigin: true,
      },
    },
  },
});
