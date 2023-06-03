declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_URL: string;

      AWS_REGION: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;

      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
    }
  }
}

export {};
