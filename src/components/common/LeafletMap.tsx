import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';

export interface MapMarkerItem {
  id: string;
  lat: number;
  lng: number;
  title: string;
  status?: 'normal' | 'warning' | 'critical' | 'operational' | 'faulty' | 'under_maintenance';
  details?: string;
  category?: string;
  code?: string;
}

interface LeafletMapProps {
  markers?: MapMarkerItem[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  enableClickPicker?: boolean;
  onLocationSelected?: (loc: { lat: number; lng: number; approxLocation: string }) => void;
  selectedMarkerId?: string;
  onMarkerSelect?: (marker: MapMarkerItem) => void;
  filterStatus?: string;
}

declare global {
  interface Window {
    L?: any;
  }
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  markers = [],
  center = [27.5684, 80.6829], // Default center around Sitapur rural cluster
  zoom = 12,
  height = "420px",
  enableClickPicker = false,
  onLocationSelected,
  selectedMarkerId,
  onMarkerSelect,
  filterStatus = 'all'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletMarkersRef = useRef<any[]>([]);
  const pickerMarkerRef = useRef<any>(null);
  const [pickedCoords, setPickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  // Check if Leaflet is loaded
  useEffect(() => {
    let checkInterval: any = null;
    if (typeof window !== 'undefined' && window.L) {
      setIsLeafletReady(true);
    } else {
      checkInterval = setInterval(() => {
        if (typeof window !== 'undefined' && window.L) {
          setIsLeafletReady(true);
          clearInterval(checkInterval);
        }
      }, 250);
    }
    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const L = window.L;
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Attribution control in compact bottom right
      L.control.attribution({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;

      if (enableClickPicker && onLocationSelected) {
        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          const latFixed = parseFloat(lat.toFixed(5));
          const lngFixed = parseFloat(lng.toFixed(5));
          setPickedCoords({ lat: latFixed, lng: lngFixed });

          if (pickerMarkerRef.current) {
            pickerMarkerRef.current.setLatLng([latFixed, lngFixed]);
          } else {
            const pickerIcon = L.divIcon({
              className: 'custom-picker-pin',
              html: `<div style="background-color: #1B5E3A; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white; font-weight: bold;">📍</div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 32]
            });
            pickerMarkerRef.current = L.marker([latFixed, lngFixed], { icon: pickerIcon }).addTo(map);
          }

          onLocationSelected({
            lat: latFixed,
            lng: lngFixed,
            approxLocation: `GPS: ${latFixed}, ${lngFixed}`
          });
        });
      }

      // Invalidate size once rendered
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    } catch (e) {
      console.warn("Leaflet map initialization warning:", e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isLeafletReady]);

  // Update markers on data or filter change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    // Clear old markers
    leafletMarkersRef.current.forEach(m => map.removeLayer(m));
    leafletMarkersRef.current = [];

    const filtered = markers.filter(m => {
      if (!filterStatus || filterStatus === 'all') return true;
      return m.status === filterStatus;
    });

    filtered.forEach(item => {
      let color = "#1B5E3A";
      let statusLabel = item.status || "active";
      if (item.status === 'critical' || item.status === 'faulty') {
        color = "#C62828";
      } else if (item.status === 'warning' || item.status === 'under_maintenance') {
        color = "#E6A700";
      } else if (item.status === 'normal' || item.status === 'operational') {
        color = "#1E8E5A";
      }

      const isSelected = selectedMarkerId === item.id;
      const size = isSelected ? 34 : 26;
      const borderWidth = isSelected ? 3 : 2;

      const markerHtml = `
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: ${borderWidth}px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          ${item.code ? item.code.slice(-2) : '•'}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-map-icon',
        html: markerHtml,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; padding: 2px; max-width: 220px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; color: ${color}; margin-bottom: 2px;">
            ${statusLabel}
          </div>
          <div style="font-weight: 700; font-size: 13px; color: #0B1B2B; margin-bottom: 4px;">
            ${item.title}
          </div>
          ${item.details ? `<div style="font-size: 11px; color: #5A6B7B; line-height: 1.4;">${item.details}</div>` : ''}
          <div style="font-size: 10px; color: #94A3B8; margin-top: 4px;">
            GPS: ${item.lat.toFixed(4)}, ${item.lng.toFixed(4)}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onMarkerSelect) onMarkerSelect(item);
      });

      leafletMarkersRef.current.push(marker);
    });
  }, [markers, filterStatus, selectedMarkerId, isLeafletReady]);

  // Center pan when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.panTo(center, { animate: true });
    }
  }, [center]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100">
      {enableClickPicker && (
        <div className="absolute top-3 left-3 right-3 z-20 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between text-xs text-[#0B1B2B]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#1B5E3A]" />
            <span>
              <strong>Map Picker:</strong> Click anywhere on the map to set GPS coordinates
            </span>
          </div>
          {pickedCoords && (
            <span className="font-mono bg-emerald-50 text-[#1B5E3A] px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
              {pickedCoords.lat}, {pickedCoords.lng}
            </span>
          )}
        </div>
      )}

      {/* Map surface */}
      <div ref={mapContainerRef} style={{ height }} className="w-full relative z-10" />

      {/* Map Legend */}
      <div className="absolute bottom-2 left-2 z-20 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-md border border-slate-200 shadow-xs text-[11px] text-slate-700 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1E8E5A]" />
          <span>Normal / Safe</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E6A700]" />
          <span>Warning / Attention</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C62828]" />
          <span>Critical / Overdue</span>
        </div>
      </div>
    </div>
  );
};
