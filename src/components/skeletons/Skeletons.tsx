import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "350px",
    height: "250px",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
  row: {
    width: "100%",
    height: "fit-content",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    borderRadius: "5px",
  },
  footer: {
    width: "100%",
    height: "fit-content",
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  },
  skel: {
    borderRadius: "5px",
  },
}));

const Skeletons: React.FC = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.row}>
        <Skeleton
          className={classes.skel}
          variant="rect"
          height={40}
          width={100}
        />
        <Skeleton variant="rect" height={40} width={220} />
      </Box>
      <Box className={classes.row}>
        <Skeleton
          className={classes.skel}
          variant="rect"
          height={40}
          width={100}
        />
        <Skeleton
          className={classes.skel}
          variant="rect"
          height={40}
          width={220}
        />
      </Box>
      <Box className={classes.footer}>
        <Skeleton
          className={classes.skel}
          variant="rect"
          height={40}
          width={350}
        />
      </Box>
    </Box>
  );
};

export default Skeletons;
