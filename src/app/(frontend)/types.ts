type SystemFields = 'id' | 'createdAt' | 'updatedAt'

export type CreateData<T> = Omit<T, SystemFields>

export type UpdateData<T> = Partial<Omit<T, SystemFields>>
