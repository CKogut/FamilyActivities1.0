export interface IActivity {
  id: number;
  description?: string | null;
  cost?: string | null;
  minParticipants?: number | null;
  maxParticipants?: number | null;
  time?: number | null;
  inOrOut?: string | null;
  homeOrAway?: string | null;
}

export type NewActivity = Omit<IActivity, 'id'> & { id: null };
