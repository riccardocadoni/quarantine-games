import React from "react";
import { Dialog, DialogTitle } from "@material-ui/core";
const LoadingDialog = ({ loading }) => {
  return (
    <Dialog open={loading} aria-labelledby="form-dialog-title">
      <DialogTitle>Attendi..stiamo cercando una domanda per te :)</DialogTitle>
    </Dialog>
  );
};
export default LoadingDialog;
