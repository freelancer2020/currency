import React from "react";
import { Skeleton } from "@material-ui/lab";

import { makeStyles, Paper, Typography, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: "flex",
    width: "fit-content",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "15px",
    margin: "5px",
  },
  skel: {
    margin: "10px",
    borderRadius: "5px",
  },
}));

type RateProps = {
  rate: string;
  load: boolean;
};

const RateRow: React.FC<RateProps> = (props) => {
  const classes = useStyles();
  return (
    <Box>
      {props.load ? (
        <Paper
          variant="outlined"
          className={classes.root}
          children={props.rate}
        />
      ) : (
        <Skeleton
          variant="rect"
          width={200}
          height={50}
          className={classes.skel}
        />
      )}
    </Box>
  );
};

export default RateRow;
