import { ViewRendererParams } from '../router.js';

export default {
  render(params: ViewRendererParams) {
    return `
      <h1>404 Not Found</h1>
      <pre>${params.subpath}</pre>
      <p>What?</p>
    `;
  },
};
