# Introduction

This repository implements a web service of screen shot of a given url. It is based on selenium web driver and express.js.

Two service will be available:
- /calendar: screenshot for google calendar;
- /screenshot/url_encoded_url: screenshot for a given url (encoded)

Screenshot resolution is set to 1200x825 (for Inkplate 10).

# Usage

## Local
With the following command, you could run it locally and your service will be able as localhost.

```
npm start
npm install
```

## Docker
Please use the following steps to run it in docker
- build the container via `docker build -t node_chrome_webdriver .`;
- create a volume for `/user/local/app`;
- set port mapping for 80;
- create a container using `npm install` as CMD to install the dependency;
- replace that container using `npm start` as CMD;
