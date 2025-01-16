'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Card } from '@/components/ui/card'

interface Person {
  id: string
  name: string
  birthDate?: string
  deathDate?: string
  gender: 'male' | 'female'
  spouse?: Person
  children?: Person[]
}

interface FamilyTreeProps {
  searchTerm: string
  selectedPerson: Person | null
  setSelectedPerson: (person: Person | null) => void
}

const FamilyTree: React.FC<FamilyTreeProps> = ({
  searchTerm,
  selectedPerson,
  setSelectedPerson,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Updated sample data with new children added to Son 1, Son 2, Son 3, Son 4, and Daughter
    const data: Person = {
      id: '1',
      name: 'Person 1',
      birthDate: '1950-01-01',
      gender: 'male',
      spouse: { id: '1s', name: 'Spouse 1', birthDate: '1952-03-15', gender: 'female' },
      children: [
        {
          id: '2',
          name: 'Son 1',
          birthDate: '1975-05-15',
          gender: 'male',
          spouse: { id: '2s', name: 'Spouse 2', birthDate: '1976-08-20', gender: 'female' },
          children: [
            { id: '10', name: 'Son 1-1', birthDate: '2000-03-20', gender: 'male' },
            { id: '11', name: 'Son 1-2', birthDate: '2002-07-10', gender: 'male' },
            { id: '12', name: 'Son 1-3', birthDate: '2004-11-05', gender: 'male' },
            { id: '13', name: 'Daughter 1-1', birthDate: '2006-09-15', gender: 'female' },
          ],
        },
        {
          id: '3',
          name: 'Son 2',
          birthDate: '1977-09-30',
          gender: 'male',
          spouse: { id: '3s', name: 'Spouse 3', birthDate: '1979-12-10', gender: 'female' },
          children: [
            { id: '14', name: 'Son 2-1', birthDate: '2001-02-14', gender: 'male' },
            { id: '15', name: 'Son 2-2', birthDate: '2003-05-22', gender: 'male' },
            { id: '16', name: 'Son 2-3', birthDate: '2005-08-30', gender: 'male' },
            { id: '17', name: 'Son 2-4', birthDate: '2007-11-11', gender: 'male' },
            { id: '18', name: 'Son 2-5', birthDate: '2009-04-01', gender: 'male' },
            { id: '19', name: 'Son 2-6', birthDate: '2011-07-07', gender: 'male' },
            { id: '20', name: 'Daughter 2-1', birthDate: '2013-10-31', gender: 'female' },
            { id: '21', name: 'Daughter 2-2', birthDate: '2015-12-25', gender: 'female' },
            { id: '22', name: 'Daughter 2-3', birthDate: '2017-06-18', gender: 'female' },
          ],
        },
        {
          id: '4',
          name: 'Daughter',
          birthDate: '1980-02-22',
          gender: 'female',
          spouse: { id: '4s', name: 'Spouse 4', birthDate: '1979-06-18', gender: 'male' },
          children: [
            { id: '23', name: 'Son D-1', birthDate: '2005-03-14', gender: 'male' },
            { id: '24', name: 'Son D-2', birthDate: '2007-09-22', gender: 'male' },
            { id: '25', name: 'Daughter D-1', birthDate: '2009-12-31', gender: 'female' },
          ],
        },
        {
          id: '5',
          name: 'Son 3',
          birthDate: '1982-07-14',
          gender: 'male',
          spouse: { id: '5s', name: 'Spouse 5', birthDate: '1983-11-30', gender: 'female' },
          children: [
            { id: '26', name: 'Son 3-1', birthDate: '2008-04-01', gender: 'male' },
            { id: '27', name: 'Son 3-2', birthDate: '2010-08-15', gender: 'male' },
            { id: '28', name: 'Daughter 3-1', birthDate: '2012-12-24', gender: 'female' },
            { id: '29', name: 'Daughter 3-2', birthDate: '2014-07-04', gender: 'female' },
            { id: '30', name: 'Daughter 3-3', birthDate: '2016-02-29', gender: 'female' },
          ],
        },
        {
          id: '6',
          name: 'Son 4',
          birthDate: '1985-11-30',
          gender: 'male',
          spouse: { id: '6s', name: 'Spouse 6', birthDate: '1986-04-25', gender: 'female' },
          children: [
            { id: '31', name: 'Son 4-1', birthDate: '2010-01-15', gender: 'male' },
            { id: '32', name: 'Son 4-2', birthDate: '2011-05-20', gender: 'male' },
            { id: '33', name: 'Son 4-3', birthDate: '2012-09-10', gender: 'male' },
            { id: '34', name: 'Son 4-4', birthDate: '2013-11-05', gender: 'male' },
            { id: '35', name: 'Son 4-5', birthDate: '2015-03-17', gender: 'male' },
            { id: '36', name: 'Son 4-6', birthDate: '2016-08-22', gender: 'male' },
            { id: '37', name: 'Daughter 4-1', birthDate: '2017-12-01', gender: 'female' },
            { id: '38', name: 'Daughter 4-2', birthDate: '2019-04-30', gender: 'female' },
            { id: '39', name: 'Daughter 4-3', birthDate: '2020-10-10', gender: 'female' },
          ],
        },
      ],
    }

    const width = 2000
    const height = 1500
    const nodeWidth = 140
    const nodeHeight = 100
    const spouseGap = 20

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;')

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${nodeHeight})`)

    const tree = d3.tree<Person>()
      .nodeSize([nodeWidth * 2 + spouseGap, nodeHeight * 3])
      .separation((a, b) => a.parent === b.parent ? 1.2 : 2)

    const root = d3.hierarchy(data)
    tree(root)

    // Custom link generator that connects to the main person's box
    const linkGenerator = d3.linkVertical<d3.HierarchyPointLink<Person>, d3.HierarchyPointNode<Person>>()
      .x(d => d.x - (nodeWidth + spouseGap) / 2)
      .y(d => d.y)

    // Draw links
    const link = g.selectAll('.link')
      .data(root.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', linkGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.4)

    const node = g.selectAll('.node')
      .data(root.descendants())
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)

    function addPersonBox(selection: d3.Selection<SVGGElement, d3.HierarchyNode<Person>, SVGGElement, unknown>, person: Person | undefined, xOffset: number) {
      if (!person) return

      const isDeceased = !!person.deathDate

      // Add white background rectangle
      selection.append('rect')
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('x', xOffset - nodeWidth / 2)
        .attr('y', -nodeHeight / 2)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('fill', 'white')
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 2)

      // Add gender icon
      selection.append('image')
        .attr('href', person.gender === 'male' ? 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1).jpg-AJNDuvOIuK2VtSPYFXjQYc2g6gjYWm.jpeg' : 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-IGEHyvrIOBQUT3VTjjn6dxSat8xz7O.png')
        .attr('x', xOffset - 15)
        .attr('y', -nodeHeight / 2 + 10)
        .attr('width', 30)
        .attr('height', 30)
        .attr('opacity', isDeceased ? 0.5 : 1)

      selection.append('text')
        .attr('x', xOffset)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1a202c')
        .attr('font-weight', 'bold')
        .attr('font-size', '14px')
        .text(person.name)

      selection.append('text')
        .attr('x', xOffset)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('fill', '#4a5568')
        .attr('font-size', '12px')
        .text(person.birthDate || '')

      selection.append('text')
        .attr('x', xOffset)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .attr('fill', isDeceased ? '#e53e3e' : '#38a169')
        .attr('font-size', '12px')
        .text(isDeceased ? `Deceased: ${person.deathDate}` : 'Alive')
    }

    node.each(function(d) {
      const g = d3.select(this)
      addPersonBox(g, d.data, -spouseGap / 2 - nodeWidth / 2)
      addPersonBox(g, d.data.spouse, spouseGap / 2 + nodeWidth / 2)
    })

    // Zoom and pan functionality
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Center the tree
    const rootNode = root.descendants()[0]
    const initialTransform = d3.zoomIdentity
      .translate(width / 2 - rootNode.x, height / 2 - rootNode.y)
      .scale(0.4)
    svg.call(zoom.transform, initialTransform)

  }, [])

  return (
    <Card className="w-full h-full bg-white/20 backdrop-blur-sm shadow-xl">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </Card>
  )
}

export default FamilyTree

