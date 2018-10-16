# React-Static - Ant Design with Less

> Ant Design is a [React UI Component Library](https://github.com/ant-design/ant-design) written in Typescript & Less. 
This 
example is enabled with TypeScript (though you can use JavaScript, losing 
component typing) handling less files automatically.

To overwrite ant design theme variables, use `src/theme-ant-overwrite.less`. 
The less loader takes those in to modify the original source.

![ant-design-react-static](https://user-images.githubusercontent.com/2397125/32235428-c0654204-be5f-11e7-8318-6db120331811.gif)

This example includes:
- general less support incl. source maps
- ant design UI components used in conjunction with styled components (for 
customization)
- ant design babel plugin that is set to use original .less files with each 
import from antd components
- TypeScript & Loader Configuration (full support)
- Source-Maps for everything (in dev)
- TypeScript paths alias mapping as a standard `webpack.config.js` used 
within react-static's build system (see tsconfig.json` paths & 
src/path-alias-example)
- TypeScript hot module replacement
- Simultaneous support of **using JavaScript and TypeScript interchangeably**
- Types for all modules (except react-static's costume methods — will be 
added later)
- Styled-Components
- Image imports
- File imports



To get started, run `react-static create` and use the `less-antdesign` 
template.
