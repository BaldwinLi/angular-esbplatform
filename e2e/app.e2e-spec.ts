import { EsbOperationPlatformPage } from './app.po';

describe('esb-operation-platform App', () => {
  let page: EsbOperationPlatformPage;

  beforeEach(() => {
    page = new EsbOperationPlatformPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
