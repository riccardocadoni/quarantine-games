import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button
} from "@material-ui/core";

const ResultDialog = ({
  questionResult,
  question,
  isResultDialogOpen,
  setQuestion,
  setIsResultDialogOpen,
  setIsErrorDialogOpen
}) => {
  let decodeAnsw = "";
  switch (questionResult) {
    case "right":
      if (question.correct_answer) {
        decodeAnsw = atob(question.correct_answer);
      }
      return (
        <Dialog
          open={isResultDialogOpen}
          onClose={() => setIsErrorDialogOpen(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">RIGHT ANSWER!</DialogTitle>
          <DialogContent>The correct answer is: {decodeAnsw}</DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setQuestion({});
                setIsResultDialogOpen(false);
              }}
              color="primary"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      );
      break;
    case "wrong":
      if (question.correct_answer) {
        decodeAnsw = atob(question.correct_answer);
      }
      return (
        <Dialog
          open={isResultDialogOpen}
          onClose={() => setIsErrorDialogOpen(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">WRONG ANSWER :(</DialogTitle>
          <DialogContent>The correct answer is: {decodeAnsw}</DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setQuestion({});
                setIsResultDialogOpen(false);
              }}
              color="primary"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      );
      break;

    default:
      return null;
      break;
  }
};
export default ResultDialog;
