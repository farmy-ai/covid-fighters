# CovidApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

## Development server

Add '.env' file 

###.env
'''
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
'''

Run `npm run dev` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run prod` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
