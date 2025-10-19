import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/app/App';
import { WorkOrdersProvider } from './src/store/workOrders.context';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <WorkOrdersProvider>
      <App />
    </WorkOrdersProvider>
  </React.StrictMode>
);