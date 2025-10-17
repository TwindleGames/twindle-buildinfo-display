import { newSpecPage } from '@stencil/core/testing';
import { BuildinfoDisplay } from './twindle-buildinfo-display';
import { BuildInfo } from '../../types/buildinfo';
import { h } from '@stencil/core';

describe('twindle-buildinfo-display', () => {
  let jsonResponse: BuildInfo;
  let fetchedBuildinfo: boolean;
  let failResponse: boolean;
  beforeEach(() => {
    fetchedBuildinfo = false;
    failResponse = false;
    jsonResponse = { project: 'Kimchi-Noodles', environment: 'dev', revision: '21', commit: '35cbc60', branch: 'main', date: '2025-04-29T00:45:58+0000' };
    jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn(() => {
        if (failResponse) {
          return Promise.reject('Test rejection');
        }
        fetchedBuildinfo = true;
        return Promise.resolve({ json: () => Promise.resolve(jsonResponse) });
      }) as jest.Mock,
    );
  });
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [BuildinfoDisplay],
      html: '<twindle-buildinfo-display></twindle-buildinfo-display>',
    });
    expect(root).toBeTruthy();
  });
  it('fetches build info', async () => {
    const { root } = await newSpecPage({
      components: [BuildinfoDisplay],
      html: '<twindle-buildinfo-display></twindle-buildinfo-display>',
    });
    expect(fetchedBuildinfo).toBeTruthy();
    expect(root.shadowRoot.textContent).toContain(jsonResponse.project);
    expect(root.shadowRoot.textContent).toContain(jsonResponse.environment);
    expect(root.shadowRoot.textContent).toContain(jsonResponse.revision);
    expect(root.shadowRoot.textContent).toContain(jsonResponse.commit);
    expect(root.shadowRoot.textContent).not.toContain(jsonResponse.branch);
  });
  it('hides itself if the buildinfo cannot be fetched', async () => {
    let errorMessageShown = false;
    failResponse = true;
    jest.spyOn(console, 'error').mockImplementationOnce(() => {
      errorMessageShown = true;
    });
    const { root } = await newSpecPage({
      components: [BuildinfoDisplay],
      html: '<twindle-buildinfo-display></twindle-buildinfo-display>',
    });
    expect(root.shadowRoot.textContent.length).toBe(0);
    expect(errorMessageShown).toBeTruthy();
  });
  it('shows branch information only if the branch is not `main`', async () => {
    jsonResponse.branch = 'potato';
    const { root } = await newSpecPage({
      components: [BuildinfoDisplay],
      html: '<twindle-buildinfo-display></twindle-buildinfo-display>',
    });
    expect(root.shadowRoot.textContent).toContain(jsonResponse.branch);
  });
  it('copies build info to clipboard when clicked', done => {
    const windowMock = {
      location: { href: 'https://www.example.com/' },
    };
    newSpecPage({
      components: [BuildinfoDisplay],
      template: () => (
        <twindle-buildinfo-display
          windowProvider={windowMock as Window}
          writeToClipboard={async text => {
            expect(text).toBe(
              `Project: Kimchi-Noodles
Environment: dev
Revision: 21
Commit: 35cbc60
Branch: main
Date: 2025-04-29T00:45:58+0000
URL: https://www.example.com/`,
            );
            done();
          }}
        ></twindle-buildinfo-display>
      ),
    }).then(({ root }) => {
      root.dispatchEvent(new MouseEvent('click', { button: 0, which: 1 }));
    });
  }, 5000);
  it('hides itself on middle click', async () => {
    const page = await newSpecPage({
      components: [BuildinfoDisplay],
      html: '<twindle-buildinfo-display></twindle-buildinfo-display>',
    });
    page.root.dispatchEvent(new MouseEvent('auxclick', { button: 1, which: 2 }));
    await page.waitForChanges();
    expect(page.root.shadowRoot.textContent.length).toBe(0);
  });
});
