import { Router } from './router.js';

const viewsInfoList = {
  404: './views/404-view.ts',
  '/': './views/home-view.ts',
  '/about': './views/about-view.ts',
};

new Router({
  viewInfoList: viewsInfoList,
  viewEl: document.querySelector('#router-view') as HTMLElement,
  progressEl: document.querySelector('#router-progressbar') as HTMLElement,
});
