import { makeStyles } from '@mui/styles';

export const useStyles_mainCard = makeStyles((theme) => ({
  menuButton: {
    // marginRight: theme.spacing(2)
  },
  button: {
    marginLeft: 12,
  },
  title: {
    flexGrow: 1
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12, // theme.spacing(2)
  },
  content: {
    marginTop: 16, // theme.spacing(2),
    padding: 20, // theme.spacing(2)
  }
}));