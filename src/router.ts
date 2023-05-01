import { render } from 'lit';

import Logger from './logger.js';

export type ViewInfoList = { [str: string]: string };

export type ViewRendererParams = {
  subpath: string;
  viewEntry: string;
  urlSegments: string[];
};

export type View = {
  render(params: ViewRendererParams): string;
  afterRender(params: ViewRendererParams): Promise<boolean>;
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

    window.addEventListener('click', this.handleWindowClick.bind(this));
    window.addEventListener('popstate', this.render);

    this.render();
  }

  updateLinkState(location: string): void {
    document
      .querySelectorAll('[router-active]')
      .forEach((el) => el.removeAttribute('router-active'));
    document
      .querySelectorAll(`[href="${location}"]`)
      .forEach((el) => el.setAttribute('router-active', ''));
  }

  async render(): Promise<void> {
    if (!this.viewInfoList) {
      Logger.error('Router', 'Need view info list to get view page');
      return;
    }
    if (!this.viewEl) {
      Logger.error('Router', 'Need view element to render in');
      return;
    }

    this.progressEl?.removeAttribute('hidden');

    const subpath = location.pathname.slice(1).toLowerCase();
    const urlSegments = subpath.split('/');
    Logger.info('Router', 'Got URL segments', urlSegments);

    const viewEntry =
      '/' +
      (urlSegments[0] ? urlSegments[0] : '') +
      (urlSegments[1] ? '/:id' : '') +
      (urlSegments[2] ? '/' + urlSegments[3] : '');
    Logger.info('Router', 'Got view entry', viewEntry);

    const viewInfo = this.viewInfoList[viewEntry] || this.viewInfoList[404];
    Logger.info('Router', 'Got view info and fetching', viewInfo);

    import(`./views/${viewInfo}-view.ts`).then((_view) => {
      if (!this.viewEl) {
        Logger.error('Router', 'Need view element to render in');
        return;
      }

      const view = _view.default as View;

      const renderView = () => {
        return view.render({
          subpath: subpath,
          viewEntry: viewEntry,
          urlSegments: urlSegments,
        });
      };

      render(renderView(), this.viewEl);
      view
        .afterRender?.({
          subpath: subpath,
          viewEntry: viewEntry,
          urlSegments: urlSegments,
        })
        .then((needRerender) => {
          if (needRerender) {
            render(renderView(), this.viewEl!);
          }
        });

      document.title = document.querySelector('h1')?.textContent!;
      this.progressEl?.setAttribute('hidden', '');
      this.updateLinkState('/' + subpath);
    });
  }

  route(link: string): void {
    window.history.pushState({ page: window.location.pathname }, '', link);
    this.render();
  }

  // NOTE: Maybe cause perf problem
  handleWindowClick(e: MouseEvent): void {
    let temp: HTMLElement | null = e.target as HTMLElement;
    do {
      if (temp.hasAttribute('router-link')) {
        e.preventDefault();
        this.route((temp as HTMLLinkElement).href);
        break;
      } else temp = temp.parentNode as HTMLElement | null;
    } while (temp?.hasAttribute);
  }
}
