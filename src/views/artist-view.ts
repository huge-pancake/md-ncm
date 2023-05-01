import { html } from 'lit';

import '@material/web/button/filled-button.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';

import Logger from '../logger.js';
import { ViewRendererParams } from '../router.js';
import { request, Artist, HotSong } from '../api.js';

export default {
  render(params: ViewRendererParams) {
    if (!this._jsonData)
      return html`<h1>Loading artist by id ${params.urlSegments[1]}...</h1>`;

    const artist = this._jsonData.artist as Artist;

    return html`
      <h1>${artist.name}</h1>

      <p>${artist.briefDesc}</p>

      <md-filled-button
        >${artist.followed ? 'Followed' : 'Follow'}</md-filled-button
      >

      <h2>Hot songs</h2>

      ${this.renderHotSongsList()}
    `;
  },
  renderHotSongsList() {
    const hotSongs = this._jsonData!.hotSongs as HotSong[];

    return html`
      <md-list class="mn-music-list">
        ${this._jsonData
          ? hotSongs.map(
              (song) => html`
                <md-list-item
                  headline="${song.name}"
                  supportingtext="${song.ar.map(
                    (artist) => ` ${artist.name}`
                  )} - ${song.al.name}"
                ></md-list-item>
              `
            )
          : html``}
      </md-list>
    `;
  },
  async afterRender(params: ViewRendererParams) {
    if (params.urlSegments[1]) {
      const response = await request(`/artists?id=${params.urlSegments[1]}`);
      const jsonData = await response.json();
      Logger.info('Search', jsonData);

      this._jsonData = jsonData;

      // need rerender
      return true;
    }
  },

  _jsonData: undefined as { artist: Artist; hotSongs: HotSong[] } | undefined,
};
