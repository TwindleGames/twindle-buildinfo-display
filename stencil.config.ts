import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'kimnoo-buildinfo-display',
  minifyJs: true,
  minifyCss: true,
  outputTargets: [
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      empty: true,
      dir: 'dist',
      minify: true,
      generateTypeDeclarations: false,
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
  ],
  testing: {
    browserHeadless: 'shell',
  },
};
