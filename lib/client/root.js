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
  }
  :host a {
    text-decoration: none;
    color: black;
  }
  :host nav {
    width: 300px;
    height: 100vh;
    overflow: scroll;
    border-right: 2px solid #eee;
  }
  :host iframe {
    position: absolute;
    top: 0;
    left: 300px;
    width: calc(100vw - 300px);
    height: 100vh;
    background: #ddd;
  }
`

module.exports = () => yo`
  <div class="${reset} ${styles}">
    <nav>${state.get('listings').map(navItem)}</nav>
    <iframe src="${state.get('listings')[state.get('index')].href}"></iframe>      
  </div>
`
