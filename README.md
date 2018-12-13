![React Static Logo](https://github.com/nozzle/react-static/raw/master/media/logo.png)

[![Travis CI Build Status](https://travis-ci.org/nozzle/react-static.svg?branch=master)](https://travis-ci.org/nozzle/react-static) [![David Dependancy Status](https://david-dm.org/nozzle/react-static.svg)](https://david-dm.org/nozzle/react-static) [![npm package v](https://img.shields.io/npm/v/react-static.svg)](https://www.npmjs.org/package/react-static) [![npm package dm](https://img.shields.io/npm/dm/react-static.svg)](https://npmjs.com/package/react-static) [![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/react-static)
[![Github Stars](https://img.shields.io/github/stars/nozzle/react-static.svg?style=social&label=Star)](https://github.com/nozzle/react-static) [![Twitter Follow](https://img.shields.io/twitter/follow/nozzleio.svg?style=social&label=Follow)](https://twitter.com/nozzleio)

<br>
<br>

> You are viewing the docs for v6 of React Static. You can browse all historical versions via Github branches!

# React Static

A **progressive static-site generator** for React.

[**Read the introduction article on Medium**](https://medium.com/@tannerlinsley/%EF%B8%8F-introducing-react-static-a-progressive-static-site-framework-for-react-3470d2a51ebc)

React-Static is a fast, lightweight, and powerful framework for building static-progressive React applications and websites. It's been carefully designed to meet the highest standards of static-site **performance, and user/developer experience**.

[![Sponsored By GraphCMS](https://github.com/nozzle/react-static/raw/master/media/graphcms.svg?sanitize=true)](http://graphcms.com/?ref=tlinsley)

## Features

- ⚛️ 100% React (and friends!)
- 🚀 [Blazing](https://twitter.com/acdlite/status/974390255393505280) fast builds and performance.
- 🚚 Data Agnostic. Supply your site with data from anywhere, **however you want**.
- ✂️ Automatic code and data splitting!
- 💥 Instant page views via [PRPL](https://developers.google.com/web/fundamentals/performance/prpl-pattern/) pattern.
- ☔️ Progressive Enchancement + Graceful Fallbacks
- 🎯 **SEO** Friendly.
- 🥇 React-first developer experience.
- 😌 Painless project setup & migration.
- 💯 Supports 100% of the React ecosystem. Including CSS-in-JS libraries, custom Query layers like GraphQL, and even Redux.
- 🔥 Hot Reloadable out-of-the-box. Edit React components & styles in real-time.
- 📲 LAN accessible dev environment for testing on other devices like phones and tablets.

## Videos & Tutorials

- [Quick Start with Styled Components](https://www.youtube.com/watch?v=KvlTVZPlmgs) (20 min)
- [Introducing React-Static! How it works and why we built it!](https://www.youtube.com/watch?v=OqbJ5swVpDQ) (80 min)
- [Using React-Static to replace create-react-app](https://youtu.be/1pBzh7IM1s8) (5 min)

## Sites Built with React-Static

- [React-Static.js.org](https://react-static.js.org) ([source](https://github.com/nozzle/react-static/tree/master/www))
- [React-Charts.js.org](https://react-charts.js.org) ([source](https://github.com/nozzle/react-charts/tree/master/www))
- [Nozzle.io](https://nozzle.io) ([source](https://github.com/nozzle/nozzle.io))
- [Timber.io](https://timber.io)
- [HeadlessCMS.org](https://headlesscms.org) ([source](https://github.com/netlify/headlesscms.org))
- [Manta.life](https://manta.life) ([source](https://github.com/MantaApp/Website))
- [Manticore Games](http://manticoregames.com)
- [BlackSandSolutions.co](https://www.blacksandsolutions.co)
- [David York - Personal Blog](http://davideyork.com)
- [Cryptagon - Crypto Portfolio Tracker](https://cryptagon.io 'Crypto Portfolio Tracker')
- [Typetalk - Chat App for Businesses and Teams](https://www.typetalk.com 'Chat App for Businesses and Teams')
- [Lam Hieu - Personal Website](https://lamhieu.info)
- [Elsa Salonen - Artist Portfolio](https://elsasalonen.com/)
- [PSD Wizard: On-demand Front-End Coding Service](https://psdwizard.com)
- [NYC Vintage Map](https://nycvintagemap.com)
- [Eldar Labs - Utilities and Productivity Tools](https://eldarlabs.com)
- [Dan Webb - Personal Website](https://danwebb.co) ([source](https://github.com/DanWebb/danwebb.co))
- [Intuit Turbo](http://turbo.com)
- [Messenger Corp. client asset ordering](http://chartwells.messengercorp.com/)
- [Digital Neighborhood watch service](https://neighborhoodwatch.io/)
- [Carmen Marcos Art - Artist Portfolio](http://carmen-marcos.art/) ([source](https://github.com/rafacm/carmen-marcos-art-portfolio))
- [BlockAce - Blockchain Jobs Board](https://blockace.io 'The Best Blockchain Jobs Board')
- [Luke Haas - Personal Website](https://lukehaas.me)
- [KleineKoning.nl - Webshop](https://kleinekoning.nl)
- [blue-frontend.com - Company Website](https://blue-frontend.com)

## Quick Start

1.  Install the CLI:

```bash
$ yarn global add react-static
# or
$ npm install -g react-static
```

2.  Create a new project:

```bash
$ react-static create
```

3.  Pick a template! [See the full list of templates](#examples-and-templates)
4.  Navigate to your new project:

```bash
$ cd my-static-site
```

5.  Start the dev server and edit some code!

```bash
$ yarn start # or react-static start
```

6.  Test a production build

```bash
$ yarn stage # or react-static build --staging
$ yarn serve
```

6.  Build for production!

```bash
$ yarn build # or react-static build
```

Once you've installed and test driven, you may want to:

- [Read about the core concepts of React Static](/docs/concepts.md)
- [Join the React Static Spectrum community!](https://spectrum.chat/react-static)
- [Familiarize yourself with the API!](/docs/config.md)

### Plugins

- CSS & Style Tooling
  - [react-static-plugin-emotion](https://github.com/nozzle/react-static-plugin-emotion) - Adds SSR support for Emotion components.
  - [react-static-plugin-styled-components](https://github.com/nozzle/react-static-plugin-styled-components) - Adds SSR support for Styled-Components
  - [react-static-plugin-sass](https://github.com/nozzle/react-static-plugin-sass) - Adds SSR and general support for SASS
- React Alternatives
  - [react-static-plugin-preact](https://github.com/nozzle/react-static-plugin-preact) - Adds preact support
- Don't see a plugin? [Help us build it!](/docs/plugins.md)

## Examples and Templates

React Static ships with a ton of examples to reference and each of them can even be used as a starting template when using `react-static create`!

[**See all Templates and Examples**](https://github.com/nozzle/react-static/tree/master/examples/)

Can't find an example? We invite you to write one! Simply copy the `basic` or `blank` templates and make the necessary changes. Then submit a PR including your new example directory and a new item in the list above. When merged, your example will automatically become a template in the CLI. How magical!

## Documentation

- [Core Concepts](/docs/concepts.md)
- [API Reference](/docs/config.md)
- [Changelog](https://github.com/nozzle/react-static/blob/master/CHANGELOG.md)
- [Contributing Guide](https://github.com/nozzle/react-static/blob/master/CONTRIBUTING.md)

## Chat with us on the React Static Spectrum community!

Need some help? Have a quick question? [Click here to sign up for the React-Tools spectrum community](https://spectrum.chat/react-static)! We are constantly answering questions, discussing features and helping each other out!

## Contributing

We are always looking for people to help us grow `react-static`'s capabilities and examples. If you have an issue, feature request, or pull request, let us know!

## License

React Static uses the MIT license. For more information on this license, [click here](https://github.com/nozzle/react-static/blob/master/LICENSE).
