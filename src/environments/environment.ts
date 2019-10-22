// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  stripeKey: 'pk_test_HlTVMj8XsPyfPqiHbeNb0WGE',
  oneSignalKey : '3f7e0844-0d52-45d9-93d4-f7da4c45f7be',
 //baseUrl: 'https://192.168.1.100/api/',
  baseUrl: 'https://rest.preprod.kpeiz.digital/api/',
//baseUr: 'https://192.168.1.100/api/',
 xcoreUrl: 'https://xcore.test/'
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
