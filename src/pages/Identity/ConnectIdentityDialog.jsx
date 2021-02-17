import React from 'react';
import Button from '@material-ui/core/Button';
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

  async function attemptToConnect() {
    return closeDialog();
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
          onChange={target => setAddress(target.value)}
        />
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
