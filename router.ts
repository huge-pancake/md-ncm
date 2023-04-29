import Logger from './logger.js';

export type ParsedURL = {
  a: string;
  b: string;
  c: string;
};

export type ViewInfoList = { [str: string]: string };

export type View = {
  render: (location: string, parsedURL: ParsedURL) => string;
  afterRender: (location: string, parsedURL: ParsedURL) => void;
};

export class Router {
  viewInfoList: ViewInfoList | undefined;
  viewEl: HTMLElement | undefined;
  progressEl: HTMLElement | undefined;

  constructor({
    viewInfoList: pages,
    viewEl: view,
    progressEl: progressbar,
  }: {
    viewInfoList: ViewInfoList;
    viewEl: HTMLElement;
    progressEl?: HTMLElement;
  }) {
    this.viewInfoList = pages;
    this.viewEl = view;
    this.progressEl = progressbar;

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
    if (!this.viewEl) {
      Logger.error('Router', 'Need view element to render in');
      return;
    }

    this.progressEl?.removeAttribute('hidden');

    const parsedURL = this.parseURL();
    Logger.info('Router', 'Got parsed URL', parsedURL);

    const location =
      (parsedURL.a ? '/' + parsedURL.a : '/') +
      (parsedURL.b ? '/:id' : '') +
      (parsedURL.c ? '/' + parsedURL.c : '');
    Logger.info('Router', 'Got location', location);

    const viewInfo = this.viewInfoList[location] || this.viewInfoList[404];
    Logger.info('Router', 'Got view info and fetching', viewInfo);

    import(viewInfo).then((_view) => {
      const view = _view.default as View;

      const renderedHTML = view.render(location, parsedURL);

      this.viewEl.innerHTML = renderedHTML;
      view.afterRender?.(location, parsedURL);

      document.title = document.querySelector('h1')?.textContent!;
      this.progressEl?.setAttribute('hidden', '');
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
