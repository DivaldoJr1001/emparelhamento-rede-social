import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Edge } from 'src/app/models/edge';
import { Node } from 'src/app/models/node';
import { ImportExportObject } from 'src/app/models/import-export-object';
import { ImportExportSettings } from 'src/app/models/import-export-settings';
declare var vis: any;

@Component({
  selector: 'app-import-export-dialog',
  templateUrl: './import-export-dialog.component.html',
  styleUrls: ['./import-export-dialog.component.scss']
})
export class ImportExportDialogComponent implements OnInit {

  importState: boolean;

  writtenData = new FormControl('');

  importError = false;

  backupData: ImportExportSettings;

  constructor(
    public dialogRef: MatDialogRef<ImportExportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImportExportSettings
  ) { }

  ngOnInit() {
    this.importState = this.data.importState;

    if (!this.importState) {
      const exportObject: ImportExportObject = {
        nodes: this.data.nodesDataSet.get(),
        edges: this.data.edgesDataSet.get()
      };

      this.writtenData.setValue(JSON.stringify(exportObject));
    }
  }

  importData() {
    try {
      this.backupData = {
        importState: this.importState,
        nodesDataSet: new vis.DataSet(),
        edgesDataSet: new vis.DataSet()
      };

      for (const node of this.data.nodesDataSet.get()) {
        this.backupData.nodesDataSet.add(node);
      }
      for (const edge of this.data.edgesDataSet.get()) {
        this.backupData.edgesDataSet.add(edge);
      }

      this.importError = false;
      const importedObject: ImportExportObject = JSON.parse(this.writtenData.value);

      this.data.nodesDataSet.clear();
      this.data.edgesDataSet.clear();

      for (const node of importedObject.nodes) {
        if (node.shape !== 'box' && node.shape !== 'ellipse') {
          node.shape = 'ellipse';
          node.color.background = 'lightskyblue';

          if (this.duplicatedLabel(node.label, node.shape)) {
            node.shape = 'box';
            node.color.background = 'red';
            node.font = {color: 'white'};
            node.color.highlight = { background: 'palevioletred', border: 'black' };

            if (this.duplicatedLabel(node.label, node.shape)) {
              throw new Error('JSON contains a node formatted incorrectly');
            }
          }
        } else if (node.shape === 'ellipse') {
          node.color.background = 'lightskyblue';
        } else if (node.shape === 'box') {
          node.color.background = 'red';
          node.font = { color: 'white' };
        }

        node.color.border = 'black';

        if (this.duplicatedLabel(node.label, node.shape)) {
          throw new Error('Duplicated label');
        } else {
          this.data.nodesDataSet.add(node);
        }
      }

      for (const edge of importedObject.edges) {
        edge.dashes = true;
        edge.color.color = 'black';
        edge.color.inherit = false;

        if (this.data.nodesDataSet.get(edge.from).shape === 'ellipse' &&
          this.data.nodesDataSet.get(edge.to).shape !== 'box') {
            const aux = edge.from;
            edge.from = edge.to;
            edge.to = aux;
        } else if (this.data.nodesDataSet.get(edge.from).shape === 'ellipse') {
          throw new Error('Edge cannot start from a user');
        } else if (this.data.nodesDataSet.get(edge.to).shape === 'box') {
          throw new Error('Edge cannot end at a business');
        } else if (this.duplicatedEdge(edge.to, edge.from)) {
          throw new Error('Duplicated edge');
        } else {
          this.data.edgesDataSet.add(edge);
        }
      }

      this.dialogRef.close();
    } catch (e) {
      console.log(e);
      this.importError = true;
      this.data = this.backupData;
      console.log(this.data);
    }
  }

  duplicatedLabel(label: string, shape: string | undefined): boolean {
    const nodes: Node[] = this.data.nodesDataSet.get();

    return nodes.findIndex(node => node.label === label && node.shape === shape) > -1;
  }

  duplicatedEdge(to: number, from: number): boolean {
    const nodes: Edge[] = this.data.edgesDataSet.get();

    return nodes.findIndex(edge => edge.to === to && edge.from === from) > -1 ||
      nodes.findIndex(edge => edge.to === from && edge.from === to) > -1;
  }


}
