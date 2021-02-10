import React from 'react';

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

    window.ethereum.autoRefreshOnNetworkChange = false;
    const accounts = await new Promise((resolve, reject) => {
      window.ethereum.sendAsync(
        { method: 'eth_requestAccounts' },
        (error, response) => {
          if (error) {
            console.error(error);
            reject(new Error('ETHEREUM_INIT_FAILED'));
          } else {
            resolve(response.result);
          }
        },
      );
    });
    const account = accounts[0];

    window.ethereum.on('accountsChanged', function (accounts) {
      setWalletAddress(accounts[0]);
      setLoaded(true);
    });

    setWalletAddress(account);
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
