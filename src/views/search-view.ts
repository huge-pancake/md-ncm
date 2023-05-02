import { html } from 'lit';

import '@material/web/iconbutton/standard-icon-button.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/textfield/outlined-text-field.js';

import Logger from '../logger.js';
import { ViewRendererParams } from '../router.js';
import { request, Song } from '../api.js';
import { router } from '../app.js';

export default {
  render(params: ViewRendererParams) {
    return html`
      <h1>
        Search${params.urlSegments[1]
          ? ' result of ' + decodeURI(params.urlSegments[1])
          : ''}
      </h1>

      <md-outlined-text-field
        id="search-input"
        label="Search"
        value="${decodeURI(params.urlSegments[1] || '')}"
        @keydown="${this._handleInputKeydown.bind(this)}"
      >
        <md-standard-icon-button
          id="search-button"
          slot="trailingicon"
          aria-label="Start search"
          @click="${this._handleButtonClick.bind(this)}"
        >
          search
        </md-standard-icon-button>
      </md-outlined-text-field>

      ${params.urlSegments[1] ? this.renderList() : ''}
    `;
  },
  renderList() {
    return html`
      <md-list class="mn-list" id="search-list">
        ${this._jsonData
          ? (this._jsonData.result.songs as Song[]).map(
              (song) => html`
                <md-list-item
                  headline="${song.name}"
                  supportingtext="${song.artists.map(
                    (artist) => ` ${artist.name}`
                  )} - ${song.album.name}${song.album.alia
                    ? ' (' + song.album.alia + ')'
                    : ''}"
                ></md-list-item>
              `
            )
          : html``}
      </md-list>
    `;
  },
  async afterRender(params: ViewRendererParams) {
    if (params.urlSegments[1]) {
      const response = await request(
        `/search?keywords=${params.urlSegments[1]}`
      );
      const jsonData = await response.json();
      Logger.info('Search', jsonData);

      this._jsonData = jsonData;

      // need rerender
      return true;
    }
  },

  _jsonData: undefined as { result: { songs: Song[] } } | undefined,

  get _searchInputEl() {
    return document.querySelector('#search-input') as HTMLInputElement;
  },

  _handleInputKeydown(_e: KeyboardEvent) {
    if (_e.code === 'Enter') {
      this.search(this._searchInputEl.value);
    }
  },
  _handleButtonClick(_e: Event) {
    this.search(this._searchInputEl.value);
  },

  search(target: string) {
    router.route(`/search/${target}`);
  },
};
