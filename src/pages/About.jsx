import {Container, Link} from "@material-ui/core";

function About() {
  return (
    <Container>
      <h1>About EDDITS</h1>

      <h2>Licenses</h2>
      <ul>
        <li><Link href="https://github.com/onchain-id/solidity/blob/master/LICENSE.md" target="_blank">ONCHAINID</Link></li>
      </ul>
      <p>Please refer to the <Link href="https://github.com/Eddits-org/identity-portal/blob/master/package.json" target="_blank">source code</Link> for the complete list of packages used.</p>
    </Container>
  );
}

export default About;
