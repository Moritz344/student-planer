export interface HomeworkEntry {
  id: number,
  name: string,
  fk_subject: number,
  due_date: number,
  subject?: { id: number,name: string },
  completed: boolean
}

export interface ExamEntry {
  fk_subject: number,
  description: string,
  date: number
}
