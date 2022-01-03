import { Request, Response, NextFunction } from 'express'
import fetch from 'node-fetch'
import FormData from 'form-data'

export type ImgbbResponse = {
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

export type ImgbbRequest = Array<{
  image: string | File
  name?: string
  expiration?: number
}>

export function imgbb(req: Request, res: Response, next: NextFunction) {
  const request = req.body.imgbbRequest as ImgbbRequest
  let count = 0
  const maxCount = request.length
  const response = { results: [], errors: [] } as ImgbbResponse
  const IMGBB_API_KEY = req.app.get('IMGBB_API_KEY')

  if (request && request.length > 0) {
    request.forEach(({ image, name, expiration }) => {
      let url = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`
      const formData = new FormData()

      if (expiration) {
        url += `&expiration=${expiration}`
      }

      if (name) {
        formData.append('name', name)
      }

      formData.append('image', image)

      fetch(url, {
        method: 'POST',
        body: formData,
      })
        .then(async v => {
          const result = await v.json()
          count++
          response.results.push(result as any)
        })
        .catch(e => {
          count++
          response.errors.push(e)
        })
        .finally(() => {
          if (count === maxCount) {
            req['imgbb'] = response
            next()
          }
        })
    })
  } else {
    next()
  }
}
