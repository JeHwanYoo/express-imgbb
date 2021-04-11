import { config } from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import { stringify } from 'querystring';

config();

const { API_KEY } = process.env;

if (API_KEY === undefined) {
    console.error('\n[Error] API_KEY is undefined!\n');
    process.exit();
}

let API_URL = `https://api.imgbb.com/1/upload?key=${API_KEY}`;

export type ImgbbSuccess = {
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
    },
    success: boolean,
    status: number
};

export type ImgbbFailure = {
    status_code: number,
    error: {
        message: string,
        code: number,
        context: string
    },
    status_txt: 'Bad Request'
};

export type ImgbbRequest = Array<{
    image: string,
    name: string,
    expiration: string,
}>;

export type ImgbbResponse = Array<ImgbbSuccess | ImgbbFailure>;

export async function imgbb(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const iRequest: ImgbbRequest = body.iRequest;
    const iResponse: ImgbbResponse = [];
    for (const img of iRequest) {
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
        const json: ImgbbSuccess | ImgbbFailure = await response.json();
        iResponse.push(json);
    }
    req['iResponse'] = iResponse;
    next();
}