import {useIdentity} from "../../../contexts/identity.context";
import {useEffect} from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";

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
              </TableRow>
            </TableHead>
            <TableBody>
              {identityContext.identity.keys.map((key) => (
                <TableRow key={key.hash}>
                  <TableCell component="th" scope="row">
                    {key.hash}
                  </TableCell>
                  <TableCell align="right">{key.purposes.map(purpose => keyPurposesLabels[purpose - 1])}</TableCell>
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
