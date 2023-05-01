import '@material/web/button/text-button.js';
import '@material/web/icon/icon.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/linearprogress/linear-progress.js';

import { Router } from './router.js';

export const router = new Router({
  viewInfoList: {
    404: { view: '404' },
    '/': { view: 'home' },
    '/about': { view: 'about' },
    '/search': { view: 'search' },
    '/search/:id': { view: 'search', hideProgress: 'afterRender' },
    '/artist/:id': { view: 'artist', hideProgress: 'afterRender' },
  },
  viewEl: document.querySelector('#router-view') as HTMLElement,
  progressEl: document.querySelector('#router-progress') as HTMLElement,
});

// @ts-ignore
globalThis.router = router;
