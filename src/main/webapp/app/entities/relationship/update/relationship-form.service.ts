import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRelationship, NewRelationship } from '../relationship.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRelationship for edit and NewRelationshipFormGroupInput for create.
 */
type RelationshipFormGroupInput = IRelationship | PartialWithRequiredKeyOf<NewRelationship>;

type RelationshipFormDefaults = Pick<NewRelationship, 'id' | 'liked' | 'shared'>;

type RelationshipFormGroupContent = {
  id: FormControl<IRelationship['id'] | NewRelationship['id']>;
  liked: FormControl<IRelationship['liked']>;
  shared: FormControl<IRelationship['shared']>;
  user: FormControl<IRelationship['user']>;
  description: FormControl<IRelationship['description']>;
};

export type RelationshipFormGroup = FormGroup<RelationshipFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RelationshipFormService {
  createRelationshipFormGroup(relationship: RelationshipFormGroupInput = { id: null }): RelationshipFormGroup {
    const relationshipRawValue = {
      ...this.getFormDefaults(),
      ...relationship,
    };
    return new FormGroup<RelationshipFormGroupContent>({
      id: new FormControl(
        { value: relationshipRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      liked: new FormControl(relationshipRawValue.liked),
      shared: new FormControl(relationshipRawValue.shared),
      user: new FormControl(relationshipRawValue.user),
      description: new FormControl(relationshipRawValue.description),
    });
  }

  getRelationship(form: RelationshipFormGroup): IRelationship | NewRelationship {
    return form.getRawValue() as IRelationship | NewRelationship;
  }

  resetForm(form: RelationshipFormGroup, relationship: RelationshipFormGroupInput): void {
    const relationshipRawValue = { ...this.getFormDefaults(), ...relationship };
    form.reset(
      {
        ...relationshipRawValue,
        id: { value: relationshipRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): RelationshipFormDefaults {
    return {
      id: null,
      liked: false,
      shared: false,
    };
  }
}
