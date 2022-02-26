import { Typography } from "@mui/material";
import { Link } from "react-router-dom";


export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link to="https://nerotecs.com/" style={{ textDecoration: 'none', color: "white" }}>
        NeroTecStudios
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}