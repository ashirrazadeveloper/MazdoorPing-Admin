'use client'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapProps {
  latitude: number
  longitude: number
  zoom?: number
  markers?: Array<{ lat: number; lng: number; label?: string; color?: string }>
  className?: string
}

export default function MapComponent({ latitude, longitude, zoom = 13, markers, className = 'h-64 w-full rounded-xl' }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInst = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInst.current) return
    const map = L.map(mapRef.current).setView([latitude, longitude], zoom)
    mapInst.current = map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map)
    const makeIcon = (color: string) => L.divIcon({
      html: `<div style="background:${color};width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3)"></div>`,
      iconSize: [20, 20], iconAnchor: [10, 10], className: ''
    })
    if (markers?.length) {
      markers.forEach(m => L.marker([m.lat, m.lng], { icon: makeIcon(m.color || '#F97316') }).addTo(map).bindPopup(m.label || ''))
    } else {
      L.marker([latitude, longitude], { icon: makeIcon('#F97316') }).addTo(map)
    }
    return () => { map.remove(); mapInst.current = null }
  }, [latitude, longitude, zoom, markers])

  return <div ref={mapRef} className={className} />
}
