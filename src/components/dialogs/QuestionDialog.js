import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent
} from "@material-ui/core";
import { getBoardCard } from "../../utils";

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
  let color = getBoardCard(colorNum);
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
