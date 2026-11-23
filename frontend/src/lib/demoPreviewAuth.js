const demoEmail = 'demo@smarthome.test';
const demoPassword = 'SmartHomeDemo2026!';

export function matchesDemoPreviewCredentials(values, developmentEnabled) {
  return developmentEnabled
    && String(values.email || '').trim().toLowerCase() === demoEmail
    && values.password === demoPassword;
}
