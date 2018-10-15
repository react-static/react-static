import React from 'react'
import styled, { css } from 'styled-components'
import { SiteData, RouteData, Link, Head } from 'react-static'

//

import Markdown from 'components/Markdown'
import Sidebar from 'components/Sidebar'

const Doc = () => (
  <SiteData>
    {({ repoName }) => (
      <RouteData>
        {({ editPath, markdown, title }) => (
          <Sidebar>
            <Head>
              <title>{`${title} | ${repoName}`}</title>
            </Head>
            <Markdown source={markdown} />
            <div>
              <a href={editPath}>Edit this page on Github</a>
            </div>
          </Sidebar>
        )}
      </RouteData>
    )}
  </SiteData>
)

export default Doc
