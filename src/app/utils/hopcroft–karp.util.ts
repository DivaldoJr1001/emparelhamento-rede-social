import { Edge } from '../models/edge';
import { HopcroftKarpObject } from '../models/hopcroft-karp-object';
import { Node } from '../models/node';
import { delay } from './delay.util';
import { environment } from 'src/environments/environment';

let empresasNodes: HKNode[];
let usuariosNodes: HKNode[];
let allEdges: Edge[];

let chosenEdges: Edge[];
let augmentingPath: Edge[];
let currentPath: Edge[];

let minDepth: number;
let currentDepth: number;

export async function runHopcroftKarp(datasets: HopcroftKarpObject) {
  empresasNodes = datasets.nodesDataSet.get().filter(node => node.shape === 'box').map(node => {
    node.parents = [];
    node.chosen = false;
    return node;
  });

  usuariosNodes = datasets.nodesDataSet.get().filter(node => node.shape === 'ellipse').map(node => {
    node.parents = [];
    node.chosen = false;
    return node;
  });

  allEdges = datasets.edgesDataSet.get();

  chosenEdges = [];
  currentPath = [];

  do {
      augmentingPath = [];
      minDepth = Infinity;
      currentDepth = -1;

      const currentNodes = empresasNodes.filter(node => !node.matched);

      for (const node of currentNodes) {
        exploreNode(node);
      }

      for (let i = 0; i < augmentingPath.length; i++) {
        if(!environment.paused){
          const edge = augmentingPath[i];
          const empresaNode = empresasNodes.find(empresa => empresa.id === edge.from);
          const usuarioNode = usuariosNodes.find(usuario => usuario.id === edge.to);
          const edgeIndex = chosenEdges.findIndex(chosenEdge => chosenEdge === edge);
  
          if (edgeIndex < 0) {
            chosenEdges.push(edge);
            edge.dashes = false;
            edge.color.color = 'red';
            edge.color.inherit = true;
            datasets.edgesDataSet.update(edge);
            empresaNode.matched = true;
            usuarioNode.matched = true;
          } else {
            chosenEdges.splice(edgeIndex, 1);
            edge.dashes = true;
            edge.color.color = 'limegreen';
            edge.color.inherit = false;
            datasets.edgesDataSet.update(edge);
          }
          await delay(2000);
        }else{
          i--;
          await delay(500);
        }
      }

      empresasNodes.map(node => {
        node.parents = [];
        return node;
      });

      usuariosNodes.map(node => {
        node.parents = [];
        return node;
      });
    
  } while (augmentingPath.length > 0);
}

async function exploreNode(node: HKNode) {
  currentDepth++;
  const isEmpresa = (node.shape === 'box');
  if (currentDepth < minDepth) {
    if (isEmpresa) {
      const linkedEdges: Edge[] = allEdges.filter(edge => edge.from === node.id && 
        node.parents.findIndex(parent => parent.id === edge.to) < 0);

      for (const edge of linkedEdges) {
        const nextNode = usuariosNodes.find(usuarioNode => usuarioNode.id === edge.to);
        if (nextNode.parents.findIndex(parent => parent === node) < 0) {
          nextNode.parents.push(node);
          currentPath.push(edge);
          exploreNode(nextNode);
        }
      }

    } else if (node.matched) {
      const linkedEdge = chosenEdges.find(edge => edge.to === node.id);
      const nextNode = empresasNodes.find(empresaNode => empresaNode.id === linkedEdge.from);
      nextNode.parents.push(node);
      currentPath.push(linkedEdge);
      exploreNode(nextNode);
    } else if (currentPath.length < augmentingPath.length || augmentingPath.length === 0) {
      minDepth = currentDepth;
      augmentingPath = [];
      for (const edge of currentPath) {
        augmentingPath.push(edge);
      }
    }
  }

  if (currentPath.length > 0) {
    currentPath.pop();
    //console.log(augmentingPath.length === 0)
  }
  currentDepth--;
}

interface HKNode extends Node {
  parents: HKNode[];
  matched: boolean;
}
