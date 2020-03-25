import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent
} from "@material-ui/core";

const ObservQuestionDialog = ({
  obQuestion,
  gameState,
  answers,
  isObservQuestionDialogOpen
}) => {
  if (obQuestion.incorrect_answers) {
    let incorrAnsw = ["daelim", ...obQuestion.incorrect_answers];
    let playerAnswering = gameState.slice(0, -1);
    return (
      <Dialog
        open={isObservQuestionDialogOpen}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{playerAnswering}</DialogTitle>
        <DialogContent>{atob(obQuestion.category)}</DialogContent>
        <DialogContent>{atob(obQuestion.question)}</DialogContent>
        <DialogActions>
          {answers.map((answ, i) => {
            if (answ === 1) {
              return (
                <Button color="primary" key={i}>
                  {atob(obQuestion.correct_answer)}
                </Button>
              );
            } else {
              incorrAnsw.splice(0, 1);
              return (
                <Button color="primary" key={i}>
                  {atob(incorrAnsw[0])}
                </Button>
              );
            }
          })}
        </DialogActions>
      </Dialog>
    );
  } else return null;
};
export default ObservQuestionDialog;
