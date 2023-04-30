import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';

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
      ></md-outlined-text-field>

      <ul id="search-list">
        ${params.urlSegments[1] ? 'Loading...' : ''}
      </ul>
    `;
  },
  async afterRender(params: ViewRendererParams) {
    const searchInputEl = document.querySelector(
      '#search-input'
    ) as MdOutlinedTextField;
    searchInputEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        router.route(`/search/${searchInputEl.value}`);
      }
    });
    searchInputEl.focus();

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
        let el = document.createElement('li');
        el.textContent = `${song.name} -${song.artists.map(
          (artist) => ` ${artist.name}`
        )} - ${song.album.name}`;
        searchListEl.appendChild(el);
      });
    }
  },
};
