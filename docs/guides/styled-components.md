# Styled components

Ah yes, begone are the old days of css files, getting a scss or sass compiler working,... Welcome styled components!
The benefits are:

- Dynamic css, pass js variables to your css.
- Unique classnames, no magic dangling css class that mess up everything.

## There's a plugin for that

Get the plugin and install it according to it's [documentation](https://github.com/react-static/react-static/tree/master/packages/react-static-plugin-styled-components).

## Let's convert the basic example to use styled components

The basic example can be found [here](https://github.com/react-static/react-static/tree/280d7c0629c702e843039e9feaa68efa4058303e/packages/react-static/templates/basic).

More detailed information on how to use styled components can be found [here](https://www.styled-components.com/docs/api).

Add the styled components core library first:

```
  yarn add styled-components
```

Remove the `app.css` file.

Open `app.js` and remove the `import './app.css'` so we're not using that css anymore.

### Global styling

Import the global style function at the top.

```javascript
import { createGlobalStyle } from 'styled-components'
```

Insert the css in the global style, this can be done inline or in a separate file.

```javascript
const GlobalStyle = createGlobalStyle`
  * {
    scroll-behavior: smooth;
  }
  body {
    font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue',
    Helvetica, Arial, 'Lucida Grande', sans-serif;
    font-weight: 300;
    font-size: 16px;
    margin: 0;
    padding: 0;
  }
  a {
    text-decoration: none;
    color: #108db8;
    font-weight: bold;
  }

  img {
    max-width: 100%;
  }
`
```

Now add the `GlobalStyle` tag inside our app.

```javascript
function App() {
  return (
    <Root>
      <GlobalStyle />
      <nav>...</nav>
      <div className="content">...</div>
    </Root>
  )
}
```

That takes care of the global styling, now we need to add the styling for the Nav and Content divs.

First Add styled import back at the top

```javascript
import styled,  { createGlobalStyle } from 'styled-components'
```

```javascript
const Nav = styled.nav`
  width: 100%;
  background: #108db8;
  & a {
    color: white;
    padding: 1rem;
    display: inline-block;
  }
`

const Content = styled.div`
  padding: 1rem;
`
```

And replace the divs in the render function with their new styled replacements.

```javascript
function App() {
  return (
    <Root>
      <GlobalStyle />
      <Nav>...</Nav>
      <Content>...</Content>
    </Root>
  )
}
```

And that's it! Enjoy!
