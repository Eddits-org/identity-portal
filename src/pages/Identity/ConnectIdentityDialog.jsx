import React from 'react';
import Button from '@material-ui/core/Button';
import { Alert } from '@material-ui/lab'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {useIdentity} from "../../contexts/identity.context";

export default function ConnectIdentityDialog({
  openDialog,
  closeDialog,
  open,
}) {
  const identityContext = useIdentity();
  const [address, setAddress] = React.useState('');
  const [error, setError] = React.useState(null);

  async function attemptToConnect() {
    setError(null);
    const result = await identityContext.loadIdentity(address);

    if (!result.error) {
      return closeDialog();
    }

    setError(result.error.code)
  }

  return (
    <Dialog open={open} onClose={closeDialog} aria-labelledby="connect-identity-dialog-title">
      <DialogTitle id="connect-identity-dialog-title">Connect identity</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the address or the ENS (if any) of the Identity below.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="address"
          label="Identity Address"
          type="text"
          fullWidth
          value={address}
          onChange={event => setAddress(event.target.value)}
        />

        {error === 'IDENTITY_ADDRESS_INVALID' && <Alert severity="error">The provided address is not an Identity contract. Please verify that you have selected the appropriate network with your wallet.</Alert>}
        {error === 'UNKNOWN_ERROR' && <Alert severity="error">Oups! We were not able to retrieve the Identity contract from this address.</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={attemptToConnect} color="primary">
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
}
