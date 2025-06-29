import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Mesh } from 'three'
import type { GeometryType } from '../types'

interface Shape3DProps {
  geometry: GeometryType
  color: string
  size: [number, number, number]
  animate?: boolean
  position?: [number, number, number]
  onClick?: () => void
}

export function Shape3D({ 
  geometry, 
  color, 
  size, 
  animate = false, 
  position = [0, 0, 0],
  onClick 
}: Shape3DProps) {
  const meshRef = useRef<Mesh>(null!)

  useFrame((_, delta) => {
    if (meshRef.current && animate) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  const renderGeometry = () => {
    switch (geometry) {
      case 'box':
        return <boxGeometry args={size} />
      case 'sphere':
        return <sphereGeometry args={[size[0], 64, 64]} />
      case 'cylinder':
        return <cylinderGeometry args={[size[0], size[0], size[1], 64]} />
      case 'cone':
        return <coneGeometry args={[size[0], size[1], 64]} />
      case 'torus':
        return <torusGeometry args={[size[0], size[2], 32, 128]} />
      case 'octahedron':
        return <octahedronGeometry args={[size[0], 2]} />
      default:
        return <boxGeometry args={size} />
    }
  }

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      onClick={onClick}
      castShadow
      receiveShadow
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = onClick ? 'pointer' : 'default'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'default'
      }}
    >
      {renderGeometry()}
      <meshStandardMaterial 
        color={color} 
        metalness={0.1}
        roughness={0.2}
        flatShading={false}
      />
    </mesh>
  )
}