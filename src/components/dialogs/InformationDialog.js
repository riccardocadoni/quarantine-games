import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@material-ui/core";
const InformationDialog = ({ isInfoDialogOpen, setIsInfoDialogOpen }) => {
  return (
    <Dialog open={isInfoDialogOpen} aria-labelledby="form-dialog-title">
      <DialogTitle>
        Questa casella di fa andare indietro di due posizioni :(
      </DialogTitle>
      <DialogActions>
        <Button onClick={() => setIsInfoDialogOpen(false)}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};
export default InformationDialog;
