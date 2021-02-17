import {Button, Container} from "@material-ui/core";

function Identity() {
  return (
    <Container>
      <h1>Identity dashboard</h1>

      <p>Connect an existing Identity or deploy your on-chain identity today!</p>

      <Button variant="contained" color="primary">Deploy a new Identity</Button>

      or

      <Button variant="contained" color="primary">Connect an existing Identity</Button>
    </Container>
  );
}

export default Identity;
