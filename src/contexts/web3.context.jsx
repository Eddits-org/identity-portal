import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from 'ethers';
import React from 'react';
import Web3Modal from "web3modal";

const Web3Context = React.createContext({ loaded: false });

function Web3ContextProvider(props) {
  const [loaded, setLoaded] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState('');

  async function loadWallet() {
    if (loaded) {
      throw new Error('WALLET_ALREADY_LOADED');
    }

    if (typeof window.ethereum === 'undefined') {
      throw new Error('ETHEREUM_NOT_INSTALLED');
    }

    const providerOptions = {
      cacheProvider: true,
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID,
        }
      }
    };

    const web3Modal = new Web3Modal({
      providerOptions,
    });

    const provider = await web3Modal.connect();

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setLoaded(true);
      } else {
        setLoaded(false);
        setWalletAddress('');
      }
    });

    // Subscribe to provider disconnection
    provider.on("disconnect", (error) => {
      setLoaded(false);
      setWalletAddress('');
    });

    const web3 = new providers.Web3Provider(provider);

    setWalletAddress(await web3.getSigner().getAddress());
    setLoaded(true);
  }

  async function unloadWallet() {
    if (!loaded) {
      throw new Error('WALLET_NOT_LOADED');
    }

    setLoaded(false);
    setWalletAddress('');

    window.ethereum.removeAllListeners('accountsChanged');
  }

  let value = {
    loaded,
    loadWallet,
    unloadWallet,
    walletAddress,
  };

  return (
    <Web3Context.Provider value={value}>{props.children}</Web3Context.Provider>
  );
}

const Web3ContextConsumer = Web3Context.Consumer;

export const withWeb3 = Component => props => (
  <Web3ContextConsumer>
    {value => <Component {...props} web3Context={value} />}
  </Web3ContextConsumer>
);

export default Web3Context;

export { Web3ContextConsumer, Web3ContextProvider };

export const useWeb3 = () => React.useContext(Web3Context);
