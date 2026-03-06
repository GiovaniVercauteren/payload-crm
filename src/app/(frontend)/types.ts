type SystemFields = 'id' | 'createdAt' | 'updatedAt' | 'totalPrice' | 'invoice' | 'totalAmount'

export type CreateData<T> = Omit<T, SystemFields>

export type UpdateData<T> = Partial<Omit<T, SystemFields>>
