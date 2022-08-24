// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  development: true,
  production: false,
  isIonic: false,
  apiUrl: '/api',
  siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
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
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
