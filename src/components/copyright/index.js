import { Typography } from "@mui/material";
import { Link } from "react-router-dom";


export default function Copyright() {
  return (
    <div>
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <a href="https://nerotecs.com/" style={{ textDecoration: 'none', color: "white" }}>
          NeroTecStudios
        </a>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        {'by '}
        <a href="https://robinh.xyz/" style={{ textDecoration: 'none', color: "white" }}>
          Robin Holzinger
        </a>{' '}
      </Typography>
    </div>
  );
}