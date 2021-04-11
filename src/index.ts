import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import { stringify } from 'querystring';

export type ImgbbResponse = {
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
};

export type ImgbbRequest = {
    image: string,
    name?: string,
    expiration?: string,
}

export type ImgbbRequestArray = Array<ImgbbRequest>;
export type ImgbbResponseArray = Array<ImgbbResponse>;

export async function imgbb(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const iRequests: ImgbbRequestArray = body.iRequests;
    const iResponses: ImgbbResponseArray = [];
    const API_KEY = req.app.get('IMGBB_API_KEY');
    let API_URL = `https://api.imgbb.com/1/upload?key=${API_KEY}`;

    for (const img of iRequests) {
        if (img.name) {
            API_URL += `&name=${img.name}`;
        }
        if (img.expiration) {
            API_URL += `&expiration=${img.expiration}`;
        }
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: stringify({
                image: img.image,
            }),
        });
        const json = await response.json();
        let format: ImgbbResponse;
        if (json.error) {
            format = {
                data: null,
                success: false,
                status: json.status_code,
                error: json.error,
            };
        } else {
            format = {
                data: json.data,
                success: true,
                status: 200,
                error: null,
            };
        }
        iResponses.push(format);
    }
    req['iResponses'] = iResponses;
    next();
}