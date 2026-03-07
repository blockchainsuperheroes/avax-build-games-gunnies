import { startCase } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'

/* eslint-disable import/no-anonymous-default-export */
/**
 * forgot password
 * @param req
 * @param res
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body } = req;
    const { captcha_answer, captcha_id, email, user_from } = body;

    console.log('forgot-password email', email);
    console.log('forgot-password captcha_id', captcha_id);
    console.log('forgot-password user_from', user_from);

    if (!email || !captcha_id) {
        return res.status(405).json({ message: 'Could not validate data' })
    }

    if (method !== 'POST') {
        return res.status(405).json({ message: 'Method not supported' })
    }

    try {
        const url = `${process.env.NEXT_PUBLIC_LOGIN_API}/user/v3/password/forgot`;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                captcha_answer,
                captcha_id,
                email,
                user_from,
            })
        };

        const result = await fetch(url, options);
        const json = await result.json();

        if (json.status) {
            return res.status(200).json({
                success: true,
                message: `Created new password`,
            })
        } else {
            const message = json.message ? json.message : json.detail ? json.detail : `Could not create new password`
            return res.status(200).json({
                error: true,
                message: `${message}`,
            })
        }
    } catch (error) {
        console.error(error);
    }
}

