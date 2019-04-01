![React Static Logo](https://github.com/nozzle/react-static/raw/v7/media/react-static-logo-2x.png)

[![Travis CI Build Status](https://travis-ci.org/nozzle/react-static.svg?branch=master)](https://travis-ci.org/nozzle/react-static) [![David Dependancy Status](https://david-dm.org/nozzle/react-static.svg)](https://david-dm.org/nozzle/react-static) [![npm package v](https://img.shields.io/npm/v/react-static.svg)](https://www.npmjs.org/package/react-static) [![npm package dm](https://img.shields.io/npm/dm/react-static.svg)](https://npmjs.com/package/react-static) [![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/react-static)
[![Github Stars](https://img.shields.io/github/stars/nozzle/react-static.svg?style=social&label=Star)](https://github.com/nozzle/react-static) [![Twitter Follow](https://img.shields.io/twitter/follow/nozzleio.svg?style=social&label=Follow)](https://twitter.com/nozzleio)

<br>
<br>

> You are viewing the docs for v7 of React Static. You can browse all historical versions via Github branches!

# React Static

A **progressive static-site generator** for React.

React-Static is a fast, lightweight, and powerful progressive static site generator based on React and its ecosystem. It resembles the simplicity and developer experience your used to in tools like **Create React App** and has been carefully designed for **performance, flexibility, and user/developer experience**.

## Features

- ⚛️ 100% React (and friends!)
- 🚀 [Blazing](https://twitter.com/acdlite/status/974390255393505280) fast builds and performance.
- 🚚 Data Agnostic. Supply your site with data from anywhere, however you want!
- ✂️ Automatic code and data splitting!
- 💥 Instant navigation and page views
- ☔️ Progressively Enhanced and mobile-ready
- 🎯 SEO Friendly.
- 🥇 React-centric developer experience.
- 😌 Painless project setup & migration.
- 💯 Supports 100% of the React ecosystem. Including CSS-in-JS libraries, custom Query layers like GraphQL, and even Redux.
- 🔥 Hot Reloadable out-of-the-box. Edit React components, styles and even data in real-time.

## Sites Built with React-Static

- [HeadlessCMS.org](https://headlesscms.org) ([source](https://github.com/netlify/headlesscms.org))
- [StaticGen.com](https://staticgen.com) ([source](https://github.com/netlify/staticgen))
- [Starbucks: Careers Hub](https://www.starbucks.com/careers/)([source](https://twitter.com/codehitchhiker/status/1097558315020832774))
- [Starbucks: Rewards](https://www.starbucks.com/rewards/comingsoon)([source](https://twitter.com/davidbrunelle/status/1108041167935922176))
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

- Install the CLI tool:

```bash
$ npm i -g react-static@next
# or
$ yarn global add react-static@next
```

- Start a new project!

```bash
$ react-static create
```

- Need some help?

```bash
$ react-static --help
```

## Documentation

- [Overview](/docs/)
- [Core Concepts](/docs/concepts.md)
- [Guides](/docs/guides/)
- [Configuration](/docs/config.md)
- [API](/docs/api.md)
- [Plugins](/docs/plugins/)

## Migration from a previous version?

# The [CHANGELOG](/CHANGELOG.md) contains information on breaking change for each major version. The latest breaking changes along with their migration tips are [located here](/CHANGELOG.md#700)

```bash
$ react-static --help
```

## Documentation

- [Overview](/docs/)
- [Core Concepts](/docs/concepts.md)
- [Guides](/docs/guides/)
- [Configuration](/docs/config.md)
- [API](/docs/api.md)
- [Plugins](/docs/plugins/)

## What is a progressive static site?

A progressive static site is a website where **every statically exported HTML page is an entry point to a fully-featured automatically-code-split React application**. Just like a normal static site, static progressive websites are capable of loading initial landing pages very quickly, but then extend the user experience by transforming invisibly into a single-page React application.

Once a progressive static site page has loaded its React application it can then do amazing things!

- Prefetch page assets
- Instantly navigate between pages
- Provide interactivity not possible in normal static sites
- Subscribe to and display real-time and dynamic data
- Anything you can imagine within a React application!

# How does it work?

![Flow Chart](https://github.com/nozzle/react-static/raw/v7/media/flow.png)

React Static gathers your **data**, and **templates** together and intelligently splits them into bite-size static files using webpack and javascript. Once these files have been generated, React Static uses them to render and export a list of **routes** that you provide it into HTML files! After your site has been exported, the resulting **data**, **template**, and **html** files can be transfered to a static file server and browsed as an awesomely fast and performant static website!

But remember, a progressive static site is more than that...

Little did you know that when React Static exported your site, it also generated **a tiny, optimized, and code-split version of your original React application for every page of your site**! After these pages have loaded, React **invisibly** mounts this application to the existing HTML on the page and... 🎉🎉🎉 You are now using the single page React application you originally built! **This application is special, though!** While you browse your website, **pages that you might go to next are automatically preloaded, making navigation to them instantaneous!**.

That's just the beginning! With React Static, you can unleash your creativity and build anything you can imagine with speed and productivity. It even has **awesome plugins** that will help you on your journey!

# Coming from Create React App?

React Static is also a great replacement for the ever popular Create React App CLI. It provides a similar developer experience, zero-config environment, and features, but **without boxing you in.** If you ever need to customize your build system in React Static, there is no need to eject! You can use existing plugins or write your own to customize anything you'd like about the build system. Not building a static site? No worries there, React Static works as an SPA too, even if there is only a single `index.html` file.

## Articles, Videos & Tutorials

- Articles
  - [Introduction and Motivations behind React Static](https://medium.com/@tannerlinsley/%EF%B8%8F-introducing-react-static-a-progressive-static-site-framework-for-react-3470d2a51ebc)
  - [React Static v6!](https://medium.com/@tannerlinsley/react-static-v6-8dbe9fd202d4)
- Videos & Tutorials
  - [Quick Start with Styled Components](https://www.youtube.com/watch?v=KvlTVZPlmgs) (20 min)
  - [Introducing React-Static! How it works and why we built it!](https://www.youtube.com/watch?v=OqbJ5swVpDQ) (80 min)
  - [Using React-Static to replace create-react-app](https://youtu.be/1pBzh7IM1s8) (5 min)

## Support, Community & Chat

Need some help? Have a quick question? [Click here to sign up for the React-Tools spectrum community](https://spectrum.chat/react-static)! We are constantly answering questions, discussing features and helping each other out!

## Contributing, Issues & Bugs

We are always looking for people to help us grow `react-static`'s capabilities and examples. If you have [found a bug, or have a feature request](https://github.com/nozzle/react-static/issues/new) let us know!

## License

React Static uses the MIT license. For more information on this license, [click here](/LICENSE).
