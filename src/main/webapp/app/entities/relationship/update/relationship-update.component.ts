import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IActivity } from 'app/entities/activity/activity.model';
import { ActivityService } from 'app/entities/activity/service/activity.service';
import { RelationshipService } from '../service/relationship.service';
import { IRelationship } from '../relationship.model';
import { RelationshipFormService, RelationshipFormGroup } from './relationship-form.service';

@Component({
  standalone: true,
  selector: 'jhi-relationship-update',
  templateUrl: './relationship-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class RelationshipUpdateComponent implements OnInit {
  isSaving = false;
  relationship: IRelationship | null = null;

  usersSharedCollection: IUser[] = [];
  activitiesSharedCollection: IActivity[] = [];

  editForm: RelationshipFormGroup = this.relationshipFormService.createRelationshipFormGroup();

  constructor(
    protected relationshipService: RelationshipService,
    protected relationshipFormService: RelationshipFormService,
    protected userService: UserService,
    protected activityService: ActivityService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareActivity = (o1: IActivity | null, o2: IActivity | null): boolean => this.activityService.compareActivity(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ relationship }) => {
      this.relationship = relationship;
      if (relationship) {
        this.updateForm(relationship);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const relationship = this.relationshipFormService.getRelationship(this.editForm);
    if (relationship.id !== null) {
      this.subscribeToSaveResponse(this.relationshipService.update(relationship));
    } else {
      this.subscribeToSaveResponse(this.relationshipService.create(relationship));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRelationship>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(relationship: IRelationship): void {
    this.relationship = relationship;
    this.relationshipFormService.resetForm(this.editForm, relationship);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, relationship.user);
    this.activitiesSharedCollection = this.activityService.addActivityToCollectionIfMissing<IActivity>(
      this.activitiesSharedCollection,
      relationship.description,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.relationship?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.activityService
      .query()
      .pipe(map((res: HttpResponse<IActivity[]>) => res.body ?? []))
      .pipe(
        map((activities: IActivity[]) =>
          this.activityService.addActivityToCollectionIfMissing<IActivity>(activities, this.relationship?.description),
        ),
      )
      .subscribe((activities: IActivity[]) => (this.activitiesSharedCollection = activities));
  }
}
