import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCompradorComponent } from './menu-comprador.component';

describe('MenuCompradorComponent', () => {
  let component: MenuCompradorComponent;
  let fixture: ComponentFixture<MenuCompradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuCompradorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuCompradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
