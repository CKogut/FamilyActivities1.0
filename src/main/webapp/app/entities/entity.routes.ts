import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'relationship',
    data: { pageTitle: 'Relationships' },
    loadChildren: () => import('./relationship/relationship.routes'),
  },
  {
    path: 'activity',
    data: { pageTitle: 'Activities' },
    loadChildren: () => import('./activity/activity.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
