import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RelationshipDetailComponent } from './relationship-detail.component';

describe('Relationship Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelationshipDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: RelationshipDetailComponent,
              resolve: { relationship: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(RelationshipDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load relationship on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', RelationshipDetailComponent);

      // THEN
      expect(instance.relationship).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
