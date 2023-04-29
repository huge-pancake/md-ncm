import { ParsedURL } from '../router.js';

export default {
  render: (location: string, parsedURL: ParsedURL) => {
    return `
      <h1>Home!</h1>
    `;
  },
};
