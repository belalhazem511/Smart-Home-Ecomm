const demoEmail = 'demo@smartatlas.test';
const demoPassword = 'SmartAtlasDemo2026!';

export function matchesDemoPreviewCredentials(values, developmentEnabled) {
  return developmentEnabled
    && String(values.email || '').trim().toLowerCase() === demoEmail
    && values.password === demoPassword;
}
