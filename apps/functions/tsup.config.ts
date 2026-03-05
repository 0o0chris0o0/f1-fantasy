import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],        // Firebase Functions usually run on CommonJS
  target: 'node20',       // Match your Firebase Runtime version
  clean: true,            // Clean the dist folder before building
  bundle: true,           // This is the magic: it pulls in @my-project/shared
  noExternal: [/^@f1pick6\/shared/], // Forces the shared package to be bundled
  sourcemap: true,
  minify: false,          // Keep it false for easier debugging in Firebase logs
});