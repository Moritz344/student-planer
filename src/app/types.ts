export interface HomeworkEntry {
  id: number,
  name: string,
  fk_subject: number,
  due_date: number,
  subject?: { id: number,name: string },
  completed: boolean
}
