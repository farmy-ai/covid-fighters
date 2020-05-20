# COVID FIGHTERS

Data collection and label tool for COVID-19 disease chest scans [covideep](http://www.covideep.net/)

## Features

 ### Dataset
   Users can download gathered dataset and/or upload dataset
 ### Expert
   Radiologists can label chest xray scan to ensure the quality of dataset 
 ### Demo
  An up-to-date deep learning model trained using collected dataset 

### Prerequisites

Add '.env' file 

#### .env

```
MONGODB_URI= <YOUR_MAONGO_URI>
MONGODB_TEST_URI= <YOUR_MONGODB_TEST_URI>
SECRET_TOKEN= <YOUR_SECRET_TOKEN>
AWS_ACCESS_KEY_ID = <YOUR_AWS_ACCESS_KEY_ID>
AWS_SECRET_ACCESS_KEY = <YOUR_AWS_SECRET_ACCESS_KEY>
AWS_REGION= <YOUR_AWS_REGION>
AWS_BUCKET_NAME = <YOUR_AWS_BUCKET_NAME>
CLIENT_URL= <YOUR_CLIENT_URL>
MAILGUN_DOMAIN=<YOUR_MAILGUN_DOMAIN>
MAILGUN_API_KEY= <YOUR_MAILGUN_API_KEY> 
TOKEN_EXPIRY=<YOUR_TOKEN_EXPIRY>
```

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run prod` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Contributing

Please feal free to fork this project and do whatever you want with.

## Versioning

We still in BETA version.

## Authors

* **Ahmed GHENABZIA** - *Initial work* - [Ahmed](https://github.com/ahmed3991)
* **Ilies BOUROUH** - *Initial work* - [Ilyes brh](https://github.com/ilyesbrh)
* **Tarik ZEDAZI** 
* **Mohamed BRAHIMI** 
* **BILEL ZEDAZI**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

