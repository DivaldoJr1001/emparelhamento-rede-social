import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../shared/material.module';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';
import { FunctionDialogComponent } from './function-dialog/function-dialog.component';
import { ImportExportDialogComponent } from './import-export-dialog/import-export-dialog.component';

@NgModule({
  declarations: [
    AboutDialogComponent,
    FunctionDialogComponent,
    ImportExportDialogComponent
  ],
  entryComponents: [
    AboutDialogComponent,
    FunctionDialogComponent,
    ImportExportDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
  ]
})
export class DialogsModule { }
