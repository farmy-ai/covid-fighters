import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOverlayComponent } from './upload-overlay.component';

describe('UploadOverlayComponent', () => {
  let component: UploadOverlayComponent;
  let fixture: ComponentFixture<UploadOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
