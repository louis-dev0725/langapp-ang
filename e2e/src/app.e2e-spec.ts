import { AppPage } from 'D:/OpenServer/domains/ip_LVS/langapp/langapp-front/e2e/src/app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Welcome to call-rocket!');
  });
});
