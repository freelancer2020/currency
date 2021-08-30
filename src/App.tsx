import { Switch, Route, BrowserRouter } from "react-router-dom";
import AllRates from "./components/allRates/AllRates";
import { useSelector } from "react-redux";
//@types
import { RootState } from "./store/store";

import Header from "./components/header/Header";
import Exchange from "./components/exchangeApp/Exchange";
import Alerting from "./components/Alerts";

import { Grow, Box } from "@material-ui/core";

function App() {
  const failed = useSelector<RootState, boolean>(
    (state) => state.exchange.failed
  );
  const look = false;
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <Box>
              <Header />
              <Exchange />
              {failed && (
                <Grow in={look} timeout={{ enter: 5000, exit: 500 }}>
                  <Box>
                    <Alerting />
                  </Box>
                </Grow>
              )}
            </Box>
          )}
        ></Route>
        <Route
          path="/rates"
          render={() => (
            <Box>
              <Header />
              <AllRates />
            </Box>
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
