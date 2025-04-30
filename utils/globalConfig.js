export const globalConfig = () => {
    return {
      apiUrlBase: useRuntimeConfig().public.apiUrlBase,
    };
  };
  