import React, {useEffect} from 'react';
import { Identity, utils } from "@onchain-id/identity-sdk";

import {useWeb3} from "./web3.context";

const IdentityContext = React.createContext({});

function IdentityContextProvider(props) {
  const web3 = useWeb3();

  const [identity, setIdentity] = React.useState(null);
  const [identitiesCached, setIdentitiesCached] = React.useState([]);

  useEffect(() => {
    if (window.localStorage) {
      try {
        const identitiesArrayRaw = JSON.parse(window.localStorage.getItem('identities'));
        if (!identitiesArrayRaw) {
          return;
        }

        setIdentitiesCached(identitiesArrayRaw.filter(identityCached => identityCached.address));
      } catch(error) {
        console.warn('Could not load identities from cache.', error);
      }
    }
  }, []);

  async function disconnectIdentity() {
    setIdentity(null);
  }

  async function loadIdentity(address) {
    try {
      const identityInstance = await Identity.at(address, { provider: web3.provider });

      setIdentity({
        address: identityInstance.address,
        instance: identityInstance,
      });

      if (!identitiesCached.find(identityCached => identityCached === identityInstance.address)) {
        const identitiesCachedNew = [...identitiesCached, { address: identityInstance.address }];

        if (window.localStorage) {
          window.localStorage.setItem('identities', JSON.stringify(identitiesCached));
        }

        setIdentitiesCached(identitiesCached);
      }

      return {
        error: false,
        success: true,
      };
    } catch (error) {
      if (error.name === "INVALID_ADDRESS") {
        return {
          error: {
            code: 'IDENTITY_ADDRESS_INVALID',
          },
        };
      } else {
        console.error(error);

        return {
          error: {
            code: 'UNKNOWN_ERROR',
            originalError: error,
          },
        };
      }
    }
  }

  async function removeIdentityFromCache(address) {
    const index = identitiesCached.findIndex(identityCached => identityCached.address === address);

    if (index > -1) {
      console.log(identitiesCached);
      const identitiesCachedNew = [...identitiesCached]
        identitiesCachedNew.splice(index, 1);

      console.log(identitiesCachedNew);

      if (window.localStorage) {
        window.localStorage.setItem('identities', JSON.stringify(identitiesCachedNew));
      }

      setIdentitiesCached(identitiesCachedNew);
    }
  }

  let value = {
    identity,
    identitiesCached,
    disconnectIdentity,
    loadIdentity,
    removeIdentityFromCache,
  };

  return (
    <IdentityContext.Provider value={value}>{props.children}</IdentityContext.Provider>
  );
}

const IdentityContextConsumer = IdentityContext.Consumer;

export const withIdentity = Component => props => (
  <IdentityContextConsumer>
    {value => <Component {...props} identityContext={value} />}
  </IdentityContextConsumer>
);

export default IdentityContext;

export { IdentityContextConsumer, IdentityContextProvider };

export const useIdentity = () => React.useContext(IdentityContext);
