const morgan = require('morgan')

const morganLogger = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens['response-time'](req, res), 'ms',
    'Body:', JSON.stringify(req.body)
  ].join(' ')
})

module.exports = morganLogger
