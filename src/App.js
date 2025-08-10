import React from 'react';
import ReminderForm from './ReminderForm';

export default function App() {
  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: 16, fontFamily: 'Arial, sans-serif' }}>
      <h1>Tablet Reminder (PWA)</h1>
      <p>Set up to three daily reminders (24-hour time). Allow notifications when prompted.</p>
      <ReminderForm />
    </div>
  );
}
