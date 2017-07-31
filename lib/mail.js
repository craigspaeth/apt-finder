const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
const helper = require('sendgrid').mail
const accounting = require('accounting')
const { parse: parseURL } = require('url')
const fromEmail = new helper.Email('craigspaeth@gmail.com')
const toEmail = new helper.Email('craigspaeth@gmail.com')
const subject = 'Latest apartment listings'
const noImg =
  'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png'

module.exports = listings => {
  console.log(`Emailing ${listings.length} listings`)
  return new Promise((resolve, reject) => {
    const content = new helper.Content(
      'text/html',
      `<div>
          <h1>Latest Listings</h1>
          ${listings
        .map(listing => `
            <a href="${listing.href}">
              <h3>${accounting.formatMoney(listing.rent)}</h3>
              <small>From ${listing.href && parseURL(listing.href).hostname}</small>
              <br/>
              <img width=200 src="${listing.thumbnail || noImg}" />
            </a>
            <br/>
          `)
        .join('')}
        </div>`
    )
    const mail = new helper.Mail(fromEmail, subject, toEmail, content)
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    })
    sg.API(request, (error, response) => {
      if (error) reject(error)
      else resolve(response)
    })
  })
}
module.exports('foo')
