import '@material/web/button/text-button.js';
import '@material/web/icon/icon.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/linearprogress/linear-progress.js';

import { Router } from './router.js';

const viewsInfoList = {
  404: '404',
  '/': 'home',
  '/about': 'about',
  '/search': 'search',
  '/search/:id': 'search',
};

export const router = new Router({
  viewInfoList: viewsInfoList,
  viewEl: document.querySelector('#router-view') as HTMLElement,
  progressEl: document.querySelector('#router-progress') as HTMLElement,
});
