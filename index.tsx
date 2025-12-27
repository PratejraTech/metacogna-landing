import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import dotenv from 'dotenv';

const env = dotenv.config();

if (env.error) {
  throw new Error('Failed to load .env file');
}
console.log(env.parsed);
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);