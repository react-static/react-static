import {
  React,
  PropTypes,
} from './vendor'

const HTML = ({ Html, Head, Body, children, renderMeta }) => (
  <Html>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1,shrink-to-fit=no" />
      <meta name="theme-color" content="#FFFFFF" />


      {/* <link rel='apple-touch-icon' sizes='57x57' href='/apple-icon-57x57.png' />
        <link rel='apple-touch-icon' sizes='60x60' href='/apple-icon-60x60.png' />
        <link rel='apple-touch-icon' sizes='72x72' href='/apple-icon-72x72.png' />
        <link rel='apple-touch-icon' sizes='76x76' href='/apple-icon-76x76.png' />
        <link rel='apple-touch-icon' sizes='114x114' href='/apple-icon-114x114.png' />
        <link rel='apple-touch-icon' sizes='120x120' href='/apple-icon-120x120.png' />
        <link rel='apple-touch-icon' sizes='144x144' href='/apple-icon-144x144.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='/apple-icon-152x152.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-icon-180x180.png' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#fbb03b' />
        <link rel='manifest' href='/manifest.json' />
        <meta name='msapplication-TileColor' content='#FFFFFF' />
      <meta name='msapplication-TileImage' content='/ms-icon-144x144.png' /> */}

      <style
        type="text/css"
      >
        {
          'html{font-family:\'HelveticaNeue-Light\',\'Helvetica Neue Light\',\'Helvetica Neue\',Helvetica,Arial,\'Lucida Grande\',sans-serif;font-size:62.5%;line-height:1.2;-webkit-font-smoothing:antialiased;font-smoothing:antialiased;box-sizing:border-box;text-rendering:optimizeLegibility;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:rgba(0,0,0,0);user-select:none;}html,body{min-height:100%;}body{position:relative;scroll-behavior:smooth;background-color:#4a4a4a;cursor:default;}*,:after,:before{box-sizing:inherit;}iframe,img,svg{width:100%;}input,select,textarea{font-weight:700;}a,body,button,div,em,footer,form,h1,h2,h3,header,img,input,label,li,nav,option,p,section,select,span,svg,textarea,ul{font-family:inherit;font-size:inherit;font-weight:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline;border:0;border-radius:0;list-style:none;}textarea{overflow:auto;}h1,h2,h3,li,p,span{cursor:inherit;}a,button,label,select{cursor:pointer;}a,button,div,h1,h2,h3,img,input[type=checkbox],li,nav,option,p,select,span,svg{user-select:inherit;}a{background-color:transparent;white-space:nowrap;text-decoration:none;word-wrap:normal;color:inherit;}select,option{text-transform:none;text-indent:.75rem;-webkit-appearance:none;-moz-appearance:none;appearance:none;}:-ms-input-placeholder,::-webkit-input-placeholder,:placeholder-shown{color:#abaaa9;}:-moz-placeholder,::-moz-placeholder{opacity:1;color:#abaaa9;}input[type=number]{-moz-appearance:textfield;-webkit-appearance:none;}input[type="number"]:hover,input[type="number"]:focus{-moz-appearance:number-input;}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}input[type=checkbox],input[type=radio],select::-ms-expand{display:none;}button,label,svg{display:block;}iframe,img{height:auto;object-fit:contain;vertical-align:middle;}button{color:#FFF;text-align:center;background:0 0;border:none;border-radius:0;-webkit-tap-highlight-color:transparent;transition:.3s ease all;}button::-moz-focus-inner,input[type=button]::-moz-focus-inner,input[type=reset]::-moz-focus-inner,input[type=submit]::-moz-focus-inner{border:0;padding:0;}svg{fill:currentColor;height:auto;pointer-events:none;}svg:not(:root){overflow:hidden;}button,input,select{overflow:visible;}[type=search]{-webkit-appearance:textfield;}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration,[type=\'time\']{-webkit-appearance:none;}@media screen and (max-width:319px){body{min-width:32rem;}}@media screen and (min-width:360px){html{font-size:70%;}}@media screen and (min-width:375px){html{font-size:71.875%;}}@media screen and (min-width:414px){html{font-size:81.25%;}}@media screen and (min-width:504px){html{font-size:98.4375%;}}@media screen and (min-width:600px){html{font-size:115.625%;}}@media screen and (min-width:768px){html{font-size:62.5%;}}@media screen and (min-width:800px){html{font-size:65.104166666666667%;}}@media screen and (min-width:1024px){html{font-size:62.5%;}}@media screen and (min-width:1200px){html{font-size:73.2421875%;}}@media screen and (min-width:1280px){html{font-size:62.5%;}}@media screen and (min-width:1400px){html{font-size:68,359375%;}}@media screen and (min-width:1536px){html{font-size:75%;}}@media screen and (min-width:1920px){html{font-size:93.75%;}}@media screen and (min-width:2048px){html{font-size:100%;}}@media screen and (min-width:2560px){html{font-size:125%;}}@media screen and (min-width:2732px){html{font-size:133,3984375%;}}'
        }
      </style>

      {
        renderMeta.styleTags
      }
    </Head>

    <Body>
      {
        children
      }
    </Body>
  </Html>
)

HTML.propTypes = {
  Html: PropTypes.func.isRequired,
  Head: PropTypes.func.isRequired,
  Body: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  renderMeta: PropTypes.shape({
    styleTags: PropTypes.string,
  }).isRequired,
}

export default HTML
