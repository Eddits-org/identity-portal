import {createMuiTheme} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import {BrowserRouter as Router} from "react-router-dom";
import Layout from "./pages/Layout";
import {Web3ContextProvider} from "./contexts/web3.context";

const theme = createMuiTheme({});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Web3ContextProvider>
          <Router>
            <Layout />
          </Router>
        </Web3ContextProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
