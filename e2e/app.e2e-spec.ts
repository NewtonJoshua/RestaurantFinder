import { WarpPage } from './app.po';

describe('warp App', () => {
  let page: WarpPage;

  beforeEach(() => {
    page = new WarpPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
