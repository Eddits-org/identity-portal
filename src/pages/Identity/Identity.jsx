import React from 'react';
import {Button, Container} from "@material-ui/core";
import {useIdentity} from "../../contexts/identity.context";
import ConnectIdentityDialog from "./ConnectIdentityDialog";

function Identity() {
  const identityContext = useIdentity();

  const [connectIdentityDialogOpen, setConnectIdentityDialogOpen] = React.useState(false);

  return (
    <>
      <Container>
        <h1>Identity dashboard</h1>
        {
          identityContext.identity ?
            (
              <>
                <h2>Identity information</h2>

                <p>{identityContext.identity.address}</p>
              </>
            ) :
            (
              <>
                <p>Connect an existing Identity or deploy your on-chain identity today!</p>

                <Button variant="contained" color="primary">Deploy a new Identity</Button>

                or

                <Button variant="contained" color="primary" onClick={() => setConnectIdentityDialogOpen(true)}>Connect an existing Identity</Button>
                <ConnectIdentityDialog open={connectIdentityDialogOpen} openDialog={() => setConnectIdentityDialogOpen(true)} closeDialog={() => setConnectIdentityDialogOpen(false)} />

                <hr />

                <h2>Identities registered</h2>
              </>
            )
        }
      </Container>
    </>
  );
}

export default Identity;
