self.addEventListener('push', event => {
    if (event.data) {
        const { title, message } = JSON.parse(event.data.text());
        event.waitUntil(
            self.registration.showNotification(title, {
                body: message,
                icon: '/tablet-icon.png'
            })
        );
    }
});
