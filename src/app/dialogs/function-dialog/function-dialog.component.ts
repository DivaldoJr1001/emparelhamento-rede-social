import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Edge } from 'src/app/models/edge';
import { FunctionSettings } from 'src/app/models/function-settings';
import { Node } from 'src/app/models/node';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-function-dialog',
  templateUrl: './function-dialog.component.html',
  styleUrls: ['./function-dialog.component.scss']
})
export class FunctionDialogComponent implements OnInit {

  createMode: boolean;

  nodeLabel = new FormControl('');
  nodesArray: Node[] = [];

  usuariosArray: Node[] = [];
  empresasArray: Node[] = [];
  edgeArray: Edge[] = [];

  usuarioSelecionado = new FormControl(undefined);
  empresaSelecionada = new FormControl(undefined);

  objetoRemocaoControl = new FormControl(undefined);

  usuarioCreationError = false;
  empresaCreationError = false;
  edgeCreationError = false;

  constructor(
    public dialogRef: MatDialogRef<FunctionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FunctionSettings
  ) { }

  ngOnInit() {
    if (this.data.functionTarget === 'Usuário') {
      this.usuariosArray = this.data.nodesDataSet.get().filter(node => node.shape === 'ellipse');
    } else if (this.data.functionTarget === 'Empresa') {
      this.empresasArray = this.data.nodesDataSet.get().filter(node => node.shape === 'box');
    } else {
      this.usuariosArray = this.data.nodesDataSet.get().filter(node => node.shape === 'ellipse');
      this.empresasArray = this.data.nodesDataSet.get().filter(node => node.shape === 'box');
      this.edgeArray = this.data.edgesDataSet.get();
    }
  }

  toLowerCaseFunction(s: string): string {
    return s.toLowerCase();
  }

  edgeName(edge: Edge): string {
    return this.data.nodesDataSet.get(edge.from).label + ' - ' + this.data.nodesDataSet.get(edge.to).label;
  }

  executeFunction(): void {
    try {
      this.usuarioCreationError = false;
      this.empresaCreationError = false;
      this.edgeCreationError = false;

      if (this.data.createMode) {
        if (this.data.functionTarget !== 'Conexão') {
          const ids: number[] = this.data.nodesDataSet.getIds();
          const id: number = parseInt(ids.pop() + '', 10) + 1 || 1;
          const label = this.nodeLabel.value;

          const newNode: Node = {
            id,
            label
          };

          if (this.data.functionTarget === 'Usuário') {
            console.log(newNode.id);
            newNode.shape = 'ellipse';
            newNode.color = {
              background: 'lightskyblue',
              border: 'black'
            };
            newNode.x = -200;
            newNode.y = -200 + environment.idU * 75;

            if (this.data.nodesDataSet.get().find(node => node.label === newNode.label && node.shape === newNode.shape)) {
              this.usuarioCreationError = true;
              throw new Error();
            } else {
              environment.idU++;
            }

          } else if (this.data.functionTarget === 'Empresa') {
            newNode.shape = 'box';
            newNode.font = { color: 'white' };
            newNode.color = {
              background: 'red',
              border: 'black',
              highlight: {
                background: 'palevioletred',
                border: 'black'
              }
            };
            newNode.x = 150;
            newNode.y = -200 + environment.idE * 75;

            if (this.data.nodesDataSet.get().find(node => node.label === newNode.label && node.shape === newNode.shape)) {
              this.empresaCreationError = true;
              throw new Error();
            } else {
              environment.idE++;
            }

          }

          this.data.nodesDataSet.add(newNode);

        } else {
          const ids: number[] = this.data.edgesDataSet.getIds();
          const id: number = parseInt(ids.pop() + '', 10) + 1 || 1;

          const newEdge: Edge = {
            id,
            from: this.empresaSelecionada.value.id,
            to: this.usuarioSelecionado.value.id,
            color: {
              color: 'black',
              inherit: false
            },
            dashes: true
          };

          if (this.edgeArray.findIndex(edge => edge.to === newEdge.to && edge.from === newEdge.from) < 0) {
            this.data.edgesDataSet.add(newEdge);
          } else {
            this.edgeCreationError = true;
            throw new Error();
          }

        }
      } else {
        const selecao: Node = this.objetoRemocaoControl.value;
        if (this.data.functionTarget !== 'Conexão') {
          const id = selecao.id;
          const edgesToRemove: Edge[] = this.data.edgesDataSet.get().filter(edge => edge.to === id || edge.from === id);

          this.data.edgesDataSet.remove(edgesToRemove);
          this.data.nodesDataSet.remove(selecao);
        } else {
          this.data.edgesDataSet.remove(selecao);
        }
      }

      this.dialogRef.close();
    } catch (e) {
      console.log(e);
    }
  }

}
