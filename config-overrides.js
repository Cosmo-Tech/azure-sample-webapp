export const ENABLE_CSP_IN_DEV_MODE = true;

export const CSP_CONFIG_POLICY = {
  'default-src': ["'self'"],
  'base-uri': ["'self'"],
  'connect-src': [
    "'self'",

    // Example of source for a custom on-premises cluster
    'https://kubernetes.cosmotech.com',

    // Examples of sources for Azure login and PowerBI
    // 'api.powerbi.com',
    // 'https://login.microsoftonline.com',
    // 'https://dc.services.visualstudio.com',
  ],
  'script-src': ["'self'"],
  'img-src': ["'self'", 'data:'],
  'style-src': ["'self'"],
  'style-src-elem': ["'unsafe-inline'"],
  'font-src': ['data:'],
  'frame-src': [
    "'self'",
    'blob:',

    // Example of source for a custom on-premises cluster
    'https://superset-kubernetes.cosmotech.com',

    // Examples of sources for Azure login and PowerBI
    // 'https://app.powerbi.com',
    // 'https://login.microsoftonline.com'
  ],
  'manifest-src': ["'self'"],
  'object-src': ["'none'"],
};
