export interface HomeworkEntry {
  id: number,
  name: string,
  fk_subject: number,
  due_date: number,
  subjectData?: any,
  completed: boolean
}

export interface ExamEntry {
  fk_subject: number,
  description: string,
  daysLeft?: number,
  subjectData?: any,
  date: number
}
