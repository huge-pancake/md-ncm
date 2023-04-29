import Logger from './logger.js';

export type ParsedURL = {
  a: string;
  b: string;
  c: string;
};

export class Router {
  pages: any;
  view: HTMLElement | undefined;
  progressbar: HTMLElement | undefined;

  constructor({
    pages,
    view,
    progressbar,
  }: {
    pages: any;
    view: HTMLElement;
    progressbar?: HTMLElement;
  }) {
    this.pages = pages;
    this.view = view;
    this.progressbar = progressbar;

    window.addEventListener('click', this.handleWindowClick);
    window.addEventListener('popstate', this.render);

    this.render();
  }

  parseURL = (): ParsedURL => {
    let url = location.pathname.slice(1).toLowerCase() || '/';
    let r = url.split('/');
    let parsedURL = {
      a: r[0],
      b: r[1],
      c: r[2],
    };

    return parsedURL;
  };

  updateLinkState = (location: string): void => {
    document
      .querySelectorAll('[router-active]')
      .forEach((el) => el.removeAttribute('router-active'));
    document
      .querySelectorAll(`[href="${location}"]`)
      .forEach((el) => el.setAttribute('router-active', ''));
  };

  render = async () => {
    if (!this.view) {
      Logger.error('router', 'Need view element to render in');
      return;
    }

    this.progressbar?.removeAttribute('hidden');

    const parsedURL = this.parseURL();
    Logger.info('router', 'Got parsed URL', parsedURL);

    const location =
      (parsedURL.a ? '/' + parsedURL.a : '/') +
      (parsedURL.b ? '/:id' : '') +
      (parsedURL.c ? '/' + parsedURL.c : '');
    Logger.info('router', 'Got location', location);

    const page = this.pages[location] || this.pages[404];
    Logger.info('router', 'Fetching page', page);

    import(page).then((_page) => {
      const data = _page.default.render(location, parsedURL);

      this.view.innerHTML = data;
      document.title = document.querySelector('h1')?.textContent!;
      page.afterRender?.();
      this.progressbar?.setAttribute('hidden', '');
      this.updateLinkState(location);
    });
  };

  route = (link: string) => {
    window.history.pushState({ page: window.location.pathname }, '', link);
    this.render();
  };

  // NOTE: Maybe cause perf problem
  handleWindowClick = (e: MouseEvent) => {
    let temp: HTMLElement | null = e.target as HTMLElement;
    do {
      if (temp.hasAttribute('router-link')) {
        e.preventDefault();
        this.route((temp as HTMLLinkElement).href);
        break;
      } else temp = temp.parentNode as HTMLElement | null;
    } while (temp?.hasAttribute);
  };
}
