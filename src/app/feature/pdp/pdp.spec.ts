import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pdp } from './pdp';

describe('Pdp', () => {
  let component: Pdp;
  let fixture: ComponentFixture<Pdp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pdp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pdp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
