import { defineNuxtPlugin } from "#app";
import isEmpty from "../utils/isEmpty";
import isNotEmpty from "../utils/isNotEmpty";
import tBy from "../utils/tBy";
import globalHelper from "../utils/globalhelper";
import helper from "../utils/helper";
import {useHttp} from "../utils/useHttp";
import {rtydate} from "../utils/rtydate";
import {formatPhoneNumber} from "../utils/phoneNumberFornat";
// import { queryParams, decryptQuery } from "../utils/queryParams"; // Correct import
// import queryParams from "../utils/queryParams"; // Correct import
import { convertToKhmerDate } from "../utils/dataConvert";
// import { createQueryParams } from '~/utils/queryParams'


export default defineNuxtPlugin((nuxtApp) => {
// const queryParams = createQueryParams()
 // Create instance once
//  const queryParamsInstance = queryParams(); // ✅ create instance here

  nuxtApp.provide("isEmpty", isEmpty);
  nuxtApp.provide("isNotEmpty", isNotEmpty);
  nuxtApp.provide("tBy", tBy);
  nuxtApp.provide("useHttp", useHttp);
  nuxtApp.provide("rtyPhoneNumberFormat", formatPhoneNumber);
  nuxtApp.provide("rtydate", rtydate);
  // nuxtApp.provide("queryParams", queryParamsInstance);
  // nuxtApp.provide('localePath', localePath)
    // Provide queryParams only once (choose one approach)
    // nuxtApp.provide("queryParams", queryParamsInstance); // Recommended
    // nuxtApp.provide("queryParam", queryParamsInstance); 
    // Alternative if you need both names
    // nuxtApp.provide("queryParam", queryParamsInstance);

  nuxtApp.provide("helper", helper);
  // nuxtApp.provide("queryParam", queryParams);
  // nuxtApp.provide("decryptQuery", decryptQuery);
  nuxtApp.provide("globalHelper", globalHelper);
  globalThis.convertToKhmerDate = convertToKhmerDate;
  // Inject as global property
  // nuxtApp.provide('queryParams', queryParams)
  nuxtApp.vueApp.config.globalProperties.rtydate = rtydate;
  // Also inject for use with useNuxtApp()
  // return {
  //   provide: {
  //     queryParams
  //   }
  // }
});


  
  