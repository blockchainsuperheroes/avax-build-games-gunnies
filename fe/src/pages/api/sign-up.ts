import type { NextApiRequest, NextApiResponse } from 'next';
import { get, join } from 'lodash';

/* eslint-disable import/no-anonymous-default-export */
/**
 * forgot password
 * @param req
 * @param res
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  const bodyJson = JSON.parse(body);
  const { captcha_id } = bodyJson;
  if (!captcha_id) {
      return res.status(405).json({ message: 'Could not validate data' })
  }

  if (method !== 'POST') {
    return res.status(405).json({ message: 'Method not supported' });
  }

  try {
    let url = `${process.env.NEXT_PUBLIC_LOGIN_API}/api/v3/user/signup`;
    if (bodyJson.wallet_type == 'ethermail') {
      url = `${process.env.NEXT_PUBLIC_LOGIN_API}/user/signup/ethermail`;
    } else if (!bodyJson.username) { // new sign up flow
        url = `${process.env.NEXT_PUBLIC_LOGIN_API}/api/v4/user/signup`;
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    };
    try {
      const result = await fetch(url, options);
      const json = await result.json();
      console.log('sign-up json', json);
      if (json.status) {
        return res.status(200).json({
          success: true,
        });
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
          return res.status(200).json({
              error: true,
              message: message ? message : `There was an issue sign up`,
          })
      }
    } catch (error) {
      console.error(error);
    }

    return res.status(400).json({
      error: true,
      message: 'There was an issue sign up',
    });
  } catch (error) {
    console.error(error);
  }
};
