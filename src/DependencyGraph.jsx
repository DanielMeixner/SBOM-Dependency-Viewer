import React, { useMemo, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'react-flow-renderer';
import dagre from 'dagre';
import useDependencyHealth from './useDependencyHealth';
// Tree layout using dagre
function getNodesTree(packages, idToLabel, edges) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 100 });
  g.setDefaultEdgeLabel(() => ({}));
  packages.forEach(pkg => {
    g.setNode(pkg.SPDXID, { label: idToLabel[pkg.SPDXID], width: 120, height: 40 });
  });
  edges.forEach(edge => {
    g.setEdge(edge.source, edge.target);
  });
  dagre.layout(g);
  return packages.map(pkg => {
    const nodeWithPos = g.node(pkg.SPDXID);
    return {
      id: pkg.SPDXID,
      data: { label: idToLabel[pkg.SPDXID] },
      position: {
        x: nodeWithPos.x,
        y: nodeWithPos.y,
      },
    };
  });
}


function getNodesCircular(packages, idToLabel) {
  const radius = 250;
  const centerX = 300;
  const centerY = 300;
  const count = packages.length;
  return packages.map((pkg, i) => {
    const angle = (2 * Math.PI * i) / count;
    return {
      id: pkg.SPDXID,
      data: { label: idToLabel[pkg.SPDXID] },
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
    };
  });
}

function getNodesGrid(packages, idToLabel) {
  const gridSize = Math.ceil(Math.sqrt(packages.length));
  const spacing = 120;
  return packages.map((pkg, i) => {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    return {
      id: pkg.SPDXID,
      data: { label: idToLabel[pkg.SPDXID] },
      position: {
        x: 100 + col * spacing,
        y: 100 + row * spacing,
      },
    };
  });
}

function getNodesLinear(packages, idToLabel) {
  return packages.map((pkg, i) => ({
    id: pkg.SPDXID,
    data: { label: idToLabel[pkg.SPDXID] },
    position: {
      x: 100 + i * 140,
      y: 300,
    },
  }));
}

function parseSpdxToGraph(data, layout) {
  if (!data.packages || !data.relationships) return { nodes: [], edges: [] };
  const idToLabel = {};
  data.packages.forEach(pkg => {
    idToLabel[pkg.SPDXID] = pkg.name + (pkg.versionInfo ? `@${pkg.versionInfo}` : '');
  });
  const edges = data.relationships
    .filter(rel => rel.relationshipType === 'DEPENDS_ON')
    .map(rel => ({
      id: rel.spdxElementId + '->' + rel.relatedSpdxElement,
      source: rel.spdxElementId,
      target: rel.relatedSpdxElement,
      animated: true,
    }));
  let nodes = [];
  if (layout === 'grid') {
    nodes = getNodesGrid(data.packages, idToLabel);
  } else if (layout === 'linear') {
    nodes = getNodesLinear(data.packages, idToLabel);
  } else if (layout === 'tree') {
    nodes = getNodesTree(data.packages, idToLabel, edges);
  } else {
    nodes = getNodesCircular(data.packages, idToLabel);
  }
  return { nodes, edges };
}


const DependencyGraph = ({ data }) => {
  const [layout, setLayout] = useState('circular');
  const { nodes, edges } = useMemo(() => parseSpdxToGraph(data, layout), [data, layout]);
  const { health, loading, error } = useDependencyHealth(data.packages);

  // Enhance node color based on health
  const nodesWithHealth = nodes.map(node => {
    // Find purl for this node
    const pkg = data.packages.find(p => p.SPDXID === node.id);
    const ref = pkg && pkg.externalRefs ? pkg.externalRefs.find(r => r.referenceType === 'purl') : null;
    const purl = ref ? ref.referenceLocator : null;
    let color = '#90ee90'; // healthy default
    let title = node.data.label;
    if (purl && health[purl]) {
      if (health[purl].vulnerabilities && health[purl].vulnerabilities.length > 0) {
        color = '#ffb3b3'; // red for vulnerable
        title += `\nVulnerabilities: ${health[purl].vulnerabilities.length}`;
      } else if (health[purl].latestVersion && pkg.versionInfo && health[purl].latestVersion !== pkg.versionInfo) {
        color = '#ffe066'; // yellow for outdated
        title += `\nOutdated: latest is ${health[purl].latestVersion}`;
      }
    }
    return {
      ...node,
      style: { background: color, border: '1px solid #888' },
      data: { ...node.data, title },
    };
  });

  return (
    <div style={{ width: '100%', height: '80vh', border: '1px solid #ccc', marginTop: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Layout:</label>
        <select value={layout} onChange={e => setLayout(e.target.value)}>
          <option value="circular">Circular</option>
          <option value="grid">Grid</option>
          <option value="linear">Linear</option>
          <option value="tree">Tree</option>
        </select>
        {loading && <span style={{ marginLeft: 16 }}>Checking health...</span>}
        {error && <span style={{ color: 'red', marginLeft: 16 }}>Health check failed</span>}
      </div>
      <ReactFlow nodes={nodesWithHealth} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default DependencyGraph;
