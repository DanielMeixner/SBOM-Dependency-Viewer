import React, { useMemo, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'react-flow-renderer';
import dagre from 'dagre';
import useDependencyHealth from './useDependencyHealth';
import { useTheme } from './useTheme.jsx';
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
  const { colors } = useTheme();
  const { nodes, edges } = useMemo(() => parseSpdxToGraph(data, layout), [data, layout]);
  const { health, loading, error } = useDependencyHealth(data.packages);

  // Enhance node color based on health
  const nodesWithHealth = nodes.map(node => {
    // Find purl for this node
    const pkg = data.packages.find(p => p.SPDXID === node.id);
    const ref = pkg && pkg.externalRefs ? pkg.externalRefs.find(r => r.referenceType === 'purl') : null;
    const purl = ref ? ref.referenceLocator : null;
    let color = colors.nodeHealthy; // healthy default
    let title = node.data.label;
    if (purl && health[purl]) {
      if (health[purl].vulnerabilities && health[purl].vulnerabilities.length > 0) {
        color = colors.nodeVulnerable; // red for vulnerable
        title += `\nVulnerabilities: ${health[purl].vulnerabilities.length}`;
      } else if (health[purl].latestVersion && pkg.versionInfo && health[purl].latestVersion !== pkg.versionInfo) {
        color = colors.nodeOutdated; // yellow for outdated
        title += `\nOutdated: latest is ${health[purl].latestVersion}`;
      }
    }
    return {
      ...node,
      style: { 
        background: color, 
        border: `1px solid ${colors.nodeBorder}`, 
        color: colors.text,
        borderRadius: '12px',
        padding: '8px 12px',
        fontSize: '12px',
        fontWeight: '500',
        boxShadow: colors.shadowMd,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      },
      data: { ...node.data, title },
    };
  });

  return (
    <div style={{ 
      background: colors.cardBackground,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: `1px solid ${colors.cardBorder}`,
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: colors.shadowGlass,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        padding: '1.5rem',
        background: colors.glassBackground,
        borderBottom: `1px solid ${colors.borderLight}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: colors.primaryGlass,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            🔗
          </div>
          <h3 style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: '600',
            color: colors.textAccent
          }}>
            Dependency Graph
          </h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ 
              fontSize: '14px',
              fontWeight: '600',
              color: colors.textAccent
            }}>
              Layout:
            </label>
            <select 
              value={layout} 
              onChange={e => setLayout(e.target.value)}
              style={{
                background: colors.surfaceBackground,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="circular">🔄 Circular</option>
              <option value="grid">⊞ Grid</option>
              <option value="linear">➤ Linear</option>
              <option value="tree">🌳 Tree</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {loading && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                fontSize: '14px',
                color: colors.textMuted
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: `2px solid ${colors.borderLight}`,
                  borderTop: `2px solid ${colors.primarySolid}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Checking health...
              </div>
            )}
            {error && (
              <div style={{ 
                fontSize: '14px', 
                color: colors.error,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>⚠️</span>
                Health check failed
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div style={{ 
        height: '70vh',
        position: 'relative',
        background: colors.backgroundSolid
      }}>
        <ReactFlow nodes={nodesWithHealth} edges={edges} fitView>
          <MiniMap 
            style={{ 
              background: colors.cardBackground,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          />
          <Controls 
            style={{ 
              button: { 
                background: colors.cardBackground,
                color: colors.text,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '8px'
              }
            }}
          />
          <Background color={colors.borderLight} />
        </ReactFlow>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DependencyGraph;
