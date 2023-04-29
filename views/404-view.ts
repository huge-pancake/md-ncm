import { ParsedURL } from '../router.js';

export default {
  render: (location: string, parsedURL: ParsedURL) => {
    return `
      <h1>404 Not Found</h1>
      <pre>${location}</pre>
      <p>What?</p>
    `;
  },
};
