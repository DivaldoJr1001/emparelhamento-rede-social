import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FunctionDialogComponent } from '../dialogs/function-dialog/function-dialog.component';
import { ImportExportDialogComponent } from '../dialogs/import-export-dialog/import-export-dialog.component';
import { Node } from '../models/node';
import { FunctionSettings } from '../models/function-settings';
import { ImportExportSettings } from '../models/import-export-settings';
import { Edge } from '../models/edge';
import { runHopcroftKarp } from '../utils/hopcroft–karp.util';
import { environment } from 'src/environments/environment';
declare var vis: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-vis',
  templateUrl: './vis.component.html',
  styleUrls: ['./vis.component.scss']
})
export class VisComponent implements AfterViewInit {
  @ViewChild('networkContainer', { static: false }) networkContainer: ElementRef;

  public network: any;

  nodesDataSet = new vis.DataSet();
  edgesDataSet = new vis.DataSet();
  2

  SQL
  
  4
  
  algorithmRunning = false;
  algorithmPaused = false;
  algorithmFinished = false;

  functionSettings: FunctionSettings = {
    createMode: true,
    functionTarget: '',
    nodesDataSet: this.nodesDataSet,
    edgesDataSet: this.edgesDataSet
  };

  constructor(
    public dialog: MatDialog,
    public cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.draw();
  }

  draw() {
    const data = {
      nodes: this.nodesDataSet,
      edges: this.edgesDataSet,
    };

    this.functionSettings = {
      createMode: true,
      functionTarget: '',
      nodesDataSet: this.nodesDataSet,
      edgesDataSet: this.edgesDataSet
    };

    var options = {
      physics: {
        enabled: false
      }
    };

    this.network = new vis.Network(this.networkContainer.nativeElement, data, options);

    this.network.on("stabilizationIterationsDone", function () {
      this.network.setOptions( { physics: false } );
    });

  }

  openImportExportDialog(importState: boolean) {
    const importExportSettings: ImportExportSettings = {
      importState,
      nodesDataSet: this.nodesDataSet,
      edgesDataSet: this.edgesDataSet
    };

    const dialogRef = this.dialog.open(ImportExportDialogComponent, {
      data: importExportSettings
    });

    dialogRef.afterClosed().subscribe((response: ImportExportSettings) => {
      if (response) {
        this.nodesDataSet = response.nodesDataSet;
        this.edgesDataSet = response.edgesDataSet;
        this.draw();
        this.cdr.detectChanges();
      }
    });
  }

  openFunctionDialog(functionTarget: string) {
    this.functionSettings.functionTarget = functionTarget;

    const dialogRef = this.dialog.open(FunctionDialogComponent, {
      data: this.functionSettings
    });

    dialogRef.afterClosed().subscribe(_ => {
      this.cdr.detectChanges();
    });
  }

  hasUsuario(): boolean {
    const nodes: Node[] = this.nodesDataSet.get();
    return nodes.findIndex(node => node.shape === 'ellipse') > -1;
  }

  hasEmpresa(): boolean {
    const nodes: Node[] = this.nodesDataSet.get();
    return nodes.findIndex(node => node.shape === 'box') > -1;
  }

  hasConexao(): boolean {
    const edges: Edge[] = this.edgesDataSet.get();
    return edges.length > 0;
  }

  menuConexaoDisabled(): boolean {
    return !this.functionSettings.createMode && !this.hasConexao() || !this.hasUsuario() || !this.hasEmpresa();
  }

  canRunAlgorithm(): boolean {
    return this.nodesDataSet.get().length > 0 && this.edgesDataSet.get().length > 0;
  }

  async runAlgorithm(): Promise<void> {
    this.algorithmRunning = true;
    await runHopcroftKarp({
      nodesDataSet: this.nodesDataSet,
      edgesDataSet: this.edgesDataSet
    });
    this.algorithmRunning = false;
    this.algorithmFinished = true;
    this.cdr.detectChanges();
  }

  resetAlgorithm(): void {
    const allNodes: Node[] = this.nodesDataSet.get();
    const allEdges: Edge[] = this.edgesDataSet.get();

    for (const node of allNodes) {
      if (node.shape === 'ellipse') {
        node.color.background = 'lightskyblue';
      } else {
        node.color.background = 'red';
        node.font = { color: 'white' };
      }
      this.nodesDataSet.update(node);
    }

    for (const edge of allEdges) {
      edge.dashes = true;
      edge.color.color = 'black';
      edge.color.inherit = false;
      this.edgesDataSet.update(edge);
    }

    this.algorithmFinished = false;

    this.cdr.detectChanges();
  }

  pauseAlgorithm(){
    environment.paused = !environment.paused;
    this.algorithmPaused = !this.algorithmPaused;
  }
}

/* {"nodes":[{"id":1,"label":"1","shape":"ellipse","color":{"background":"lightskyblue","border":"black"},"x":-200,"y":-200},{"id":2,"label":"2","shape":"ellipse","color":{"background":"lightskyblue","border":"black"},"x":-200,"y":-125},{"id":3,"label":"3","shape":"ellipse","color":{"background":"lightskyblue","border":"black"},"x":-200,"y":-50},{"id":4,"label":"4","shape":"ellipse","color":{"background":"lightskyblue","border":"black"},"x":-200,"y":25},{"id":5,"label":"5","shape":"ellipse","color":{"background":"lightskyblue","border":"black"},"x":-200,"y":100},{"id":6,"label":"Java","shape":"box","font":{"color":"white"},"color":{"background":"red","border":"black","highlight":{"background":"palevioletred","border":"black"}},"x":150,"y":-200},{"id":7,"label":"Python","shape":"box","font":{"color":"white"},"color":{"background":"red","border":"black","highlight":{"background":"palevioletred","border":"black"}},"x":150,"y":-125},{"id":8,"label":"Web","shape":"box","font":{"color":"white"},"color":{"background":"red","border":"black","highlight":{"background":"palevioletred","border":"black"}},"x":150,"y":-50},{"id":9,"label":"SQL","shape":"box","font":{"color":"white"},"color":{"background":"red","border":"black","highlight":{"background":"palevioletred","border":"black"}},"x":150,"y":25},{"id":10,"label":"C++","shape":"box","font":{"color":"white"},"color":{"background":"red","border":"black","highlight":{"background":"palevioletred","border":"black"}},"x":150,"y":100}],"edges":[{"id":1,"from":6,"to":1,"color":{"color":"black","inherit":false},"dashes":true},{"id":2,"from":7,"to":3,"color":{"color":"black","inherit":false},"dashes":true},{"id":3,"from":8,"to":1,"color":{"color":"black","inherit":false},"dashes":true},{"id":4,"from":8,"to":3,"color":{"color":"black","inherit":false},"dashes":true},{"id":5,"from":8,"to":4,"color":{"color":"black","inherit":false},"dashes":true},{"id":6,"from":8,"to":5,"color":{"color":"black","inherit":false},"dashes":true},{"id":7,"from":9,"to":2,"color":{"color":"black","inherit":false},"dashes":true},{"id":8,"from":9,"to":4,"color":{"color":"black","inherit":false},"dashes":true},{"id":9,"from":10,"to":2,"color":{"color":"black","inherit":false},"dashes":true}]} */