import React from 'react'
import { Root, Link, Routes } from 'react-static'
import styled, { injectGlobal } from 'styled-components'

//

import { Layout, Menu, Icon } from 'antd'

const { Header, Sider, Content, Footer } = Layout

injectGlobal`
  #root {
    min-width: 100%;
    min-height: 100%;
    display: flex;
  }
`

const Logo = styled.div`
  height: 32px;
  background: #333;
  border-radius: 6px;
  margin: 16px;
`

const Trigger = styled(Icon)`
  font-size: 18px;
  line-height: 64px;
  padding: 0 16px;
  cursor: pointer;
  transition: color 0.3s;

  :hover {
    color: #108ee9;
  }
`

class App extends React.Component {
  state = {
    collapsed: false,
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }
  render() {
    return (
      <Root>
        <Layout>
          <Sider
            style={{ backgroundColor: '#404040' }}
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <Logo />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Link
                  to="/"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  <Icon type="home" />
                  <span>Home</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link
                  to="/blog"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  <Icon type="bars" />
                  <span>Blog</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link
                  to="/about"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  <Icon type="pushpin-o" />
                  <span>About</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Trigger
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
            </Header>
            <Content
              style={{
                margin: '32px 32px',
                padding: 24,
                background: '#fff',
                minHeight: 280,
              }}
            >
              <Routes />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              React Static — Example with ant design UI & TypeScript / LESS
              loaders
            </Footer>
          </Layout>
        </Layout>
      </Root>
    )
  }
}

export default App
