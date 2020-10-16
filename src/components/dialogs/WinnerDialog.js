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
        {winner} WINS THE GAME!!!
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleCloseGame} variant="contained" color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default WinnerDialog;
