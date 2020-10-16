import React from "react";
import { Dialog, DialogTitle } from "@material-ui/core";
const LoadingDialog = ({ loading }) => {
  return (
    <Dialog open={loading} aria-labelledby="form-dialog-title">
      <DialogTitle>Wait..we are looking for a question for you :)</DialogTitle>
    </Dialog>
  );
};
export default LoadingDialog;
