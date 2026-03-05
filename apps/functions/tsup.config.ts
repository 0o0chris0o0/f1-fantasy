import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Your functions entry point
  format: ['cjs'],         // Firebase Functions usually expect CommonJS
  clean: true,             // Clean the dist folder before each build
  dts: false,              // We don't need type definitions for the cloud
  splitting: false,
  sourcemap: true,
  // CRITICAL: This tells tsup to bundle your shared package 
  // instead of leaving it as an external reference.
  noExternal: ['@f1pick6/shared'], 
});