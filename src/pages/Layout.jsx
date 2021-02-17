import {AppBar, Avatar, Button, Menu, MenuItem, Toolbar, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useState} from "react";
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import {Link, NavLink, Route, Switch} from "react-router-dom";

import Home from "./Home";
import Identity from "./Identity/Identity";
import {useWeb3} from "../contexts/web3.context";
import About from "./About";

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

  async function disconnectWallet() {
    closeWalletMenu();
    await web3.unloadWallet();
  }

  const [walletMenuAnchorElement, setWalletMenuAnchorElement] = useState(null);

  const openWalletMenu = (event) => {
    setWalletMenuAnchorElement(event.currentTarget);
  };

  const closeWalletMenu = () => {
    setWalletMenuAnchorElement(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            EDDITS
          </Typography>
          <Button color="inherit" component={NavLink} to="/" exact activeStyle={{ color: "darkblue", fontWeight: "bold" }}>Home</Button>
          <Button color="inherit" component={NavLink} to="/identity" activeStyle={{ color: "darkblue", fontWeight: "bold" }}>Identity</Button>
          <Button color="inherit" component={NavLink} to="/about" activeStyle={{ color: "darkblue", fontWeight: "bold" }}>About</Button>

          {web3.loaded ? (
            <>
              <Avatar aria-controls="wallet-menu" aria-haspopup="true" onClick={openWalletMenu} alt={web3.walletAddress}>
                <Jazzicon diameter={30} seed={jsNumberForAddress(web3.walletAddress)} />
              </Avatar>

              <Menu
                id="wallet-menu"
                anchorEl={walletMenuAnchorElement}
                keepMounted
                open={Boolean(walletMenuAnchorElement)}
                onClose={closeWalletMenu}
              >
                <MenuItem onClick={disconnectWallet}>Disconnect wallet</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={connectWallet}>Connect Wallet</Button>
          )}
        </Toolbar>
      </AppBar>

      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/about">
          <About />
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
