import React from 'react'
import { SiteData, Link, Head } from 'react-static'
import styled from 'styled-components'
//

import logoImg from '../logo.png'

const Styles = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 5vw;
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
      background: linear-gradient(
        to bottom,
        rgba(0, 120, 150, 0.05),
        transparent 15px
      );
    }

    .background2 {
      transform: scale(3) rotate(-25deg);
      transform-origin: top right;
      background: linear-gradient(
        to bottom,
        rgba(0, 120, 150, 0.05),
        transparent 15px
      );
    }
  }

  img {
    width: 600px;
  }

  h1 {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  h2 {
    width: 400px;
    max-width: 100%;
    color: rgba(0, 0, 0, 0.8);
  }

  p {
    max-width: 750px;
  }

  .github {
    margin-top: 2rem;
    width: 150px;
  }
`

const Cards = styled.div`
  display: flex;
  flex-align: stretch;
  justify-content: stretch;
  flex-wrap: wrap;
  width: 1000px;
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
  <SiteData
    render={({ repo, repoURL, repoName }) => (
      <Styles>
        <Head>
          <title>Home | {repoName}</title>
        </Head>
        <div className="backgrounds">
          <div className="background1" />
          <div className="background2" />
        </div>
        <img
          src={logoImg}
          alt=""
          style={{ display: 'block', margin: '0 auto' }}
        />
        <h1>My Awesome Library</h1>
        <h2>
          The most bestest blazingliest fastest freaking way to do something
          awesome.
        </h2>
        <p>
          My Awesome Libary was built to help you get stuff done fast. It will
          change your live by being faster, lighter, and easier to use than the
          next thing.
        </p>
        <Cards>
          <Card to="/docs" background="#ff6073">
            Introduction
          </Card>
          <Card to="/docs/overview" background="#efbb3c">
            Documentation
          </Card>
        </Cards>
        <div className="github">
          <Link to={repoURL}>
            <img
              src={`https://img.shields.io/github/stars/${repo}.svg?style=social&label=Star`}
              alt="Github Stars"
            />
          </Link>
        </div>
      </Styles>
    )}
  />
)
