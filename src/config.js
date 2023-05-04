const prodDomain = "https://garlic-os.is-a.dev";
const prodPort   = 443;
const prodURL    = prodDomain;

const devDomain  = "http://localhost";
const devPort    = 3001;
const devURL     = `${devDomain}:${devPort}`;

const prodMode = process.env.NODE_ENV === "production";

export const domain = prodMode ? prodDomain : devDomain;
export const port   = prodMode ? prodPort   : devPort;
export const url    = prodMode ? prodURL    : devURL;

export const sslKeyPath = "/etc/letsencrypt/live/garlic-os.is-a.dev/privkey.pem";
export const sslCertPath = "/etc/letsencrypt/live/garlic-os.is-a.dev/fullchain.pem";
