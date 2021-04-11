## EXPRESS-IMGBB

Express Middleware for imgbb

Supports multiple file uploads.

It uses the official imgbb API (https://api.imgbb.com/)

## HOW TO USE

### Server Implementation

```bash
npm install express-imgbb
```

```javascript
const { imgbb } = require('express-imgbb');
const express = require('express');
const path = require('path');
const app = express();

// dotenv is recommended to store the API Key.
const { config } = require('dotenv');
config(); 

// Because the image size is large, you need to increase the limit.
app.use(express.json({ limit: '32mb' })); 

// Get an API key from the official website. (https://api.imgbb.com/)
app.set('IMGBB_API_KEY', process.env.API_KEY); 

// See req['iResponses'] when going through the middleware.
// The type is 'ImgbbResponseArray'. Please refer to the document below.
app.post('/upload', imgbb, (req, res) => {
    const iResponses = req['iResponses'];
    // ... doing Something
});

```

### Client implementation (Web Browser - Vanilla JS)

#### imgbb Request Schema
---
```typescript
type ImgbbRequestArray = Array<{
    image: string, // [Required] URL OR Base64 Encoding
    name?: string, // [Optional] Custom Filname
    expiration?: string, // [Optional] uploads to be auto deleted after certain time (in seconds 60-15552000)
}>
```

#### imgbb Response Schema
---
```typescript

type ImgbbResponseArray = Array<{
    data: {
        id: string,
        title: string,
        url_viewer: string,
        url: string,
        display_url: string,
        size: string,
        time: string,
        expiration: string,
        image: {
            filename: string,
            name: string,
            mime: string,
            extension: string,
            url: string,
        },
        thumb: {
            filename: string,
            name: string,
            mime: string,
            extension: string,
            url: string,
        },
        medium: {
            filename: string,
            name: string,
            mime: string,
            extension: string,
            url: string,
        },
        delete_url: string
    } | null,
    success: boolean,
    status: number
    error: {
        message: string,
        code: number,
        context: string,
    } | null
}>;
```

When the request is complete, an array of results for each image will be returned. Note that it also includes results for failures. On failure, data is null and an error object is assigned.

#### Sending Image URL (Vanilla JS)
---

``` javascript
fetch('/upload', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
        iRequests: [{
            image: 'https://via.placeholder.com/300/09f/fff.png',
            name: 'exmaple',
            expiration: 3600,
        }]
    }),
});
```

#### Sending Base64 Image (Vanilla JS)
---
```html
<input type="file" id="formFileMultiple" accept="image/*" multiple>
```
```javascript
// convert base64String
const formFileMultiple = document.querySelector('#formFileMultiple');
const iRequests = [];
// when file selected by the user
formFileMultiple.onchange = evt => {
    // get selected files from input element
    const files = evt.target.files;
    // for each file
    for (const file of files) {
        const fileReader = new FileReader();
        // convert base64 string
        fileReader.readAsDataURL(file);
        fileReader.onload = (evt => {
            // When the conversion is complete, write it on the form.
            iRequests.push({
                name: file.name,
                 // You need to remove the front part of DataURL.
                image: evt.target.result.split(',')[1],
            });
        });
    }
};
```

```javascript
// upload
fetch('/upload', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ iRequests }),
});
```
