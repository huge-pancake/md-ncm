import { Router } from './router.js';

const pages = {
  404: './views/404-view.ts',
  '/': './views/home-view.ts',
  '/about': './views/about-view.ts',
};

const router = new Router({
  pages: pages,
  view: document.querySelector('#router-view') as HTMLElement,
  progressbar: document.querySelector('#router-progressbar') as HTMLElement,
});
