import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: {
    app: './app.ts',
    'views/404-view': './views/404-view.js',
    'views/about-view': './views/about-view.js',
    'views/home-view': './views/home-view.js',
  },
  output: {
    dir: './dist',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript({
      sourceMap: true,
    }),
    terser({
      output: {
        comments: false,
      },
    }),
    html({
      input: ['./index.html'],
    }),
  ],
};
