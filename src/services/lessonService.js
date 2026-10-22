// Lesson Service Module: Defines available sample lessons, PDF validation, and backend service interface
import { INITIAL_NODES, MAP_CONNECTIONS } from '../data/nodesData.js'

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 Megabytes

// Curated Sample Lessons
export const SAMPLE_LESSONS = [
  {
    id: 'europe_biomes_watersheds',
    realm: 'Europe',
    title: 'Mediterranean Biomes & Alpine Watersheds',
    subtitle: 'Geography, Ecology & Karst Geology',
    category: 'Earth & Environmental Sciences',
    difficulty: 'Intermediate',
    estimatedDuration: '45 mins',
    totalXpAvailable: 945,
    nodesCount: 7,
    description:
      'Explore coastal adaptations, river basin hydraulics, limestone karst dissolution, and high-altitude snowpack buffering across Europe.',
    highlightPoints: [
      '7 sequential knowledge nodes from coast to mountain summit',
      'Interactive mid-island checkpoint quiz',
      'Realistic watershed runoff simulation and erosion control'
    ],
    nodes: INITIAL_NODES,
    connections: MAP_CONNECTIONS
  },
  {
    id: 'roman_engineering_architecture',
    realm: 'Rome',
    title: 'Roman Engineering & Hydraulic Aqueducts',
    subtitle: 'Classical Architecture, Pozzolanic Concrete & Arches',
    category: 'History & Structural Engineering',
    difficulty: 'Beginner',
    estimatedDuration: '35 mins',
    totalXpAvailable: 780,
    nodesCount: 7,
    description:
      'Study how Roman master builders channeled mountain springs into metropolitan bathhouses using gravity aqueducts and volcanic cement.',
    highlightPoints: [
      'True arches vs corbelled spans and compression lines',
      'Pozzolana volcanic ash curing underwater',
      'Siphon hydraulics across deep canyon ravines'
    ],
    nodes: INITIAL_NODES.map((n) => {
      if (n.id === 'intro') {
        return {
          ...n,
          label: 'Intro',
          subtitle: 'The Appian Way',
          desc: 'Orientation to Roman infrastructure. Discover how surveyor roads enabled rapid legion movement and trade routes.'
        }
      }
      if (n.id === 'learn') {
        return {
          ...n,
          label: 'Learn',
          subtitle: 'Arch Mechanics',
          desc: 'Examine voussoirs, keystones, and thrust vector dispersion in semicircular stone arches.'
        }
      }
      if (n.id === 'homework') {
        return {
          ...n,
          label: 'Homework',
          subtitle: 'Aqueduct Gradient',
          desc: 'Calculate the hydraulic grade line for a 40km aqueduct with 1:500 slope ratio.'
        }
      }
      if (n.id === 'quiz') {
        return {
          ...n,
          label: 'Quiz',
          subtitle: 'Hydraulic Checkpoint',
          desc: 'Test your knowledge on settling tanks, lead siphons, and water distribution castella.'
        }
      }
      if (n.id === 'objective_plateau') {
        return {
          ...n,
          label: 'New Objective',
          subtitle: 'Pantheon Dome',
          desc: 'Study coffered concrete thickness reduction and pumice aggregate lightweighting.'
        }
      }
      if (n.id === 'objective_summit') {
        return {
          ...n,
          label: 'New Objective',
          subtitle: 'Subterranean Siphons',
          desc: 'Analyze high-pressure inverted lead siphons across deep valley riverbeds.'
        }
      }
      if (n.id === 'objective_fortress') {
        return {
          ...n,
          label: 'New Objective',
          subtitle: 'Imperial Citadel',
          desc: 'Final architectural trial synthesizing urban planning, defense ramparts, and cistern water security.'
        }
      }
      return n
    }),
    connections: MAP_CONNECTIONS
  },
  {
    id: 'orbital_mechanics_space',
    realm: 'Cosmos',
    title: 'Orbital Dynamics & Planetary Insertion',
    subtitle: 'Astrodynamics, Keplerian Elements & Delta-V',
    category: 'Physics & Aerospace Science',
    difficulty: 'Advanced',
    estimatedDuration: '60 mins',
    totalXpAvailable: 1150,
    nodesCount: 7,
    description:
      'Navigate orbital mechanics around planetary bodies. Calculate Hohmann transfer orbits, gravitational slingshots, and atmospheric aerocapture.',
    highlightPoints: [
      'Keplerian conic sections and vis-viva equation',
      'Hohmann transfer ellipse energy budgets',
      'Lagrangian equilibrium points L1-L5'
    ],
    nodes: INITIAL_NODES.map((n) => {
      if (n.id === 'intro') {
        return {
          ...n,
          label: 'Intro',
          subtitle: 'Launch Trajectory',
          desc: 'Ascend through the troposphere and establish circular low Earth parking orbit.'
        }
      }
      if (n.id === 'learn') {
        return {
          ...n,
          label: 'Learn',
          subtitle: 'Keplerian Orbits',
          desc: 'Understand semi-major axis, orbital eccentricity, inclination, and apoapsis.'
        }
      }
      if (n.id === 'homework') {
        return {
          ...n,
          label: 'Homework',
          subtitle: 'Delta-V Maneuver',
          desc: 'Calculate prograde burn requirements to raise orbital apogee to geostationary transfer.'
        }
      }
      if (n.id === 'quiz') {
        return {
          ...n,
          label: 'Quiz',
          subtitle: 'Astrodynamics Exam',
          desc: 'Mid-flight checkpoint testing orbital rendezvous and phasing angles.'
        }
      }
      if (n.id === 'objective_plateau') {
        return {
          ...n,
          label: 'New Objective',
          subtitle: 'Lunar Slingshot',
          desc: 'Execute gravity assist flyby to alter heliocentric velocity with zero fuel expenditure.'
        }
      }
      if (n.id === 'objective_summit') {
        return {
          ...n,
          label: 'New Objective',
          subtitle: 'Planetary Aerocapture',
          desc: 'Perform controlled upper-atmospheric aerobraking without thermal shield failure.'
        }
      }
      if (n.id === 'objective_fortress') {
        return {
          ...n,
          label: 'New Objective',
          subtitle: 'Deep Space Citadel',
          desc: 'Final trial: stationkeep at Sun-Earth L2 Lagrangian point and deploy observatory array.'
        }
      }
      return n
    }),
    connections: MAP_CONNECTIONS
  }
]

// Plain-language PDF validation
export function validatePdfFile(file, maxSizeBytes = MAX_FILE_SIZE_BYTES) {
  if (!file) {
    return {
      isValid: false,
      error: 'No file was selected. Please choose a PDF document.'
    }
  }

  // 1. Check file extension
  const fileName = file.name || ''
  const hasPdfExtension = fileName.toLowerCase().endsWith('.pdf')

  // 2. Check MIME type (allow empty MIME if extension is .pdf as fallback on some OS)
  const isPdfMime = file.type === 'application/pdf' || file.type === 'application/x-pdf'

  if (!hasPdfExtension && !isPdfMime) {
    return {
      isValid: false,
      error: 'Only PDF documents are supported. Please upload a file with the .pdf extension.'
    }
  }

  // 3. Check File Size Limit
  if (file.size > maxSizeBytes) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1)
    const limitInMb = (maxSizeBytes / (1024 * 1024)).toFixed(0)
    return {
      isValid: false,
      error: `File is too large (${sizeInMb} MB). Maximum permitted file size is ${limitInMb} MB.`
    }
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'The selected file is empty (0 bytes). Please upload a valid document.'
    }
  }

  return {
    isValid: true,
    fileDetails: {
      name: file.name,
      sizeBytes: file.size,
      sizeFormatted: formatBytes(file.size),
      lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'Today',
      type: 'PDF Document'
    }
  }
}

// Utility to format bytes into readable strings
export function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Mock service for future backend connectivity
export async function uploadLessonPdf(file) {
  // Frontend-only check: do not invent API endpoints or pretend content is extracted
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        backendConnected: false,
        fileName: file ? file.name : 'document.pdf',
        message:
          'PDF processing service is in local prototype mode (no backend server connected). The sample lesson world map will be loaded so you can explore all interactive features.',
        suggestedLesson: SAMPLE_LESSONS[0]
      })
    }, 1200)
  })
}
