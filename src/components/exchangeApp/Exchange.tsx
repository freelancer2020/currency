import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Skeletons from "../skeletons/Skeletons";
import { useSelector, useDispatch } from "react-redux";

import Selector from "../../ReusableComponents/Selector";

//Actions
import { exchangeActions } from "../../store/exrate";
import { allRatesActions } from "../../store/allRates";
//@Types
import { RootState, AppDispatch } from "../../store/store";
import {
  Grid,
  Typography,
  Button,
  makeStyles,
  Grow,
  Box,
  MenuItem,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(8),
  },
  container: {
    padding: theme.spacing(2),
  },
  paper: {
    width: "100%",
    height: "fit-content",
  },
  conv: {
    marginTop: "50px",
  },
  btn: {
    width: "100%",
    color: "#fff",
    fontWeight: "bold",
    textTransform: "none",
    backgroundColor: "royalblue",
    "&:hover": {
      backgroundColor: "royalblue",
    },
  },
  typo: {
    overflowX: "auto",
  },
}));

export interface ExchangeData {
  [index: string]: number;
}

export interface Data {
  base: string;
  last_updated: number;
  exchange_rates: ExchangeData;
}

const Exchange: React.FC = () => {
  //Refs
  const baseVal = useRef<HTMLInputElement>(null);
  const toCurrencyVal = useRef<HTMLInputElement>(null);
  const rateVal = useRef<HTMLInputElement>(null);
  // local state
  const [total, setTotal] = useState<string>("");
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<Data>();
  // redux state
  const base = useSelector<RootState, string>((state) => state.exchange.base);
  const toCurrency = useSelector<RootState, string>(
    (state) => state.exchange.toCurrency
  );
  const rate = useSelector<RootState, string>((state) => state.exchange.rate);

  // redux dispatch
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    window
      .fetch(
        "https://exchange-rates.abstractapi.com/v1/live/?api_key=614854e10e114ee1b45e29a9af1dc601&base=SEK"
      )
      .then((response) => {
        if (response.status === 200) {
          setLoaded(true);
          return response.json();
        } else if (response.status === 422) {
          throw new Error("quota_reached");
        } else if (response.status === 429) {
          throw new Error("Failed");
        } else {
          throw new Error("unknown error");
        }
      })
      .then((data) => {
        dispatch(exchangeActions.apiSuccess());
        setExchangeRate(data);
        const currencies = Object.keys(data["exchange_rates"]);
        const dataEnteries = Object.entries(data["exchange_rates"]);
        dispatch(exchangeActions.setEntries(dataEnteries));
        setCurrencies(currencies);
      })
      .catch((err) => {
        if (err.message === "quota_reached") {
          dispatch(exchangeActions.setErrorMessage("quota_reached"));
        } else if (err.message === "failed") {
          dispatch(exchangeActions.setErrorMessage("failed"));
        } else {
          dispatch(exchangeActions.setErrorMessage("unknown error"));
        }
      });

    return () => {
      dispatch(exchangeActions.setRate(0));
    };
  }, []);

  const baseHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
    event.preventDefault();
    dispatch(exchangeActions.setBase(event.target.value));
    dispatch(allRatesActions.addBase(event.target.value));
    if (typeof event.target.value === "string") {
      window.localStorage.setItem("base", event.target.value);
      calculateRate();
    }
  };

  const toCurrencyHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
    event.preventDefault();
    dispatch(exchangeActions.setToCurrency(event.target.value));
    calculateRate();
  };

  const rateHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
    event.preventDefault();
    dispatch(exchangeActions.setRate(event.target.value));
    setTimeout(() => {
      calculateRate();
    }, 1000);
  };

  const calculateRate = () => {
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(baseVal.current?.value);
      }, 0);
    }).then((uq) => {
      if (uq === toCurrencyVal.current?.value) {
        dispatch(exchangeActions.setErrorMessage("same value"));
        return false;
      }
      window
        .fetch(
          `https://exchange-rates.abstractapi.com/v1/live/?api_key=614854e10e114ee1b45e29a9af1dc601&base=${uq}`
        )
        .then((response) => {
          if (response.status === 200) {
            setLoaded(true);
            return response.json();
          } else if (response.status === 422) {
            throw new Error("quota_reached");
          } else if (response.status === 429) {
            throw new Error("Too many requests");
          } else {
            throw new Error("unknown error");
          }
        })
        .then((data) => {
          dispatch(exchangeActions.apiSuccess());
          const dataEntries = Object.entries(data["exchange_rates"]);
          const targ = dataEntries.filter(
            (cur) => cur[0] === toCurrencyVal.current?.value
          );
          const cal = targ[0][1];
          const rateNum = Number(rateVal.current?.value);
          if (typeof cal === "number") {
            if (rateVal.current) {
              const total = cal * rateNum;
              setTotal(total.toFixed(1));
            }
          }
        })
        .catch((err) => {
          if (err.message === "quota_reached") {
            dispatch(exchangeActions.setErrorMessage("quota_reached"));
          } else if (err.message === "Too many requests") {
            dispatch(exchangeActions.setErrorMessage("Too many requests"));
          } else {
            dispatch(exchangeActions.setErrorMessage("unknown error"));
          }
        });
    });
  };

  const classes = useStyles();

  return (
    <Box style={{ position: "relative" }}>
      <Grow
        in={!loaded}
        timeout={{ enter: 500, exit: 100 }}
        style={{ position: "absolute", width: "100%" }}
      >
        <Box>
          <Skeletons />
        </Box>
      </Grow>
      <Grow
        in={loaded}
        timeout={{ enter: 500, exit: 100 }}
        style={{ position: "absolute", width: "100%" }}
      >
        <Box>
          <Grid item container lg className={classes.root} direction="column">
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              item
              xs={9}
              sm={4}
              md={3}
              xl={3}
            >
              <Grid item xs={3} sm={3} md={3} xl={3}>
                <TextField
                  inputRef={rateVal}
                  onChange={rateHandler}
                  id="standard-basic"
                  placeholder="1"
                  value={rate}
                />
              </Grid>
              <Grid item xs={8} sm={8} md={8} xl={8}>
                {/* Base */}
                <Selector
                  width="100%"
                  selRef={baseVal}
                  selValue={base}
                  change={baseHandler}
                >
                  {currencies.map((cur, index) => (
                    <MenuItem value={cur} dense={true} key={index.toString()}>
                      {cur}
                    </MenuItem>
                  ))}
                </Selector>
              </Grid>
            </Grid>
            <Grid
              item
              className={classes.conv}
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              xs={9}
              sm={4}
              md={3}
              xl={3}
            >
              {/* Rate */}
              <Grid item xs={3} sm={3} md={3} xl={3}>
                <Typography
                  className={classes.typo}
                  variant="h6"
                  children={total}
                />
              </Grid>
              <Grid item xs={8} sm={8} md={8} xl={8}>
                {/* to currency */}
                <Selector
                  width="100%"
                  selRef={toCurrencyVal}
                  selValue={toCurrency}
                  change={toCurrencyHandler}
                >
                  {currencies.map((cur, index) => (
                    <MenuItem value={cur} dense={true} key={index.toString()}>
                      {cur}
                    </MenuItem>
                  ))}
                </Selector>
              </Grid>
            </Grid>
            <Grid
              item
              className={classes.conv}
              container
              xs={9}
              sm={4}
              md={3}
              xl={3}
            >
              <Link
                to="/rates"
                style={{ width: "100%", textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  children="All currency rates"
                  className={classes.btn}
                />
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grow>
    </Box>
  );
};

export default Exchange;
