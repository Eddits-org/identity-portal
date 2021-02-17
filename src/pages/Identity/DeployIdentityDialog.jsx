import React from 'react';
import Button from '@material-ui/core/Button';
import { Alert } from '@material-ui/lab'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { green } from '@material-ui/core/colors';

import {useIdentity} from "../../contexts/identity.context";
import {CircularProgress, makeStyles, Step, StepLabel, Stepper} from "@material-ui/core";
import {useWeb3} from "../../contexts/web3.context";

const stepperSteps = ['PARAMETERS', 'SIGNATURE', 'DEPLOY', 'DEPLOYED'];

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function DeployIdentityDialog({
  openDialog,
  closeDialog,
  open,
}) {
  const classes = useStyles();
  const identityContext = useIdentity();
  const web3 = useWeb3();
  const [error, setError] = React.useState(null);
  const [step, setStep] = React.useState('PARAMETERS');
  const [deployAddress, setDeployAddress] = React.useState(null);

  async function deploy() {
    setError(null);
    await identityContext.deployIdentity((progress) => {
      if (progress.error) {
        setError(progress.error.code)
        setStep('PARAMETERS');
        return;
      }

      if (progress.step === 'DEPLOY') {
        setDeployAddress(progress.address);
      }

      setStep(progress.step);
    });
  }

  async function acceptDeploy() {
    return identityContext.loadIdentity(deployAddress);
  }

  return (
    <Dialog open={open} onClose={closeDialog} aria-labelledby="deploy-identity-dialog-title" disableBackdropClick disableEscapeKeyDown>
      <DialogTitle id="deploy-identity-dialog-title">Deploy identity</DialogTitle>
      <DialogContent>
        <Stepper activeStep={stepperSteps.indexOf(step)} alternativeLabel>
          <Step>
            <StepLabel>Define identity</StepLabel>
          </Step>
          <Step>
            <StepLabel>Sign deploy transaction</StepLabel>
          </Step>
          <Step>
            <StepLabel>Deploy identity</StepLabel>
          </Step>
        </Stepper>

        {step === 'PARAMETERS' &&
          <>
            <p>The identity will be deployed using the ONCHAINID standard and associated with the wallet {web3.walletAddress}.</p>
          </>
        }

        {step === 'SIGNATURE' &&
          <>
            <p>Please verify and approve the transaction using your connected wallet.</p>
          </>
        }

        {step === 'DEPLOY' &&
        <>
          <p>The transaction is in progress. The contract should be deployed at address {deployAddress}. Please wait while the network is accepting it.</p>
        </>
        }

        {step === 'DEPLOYED' &&
        <>
          <p>Your new identity was deployed at address {deployAddress}.</p>
        </>
        }

        {error === 'UNKNOWN_ERROR' && <Alert severity="error">Oups! We were not able to deploy the Identity contract.</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="secondary">
          Cancel
        </Button>
        {step === 'PARAMETERS' &&
          <Button onClick={deploy} color="primary" variant="contained">
            Deploy
          </Button>
        }
        {(step === 'SIGNATURE' || step === 'DEPLOY') &&
          <div>
            <div className={classes.wrapper}>
              <Button
                variant="contained"
                color="primary"
                disabled
              >
                Deploying
              </Button>
              <CircularProgress size={24} className={classes.buttonProgress} />
            </div>
          </div>
        }
        {step === 'DEPLOYED' &&
          <Button onClick={acceptDeploy} className={classes.buttonSuccess} color="primary" variant="contained">
            Load deployed identity
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}
