import apis from '../helpers/api';
import str from '../helpers/str';
import config from '../helpers/config';

export default () => {
  const gHelper = globalHelper();

  return {
    str: { ...gHelper.str, ...str },
    config: { ...gHelper.config, ...config },
    api: { ...gHelper.api, ...apis }, 
  };
};
