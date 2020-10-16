import React from "react";
import { Dialog, Button } from "@material-ui/core";
const ErrorDialog = ({ isErrorDialogOpen, setRedirect }) => {
  return (
    <Dialog open={isErrorDialogOpen}>
      <p>This game does not exists :(</p>
      <Button onClick={() => setRedirect(true)} color="primary">
        OK
      </Button>
    </Dialog>
  );
};
export default ErrorDialog;
