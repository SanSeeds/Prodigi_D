// src/config.ts

type Config = {
    apiUrl: string;
  };
  
  const ENV = import.meta.env.VITE_APP_ENV || 'development';
  
  const config: Record<string, Config> = {
    development: {
      apiUrl: 'http://localhost:8000',
    },
    test: {
      apiUrl: 'https://test.example.com',
    },
    production: {
      apiUrl: 'http://43.205.83.83',
    },
  };
  
  export default config[ENV];
  