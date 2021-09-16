const CLIENT_ID = "028ea5b683384907ee2126203f9e033d";
const REDIRECT_URI =  process.env.REACT_APP_HOST;

const KAKAO_AUTH_URL   = "https://kauth.kakao.com/oauth/authorize?client_id="+CLIENT_ID+"&redirect_uri="+REDIRECT_URI+"&response_type=code";
const KAKAO_LOGOUT_URL = "https://kauth.kakao.com/oauth/logout?client_id="+CLIENT_ID+"&logout_redirect_uri="+REDIRECT_URI+"&state=kakaologout";

export {KAKAO_AUTH_URL, KAKAO_LOGOUT_URL}