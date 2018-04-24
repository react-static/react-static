import React from 'react'
import styled from 'styled-components'
import { SiteData, RouteData, Link, Head } from 'react-static'

//

import Markdown from 'components/Markdown'

const Styles = styled.div`
  position: relative;
  width: 1200px;
  max-width: 100%;
  padding-left: 300px;
  margin: 0 auto;

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 300px;
    padding-bottom: 5rem;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background: rgba(0, 0, 0, 0.03);

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.7rem;
      border-bottom: 3px solid rgba(0, 0, 0, 0.1);

      .back {
        font-weight: bold;
      }

      .version {
        font-size: 0.9rem;
        font-weight: bold;
        opacity: 0.3;
      }
    }

    .list {
      margin: 0;
      padding: 0;
      list-style-type: none;
      .list {
        padding-left: 1rem;
      }
    }

    .item {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);

      .name,
      a {
        display: block;
        padding: 0.5rem 0.7rem;
      }

      a {
        color: rgba(0, 0, 0, 0.8);

        &.active {
          font-weight: bold;
        }
      }

      .name {
        font-size: 0.8rem;
        text-transform: uppercase;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }

  .content {
    padding: 1rem 2rem;
  }
`

const Item = ({ name, link, children }) => (
  <div className="item">
    {link ? (
      <Link to={link} exact activeClassName="active">
        {name}
      </Link>
    ) : (
      <div className="name">{name}</div>
    )}
    {children ? (
      <div className="list">{children.map((child, i) => <Item key={i} {...child} />)}</div>
    ) : null}
  </div>
)

const DocPage = () => (
  <SiteData
    render={({ menu }) => (
      <RouteData
        render={({ editPath, markdown, title }) => (
          <Styles>
            <Head>
              <title>{title} | React Static</title>
            </Head>
            <div className="sidebar">
              <div className="header">
                <Link to="/" className="back">
                  ← Back to Site
                </Link>
                <div className="version">v{process.env.REPO_VERSION}</div>
              </div>
              <div className="list">{menu.map((child, i) => <Item key={i} {...child} />)}</div>
            </div>
            <div className="content">
              <Markdown source={markdown} />
              <div>
                <a href={editPath}>Edit this page on Github</a>
              </div>
            </div>
          </Styles>
        )}
      />
    )}
  />
)

export default DocPage
