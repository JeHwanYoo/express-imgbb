# EXPRESS-IMGBB

Express Middleware for imgbb

Supports multiple file uploads.

It uses the official imgbb API [https://api.imgbb.com/](https://api.imgbb.com/)

## Usage

Check the official [API document](https://api.imgbb.com/) for detailed usage.

You can use a blob file, base64 encoding, or web address.

```bash
npm install express-imgbb
```

```javascript
const { imgbb } = require('express-imgbb')
const express = require('express')
const path = require('path')
const app = express()

// dotenv is recommended to store the API Key.
const { config } = require('dotenv')
config()

// Because the image size is large, you need to increase the limit.
app.use(express.urlencoded({ extended: true, limit: '32mb' }))
app.use(express.json({ limit: '32mb' }))

// Get an API key from the official website. (https://api.imgbb.com/)
app.set('IMGBB_API_KEY', process.env.API_KEY)

/**
 * For body parameters, refer to the requested schema below.
 */
app.post('/upload', imgbb, (req, res) => {
  const imgbb = req['imgbb']
  const results = imgbb.results
  // ... doing Something
})
```

## Request & Response Schema

```typescript
export type ImgbbRequest = Array<{
  image: string | File
  name?: string
  expiration?: number
}>

type ImgbbResponse = {
  results: Array<{
    data?: {
      id: string
      title: string
      url_viewer: string
      url: string
      display_url: string
      size: string
      time: string
      expiration: string
      image: {
        filename: string
        name: string
        mime: string
        extension: string
        url: string
      }
      thumb: {
        filename: string
        name: string
        mime: string
        extension: string
        url: string
      }
      medium: {
        filename: string
        name: string
        mime: string
        extension: string
        url: string
      }
      delete_url: string
    }
    error?: {
      message: string
      code: number
      context: string
    }
    success: boolean
    status: number
  }>
  errors: string[] // Caution, it's not imgbb errors, it's network errors.
}
```

## Example

If you check 'test' directory, there is an example of uploading using the base64 method.
