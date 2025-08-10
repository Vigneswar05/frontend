export async function subscribeUserToPush() {
    const swRegistration = await navigator.serviceWorker.ready;

    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/vapidPublicKey`);
        const { publicKey } = await response.json();
        const convertedKey = urlBase64ToUint8Array(publicKey);

        // Check if an existing subscription matches
        let subscription = await swRegistration.pushManager.getSubscription();
if (subscription) {
    const subJSON = subscription.toJSON();
    // Compare subscription key string with the fetched publicKey string directly
    if (!subJSON.keys || subJSON.keys.p256dh !== publicKey) {
        await subscription.unsubscribe();
        console.log("Old subscription removed due to key mismatch.");
        subscription = null;
    }
}

        // Subscribe if needed
        if (!subscription) {
            subscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedKey
            });

            await fetch(`${process.env.REACT_APP_BACKEND_URL}/subscribe`, {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: { 'Content-Type': 'application/json' }
            });
            console.log("New push subscription created and sent to server.");
        }
    } catch (err) {
        console.error("Error during push subscription:", err);
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
