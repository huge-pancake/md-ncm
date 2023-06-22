import { render } from 'lit';

import Logger from './utils/logger.js';

export type ViewInfoList = {
  [path: string]: {
    view: string;
    hideProgress?: 'render' | 'afterRender';
  };
};

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
    viewInfoList: viewInfoList,
    viewEl: viewEl,
    progressEl: progressEl,
  }: {
    viewInfoList: ViewInfoList;
    viewEl: HTMLElement;
    progressEl?: HTMLElement;
  }) {
    this.viewInfoList = viewInfoList;
    this.viewEl = viewEl;
    this.progressEl = progressEl;

    window.addEventListener('click', this._handleWindowClick.bind(this));
    window.addEventListener('popstate', this.render.bind(this));

    this.render();
  }

  _updateLinkState(location: string): void {
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

    this.showProgress();

    // trying to find view entry

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

    // fetch view and render

    import(`./views/${viewInfo.view}-view.ts`).then((_view) => {
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

      this.syncTitle();
      if (viewInfo.hideProgress !== 'afterRender') this.hideProgress();

      view
        .afterRender?.({
          subpath: subpath,
          viewEntry: viewEntry,
          urlSegments: urlSegments,
        })
        .then((needRerender) => {
          if (needRerender) {
            Logger.info('Router', 'View requested rerender');

            render(renderView(), this.viewEl!);

            this.syncTitle();
            if (viewInfo.hideProgress === 'afterRender') this.hideProgress();
          }
        });

      this._updateLinkState('/' + subpath);
    });
  }

  route(link: string): void {
    window.history.pushState({ page: window.location.pathname }, '', link);
    this.render();
  }

  // NOTE: Maybe cause perf problem
  private _handleWindowClick(e: MouseEvent): void {
    let temp: HTMLElement | null = e.target as HTMLElement;
    do {
      if (temp.hasAttribute('router-link')) {
        e.preventDefault();
        this.route((temp as HTMLLinkElement).href);
        break;
      } else temp = temp.parentNode as HTMLElement | null;
    } while (temp?.hasAttribute);
  }

  syncTitle() {
    document.title = document.querySelector('h1')?.textContent || '';
  }
  showProgress() {
    this.progressEl?.removeAttribute('hidden');
  }
  hideProgress() {
    this.progressEl?.setAttribute('hidden', '');
  }
}
