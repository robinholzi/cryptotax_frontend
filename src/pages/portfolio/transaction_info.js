import { Info } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

export default function TransactionInfoDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        variant="text"
        style={{ 
          // backgroundColor: blue[300],
          color: "white"
        }}
      >
        <Info />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use of the transaction management system"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {
            "TODO: Explenation"
          }
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
          {
            "Currency tags: Short tags according to CoinGecko"
          }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}