import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import bundleSize from 'rollup-plugin-bundle-size';

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/markers/src/cassettator-markers-plugin.js',
  output: [
    {
      file: 'dist/cassettator.browser.js',
      format: 'iife',
    },
    {
      file: 'dist/cassettator.browser.min.js',
      format: 'iife',
      plugins: [terser()],
    },
    {
      file: 'dist/cassettator.es.js',
      format: 'es',
    },
    {
      file: 'dist/cassettator.es.min.js',
      format: 'es',
      plugins: [terser()],
    },
  ],
  plugins: [json(), bundleSize()],
};
