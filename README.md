# COVID FIGHTERS

Data collection and annotation tool for Covid-19 disease chest x-ray scans [Project website](https://covidfighterapp.herokuapp.com/)

## Why this project

in the end of 2019 a new virus arrived to our world as many people get sick and sometimes die from that novel virus that was named lately COVID-19,to detect this virus There is a test called PCR ,but this test is hard to perform in a large amount of population , so in emergency cases like in italy ,doctors uses clinical and radiological signs to classify patients but the overwhelming charge on the Health care systems make it hard for doctors to fast & objectify detect those signs so a need risen to help them using modern technologies like Data science & deep learning ,but those methods such those need a big amount of data so to collect and broadcast data we created this project as an attempt to help collecting information's about this virus and broadcast it to the public ,hoping that this will help fighting this virus.
Therefor using supervised learning is know as the fastest and the most reliable way to implement a deep learning model so we needed to created a pipe helping fast data collection and expert fast annotation , for that we used the following web technologies that we saw the most effective for this particular case :
- MEAN Stack
- AWS S3
- Heruko
- Pytorch

## Goal
Our main goal is make collect and label chest scan data easy ,accelerating the process toward having a reliable & good data to work with


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

* **Ahmed GHENABZIA** - *Initial work* - [Ahmad](https://github.com/ahmed3991)
* **Ilies BOUROUH** - *Initial work* - [Ilyes brh](https://github.com/ilyesbrh)
* **Tarik ZEZADI** 
* **Mohamed BRAHIMI** 
* **BILEL ZEZADI**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

