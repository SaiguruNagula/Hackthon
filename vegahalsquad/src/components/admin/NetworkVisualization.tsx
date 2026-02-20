import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { 
  Network, ZoomIn, ZoomOut, RefreshCw, 
  Users, BookOpen, GraduationCap, Briefcase, Users2
} from 'lucide-react';
import { networkNodes, networkEdges } from '@/data/enhancedDummyData';

interface NetworkVisualizationProps {
  height?: number;
}

const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({ height = 600 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<typeof networkNodes[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'students' | 'faculty' | 'courses' | 'clubs'>('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Filter nodes based on selection
  const filteredNodes = filter === 'all' 
    ? networkNodes 
    : networkNodes.filter(n => {
        if (filter === 'students') return n.type === 'student';
        if (filter === 'faculty') return n.type === 'faculty';
        if (filter === 'courses') return n.type === 'course';
        if (filter === 'clubs') return n.type === 'club';
        return true;
      });
  
  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = networkEdges.filter(e => 
    filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
  );

  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const width = svgRef.current.clientWidth;
    const containerHeight = height;
    
    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });
    
    svg.call(zoom);
    
    const g = svg.append('g');
    
    // Create force simulation
    const simulation = d3.forceSimulation(filteredNodes as any)
      .force('link', d3.forceLink(filteredEdges as any).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, containerHeight / 2))
      .force('collision', d3.forceCollide().radius(40));
    
    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(filteredEdges)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => {
        if (d.health === 'critical') return '#EF4444';
        if (d.health === 'warning') return '#F59E0B';
        return '#10B981';
      })
      .attr('stroke-width', (d: any) => d.weight || 1)
      .attr('stroke-opacity', 0.6);
    
    // Create node groups
    const node = g.append('g')
      .selectAll('g')
      .data(filteredNodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<any, any>()
        .on('start', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      )
      .on('click', (_event, d: any) => {
        setSelectedNode(d);
      });
    
    // Add circles to nodes
    node.append('circle')
      .attr('r', (d: any) => {
        if (d.type === 'faculty') return 25;
        if (d.type === 'course') return 20;
        return 18;
      })
      .attr('fill', (d: any) => {
        switch (d.type) {
          case 'student': return d.health === 'critical' ? '#EF4444' : d.health === 'warning' ? '#F59E0B' : '#3B82F6';
          case 'faculty': return '#8B5CF6';
          case 'course': return '#10B981';
          case 'club': return '#F59E0B';
          case 'placement': return '#EC4899';
          default: return '#6B7280';
        }
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.8);
    
    // Add icons to nodes
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text((d: any) => {
        const initials = d.label.split(' ').map((n: string) => n[0]).join('').substring(0, 2);
        return initials;
      });
    
    // Add labels
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 35)
      .attr('font-size', '10px')
      .attr('fill', '#64748B')
      .text((d: any) => d.label.length > 12 ? d.label.substring(0, 12) + '...' : d.label);
    
    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      
      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });
    
    return () => {
      simulation.stop();
    };
  }, [filteredNodes, filteredEdges, height]);
  
  const handleZoomIn = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().call(
        (d3.zoom() as any).transform,
        d3.zoomTransform(svgRef.current).scale(zoomLevel * 1.2)
      );
    }
  };
  
  const handleZoomOut = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().call(
        (d3.zoom() as any).transform,
        d3.zoomTransform(svgRef.current).scale(zoomLevel * 0.8)
      );
    }
  };
  
  const handleReset = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().call(
        (d3.zoom() as any).transform,
        d3.zoomIdentity
      );
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'student': return Users;
      case 'faculty': return GraduationCap;
      case 'course': return BookOpen;
      case 'club': return Users2;
      case 'placement': return Briefcase;
      default: return Network;
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {(['all', 'students', 'faculty', 'courses', 'clubs'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-500 w-16 text-center">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-slate-600">Students</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-slate-600">Faculty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-slate-600">Courses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-slate-600">Clubs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-emerald-500" />
          <span className="text-slate-600">Healthy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-amber-500" />
          <span className="text-slate-600">Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-red-500" />
          <span className="text-slate-600">Critical</span>
        </div>
      </div>
      
      {/* Graph Container */}
      <div className="relative rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          className="cursor-grab active:cursor-grabbing"
        />
        
        {/* Node Info Panel */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 right-4 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedNode.type === 'student' ? 'bg-blue-100' :
                  selectedNode.type === 'faculty' ? 'bg-purple-100' :
                  selectedNode.type === 'course' ? 'bg-emerald-100' :
                  'bg-amber-100'
                }`}>
                  {React.createElement(getNodeIcon(selectedNode.type), { 
                    className: `w-5 h-5 ${
                      selectedNode.type === 'student' ? 'text-blue-600' :
                      selectedNode.type === 'faculty' ? 'text-purple-600' :
                      selectedNode.type === 'course' ? 'text-emerald-600' :
                      'text-amber-600'
                    }`
                  })}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{selectedNode.label}</h4>
                  <p className="text-xs text-slate-500 capitalize">{selectedNode.type}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              {Object.entries(selectedNode.data).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-slate-500 capitalize">{key}:</span>
                  <span className="text-slate-900 dark:text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
            
            {selectedNode.health && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  selectedNode.health === 'good' ? 'bg-emerald-100 text-emerald-700' :
                  selectedNode.health === 'warning' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedNode.health === 'good' ? '✓' : selectedNode.health === 'warning' ? '!' : '✗'}
                  {selectedNode.health.charAt(0).toUpperCase() + selectedNode.health.slice(1)}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Students', count: networkNodes.filter(n => n.type === 'student').length, color: 'blue' },
          { label: 'Faculty', count: networkNodes.filter(n => n.type === 'faculty').length, color: 'purple' },
          { label: 'Courses', count: networkNodes.filter(n => n.type === 'course').length, color: 'emerald' },
          { label: 'Clubs', count: networkNodes.filter(n => n.type === 'club').length, color: 'amber' },
          { label: 'Connections', count: networkEdges.length, color: 'slate' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800"
          >
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.count}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NetworkVisualization;
