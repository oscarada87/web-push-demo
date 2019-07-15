const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const webPush = require('web-push')
const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 4000
app.get('/', (req, res) => res.send('Hello World!'))

const vapidKeys = {
  publicKey: 'BJ5IxJBWdeqFDJTvrZ4wNRu7UY2XigDXjgiUBYEYVXDudxhEs0ReOJRBcBHsPYgZ5dyV8VjyqzbQKS8V7bUAglk',
  privateKey: 'ERIZmc5T5uWGeRxedxu92k3HnpVwy_RCnQfgek1x2Y4',
}

// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  'http://localhost:8080/',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const payloads = {};

app.get('/vapidPublicKey', function (req, res) {
  res.send(vapidKeys.publicKey);
});

app.post('/register', function (req, res) {
  // A real world application would store the subscription info.
  res.sendStatus(201);
});

app.post('/sendNotification', function (req, res) {
  // console.log(req.body.subscription)
  // console.log(req.body.payload)
  // console.log(req.body.ttl)
  const subscription = req.body.subscription;
  const payload = req.body.payload;
  const options = {
    TTL: req.body.ttl
  };

  setTimeout(function () {
    payloads[req.body.subscription.endpoint] = payload;
    webPush.sendNotification(subscription, null, options)
      .then(function () {
        res.sendStatus(201);
      })
      .catch(function (error) {
        res.sendStatus(500);
        console.log(error);
      });
  }, req.body.delay * 1000);
});

app.get('/getPayload', function (req, res) {
  res.send(payloads[req.query.endpoint]);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));