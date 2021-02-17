import React, {useEffect} from 'react';
import {
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText, Tab,
  Tabs
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import LoadIdentityIcon from '@material-ui/icons/GetApp';

import {useIdentity} from "../../contexts/identity.context";
import ConnectIdentityDialog from "./ConnectIdentityDialog";
import DeployIdentityDialog from "./DeployIdentityDialog";
import Keys from "./tabs/Keys";
import Claims from "./tabs/Claims";
import Information from "./tabs/Information";
import {useWeb3} from "../../contexts/web3.context";

function Identity() {
  const identityContext = useIdentity();
  const web3 = useWeb3();

  const [identityTab, setIdentityTab] = React.useState(0);
  const [connectIdentityDialogOpen, setConnectIdentityDialogOpen] = React.useState(false);
  const [deployIdentityDialogOpen, setDeployIdentityDialogOpen] = React.useState(false);
  const [hasManagementKey, setHasManagementKey] = React.useState(false);

  useEffect(() => {
    verifyManagementKey();
  }, [identityContext.identity.address, web3.walletAddress]);

  async function verifyManagementKey() {
    setHasManagementKey(await identityContext.keyHasPurpose(web3.walletAddress, 1));
  }

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

                {hasManagementKey ? (
                  <p>You are connected with a wallet allowed with a MANAGEMENT key.</p>
                ) : (
                  <p>You are connected with a wallet that has no MANAGEMENT key on this identity.</p>
                )}

                <Button variant="outlined" color="primary" onClick={identityContext.disconnectIdentity}>Disconnect Identity</Button>

                <Tabs value={identityTab} onChange={(event, tab) => setIdentityTab(tab)} aria-label="simple tabs example">
                  <Tab label="Keys and permissions" id="identity-tab-keys" />
                  <Tab label="Claims" id="identity-tab-claims" />
                  <Tab label="Information" id="identity-tab-information" />
                </Tabs>

                <div
                  role="tabpanel"
                  hidden={identityTab !== 0}
                  id="identity-tabpanel-keys"
                  aria-labelledby="identity-tab-keys"
                >
                  <Keys />
                </div>

                <div
                  role="tabpanel"
                  hidden={identityTab !== 1}
                  id="identity-tabpanel-claims"
                  aria-labelledby="identity-tab-claims"
                >
                  <Claims />
                </div>

                <div
                  role="tabpanel"
                  hidden={identityTab !== 2}
                  id="identity-tabpanel-information"
                  aria-labelledby="identity-tab-information"
                >
                  <Information />
                </div>
              </>
            ) :
            (
              <>
                <p>Connect an existing Identity or deploy your on-chain identity today!</p>

                <Button variant="contained" color="primary" onClick={() => setDeployIdentityDialogOpen(true)}>Deploy a new Identity</Button>
                <DeployIdentityDialog open={deployIdentityDialogOpen} openDialog={() => setDeployIdentityDialogOpen(true)} closeDialog={() => setDeployIdentityDialogOpen(false)} />

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
