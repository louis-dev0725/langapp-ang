export const environment = {
  development: false,
  production: true,
  isIonic: false,
  apiUrl: '/api',
  siteKey: '',
  square: {
    env: 'sandbox',
    sandbox: {
      applicationId: 'sandbox-sq0idb-1hwdCIUEVLJIdMOtcBwPzA',
      locationId: 'LY033JNJZ5BMP',
    },
    production: {
      applicationId: 'sq0idp-yUVUXTKL0ydRWjqPHIEVqw',
      locationId: 'LPC0JQJPQTJKN',
    },
  },
  stripe: {
    env: 'test',
    test: {
      publishableKey: 'pk_test_51GYZxmCMGBLulUmlAdpyDglDbQ1T3fVSu2r25WFSO5WQRdKipbNQhi9fyjJOvizfLd4MkygVGpRo6o6hV8E2IQQw00tASHPk8S',
    },
    production: {
      publishableKey: 'pk_live_51GYZxmCMGBLulUmldBi8JgmYoYtDkC1fK0Uv0mJomjrf0VeutQS1fxUhB6sbw8aAiv2cR1zJIVymsOt9OjPusjJN00gLJLd20i',
    },
  },
};
