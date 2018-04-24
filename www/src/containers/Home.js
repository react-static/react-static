import React from 'react'
import { Link, Head } from 'react-static'
import styled from 'styled-components'
//

import logoImg from '../../../media/logo.png'
import sponsorSrc from '../../../media/graphcms-large.svg'

const introURL =
  'https://medium.com/@tannerlinsley/️-introducing-react-static-a-progressive-static-site-framework-for-react-3470d2a51ebc'

const Styles = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;

  .backgrounds {
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    z-index: -1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    .background1,
    .background2 {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .background1 {
      transform: scale(3) rotate(50deg);
      transform-origin: top left;
      background: linear-gradient(to bottom, rgba(0, 120, 150, 0.05), transparent 15px);
    }

    .background2 {
      transform: scale(3) rotate(-25deg);
      transform-origin: top right;
      background: linear-gradient(to bottom, rgba(0, 120, 150, 0.05), transparent 15px);
    }
  }

  img {
    width: 500px;
  }

  h1 {
    position: absolute;
    opacity: 0;
  }

  h2 {
    width: 400px;
    color: rgba(0, 0, 0, 0.8);
  }

  p {
    max-width: 750px;
  }

  .github {
    margin-top: 2rem;
    width: 150px;
  }

  .sponsor {
    margin-top: 3rem;
    width: 300px;
  }
`

const Cards = styled.div`
  display: flex;
  flex-align: stretch;
  justify-content: stretch;
  flex-wrap: wrap;
  width: 1000px
  max-width: 95%;
`

const Card = styled(Link)`
  flex: 1 1 150px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: ${props => props.background};
  color: white;
  border-radius: 5px;
  padding: 2vh 2vw;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 1rem;
  font-weight: bold;
  font-size: 1.5rem;
  cursor: pointer;
  transition: 0.1s ease-out;
  white-space: nowrap;

  :hover {
    transform: translate(3px, -5px);
    box-shadow: -6px 10px 40px rgba(0, 0, 0, 0.2);
  }
`

export default () => (
  <Styles>
    <Head>
      <title>Home | React Static</title>
    </Head>
    <div className="backgrounds">
      <div className="background1" />
      <div className="background2" />
    </div>
    <img src={logoImg} alt="" />
    <h1>React Static</h1>
    <h2>
      A progressive static-site generator for React by <Link to="https://nozzle.io">Nozzle.io</Link>
    </h2>
    <p>
      React-Static is a fast, lightweight, and powerful framework for building static-progressive
      React applications and websites. It's been carefully designed to meet the highest standards of
      SEO, site performance, and user/developer experience.
    </p>
    <Cards>
      <Card to={introURL} background="#ff6073">
        Introduction
      </Card>
      <Card to="/docs/#quick-start" background="#5ca9c3">
        Get Started!
      </Card>
      <Card to="https://react-chat-signup.herokuapp.com" background="#efbb3c">
        Slack
      </Card>
      <Card to="/docs/concepts" background="#9ec754">
        Documentation
      </Card>
    </Cards>
    <div className="github">
      <Link to="https://github.com/nozzle/react-static">
        <img
          src="https://img.shields.io/github/stars/nozzle/react-static.svg?style=social&label=Star"
          alt="Github Stars"
        />
      </Link>
    </div>
    <Link to="http://graphcms.com/?ref=tlinsley">
      <img src={sponsorSrc} className="sponsor" alt="GraphCMS" />
    </Link>
  </Styles>
)
