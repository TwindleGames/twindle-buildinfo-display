# kimnoo-buildinfo-display



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description                                                                                                                    | Type                           | Default                                                             |
| ------------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ | ------------------------------------------------------------------- |
| `writeToClipboard` | `write-to-clipboard` | Function to call to write to clipboard. This does not need to be set and only exists for injecting in a mock for unit testing. | `(_: string) => Promise<void>` | `async (text: string) => await navigator.clipboard.writeText(text)` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
