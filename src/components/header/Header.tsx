import React from "react";
import { Link } from "react-router-dom";
import { Box, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  header: {
    width: "100vw",
    height: "100px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#333231",
  },
  typo: {
    fontFamily: "Aclonica",
    color: "#fff",
    userSelect: "none",
    cursor: "pointer",
    paddingLeft: theme.spacing(8),
  },
}));

const Header: React.FC = () => {
  const classes = useStyles();
  return (
    <Box className={classes.header}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Typography
          className={classes.typo}
          variant="h4"
          children="exchangerates"
        />
      </Link>
    </Box>
  );
};

export default Header;
