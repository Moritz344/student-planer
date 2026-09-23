export interface HomeworkEntry {
  id: number,
  name: string,
  fk_subject: number,
  due_date: number,
  subjectName?: string,
  completed: boolean
}

export interface ExamEntry {
  fk_subject: number,
  description: string,
  daysLeft?: number,
  subjectName?: string,
  date: number
}
