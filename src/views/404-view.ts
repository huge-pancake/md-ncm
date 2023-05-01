import { html } from 'lit';

import { ViewRendererParams } from '../router.js';

export default {
  render(params: ViewRendererParams) {
    return html`
      <h1>404 Not Found</h1>
      <pre>${params.subpath}</pre>
      <p>What?</p>
    `;
  },
};
