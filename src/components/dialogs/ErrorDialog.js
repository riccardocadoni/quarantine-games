import React from "react";
import { Dialog, Button } from "@material-ui/core";
const ErrorDialog = ({ isErrorDialogOpen, setRedirect }) => {
  return (
    <Dialog open={isErrorDialogOpen}>
      <p>Non esite la partita che stai cercando, prova a digitare meglio ;)</p>
      <Button onClick={() => setRedirect(true)} color="primary">
        OK
      </Button>
    </Dialog>
  );
};
export default ErrorDialog;
