import React from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@material-ui/core";
const WinnerDialog = ({
  isWinnerDialogOpen,
  winner,
  handleCloseGame,
  setIsErrorDialogOpen
}) => {
  return (
    <Dialog
      open={isWinnerDialogOpen}
      onClose={() => setIsErrorDialogOpen(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        HA VINTO LA PARTITA {winner}!!!
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleCloseGame} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default WinnerDialog;
