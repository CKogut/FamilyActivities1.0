import { IActivity, NewActivity } from './activity.model';

export const sampleWithRequiredData: IActivity = {
  id: 2142,
};

export const sampleWithPartialData: IActivity = {
  id: 32641,
  description: 'growl flail',
  cost: 'across whereas vibrissae',
  minParticipants: 12651,
  maxParticipants: 1535,
  inOrOut: 'vandalise',
};

export const sampleWithFullData: IActivity = {
  id: 15485,
  description: 'until',
  cost: 'frozen',
  minParticipants: 1721,
  maxParticipants: 72,
  time: 18014,
  inOrOut: 'weakly failing opine',
  homeOrAway: 'er',
};

export const sampleWithNewData: NewActivity = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
