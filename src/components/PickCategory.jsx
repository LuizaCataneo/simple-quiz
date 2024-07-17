import { useContext, useEffect } from "react";
import { QuizContext } from "../context/quiz";

import Category from "../img/category.svg";

import "./PickCategory.css";
const PickCategory = () => {
  const [quizState, dispatch] = useContext(QuizContext);

  const chooseCategoryAndReorderQuestions = (category) => {
    dispatch({ type: "START_GAME", payload: category });
    dispatch({ type: "REORDER_QUESTIONS" });
  };

  return (
    <div id="category">
      <h2>Escolha uma categoria</h2>
      <p>Perguntas serão referentes a uma das linguagens abaixo:</p>
      <div className="">
        {quizState.questions.map((question) => (
          <button
            onClick={() => chooseCategoryAndReorderQuestions(question.category)}
            key={question.category}
          >
            {question.category}
          </button>
        ))}
      </div>
      <img src={Category} alt="Categorias do Quiz" />
    </div>
  );
};

export default PickCategory;
