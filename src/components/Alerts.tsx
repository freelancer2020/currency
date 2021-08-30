import React from "react";
import { useSelector } from "react-redux";
//@types
import { RootState } from "../store/store";
import ReactDOM from "react-dom";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "fit-content",
    height: "fit-content",
    padding: theme.spacing(1),
    position: "absolute",
    left: "0",
    right: "0",
    top: "0",
    margin: "auto",
    marginTop: "105px",
  },
}));

const UserAlert: React.FC = () => {
  const errorMsg = useSelector<RootState, string>(
    (state) => state.exchange.error
  );
  const classes = useStyles();
  return (
    <Alert className={classes.root} severity="error" children={errorMsg} />
  );
};

const Alerting: React.FC = () => {
  const root = document.getElementById("alert") as HTMLDivElement;
  return ReactDOM.createPortal(<UserAlert />, root);
};

export default Alerting;
