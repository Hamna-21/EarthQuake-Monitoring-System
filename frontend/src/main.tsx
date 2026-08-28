import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {ConfigProvider} from 'antd';
import App from '@/app/App.tsx';
import {geoPulseAntdTheme} from '@/theme/antdTheme';
import '@/styles/app.css';

// Mount the single application root and keep React's development checks enabled.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={geoPulseAntdTheme}>
      <App />
    </ConfigProvider>
  </StrictMode>,
);
