import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickContact } from './quick-contact';

describe('QuickContact', () => {
  let component: QuickContact;
  let fixture: ComponentFixture<QuickContact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickContact],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickContact);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
