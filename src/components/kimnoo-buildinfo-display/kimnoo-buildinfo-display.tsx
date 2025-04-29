import { Component, Listen, Prop, State, h } from '@stencil/core';
import { BuildInfo } from '../../types/buildinfo';
import { capitalize } from './capitalize';

@Component({
  tag: 'kimnoo-buildinfo-display',
  styleUrl: 'kimnoo-buildinfo-display.css',
  shadow: true,
})
export class BuildinfoDisplay {
  /**
   * The buildinfo data fetched from the server.
   */
  @State() public buildInfo: BuildInfo;

  /**
   * Function to call to write to clipboard. This does not need to be set and only exists for injecting in a mock for unit testing.
   */
  @Prop() public writeToClipboard: (_: string) => Promise<void> = async (text: string) => await navigator.clipboard.writeText(text);

  public async componentWillLoad() {
    try {
      const response = await fetch('buildinfo.json');
      this.buildInfo = await response.json();
    } catch {
      console.error('Could not fetch `buildinfo.json`');
    }
  }

  @Listen('click')
  public async onClick() {
    const buildInfoString = Object.keys(this.buildInfo)
      .map(key => `${capitalize(key)}: ${this.buildInfo[key]}`)
      .join('\n');
    await this.writeToClipboard(buildInfoString);
  }

  @Listen('auxclick')
  public async onMiddleClick(ev: MouseEvent) {
    if (ev.button === 1) {
      this.buildInfo = undefined;
    }
  }

  public render() {
    if (this.buildInfo) {
      const branch = this.buildInfo.branch !== 'main' ? `[${this.buildInfo.branch}] ` : '';
      return (
        <div>
          {this.buildInfo.project} {this.buildInfo.environment}: {branch}Revision {this.buildInfo.revision} ({this.buildInfo.commit})
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}
