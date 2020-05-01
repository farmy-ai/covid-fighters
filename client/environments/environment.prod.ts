export const environment = {
  production: true,
  API_KEY: $ENV.API_KEY,
  API_URL: $ENV.API_URL,
  ONESIGNAL_KEY: $ENV.ONESIGNAL_KEY
};

declare var $ENV: ENV;

interface ENV {
  API_KEY: string;
  API_URL: string;
  ONESIGNAL_KEY: string;
}


