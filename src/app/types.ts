export interface HomeworkEntry {
  id: number,
  name: string,
  fk_subject: number,
  due_date: number,
  subjectData?: any,
  isToday?: boolean,
  completed: boolean
}

export interface TimetableConfig {
  id: number,
  hour_length: number | null,
  start_time: string | null,
  end_time: string | null,
  break_time: number | null,
  break_step: number | null
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
