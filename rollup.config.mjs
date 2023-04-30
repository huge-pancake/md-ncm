import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import postcss from 'rollup-plugin-postcss';

export default {
  input: {
    app: './app.ts',
    'views/404-view': './views/404-view.ts',
    'views/about-view': './views/about-view.ts',
    'views/home-view': './views/home-view.ts',
    'views/search-view': './views/search-view.ts',
  },
  output: {
    dir: './dist',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    html({
      input: ['./index.html'],
      minify: true,
    }),
    postcss({
      minimize: true,
    }),

    // .js is for vercel deployment and .ts is for web-dev-server, if not so,
    // vercel can't work because the code which imports these views points to
    // .ts files and they're strings so that rollup can't auto change them to
    // strings with .js
    // *see ./app.ts > row 3 | const views
    replace({
      preventAssignment: true,
      values: {
        '-view.ts': '-view.js',
      },
    }),
    resolve(),
    typescript({
      sourceMap: true,
    }),
    terser({
      output: {
        comments: false,
      },
    }),
  ],
};
