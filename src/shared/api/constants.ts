// @ts-ignore
const isLocal = 'local'

export const BASE_URL = isLocal
  ? 'http://localhost:3004/api/v1'
  : `https://dev.webway.studio/api/v1`
export const CDN_URL = isLocal
  ? 'http://localhost:9000/local'
  : `https://cdn.webway.studio/${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}`
