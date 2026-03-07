import { get, join } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'

/* eslint-disable import/no-anonymous-default-export */
/**
 * forgot password
 * @param req
 * @param res
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body } = req;
    console.log('login-with-email body', body);
    const bodyJson = JSON.parse(body);
    console.log('login-with-email bodyJson', bodyJson);

    if (method !== 'POST') {
        return res.status(405).json({ message: 'Method not supported' })
    }

    try {
        const url = `${process.env.NEXT_PUBLIC_LOGIN_API}/user/login/email`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body,
        };
        try {
            const result = await fetch(url, options);
            const json = await result.json();
            console.log('login-with-email json', json);
            if (json.status) {
                return res.status(200).json({
                    success: true,
                })
            } else {
                let message = json.message;
                if (json.erorlist && typeof json.erorlist == 'object') {
                    message = '';
                    const keys = Object.keys(json.erorlist);
                    keys.forEach(key => {
                        let value = get(json.erorlist, key);
                        if (Array.isArray(value)) {
                            value = join(value, ' ');
                        }
                        message = message ? `${message} ${value}` : `${value}`;
                    });
                }
                if (message == 'Unauthenticated user') {
                    message = 'Email not found in our system. Please check your email and try again or sign up to get started!';
                }
                return res.status(200).json({
                    error: true,
                    message: message ? message : `There was an issue login with email`,
                })
            }
        }
        catch (error) {
            console.error(error);
        };

        return res.status(400).json({
            error: true,
            message: 'There was an issue login with email'
        })
    } catch (error) {
        console.error(error);
    }
}

