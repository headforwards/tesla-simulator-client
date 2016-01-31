# Tesla Simulator Client

This is an open source project to provide and educational tool to simulate the actions of the Tesla model S API.
Not everyone has access to a Tesla to test against so we plan to produce something that will model it's behaviour.

This client is the visual representation of the Tesla demo responding to the actions you have requested via the server.

## Getting started

### Get the repo

Clone the repo at: ``` git clone https://github.com/headforwards/tesla-simulator-client.git ```

### Install the dependencies

```
cd socket-client-demo
npm install
```

### Start the Socket.io server which will listen to, and broadcast socket messages, as well as server the index.html file in the browser.

```
node index
```

### Viewing in the browser

Open your browser and navigate to [http:/localhost:3000](http:/localhost:3000)

There are 2 panels in the GUI; the left includes input controls, the right the output.

#### Input

Select which car you would like to control from the dropdown; then click on the action to perform on the car.
When you click an action, a socket message is broadcast which will be caught by any listening client.


#### Output

The output panel listens for broadcast messages and displays them on screen.
You can choose to listen to all cars or for messages for a specific car.

If you have multiple browser windows open, you will see the messages displayed across all windows :)

