/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Confirm Password
 * @param req
 * @param res
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body } = req;
    const { resetToken, password } = body;

    if (!resetToken || !password) {
        return res.status(405).json({ message: 'Could not validate data' })
    }

    if (method !== 'POST') {
        return res.status(405).json({ message: 'Method not supported' })
    }

    try {
        const url = `${process.env.NEXT_PUBLIC_LOGIN_API}/user/password/reset`;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resetToken}`
            },
            body: JSON.stringify({
                password: password,
            })
        };
        console.log(options);

        const result = await fetch(url, options);
        const json = await result.json();

        console.log(json);

        if (json.status) {
            return res.status(200).json({
                success: true,
                message: json.message,
            })
        } else {
            return res.status(200).json({
                error: true,
                message: json.detail,
            })
        }

    } catch (error) {
        console.error(error);
    }
}

