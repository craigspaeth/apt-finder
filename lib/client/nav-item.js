const yo = require('yo-yo')
const css = require('sheetify')
const moment = require('moment')
const accounting = require('accounting')
const url = require('url')
const _ = require('lodash')
const state = require('./state')

const styles = css`  
  :host {
    height: 100px;
    display: block;
    cursor: pointer;
    position: relative;
  }
  :host.active {
    box-shadow: 0px 5px 5px rgba(0,0,0,0.1);
    z-index: 2;
  }
  :host:nth-child(2n + 2) {
    background-color: #fdfdfd;
  }
  :host .thumb {
    display: block;
    background: center center no-repeat #ddd;
    background-size: cover;
    height: 100px;
    width: 100px;
    margin-right: 10px;
  }
  :host .details, :host .thumb {
    display: inline-block;
    vertical-align: middle;
  }
  :host small {
    color: #aaa;
    font-size: 12px;
  }
`

module.exports = (listing, i) => yo`
  <a
    class="${styles} ${state.get('index') === i ? 'active' : ''}"
    onclick=${() => state.set({ index: i })}
  >
    <div class="thumb" style="background-image: url(${listing.thumbnail})"></div>
    <div class="details">
      <p>${accounting.formatMoney(listing.rent)}</p>
      <small>${moment(listing.scrapedOn).fromNow()}</small>
      <br />
      <small>${_.slice(url
    .parse(listing.href)
    .hostname.split('.'), -2).join('.')}</small>
    </div>
  </a>
`
