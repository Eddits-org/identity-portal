import React, {useEffect} from 'react';
import { Identity, utils } from "@onchain-id/identity-sdk";
import ONCHAINID from "@onchain-id/solidity";
import { ethers } from "ethers";

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

      if (!identitiesCached.find(identityCached => identityCached.address === identityInstance.address)) {
        const identitiesCachedNew = [...identitiesCached, { address: identityInstance.address }];

        if (window.localStorage) {
          window.localStorage.setItem('identities', JSON.stringify(identitiesCachedNew));
        }

        setIdentitiesCached(identitiesCachedNew);
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

  async function deployIdentity(onProgress) {
    try {
      const signer = web3.provider.getSigner();
      const identityFactory = new ethers.ContractFactory(
        ONCHAINID.contracts.Identity.abi,
        ONCHAINID.contracts.Identity.bytecode,
        signer,
      );

      onProgress({
        step: 'SIGNATURE',
      });

      const identityContract = await identityFactory.deploy(
        await signer.getAddress(),
        false,
      );

      onProgress({
        step: 'DEPLOY',
        address: identityContract.address,
      });

      await identityContract.deployed();

      onProgress({
        step: 'DEPLOYED',
      });
    } catch(error) {
      console.error('Could not deploy identity.', error);

      onProgress({
        error: {
          code: 'UNKNOWN_ERROR',
          originalError: error,
        },
      });
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

  async function getIdentityKeys(purposes = [1, 2, 3]) {
    const identityInstance = await Identity.at(identity.address, { provider: web3.provider });

    const keys = [].concat.apply([], await Promise.all(purposes.map(purpose => identityInstance.getKeysByPurpose(purpose)))).map(key => ({
      hash: key.key,
      purposes: key.purposes,
    }));

    setIdentity({
      ...identity,
      keys,
    });

    return keys;
  }

  async function keyHasPurpose(key, purpose) {
    return identity.instance.keyHasPurpose(
      utils.encodeAndHash(['address'], [key]),
      1,
      { provider: web3.provider },
      );
  }

  let value = {
    identity,
    identitiesCached,
    deployIdentity,
    disconnectIdentity,
    keyHasPurpose,
    loadIdentity,
    getIdentityKeys,
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
