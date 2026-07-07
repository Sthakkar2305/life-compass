self.addEventListener("sync", (event) => {
  if (event.tag === "life-book-sync") {
    event.waitUntil(Promise.resolve());
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const focused = clients.find((client) => client.url.includes(self.location.origin));
      if (focused) return focused.focus();
      return self.clients.openWindow("/");
    })
  );
});
