import {useIdentity} from "../../../contexts/identity.context";
import {useEffect} from "react";
import {IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import RemoveIcon from "@material-ui/icons/Remove";

const keyPurposesLabels = ['MANAGEMENT', 'CLAIM', 'ACTION'];

export default function Keys() {
  const identityContext = useIdentity();

  useEffect(() => {
    if (identityContext.identity) {
      loadKeys();
    }
  }, [identityContext.identity.address]);

  async function loadKeys() {
    await identityContext.getIdentityKeys();
  }

  return (
    <>
      <h3>Keys</h3>

      {identityContext.identity.keys ? (
        <TableContainer component={Paper}>
          <Table aria-label="identity keys">
            <TableHead>
              <TableRow>
                <TableCell>Key hash</TableCell>
                <TableCell align="right">Purposes</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {identityContext.identity.keys.map((key) => (
                <TableRow key={key.hash}>
                  <TableCell component="th" scope="row">
                    {key.hash}
                  </TableCell>
                  <TableCell align="right">{key.purposes.map(purpose => keyPurposesLabels[purpose - 1])}</TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="remove key" title="remove key" disabled={!identityContext.loadedWalletHasManagementKey}>
                        <RemoveIcon/>
                      </IconButton>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
}
