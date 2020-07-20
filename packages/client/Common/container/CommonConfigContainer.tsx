import { createContainer } from 'unstated-next';
import { defaultCommonConfig } from 'client/util';
import { ReactNode, useCallback, useState } from 'react';
import useWebStorage from 'client/useWebStorage';
import type { CommonConfig } from 'client/Common/config';

const configCookieName = 'commonConfig';

const useCommonConfig = (initialConfig: CommonConfig = defaultCommonConfig) => {
  const [config, setConfig] = useState(initialConfig);
  const storage = useWebStorage();
  const setCommonConfigKey = useCallback(
    <K extends keyof CommonConfig>(key: K, value: CommonConfig[K]) => {
      const newConfig = {
        ...config,
        [key]: value,
      };

      storage.set(configCookieName, newConfig);
      setConfig(newConfig);
    },
    [config, storage]
  );

  return {
    config,
    setCommonConfigKey,
  };
};

const CommonConfigContainer = createContainer(useCommonConfig);

export default CommonConfigContainer;

interface Props {
  children: ReactNode;
}

export const CommonConfigProvider = ({ children }: Props) => {
  const storage = useWebStorage();

  const savedAbfahrtenConfig = storage.get('config');
  const savedCommonConfig = storage.get(configCookieName);

  const savedConfig = {
    ...defaultCommonConfig,
    ...savedAbfahrtenConfig,
    ...savedCommonConfig,
    ...global.configOverride.common,
  };

  return (
    <CommonConfigContainer.Provider initialState={savedConfig}>
      {children}
    </CommonConfigContainer.Provider>
  );
};
