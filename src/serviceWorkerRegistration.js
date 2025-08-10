export function register() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('https://vigneswar05.github.io/frontend/service-worker.js')
                .then(reg => console.log('Service worker registered', reg))
                .catch(err => console.error('Service worker error', err));
        });
    }
}
