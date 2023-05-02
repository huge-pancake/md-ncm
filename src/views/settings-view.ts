import { html } from 'lit';

import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';

import { router } from '../app.js';

export default {
  render() {
    return html`
      <h1>Settings</h1>

      <h2>Appearance</h2>

      <md-list class="mn-list">
        <md-list-item headline="Language" supportingtext="English" @click="">
          <md-icon data-variant="icon" slot="start">translate</md-icon>
        </md-list-item>
        <md-list-item headline="Theme" supportingtext="System" @click="">
          <md-icon data-variant="icon" slot="start"
            >settings_brightness</md-icon
          >
        </md-list-item>
      </md-list>

      <h2>Development</h2>

      <md-list class="mn-list">
        <md-list-item
          headline="Debug mode"
          supportingtext="${localStorage.getItem('debug') !== 'true'
            ? 'Off'
            : 'On'}"
          @click="${this.toggleDebugMode}"
        >
          <md-icon data-variant="icon" slot="start">code</md-icon>
        </md-list-item>
      </md-list>
    `;
  },

  toggleDebugMode() {
    localStorage.setItem(
      'debug',
      localStorage.getItem('debug') !== 'true' ? 'true' : 'false'
    );
    router.render();
  },
};
