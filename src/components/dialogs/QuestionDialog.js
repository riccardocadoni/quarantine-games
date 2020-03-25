import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent
} from "@material-ui/core";

const QuestionDialog = ({
  question,
  positions,
  boardArr,
  rightAnswer,
  wrongAnswer,
  isQuestionDialogOpen,
  nickName,
  answers
}) => {
  let myPos = positions[nickName];
  let colorNum = boardArr[myPos];
  let color;
  switch (colorNum) {
    case 0:
      color = "yellow";
      break;
    case 1:
      color = "blue";
      break;
    case 2:
      color = "brown";
      break;
    case 3:
      color = "pink";
      break;
    case 4:
      color = "green";
      break;
    case 5:
      color = "orange";
      break;
    case 6:
      color = "grey";
      break;
    default:
      break;
  }
  if (question && question.incorrect_answers) {
    let incorrAnsw = ["daelim", ...question.incorrect_answers];
    return (
      <Dialog open={isQuestionDialogOpen} aria-labelledby="form-dialog-title">
        <DialogTitle
          style={{ background: [color], fontWeight: "bold" }}
          id="form-dialog-title"
        >
          <p style={{ color: "white" }}>{atob(question.category)}</p>
        </DialogTitle>
        <DialogContent>{atob(question.question)}</DialogContent>
        <DialogActions>
          {answers.map((answ, i) => {
            if (answ === 1) {
              return (
                <Button onClick={rightAnswer} color="primary" key={i}>
                  {atob(question.correct_answer)}
                </Button>
              );
            } else {
              incorrAnsw.splice(0, 1);
              return (
                <Button onClick={wrongAnswer} color="primary" key={i}>
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
export default QuestionDialog;
