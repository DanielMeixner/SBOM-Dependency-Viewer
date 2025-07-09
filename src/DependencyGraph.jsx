import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'react-flow-renderer';

function parseSpdxToGraph(data) {
  if (!data.packages || !data.relationships) return { nodes: [], edges: [] };
  const idToLabel = {};
  data.packages.forEach(pkg => {
    idToLabel[pkg.SPDXID] = pkg.name + (pkg.versionInfo ? `@${pkg.versionInfo}` : '');
  });
  const nodes = data.packages.map(pkg => ({
    id: pkg.SPDXID,
    data: { label: idToLabel[pkg.SPDXID] },
    position: { x: Math.random() * 600, y: Math.random() * 600 },
  }));
  const edges = data.relationships
    .filter(rel => rel.relationshipType === 'DEPENDS_ON')
    .map(rel => ({
      id: rel.spdxElementId + '->' + rel.relatedSpdxElement,
      source: rel.spdxElementId,
      target: rel.relatedSpdxElement,
      animated: true,
    }));
  return { nodes, edges };
}

const DependencyGraph = ({ data }) => {
  const { nodes, edges } = useMemo(() => parseSpdxToGraph(data), [data]);
  return (
    <div style={{ width: '100%', height: '80vh', border: '1px solid #ccc', marginTop: 24 }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default DependencyGraph;
