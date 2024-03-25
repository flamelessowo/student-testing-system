export enum EDITOR_TYPES {
  SINGLE_ANSWER = "oneAnswer",
  MULTIPLE_ANSWER = "manyAnswers",
  ANY_ANSWER = "anyAnswer"

}

export type OptionT = {
  text: string,
  isCorrect: boolean
}

export type QuestionT = {
  question: string,
  type: EDITOR_TYPES,
  grade: number,
  options: Array<OptionT>
}

export type EditorT = {
  name: string,
  description: string,
  questions?: Array<QuestionT>
}
