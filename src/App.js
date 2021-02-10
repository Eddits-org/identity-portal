import {AppBar, Button, Toolbar, Typography, createMuiTheme} from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import {BrowserRouter as Router, Link, NavLink, Route, Switch} from "react-router-dom";

import Home from "./pages/Home";
import Identity from "./pages/Identity/Identity";

const theme = createMuiTheme({});

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                EDDITS
              </Typography>
              <Button color="inherit" component={NavLink} to="/" exact activeStyle={{ color: "darkblue", fontWeight: "bold" }}>Home</Button>
              <Button color="inherit" component={NavLink} to="/identity" activeStyle={{ color: "darkblue", fontWeight: "bold" }}>Identity</Button>
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
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
