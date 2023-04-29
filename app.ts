import { Router } from './router.js';

const viewsInfoList = {
  404: './views/404-view.ts',
  '/': './views/home-view.ts',
  '/about': './views/about-view.ts',
  '/search': './views/search-view.ts',
  '/search/:id': './views/search-view.ts',
};

export const router = new Router({
  viewInfoList: viewsInfoList,
  viewEl: document.querySelector('#router-view') as HTMLElement,
  progressEl: document.querySelector('#router-progress') as HTMLElement,
});
