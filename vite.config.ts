import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [devtools(), solidPlugin()],
  server: {
    port: 3000,
  },
  // root: './src',
  build: {
    outDir: '../UtilityAnalysis/wwwroot',
    emptyOutDir: true, // also necessary
    target: 'esnext',
    sourcemap: true
  },
});
