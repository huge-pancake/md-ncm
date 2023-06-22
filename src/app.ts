import '@material/web/button/text-button.js';
import '@material/web/icon/icon.js';
import '@material/web/linearprogress/linear-progress.js';
import '@material/web/iconbutton/standard-icon-button.js';
import '@material/web/dialog/dialog.js';

import type { MdDialog } from '@material/web/dialog/dialog.js';
import type { MdStandardIconButton } from '@material/web/iconbutton/standard-icon-button.js';

import './components/theme-picker.js';

import { Router } from './router.js';

export const router = new Router({
  viewInfoList: {
    404: { view: '404' },
    '/': { view: 'home' },
    '/about': { view: 'about' },
    '/artist/:id': { view: 'artist', hideProgress: 'afterRender' },
    '/search': { view: 'search' },
    '/search/:id': { view: 'search', hideProgress: 'afterRender' },
    '/settings': { view: 'settings' },
  },
  viewEl: document.querySelector('#router-view') as HTMLElement,
  progressEl: document.querySelector('#router-progress') as HTMLElement,
});

const themePickerTrigger: MdStandardIconButton = document.querySelector(
  '#theme-picker-trigger'
)!;
const themePicker: MdDialog = document.querySelector('#theme-picker')!;

themePickerTrigger.addEventListener('click', (_ev) => {
  themePicker.open = true;
});
