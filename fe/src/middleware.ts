import { NextResponse } from 'next/server';


const getNewURL = (req: any, isVerify: boolean = false) => {
  const queryParams = req.nextUrl.searchParams;
  let username = queryParams.get('username');
  let referral_username = queryParams.get('referral_username');
  username = username?.replaceAll(" ", "+");
  referral_username = referral_username?.replaceAll(" ", "+");
  const url = req.nextUrl.clone();

  // case 2: without referral_username
  // case 2.1: isVerify = true
  // case 2.2: isVerify = false
  // url.pathname = `/${encodeURIComponent(username)}`;
  url.pathname = `/sign-in`;

  if (isVerify) {
    url.searchParams.set('verify', 'true');
  }

  return url;
}

const Middleware = (req: any) => {
  const originalPathname = req.nextUrl.pathname;
  switch (originalPathname) {
    case '/auto-login':
      return NextResponse.redirect(getNewURL(req));
    case '/validate-email':
      return NextResponse.redirect(getNewURL(req, true));
  
    default:
      return NextResponse.next();
  }
};

export default Middleware;
