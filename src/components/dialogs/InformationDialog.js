import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@material-ui/core";
const InformationDialog = ({ isInfoDialogOpen, setIsInfoDialogOpen }) => {
  return (
    <Dialog open={isInfoDialogOpen} aria-labelledby="form-dialog-title">
      <DialogTitle>
        Go back of two boxes!
      </DialogTitle>
      <DialogActions>
        <Button onClick={() => setIsInfoDialogOpen(false)}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};
export default InformationDialog;
