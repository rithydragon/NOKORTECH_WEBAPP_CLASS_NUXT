import CryptoJS from "crypto-js";
import { useRoute, useRouter, useRuntimeConfig, navigateTo } from "#imports";

export default function useQueryParams() {
  const route = useRoute();
  const router = useRouter();
  const runtimeConfig = useRuntimeConfig();

  const secretKey = runtimeConfig.public.encryptionSecret || "fallback-secret-key";

  const encrypt = (data) => {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  };

  const decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const queryParams = (options, data) => {
    if (!options) {
      try {
        if (!route.query._e) return { data: null };
        const decrypted = decrypt(route.query._e);
        return { data: JSON.parse(decrypted) };
      } catch (error) {
        console.log("Query decryption failed:", error);
        return { data: null };
      }
    }

    const path = typeof options === "string" ? options : options.path;
    const payload = typeof options === "string" ? data : options.data;

    const encrypted = encrypt(JSON.stringify(payload || {}));

    return navigateTo({
      path,
      query: { _e: encrypted },
    });
  };

  queryParams.withData = (path, data) => queryParams(path, data);
  queryParams.withOptions = (options) => queryParams(options);

  return queryParams;
}
