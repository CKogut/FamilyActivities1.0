import { IRelationship, NewRelationship } from './relationship.model';

export const sampleWithRequiredData: IRelationship = {
  id: 10883,
};

export const sampleWithPartialData: IRelationship = {
  id: 28464,
};

export const sampleWithFullData: IRelationship = {
  id: 10956,
  liked: true,
  shared: false,
};

export const sampleWithNewData: NewRelationship = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
