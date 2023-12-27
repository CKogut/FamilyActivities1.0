import { IUser } from 'app/entities/user/user.model';
import { IActivity } from 'app/entities/activity/activity.model';

export interface IRelationship {
  id: number;
  liked?: boolean | null;
  shared?: boolean | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  description?: IActivity | null;
}

export type NewRelationship = Omit<IRelationship, 'id'> & { id: null };
