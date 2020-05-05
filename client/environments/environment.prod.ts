export const environment = {
  production: true,
  API_KEY: " ",
  API_URL: "https://covidfighterapp.herokuapp.com/api/",
  ONESIGNAL_KEY: " "
};

declare var $ENV: ENV;

interface ENV {
  API_KEY: string;
  API_URL: string;
  ONESIGNAL_KEY: string;
}


