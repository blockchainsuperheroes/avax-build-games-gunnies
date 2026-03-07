import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

const scopes = ['identify', 'email'].join(' ');

class UserSession {
  session: any = null;
}

const userSession = new UserSession();

export const authOptions: NextAuthOptions = {
  debug: true,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      // Name must match what NextAuth expects
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        // Use 'lax' in development, 'none' in production (for iframe support)
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        // Only require secure in production (HTTPS)
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        // Set maxAge to match session maxAge
        maxAge: 30 * 24 * 60 * 60, // 30 days
        // domain: '.gunnies.io', // optional – only if you want to share across subdomains
      },
    },
    // (Optional but nice) make CSRF cookie also third-party friendly
    csrfToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Host-next-auth.csrf-token'
          : 'next-auth.csrf-token',
      options: {
        httpOnly: false, // CSRF cookie is readable by JS by design
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      },
    },
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      // Get accessToken from JWT token (persists across refreshes)
      const accessToken = token?.accessToken;

      // If no accessToken in JWT, session is invalid
      if (!accessToken) {
        console.log('No access token in session callback');
        return {};
      }

      try {
        // Check if this is a wallet login (has wallet-specific data in token)
        if (token?.isWalletLogin) {
          // For wallet login, we already have the user data in the token
          session.token = accessToken;
          session.user.email = token.email;
          session.user.email_validated = token.email_validated;
          session.user.mm_address = token.mm_address;
          session.user.username = token.username;
          session.user.metamask_bind = token.metamask_bind;
          session.user.gunnies_access_token = token.gunnies_access_token;

          userSession.session = session;
          return session;
        }

        // For regular login, fetch current user data using the access token
        const userData = await currentUser(accessToken);

        if (!userData?.status || !userData?.result) {
          console.log('Failed to get user data from currentUser');
          return {};
        }

        // Populate session with user data
        session.token = accessToken;
        session.user.email = userData.result.email;
        session.user.email_validated = userData.result.email_validated_at;
        session.user.mm_address = userData.result.mm_address;
        session.user.username = userData.result.username;
        session.user.algorand_address = userData.result.algorand_address;
        session.user.metamask_bind = userData.result.metamask_bind;
        session.user.extra_data = userData.result.extra_data;
        session.user.gunnies_access_token = userData.result.gunnies_access_token;

        // Store in memory for fallback (though JWT should be primary)
        userSession.session = session;

        return session;
      } catch (error) {
        console.error('Error fetching user data in session callback:', error);
        // Return empty session if there's an error
        return {};
      }
    },
    async jwt({ token, user }: { token: JWT; user: any }) {
      // Initial sign in - set the token
      if (user?.token) {
        // Check if this is a wallet login (has mm_address)
        if (user?.mm_address) {
          console.log('JWT callback: wallet login detected');
          return {
            ...token,
            accessToken: user.token,
            isWalletLogin: true,
            email: user.email,
            username: user.name,
            mm_address: user.mm_address,
            metamask_bind: user.metamask_bind,
            email_validated: user.email_validated,
            gunnies_access_token: user.gunnies_access_token,
          };
        } else {
          // Regular login
          return {
            ...token,
            accessToken: user.token,
          };
        }
      }

      // On subsequent requests, preserve the existing accessToken
      // This ensures the session persists after page refresh
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      id: 'mm-login',
      name: 'Credentials',
      credentials: {
        token: { label: 'username', type: 'text', placeholder: '' },
      },
      async authorize(credentials, req) {
        const parsed = JSON.parse((credentials as any).data);
        const user = await genericLogin(parsed);

        if (user.error) {
          if (user?.errorType === 'email_verification') {
            return Promise.reject({
              message: `EMAIL_VERIFICATION: ${user?.token}`,
              status: 200,
            });
          } else if (user?.errorType === 'referral_code_unverified') {
            return Promise.reject({
              message: `REFERRAL_CODE_UNVERIFIED: ${user?.token}`,
              status: 200,
            });
          } else if (user?.message === 'Unauthenticated user') {
            // Try wallet login as fallback when user is unauthenticated
            if (parsed?.signature && parsed?.address) {
              console.log('Unauthenticated user, trying wallet login fallback');

              try {
                // Create FormData for the wallet login API call
                const formData = new FormData();
                formData.append('signature', parsed.signature);
                formData.append('address', parsed.address);
                formData.append('message', parsed.message || '');

                // Call the Gunnies wallet login API
                const walletResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_GUNNIES_API}/user/login/wallet`,
                  {
                    method: 'POST',
                    body: formData,
                  }
                );

                const walletResult = await walletResponse.json();

                if (walletResponse.ok && walletResult.status) {
                  console.log('Wallet login fallback successful');

                  // Return user data in the expected format
                  const userArr = {
                    id: walletResult.result.user_data.email || walletResult.result.user_data.id,
                    email: walletResult.result.user_data.email,
                    name: walletResult.result.user_data.username,
                    token: walletResult.result.access_token,
                    mm_address: walletResult.result.user_data.mm_address,
                    metamask_bind: walletResult.result.user_data.metamask_bind,
                    gunnies_access_token: walletResult.result.access_token,
                    isWalletLogin: true, // Flag to identify wallet login
                  };

                  return userArr;
                } else {
                  console.error('Wallet login fallback failed:', walletResult);
                }
              } catch (error) {
                console.error('Error during wallet login fallback:', error);
              }
            }

            return Promise.reject({
              message: `UNAUTHENTICATED_USER: ${user?.message}`,
              status: 200,
            });
          }
          return Promise.reject(new Error('Invalid Username and Password combination'));
        }

        if (user.access_token) {
          const userData = await currentUser(user.access_token);

          const userArr = {
            id: userData.email,
            email: userData.email,
            name: userData.username,
            token: user.access_token,
            total_hashrate: userData.total_hashrate,
            pool: userData.userData,
            not_eligible: userData.not_eligible,
            email_validated: userData.email_validated_at,
            asset_count: userData.asset_count,
            mm_address: userData.mm_address,
            gunnies_access_token: userData.gunnies_access_token,
          };

          // Any object returned will be saved in `user` property of the JWT
          return userArr;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
    CredentialsProvider({
      type: 'credentials',
      id: 'token-login',
      name: 'Credentials',
      credentials: {
        token: { label: 'username', type: 'text', placeholder: '' },
      },
      async authorize(credentials, req) {
        const parsed = JSON.parse((credentials as any).data);

        if (parsed.token) {
          const userData = await currentUser(parsed.token);
          const userArr = {
            id: userData.email,
            email: userData.email,
            name: userData.username,
            token: parsed.token,
            total_hashrate: userData.total_hashrate,
            pool: userData.userData,
            not_eligible: userData.not_eligible,
            email_validated: userData.email_validated_at,
            asset_count: userData.asset_count,
            mm_address: userData.mm_address,
            gunnies_access_token: userData.gunnies_access_token,
          };

          // Any object returned will be saved in `user` property of the JWT
          return userArr;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
    CredentialsProvider({
      type: 'credentials',
      id: 'login',
      name: 'Login',
      credentials: {
        username: { label: 'Username', type: 'text ', placeholder: 'username' },
        password: { label: 'Password', type: 'password', placeholder: '' },
        referral_code: { label: 'referral_code', type: 'text ', placeholder: 'referral_code' },
      },
      async authorize(credentials, req) {
        const data = {
          username: credentials?.username,
          password: credentials?.password,
          referral_code: credentials?.referral_code,
        };

        const user = await genericLogin(data, 'email');

        if (user.error) {
          if (user?.errorType === 'email_verification') {
            return Promise.reject({
              message: `EMAIL_VERIFICATION: ${user?.token}`,
              status: 200,
            });
          } else if (user?.errorType === 'referral_code_unverified') {
            return Promise.reject({
              message: `REFERRAL_CODE_UNVERIFIED: ${user?.token}`,
              status: 200,
            });
          }
          return Promise.reject(new Error('Invalid Username and Password combination'));
        }

        console.log('authorize1 user', user);

        if (user?.access_token) {
          const userData = await currentUser(user.access_token);

          const userArr = {
            id: userData.email,
            email: userData.email,
            name: userData.username,
            token: user.access_token,
            total_hashrate: userData.total_hashrate,
            pool: userData.userData,
            not_eligible: userData.not_eligible,
            email_validated: userData.email_validated_at,
            asset_count: userData.asset_count,
            mm_address: userData.mm_address,
            centralised_wallet_address: userData.centralised_wallet_address,
            metamask_bind: userData.metamask_bind,
            gunnies_access_token: userData.gunnies_access_token,
          };

          // Any object returned will be saved in `user` property of the JWT
          return userArr;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
    CredentialsProvider({
      type: 'credentials',
      id: 'wallet-login',
      name: 'Wallet Login',
      credentials: {
        signature: { label: 'signature', type: 'text', placeholder: '' },
        address: { label: 'address', type: 'text', placeholder: '' },
        message: { label: 'message', type: 'text', placeholder: '' },
      },
      async authorize(credentials, req) {
        if (!credentials?.signature || !credentials?.address || !credentials?.message) {
          return Promise.reject(new Error('Missing required wallet login credentials'));
        }

        try {
          // Create FormData for the API call
          const formData = new FormData();
          formData.append('signature', credentials.signature);
          formData.append('address', credentials.address);
          formData.append('message', credentials.message);

          // Call the Gunnies wallet login API
          const response = await fetch(`${process.env.NEXT_PUBLIC_GUNNIES_API}/user/login/wallet`, {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();

          if (!response.ok || !result.status) {
            console.error('Wallet login API failed:', result);
            return Promise.reject(new Error(result.message || 'Wallet login failed'));
          }

          // If successful, get user data using the access token
          if (result.result?.access_token) {
            const userData = result.result?.user_data;

            const userArr = {
              id: userData?.email || userData?.id,
              email: userData?.email,
              name: userData?.username,
              token: result.result.access_token,
              total_hashrate: userData?.total_hashrate || 0,
              pool: userData?.userData,
              not_eligible: userData?.not_eligible || false,
              email_validated: userData?.email_validated_at,
              asset_count: userData?.asset_count || 0,
              mm_address: userData?.mm_address,
              centralised_wallet_address: userData?.centralised_wallet_address,
              metamask_bind: userData?.metamask_bind,
              gunnies_access_token: result.result.access_token, // Use the same token for now
            };

            return userArr;
          }

          return Promise.reject(new Error('No access token received'));
        } catch (error) {
          console.error('Wallet login error:', error);
          return Promise.reject(new Error('Wallet login failed'));
        }
      },
    }),
  ],
  pages: {
    // signIn: "/login",
  },
};

export default NextAuth(authOptions);

/**
 * Login Via MetaMask
 * @param data
 * @returns {Promise<any>}
 */
const genericLogin = async (data: any, type = 'wallet') => {
  let body: any = {
    type: type,
    signature: data?.signature ?? '',
    address: data?.address ?? '',
    message: data?.message ?? '',
    username: data?.username ?? '',
    password: data?.password ?? '',
    referral_code: data?.referral_code ?? '',
    captcha_id: data?.captcha_id ?? '',
    captcha_answer: data?.captcha_answer ?? '',
    user_from: process.env.NEXT_PUBLIC_USER_FROM ?? '',
  };
  if (type == 'ethermail') {
    body = {
      ethermail_token: data?.ethermail_token,
    };
  }

  const settings = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  };
  let url = `${process.env.NEXT_PUBLIC_LOGIN_API}/user/login`;
  if (type == 'ethermail') {
    url = `${url}/ethermail`;
  }
  const res = await fetch(url, settings);
  const result = await res.json();
  if (!result.status) {
    result.error = true;
    if (result.message == 'User not verified') {
      result.errorType = 'email_verification';
    }
    result.token = result.result?.access_token;
    delete result.status;
    delete result.result;
  } else {
    result.message = '';
    result.token = result.result?.access_token;
  }
  result.access_token = result.result?.access_token;

  return result;
};

/**
 * Get Current User Data
 * @param data
 * @returns {Promise<any>}
 */
const currentUser = async (data: any) => {
  const settings = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + data,
    },
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_LOGIN_API}/user/info`, settings);
  const pg_result = await res.json();

  if (!pg_result.status) {
    throw new Error('PG user not found!');
  }

  const formData = new FormData();
  formData.append('token', data);

  const response = await fetch(`${process.env.NEXT_PUBLIC_GUNNIES_API}/user/auth/login`, {
    method: 'POST',
    body: formData,
  });

  const gunnies_result = await response.json();
  if (!gunnies_result.status) {
    throw new Error(
      'GUNNIES_USER_NOT_FOUND: Gunnies user not found! Create new account on Avalanche.games.'
    );
  }

  pg_result.result.gunnies_access_token = gunnies_result.result.access_token;
  //pg_result.result.gunnies_access_token = "gunnies_result.result.access_token";

  return pg_result;
};
