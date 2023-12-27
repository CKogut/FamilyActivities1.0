import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { RelationshipComponent } from './list/relationship.component';
import { RelationshipDetailComponent } from './detail/relationship-detail.component';
import { RelationshipUpdateComponent } from './update/relationship-update.component';
import RelationshipResolve from './route/relationship-routing-resolve.service';

const relationshipRoute: Routes = [
  {
    path: '',
    component: RelationshipComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RelationshipDetailComponent,
    resolve: {
      relationship: RelationshipResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RelationshipUpdateComponent,
    resolve: {
      relationship: RelationshipResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RelationshipUpdateComponent,
    resolve: {
      relationship: RelationshipResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default relationshipRoute;
