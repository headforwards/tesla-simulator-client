# Tesla Simulator Client

This is an open source project to provide and educational tool to simulate the actions of the Tesla model S API.
Not everyone has access to a Tesla to test against so we plan to produce something that will model it's behaviour.

This client is the visual representation of the Tesla demo responding to the actions you have requested via the server.

## Getting started

### Requirements

The application requires [NodeJS](https://nodejs.org/en/download/) to build a version for the browser using various packages.

It also requires the [Server](https://github.com/headforwards/tesla-simulator-server) running which it will connect too and listen for commands from there.

### Get the repo

Clone the repo at: ``` git clone https://github.com/headforwards/tesla-simulator-client.git ```

### Install the dependencies

Make sure you have installed NodeJS (tested with v4.1.2)

```
npm install
```

### Build and test the application

```
npm run build
http-server -p 3000
```

### Viewing in the browser

Open your browser and navigate to [http:/localhost:3000](http:/localhost:3000)

By default the application will visualise all vehicles that the server has created from people calling the API.  You can make the application show a single car by passing the email address used with the Server API in the email parameter: http:/localhost:3000?email=my-api-email


### Development work

You can run 

```
npm run watch
```

Which will watch for any changes to js/main.js and rebuild this for the browser if you save changes to it.
The build file is not committed to the repository at the moment - we should make a "dist" version for "release".
