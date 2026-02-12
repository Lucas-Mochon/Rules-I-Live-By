import { UpdateUser } from './updateUser';

export type UpdateUserPayload = Partial<Omit<UpdateUser, 'id'>>;
