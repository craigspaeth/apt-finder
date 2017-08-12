const yo = require('yo-yo')
const css = require('sheetify')
const navItem = require('./nav-item')
const state = require('./state')

const reset = css('reset-css/reset.css')
const styles = css`
  :host {
    font-family: Helvetica, sans-serif;
    line-height: 1.4em;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  :host * {
    box-sizing: border-box;
  }
  :host a {
    text-decoration: none;
    color: black;
  }
  :host nav {
    width: 300px;
    height: 100vh;
    overflow: scroll;
    overflow-x: hidden;
    border-right: 5px solid #eee;
    position: relative;
    z-index: 2;
  }
  :host iframe {
    position: absolute;
    top: 0;
    left: 300px;
    width: calc(100vw - 300px);
    height: 100vh;
    background: #ddd;
  }
  :host .jump {
    height: 50px;
    box-shadow: 0px 5px 5px rgba(0,0,0,0.1);
    background: white;
    position: absolute;
    top: 15px;
    right: 15px;
    text-align: left;
    padding: 15px 40px 15px 30px;
    font-weight: bold;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #333;
  }
  :host .jump:after {
    content: '▶';
    position: relative;
    left: 10px;
    font-size: 11px;
    top: 0px;
  }
`

module.exports = () => {
  const listing = state.get('listings')[state.get('index')]
  return yo`
    <div class="${reset} ${styles}">
      <nav>${state.get('listings').map(navItem)}</nav>
      <div class="iframe">
        <iframe
          src="${listing.href}"
          ${listing.href.match('trulia') ? 'sandbox' : ''}
        ></iframe>
        <a
          href="${listing.href}"
          target="_blank"
          class="jump"
        >Full page</a>
      </div>
    </div>
  `
}
