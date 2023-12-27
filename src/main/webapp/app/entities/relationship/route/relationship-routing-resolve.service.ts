import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRelationship } from '../relationship.model';
import { RelationshipService } from '../service/relationship.service';

export const relationshipResolve = (route: ActivatedRouteSnapshot): Observable<null | IRelationship> => {
  const id = route.params['id'];
  if (id) {
    return inject(RelationshipService)
      .find(id)
      .pipe(
        mergeMap((relationship: HttpResponse<IRelationship>) => {
          if (relationship.body) {
            return of(relationship.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default relationshipResolve;
