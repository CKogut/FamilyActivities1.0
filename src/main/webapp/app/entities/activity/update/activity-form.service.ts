import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IActivity, NewActivity } from '../activity.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActivity for edit and NewActivityFormGroupInput for create.
 */
type ActivityFormGroupInput = IActivity | PartialWithRequiredKeyOf<NewActivity>;

type ActivityFormDefaults = Pick<NewActivity, 'id'>;

type ActivityFormGroupContent = {
  id: FormControl<IActivity['id'] | NewActivity['id']>;
  description: FormControl<IActivity['description']>;
  cost: FormControl<IActivity['cost']>;
  minParticipants: FormControl<IActivity['minParticipants']>;
  maxParticipants: FormControl<IActivity['maxParticipants']>;
  time: FormControl<IActivity['time']>;
  inOrOut: FormControl<IActivity['inOrOut']>;
  homeOrAway: FormControl<IActivity['homeOrAway']>;
};

export type ActivityFormGroup = FormGroup<ActivityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActivityFormService {
  createActivityFormGroup(activity: ActivityFormGroupInput = { id: null }): ActivityFormGroup {
    const activityRawValue = {
      ...this.getFormDefaults(),
      ...activity,
    };
    return new FormGroup<ActivityFormGroupContent>({
      id: new FormControl(
        { value: activityRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      description: new FormControl(activityRawValue.description),
      cost: new FormControl(activityRawValue.cost),
      minParticipants: new FormControl(activityRawValue.minParticipants),
      maxParticipants: new FormControl(activityRawValue.maxParticipants),
      time: new FormControl(activityRawValue.time),
      inOrOut: new FormControl(activityRawValue.inOrOut),
      homeOrAway: new FormControl(activityRawValue.homeOrAway),
    });
  }

  getActivity(form: ActivityFormGroup): IActivity | NewActivity {
    return form.getRawValue() as IActivity | NewActivity;
  }

  resetForm(form: ActivityFormGroup, activity: ActivityFormGroupInput): void {
    const activityRawValue = { ...this.getFormDefaults(), ...activity };
    form.reset(
      {
        ...activityRawValue,
        id: { value: activityRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ActivityFormDefaults {
    return {
      id: null,
    };
  }
}
