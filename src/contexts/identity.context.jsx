import React from 'react';

const IdentityContext = React.createContext({});

function IdentityContextProvider(props) {
  const [identity, setIdentity] = React.useState(null);

  let value = {
    identity,
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
