import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "27820353-9ce9-4c01-b201-63312d592067",
    authority: "https://login.microsoftonline.com/f3fc4250-5934-44f4-b6ac-98d16d9807e0",
    redirectUri: "http://localhost:5173",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"],
};

export const msalInstance = new PublicClientApplication(msalConfig);