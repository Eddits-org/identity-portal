import React from 'react';
import {Button, Container, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import LoadIdentityIcon from '@material-ui/icons/GetApp';

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

                <Button variant="outlined" color="danger" onClick={identityContext.disconnectIdentity}>Disconnect Identity</Button>
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

                <List aria-label="identities in cache">
                  {identityContext.identitiesCached.map(identityCached =>
                    <ListItem key={identityCached.address}>
                      <ListItemText primary={identityCached.address} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="load identity" onClick={() => identityContext.loadIdentity(identityCached.address)}>
                          <LoadIdentityIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="remove identity from cache" onClick={() => identityContext.removeIdentityFromCache(identityCached.address)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )}
                </List>
              </>
            )
        }
      </Container>
    </>
  );
}

export default Identity;
