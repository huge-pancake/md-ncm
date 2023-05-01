import { html } from 'lit';

import { ViewRendererParams } from '../router.js';

export default {
  render(params: ViewRendererParams) {
    return html`
      <h1>404 Not Found</h1>
      <code>${params.subpath}</code>
      <p>What?</p>
    `;
  },
};
