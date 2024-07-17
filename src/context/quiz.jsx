import { createContext, useReducer } from "react";

import questions from "../data/questions_complete";

const STAGES = ["Start", "Category", "Playing", "End"];

const initialState = {
  // objeto do estado inicial
  gameStage: STAGES[0],
  questions,
  currentQuestion: 0,
  score: 0,
  answerSelected: false,
  help: false,
  optionToHide: null,
};

const quizReducer = (state, action) => {
  // determina como o estado deve mudar a partir da ação. Recebe o estado atual e a ação.

  switch (action.type) {
    case "CHANGE_STATE":
      return {
        ...state, // copia todas as propriedades do estado atual
        gameStage: STAGES[1], // substitui o valor da propriedade gameStage no novo objeto pelo novo valor STAGES[1].
      };

    case "START_GAME":
      let quizQuestions = null;
      state.questions.forEach((question) => {
        if (question.category === action.payload) {
          quizQuestions = question.questions; // vetor de perguntas da respectiva categoria.
        }
      });
      return {
        ...state,
        questions: quizQuestions,
        gameStage: STAGES[2],
      };

    case "REORDER_QUESTIONS":
      const reorderedQuestions = state.questions.sort(() => {
        return Math.random() - 0.5; // embaralhando perguntas
      });
      return {
        ...state,
        questions: reorderedQuestions,
      };

    case "CHANGE-QUESTION":
      const nextQuestion = state.currentQuestion + 1;
      let endGame = false;

      if (!state.questions[nextQuestion]) endGame = true; // se a proxima pergunta não existir...

      return {
        ...state,
        currentQuestion: nextQuestion,
        gameStage: endGame ? STAGES[3] : state.gameStage,
        answerSelected: false,
        help: false,
      };

    case "RESTART":
      return initialState;

    case "CHECK_ANSWER":
      if (state.answerSelected) return state;
      const answer = action.payload.answer;
      const option = action.payload.option;

      if (answer === option)
        return {
          ...state,
          score: state.score + 1,
          answerSelected: option,
        };

    case "SHOW_TIP":
      return {
        ...state,
        help: "tip",
      };

    case "REMOVE_OPTION":
      const questionWithoutOption = state.questions[state.currentQuestion]; // objeto da pergunta atual

      let repeat = true;
      let optionToHide;

      questionWithoutOption.options.forEach((option) => {
        // para cada opção do vetor de opções da pergunta atual faça...
        if (option !== questionWithoutOption.answer && repeat) {
          optionToHide = option;
          repeat = false;
        }
      });

      return {
        ...state,
        optionToHide,
        help: true,
      };

    default:
      return state;
  }
};

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const value = useReducer(quizReducer, initialState); // retorna [state, dispatch]. estado atual e a função dispatch para enviar ações para o reducer

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
