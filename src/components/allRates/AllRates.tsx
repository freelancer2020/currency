import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
//@actions
import { exchangeActions } from "../../store/exrate";
import { allRatesActions } from "../../store/allRates";
//@types
import { RootState, AppDispatch } from "../../store/store";
import Selector from "../../ReusableComponents/Selector";

import RateRow from "../rateRow/RateRow";

import { Container, makeStyles, Paper, Box, MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
  },
  paper: {
    padding: theme.spacing(2),
  },
  paperHead: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  screen: {
    marginTop: "50px",
    width: "inherit",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
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

const AllRates: React.FC = () => {
  //local state
  const [loaded, setLoaded] = useState<boolean>(false);
  const [currencies, setCurrencies] = useState<string[]>([]);

  //refs
  const selInput = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  // redux state
  const allRates = useSelector<RootState, [string]>(
    (state) => state.exchange.dataEntries
  );
  const base = useSelector<RootState, string>((state) => state.rates.base);
  const currencyBase = window.localStorage.getItem("base");
  useEffect(() => {
    let url;
    if (currencyBase) {
      if (typeof currencyBase === "string") {
        url = `https://exchange-rates.abstractapi.com/v1/live/?api_key=614854e10e114ee1b45e29a9af1dc601&base=${currencyBase}`;
      }
    } else {
      url = `https://exchange-rates.abstractapi.com/v1/live/?api_key=614854e10e114ee1b45e29a9af1dc601&base=USD`;
    }

    if (url) {
      window
        .fetch(url)
        .then((response) => {
          if (response.status === 200) {
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
          const rock = Object.entries(data["exchange_rates"]);
          const currency = Object.keys(data["exchange_rates"]);
          dispatch(exchangeActions.setEntries(rock));
          setCurrencies(currency);
        })
        .then(() => {
          setLoaded(true);
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
    }
  }, []);

  const selectHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
    event.preventDefault();
    if (typeof event.target.value === "string") {
      window.localStorage.setItem("base", event.target.value);
    }

    dispatch(allRatesActions.addBase(event.target.value));
    window
      .fetch(
        `https://exchange-rates.abstractapi.com/v1/live/?api_key=614854e10e114ee1b45e29a9af1dc601&base=${event.target.value}`
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
        const rock = Object.entries(data["exchange_rates"]);
        dispatch(exchangeActions.setEntries(rock));
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
  };

  const getRate = (str: string): string => {
    const num = parseFloat(str[1]);
    const total = 1 / Number(num);
    return `1 ${str[0]} = ${total.toFixed(2)}`;
  };

  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <Paper className={classes.paper}>
        <Box className={classes.paperHead}>
          <Selector
            width="250px"
            selRef={selInput}
            selValue={base}
            change={selectHandler}
          >
            {currencies.map((cur, index) => (
              <MenuItem value={cur} dense={true} key={index.toString()}>
                {cur}
              </MenuItem>
            ))}
          </Selector>
        </Box>
        <Box className={classes.screen}>
          {allRates.map((item, index) => (
            <RateRow
              load={loaded}
              rate={getRate(item)}
              key={index.toString()}
            />
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default AllRates;
