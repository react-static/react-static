# React Static - Ant Design with LESS Example

> Ant Design is a [React UI Component Library](https://github.com/ant-design/ant-design) written in TypeScript & LESS.
This example uses TypeScript (though you can use JavaScript, losing
component typing) and handles LESS files automatically.

To overwrite Ant Design theme variables, use `src/theme-ant-overwrite.less`.
The LESS loader takes those in to modify the original source.

![ant-design-react-static](https://user-images.githubusercontent.com/2397125/32235428-c0654204-be5f-11e7-8318-6db120331811.gif)

This example includes:
- General LESS support including source maps
- Ant Design UI components used in conjunction with Styled Components (for
customization)
- Ant Design Babel plugin that is set to use original `.less` files with each
import from Ant Design components
- TypeScript and loader configuration (full support)
- Source maps for everything (in dev)
- TypeScript paths alias mapping as a standard `webpack.config.js` used
within React Static's build system (see `tsconfig.json` paths and
`src/path-alias-example`)
- TypeScript hot module replacement
- Simultaneous support for **using JavaScript and TypeScript interchangeably**
- Types for all modules (except React Static's custom methods — will be
added later)
- Styled Components
- Image imports
- File imports
- Automatic routing


To get started, run `react-static create` and use the `less-antdesign`
template.
