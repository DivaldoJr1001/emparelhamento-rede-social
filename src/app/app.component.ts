import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AboutDialogComponent } from './dialogs/about-dialog/about-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'emparelhamento-rede-social';

  constructor(public dialog: MatDialog) { }

  openAboutDialogue() {
    this.dialog.open(AboutDialogComponent);
  }
}
