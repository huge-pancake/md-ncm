import '@material/web/iconbutton/standard-icon-button.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';

import Logger from '../logger.js';
import { ViewRendererParams } from '../router.js';

import { request, Song } from '../api.js';
import { router } from '../app.js';

export default {
  render(params: ViewRendererParams) {
    return `
      <h1>
        Search${
          params.urlSegments[1]
            ? ' result of ' + decodeURI(params.urlSegments[1])
            : ''
        }
      </h1>

      <md-outlined-text-field
        id="search-input"
        label="Search"
        value="${decodeURI(params.urlSegments[1] || '')}"
      >
        <md-standard-icon-button
          id="search-button"
          slot="trailingicon"
          aria-label="Start search"
        >
          search
        </md-standard-icon-button>
      </md-outlined-text-field>

      <md-list id="search-list">
        ${params.urlSegments[1] ? 'Loading...' : ''}
      </md-list>
    `;
  },
  async afterRender(params: ViewRendererParams) {
    const searchButtonEl = document.querySelector(
      '#search-button'
    ) as HTMLButtonElement;
    searchButtonEl.addEventListener('click', (_e: Event) => {
      router.route(`/search/${searchInputEl.value}`);
    });

    const searchInputEl = document.querySelector(
      '#search-input'
    ) as HTMLInputElement;
    searchInputEl.addEventListener('keydown', (_e: KeyboardEvent) => {
      if (_e.code === 'Enter') {
        router.route(`/search/${searchInputEl.value}`);
      }
    });
    searchInputEl.focus();
    searchInputEl.select();

    if (params.urlSegments[1]) {
      const searchListEl = document.querySelector(
        '#search-list'
      ) as HTMLUListElement;

      const response = await request(
        `/search?keywords=${params.urlSegments[1]}`
      );
      const jsonData = await response.json();
      Logger.info('Search', jsonData);

      searchListEl.innerHTML = '';

      (jsonData.result.songs as Song[]).forEach((song) => {
        let el = document.createElement('md-list-item');
        el.headline = song.name;
        el.supportingText = `${song.artists.map(
          (artist) => ` ${artist.name}`
        )} - ${song.album.name}${
          song.album.alia ? ' (' + song.album.alia + ')' : ''
        }`;
        searchListEl.appendChild(el);
      });
    }
  },
};
