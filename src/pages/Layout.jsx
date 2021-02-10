import {AppBar, Button, Toolbar, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import {Link, NavLink, Route, Switch} from "react-router-dom";

import Home from "./Home";
import Identity from "./Identity/Identity";
import {useWeb3} from "../contexts/web3.context";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

function Layout() {
  const classes = useStyles();
  const web3 = useWeb3();

  async function connectWallet() {
    await web3.loadWallet();
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            EDDITS
          </Typography>
          <Button color="inherit" component={NavLink} to="/" exact activeStyle={{ color: "darkblue", fontWeight: "bold" }}>Home</Button>
          <Button color="inherit" component={NavLink} to="/identity" activeStyle={{ color: "darkblue", fontWeight: "bold" }}>Identity</Button>

          {web3.loaded ? (
            <Jazzicon diameter={30} seed={jsNumberForAddress(web3.walletAddress)} />
          ) : (
            <Button color="inherit" onClick={connectWallet}>Connect Wallet</Button>
          )}
        </Toolbar>
      </AppBar>

      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/identity">
          <Identity />
        </Route>
        <Route>
          <h1>OUPS!</h1>
          <p>That's a four-oh-four. <Link to="/">Get back to safety!</Link></p>
        </Route>
      </Switch>
    </>
  );
}

export default Layout;
