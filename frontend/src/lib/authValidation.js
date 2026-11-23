const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  return emailPattern.test(String(email || '').trim());
}

export function validateAuthForm(formType, values) {
  const errors = {};
  if (formType === 'sign-up' && !values.name?.trim()) errors.name = 'Enter your name.';
  if (!validateEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (formType === 'sign-in' && !values.password) errors.password = 'Enter your password.';
  if (formType === 'sign-up') {
    if ((values.password || '').length < 15) errors.password = 'Use at least 15 characters.';
    else if (values.password.length > 128) errors.password = 'Use no more than 128 characters.';
    if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match.';
  }
  return errors;
}
