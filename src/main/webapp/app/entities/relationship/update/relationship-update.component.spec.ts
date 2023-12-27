import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IActivity } from 'app/entities/activity/activity.model';
import { ActivityService } from 'app/entities/activity/service/activity.service';
import { IRelationship } from '../relationship.model';
import { RelationshipService } from '../service/relationship.service';
import { RelationshipFormService } from './relationship-form.service';

import { RelationshipUpdateComponent } from './relationship-update.component';

describe('Relationship Management Update Component', () => {
  let comp: RelationshipUpdateComponent;
  let fixture: ComponentFixture<RelationshipUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let relationshipFormService: RelationshipFormService;
  let relationshipService: RelationshipService;
  let userService: UserService;
  let activityService: ActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), RelationshipUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(RelationshipUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RelationshipUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    relationshipFormService = TestBed.inject(RelationshipFormService);
    relationshipService = TestBed.inject(RelationshipService);
    userService = TestBed.inject(UserService);
    activityService = TestBed.inject(ActivityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const relationship: IRelationship = { id: 456 };
      const user: IUser = { id: 7072 };
      relationship.user = user;

      const userCollection: IUser[] = [{ id: 19926 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ relationship });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Activity query and add missing value', () => {
      const relationship: IRelationship = { id: 456 };
      const description: IActivity = { id: 29163 };
      relationship.description = description;

      const activityCollection: IActivity[] = [{ id: 17935 }];
      jest.spyOn(activityService, 'query').mockReturnValue(of(new HttpResponse({ body: activityCollection })));
      const additionalActivities = [description];
      const expectedCollection: IActivity[] = [...additionalActivities, ...activityCollection];
      jest.spyOn(activityService, 'addActivityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ relationship });
      comp.ngOnInit();

      expect(activityService.query).toHaveBeenCalled();
      expect(activityService.addActivityToCollectionIfMissing).toHaveBeenCalledWith(
        activityCollection,
        ...additionalActivities.map(expect.objectContaining),
      );
      expect(comp.activitiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const relationship: IRelationship = { id: 456 };
      const user: IUser = { id: 11639 };
      relationship.user = user;
      const description: IActivity = { id: 1702 };
      relationship.description = description;

      activatedRoute.data = of({ relationship });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.activitiesSharedCollection).toContain(description);
      expect(comp.relationship).toEqual(relationship);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRelationship>>();
      const relationship = { id: 123 };
      jest.spyOn(relationshipFormService, 'getRelationship').mockReturnValue(relationship);
      jest.spyOn(relationshipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ relationship });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: relationship }));
      saveSubject.complete();

      // THEN
      expect(relationshipFormService.getRelationship).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(relationshipService.update).toHaveBeenCalledWith(expect.objectContaining(relationship));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRelationship>>();
      const relationship = { id: 123 };
      jest.spyOn(relationshipFormService, 'getRelationship').mockReturnValue({ id: null });
      jest.spyOn(relationshipService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ relationship: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: relationship }));
      saveSubject.complete();

      // THEN
      expect(relationshipFormService.getRelationship).toHaveBeenCalled();
      expect(relationshipService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRelationship>>();
      const relationship = { id: 123 };
      jest.spyOn(relationshipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ relationship });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(relationshipService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareActivity', () => {
      it('Should forward to activityService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(activityService, 'compareActivity');
        comp.compareActivity(entity, entity2);
        expect(activityService.compareActivity).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
