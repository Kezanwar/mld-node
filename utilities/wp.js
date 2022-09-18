require('dotenv').config()

const _wp = {
  URL: process.env.WC_URL,
  USERNAME: process.env.WP_USERNAME,
  PASSWORD: process.env.WP_PASSWORD,
  JWT: `Bearer ${process.env.WP_JWT}`,
  HEADERS: { Authorization: `Bearer ${process.env.WP_JWT}` },
  POST_HEADERS: {
    Authorization: `Bearer ${process.env.WP_JWT}`,
    'Content-Type': 'application/json',
  },
}

module.exports = _wp
