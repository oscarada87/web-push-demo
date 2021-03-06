
function getEndpoint() {
  return self.registration.pushManager.getSubscription()
    .then(function (subscription) {
      if (subscription) {
        return subscription.endpoint;
      }

      throw new Error('User not subscribed');
    });
}

// Register event listener for the 'push' event.
self.addEventListener('push', function (event) {
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    getEndpoint()
    .then(function (endpoint) {
      // Retrieve the textual payload from the server using a GET request.
      // We are using the endpoint as an unique ID of the user for simplicity.
      return fetch('http://localhost:4000/getPayload?endpoint=' + endpoint);
    })
    .then(function (response) {
      console.log(response)
      return response.text();
    })
    .then(function (payload) {
      // Show a notification with title 'ServiceWorker Cookbook' and use the payload
      // as the body.
      console.log(payload)
      self.registration.showNotification('通知', {
        body: payload,
        icon: '123.jpg',
      });
    })
  );
})