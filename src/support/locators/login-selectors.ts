/**
 * EPP Login Selectors
 */
export const eppLoginSelectors = {
  // Login page selectors
  loginButton: '[data-test="login-button"]',
  usernameField: '[data-test="username-input"]',
  passwordField: '[data-test="password-input"]',
  nextButton: '[data-test="next-button"]',
  continueButton: '[data-test="continue-button"]',

  // Dashboard selectors
  dashboard: '[data-test="dashboard"]',
  dashboardContainer: '[data-test="dashboard-container"]',

  // Header/Navigation selectors
  userMenu: '[data-test="user-menu"]',
  headerUsername: '[data-test="header-username"]',
  settingsLink: '[data-test="settings-link"]',
  logoutButton: '[data-test="logout-button"]',

  // Common selectors
  loadingSpinner: '[data-test="loading-spinner"]',
  errorMessage: '[data-test="error-message"]'
};

export default eppLoginSelectors;