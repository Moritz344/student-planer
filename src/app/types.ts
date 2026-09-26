export interface HomeworkEntry {
  id: number,
  name: string,
  fk_subject: number,
  due_date: number,
  subjectData?: any,
  completed: boolean
}

export interface SubjectEntry {
  id: number,
  color: string,
  name: string
}

export interface GradeEntry {
  id: number,
  fk_subject: number,
  grade: number
}

export interface ExamEntry {
  id: number,
  fk_subject: number,
  description: string,
  daysLeft?: number,
  subjectData?: any,
  date: number | null
}
