if (
  navigator &&
  navigator.serviceWorker &&
  navigator.serviceWorker.getRegistrations
) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

console.log("run clear gatsby");
