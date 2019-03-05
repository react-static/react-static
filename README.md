![React Static Logo](https://github.com/nozzle/react-static/raw/master/media/logo.png)

[![Travis CI Build Status](https://travis-ci.org/nozzle/react-static.svg?branch=master)](https://travis-ci.org/nozzle/react-static) [![David Dependancy Status](https://david-dm.org/nozzle/react-static.svg)](https://david-dm.org/nozzle/react-static) [![npm package v](https://img.shields.io/npm/v/react-static.svg)](https://www.npmjs.org/package/react-static) [![npm package dm](https://img.shields.io/npm/dm/react-static.svg)](https://npmjs.com/package/react-static) [![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/react-static)
[![Github Stars](https://img.shields.io/github/stars/nozzle/react-static.svg?style=social&label=Star)](https://github.com/nozzle/react-static) [![Twitter Follow](https://img.shields.io/twitter/follow/nozzleio.svg?style=social&label=Follow)](https://twitter.com/nozzleio)

<br>
<br>

> You are viewing the docs for v6 of React Static. You can browse all historical versions via Github branches!

# React Static

A **progressive static-site generator** for React.

React-Static is a fast, lightweight, and powerful framework for building static-progressive React applications and websites. It's been carefully designed to meet the highest standards of static-site **performance, and user/developer experience**.

## Features

- ⚛️ 100% React (and friends!)
- 🚀 [Blazing](https://twitter.com/acdlite/status/974390255393505280) fast builds and performance.
- 🚚 Data Agnostic. Supply your site with data from anywhere, **however you want**.
- ✂️ Automatic code and data splitting!
- 💥 Instant page views via [PRPL](https://developers.google.com/web/fundamentals/performance/prpl-pattern/) pattern.
- ☔️ Progressive Enhancement + Graceful Fallbacks
- 🎯 **SEO** Friendly.
- 🥇 React-first developer experience.
- 😌 Painless project setup & migration.
- 💯 Supports 100% of the React ecosystem. Including CSS-in-JS libraries, custom Query layers like GraphQL, and even Redux.
- 🔥 Hot Reloadable out-of-the-box. Edit React components & styles in real-time.
- 📲 LAN accessible dev environment for testing on other devices like phones and tablets.

## Articles, Videos & Tutorials

- Articles
  - [Introduction and Motivations behind React Static](https://medium.com/@tannerlinsley/%EF%B8%8F-introducing-react-static-a-progressive-static-site-framework-for-react-3470d2a51ebc)
  - [React Static v6!](https://medium.com/@tannerlinsley/react-static-v6-8dbe9fd202d4)
- Videos & Tutorials
  - [Quick Start with Styled Components](https://www.youtube.com/watch?v=KvlTVZPlmgs) (20 min)
  - [Introducing React-Static! How it works and why we built it!](https://www.youtube.com/watch?v=OqbJ5swVpDQ) (80 min)
  - [Using React-Static to replace create-react-app](https://youtu.be/1pBzh7IM1s8) (5 min)

## Sites Built with React-Static

<!-- - [React-Static.js.org](https://react-static.js.org) ([source](www)) -->
<!-- - [React-Charts.js.org](https://react-charts.js.org) ([source](https://github.com/nozzle/react-charts/tree/master/www)) -->

- [HeadlessCMS.org](https://headlesscms.org) ([source](https://github.com/netlify/headlesscms.org))
- [StaticGen.com](https://staticgen.com) ([source](https://github.com/netlify/staticgen))
- [Starbucks: Careers Hub](https://www.starbucks.com/careers/)([source](https://twitter.com/codehitchhiker/status/1097558315020832774))
- [Intuit Turbo](http://turbo.com)
- [Nozzle.io](https://nozzle.io) ([source](https://github.com/nozzle/nozzle.io))
- [Timber.io](https://timber.io)
- [TannerLinsley.com](https://tannerlinsley.com) ([source](https://github.com/tannerlinsley/tannerlinsley.com))
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
- [Messenger Corp. client asset ordering](http://chartwells.messengercorp.com/)
- [Digital Neighborhood watch service](https://neighborhoodwatch.io/)
- [Carmen Marcos Art - Artist Portfolio](http://carmen-marcos.art/) ([source](https://github.com/rafacm/carmen-marcos-art-portfolio))
- [BlockAce - Blockchain Jobs Board](https://blockace.io 'The Best Blockchain Jobs Board')
- [Luke Haas - Personal Website](https://lukehaas.me)
- [KleineKoning.nl - Webshop](https://kleinekoning.nl)
- [blue-frontend.com - Company Website](https://blue-frontend.com)
- [mmxp.com.br - MadeiraMadeira Experience](https://www.mmxp.com.br/)
- [Fullstack HQ: Web Design & Development Team in the Philippines](https://fullstackhq.com/)
- [Be Clever: Games for kids and parents](https://beclever.cc)
- [Stoplight: Best in class API Design, Docs, Mocking, and Testing](https://stoplight.io) ([source](https://github.com/stoplightio/stoplight.io))
- [WordFlow: Copywriting service](https://www.wordflow.ie/) ([source](https://github.com/nathanpower/wordflow-site))
- [Amplify Credit Union](https://www.goamplify.com)

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

Or use `npx` to create an app without global installing the CLI

```bash
npx react-static create --name=my-app
```

3.  Pick a template! [See the full list of templates](#templates-and-guides)
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

## [Documentation](/docs/)

- [Overview](/docs/)
- [Core Concepts](/docs/concepts.md)
- [Guides](/docs/guides/)
- [Configuration](/docs/config.md)
- [CLI](/docs/cli.md)
- [Components](/docs/components.md)
- [Browser](/docs/browser.md)
- [Node API](/docs/node-api.md)
- [Plugins](/docs/plugins/)
- [Changelog](/CHANGELOG.md)
- [Contributing Guide](/CONTRIBUTING.md)

## Plugins

For a list of supported plugins, [view the Plugin documentation](/docs/plugins/).

## Templates and Guides

React Static ships with a few basic templates to you get you started quickly with `react-static create`, then provides in-depth guides for further enhancement. You can check them out here!

- [**Templates**](/packages/react-static/templates/)
- [**Guides**](/docs/guides/)

Can't find an guide? You should write one! [Here's how to get started.](/docs/guides/)

## Support, Community & Chat

Need some help? Have a quick question? [Click here to sign up for the React-Tools spectrum community](https://spectrum.chat/react-static)! We are constantly answering questions, discussing features and helping each other out!

## Contributing, Issues & Bugs

We are always looking for people to help us grow `react-static`'s capabilities and examples. If you have [found a bug, or have a feature request](https://github.com/nozzle/react-static/issues/new) let us know!

## License

React Static uses the MIT license. For more information on this license, [click here](/LICENSE).
