import './App.css'
import { Link } from 'react-router-dom';
export default function Home() {
    const getGoogleAuthUrl = () => {
        const url = "https://accounts.google.com/o/oauth2/v2/auth";
        const {VITE_GOOGLE_CLIENT_ID, VITE_REDIRECT_URL} = import.meta.env;
        const query = {
            client_id: VITE_GOOGLE_CLIENT_ID,
            redirect_uri: VITE_REDIRECT_URL,
            response_type: 'code',
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email"
            ].join(' '),
            prompt: 'consent'
        };
        const queryParams = new URLSearchParams(query).toString();
        return `${url}?${queryParams}`;
    }
    const googleOauthUrl = getGoogleAuthUrl();
    console.log(googleOauthUrl);
    return (
        <>
          <Link to={googleOauthUrl}>Login with google</Link>
        </>
      )
}