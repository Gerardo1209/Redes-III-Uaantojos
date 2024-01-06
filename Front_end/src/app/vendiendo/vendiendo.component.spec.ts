import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendiendoComponent } from './vendiendo.component';

describe('VendiendoComponent', () => {
  let component: VendiendoComponent;
  let fixture: ComponentFixture<VendiendoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendiendoComponent]
    });
    fixture = TestBed.createComponent(VendiendoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
