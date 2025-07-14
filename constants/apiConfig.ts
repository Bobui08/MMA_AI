export const API_CONFIG = {
  IMAGE_GENERATION: {
    URL: "https://api.takey.ai/v1/images/generations",
    MODEL: "dall-e-3",
    SIZE: "1024x1024",
    COUNT: 1,
  },
  RETRY: {
    DELAY: 1000,
    MAX_ATTEMPTS: 12,
  },
  VALIDATION: {
    MIN_BASE64_LENGTH: 100,
    BASE64_REGEX: /^[A-Za-z0-9+/]*={0,2}$/,
  },
} as const;
