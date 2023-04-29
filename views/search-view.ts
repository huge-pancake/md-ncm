import Logger from '../logger.js';
import { ParsedURL } from '../router.js';

import { request, Song } from '../api.js';
import { router } from '../app.js';

export default {
  render(location: string, parsedURL: ParsedURL) {
    return `
      <h1>
        Search${parsedURL.b ? ' result of ' + decodeURI(parsedURL.b) : ''}
      </h1>

      <input
        class="md-text-field"
        id="search-input"
        placeholder="Search"
        value="${decodeURI(parsedURL.b || '')}"
      />

      <ul id="search-list">
        ${parsedURL.b ? 'Loading...' : ''}
      </ul>
    `;
  },
  async afterRender(location: string, parsedURL: ParsedURL) {
    const searchInputEl = document.querySelector(
      '#search-input'
    ) as HTMLInputElement;
    searchInputEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        router.route(`/search/${searchInputEl.value}`);
      }
    });
    searchInputEl.focus();

    if (parsedURL.b) {
      const searchListEl = document.querySelector('#search-list');

      const response = await request(`/search?keywords=${parsedURL.b}`);
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
