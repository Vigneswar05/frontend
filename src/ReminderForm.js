import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ReminderForm() {
  const [form, setForm] = useState({ name: '', time1: '', time2: '', time3: '' });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    // Convert local time (HH:mm) to UTC (HH:mm)
    function localTimeToUtcString(localTime) {
        const [hours, minutes] = localTime.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0); // set local time
        const utcHours = date.getUTCHours().toString().padStart(2, '0');
        const utcMinutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${utcHours}:${utcMinutes}`;
    }

    const handleSubmit = async e => {
        e.preventDefault();

        if (await Notification.requestPermission() !== 'granted') {
            alert('Please enable notifications to use this app.');
            return;
        }

        // Convert all provided times to UTC before sending to backend
        const times = [form.time1, form.time2, form.time3]
            .filter(Boolean)
            .map(localTimeToUtcString);

        // Save reminder times
        await axios.post('https://tablet-reminder-backend-production.up.railway.app/reminders', {
            name: form.name,
            times
        });

        // Get public key
        const publicKeyResp = await axios.get('https://tablet-reminder-backend-production.up.railway.app/vapidPublicKey');
        const publicKey = urlBase64ToUint8Array(publicKeyResp.data.publicKey);

        // Subscribe user to push notifications
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicKey
        });

        await axios.post('https://tablet-reminder-backend-production.up.railway.app/subscribe', {
            name: form.name,
            subscription: sub
        });

        alert('✅ Reminder saved and notifications enabled!');
    };

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 rounded">
        <h2 className="text-center mb-4">💊 Tablet Reminder</h2>

        <form onSubmit={handleSubmit}>
          {/* Tablet Name */}
          <div className="mb-3">
            <label className="form-label">Tablet Name</label>
            <input
              name="name"
              type="text"
              className="form-control"
              placeholder="Enter tablet name"
              onChange={handleChange}
              required
            />
          </div>

          {/* Time 1 */}
          <div className="mb-3">
            <label className="form-label">Time 1</label>
            <input
              name="time1"
              type="time"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          {/* Time 2 */}
          <div className="mb-3">
            <label className="form-label">Time 2 (optional)</label>
            <input
              name="time2"
              type="time"
              className="form-control"
              onChange={handleChange}
            />
          </div>

          {/* Time 3 */}
          <div className="mb-3">
            <label className="form-label">Time 3 (optional)</label>
            <input
              name="time3"
              type="time"
              className="form-control"
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">
              💾 Save Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
