
"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface PlotData {
  id: string;
  coordinates: [number, number][];
  area: number;
  pointCount: number;
}

interface FieldMapProps {
  onPlotCreated?: (plotData: PlotData) => void;
  initialCoordinates?: [number, number][];
  readOnly?: boolean;
}

function calculatePolygonArea(coordinates: [number, number][]): number {
  if (coordinates.length < 3) return 0;
  let area = 0;
  const n = coordinates.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += coordinates[i][0] * coordinates[j][1];
    area -= coordinates[j][0] * coordinates[i][1];
  }
  area = Math.abs(area) / 2;
  const earthRadius = 6371000;
  const latAvg = coordinates.reduce((sum, coord) => sum + coord[1], 0) / n;
  const latRadians = (latAvg * Math.PI) / 180;
  const metersPerDegreeLat = (earthRadius * Math.PI) / 180;
  const metersPerDegreeLng = metersPerDegreeLat * Math.cos(latRadians);
  return area * metersPerDegreeLat * metersPerDegreeLng;
}

const STABLE_COLOR = "#2563eb";

function LeafletMapComponent({ onPlotCreated, initialCoordinates, readOnly }: FieldMapProps) {
  const mapRef = useRef<any>(null);
  const drawnItemsRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const drawInitialPolygon = async () => {
    if (!mapRef.current || !drawnItemsRef.current) return;
    if (!initialCoordinates || initialCoordinates.length === 0) return;
    const L = (await import("leaflet")).default;
    const drawnItems = drawnItemsRef.current as any;
    try { drawnItems.clearLayers(); } catch {}
    const latlngs = initialCoordinates.map((coord) => [coord[1], coord[0]] as [number, number]);
    const polygon = (L as any).polygon(latlngs, {
      color: STABLE_COLOR,
      weight: 2,
      fillOpacity: 0.3,
      fillColor: STABLE_COLOR,
    });
    drawnItems.addLayer(polygon);
    try { mapRef.current.fitBounds(polygon.getBounds(), { padding: [16, 16] }); } catch {}
    try { mapRef.current.invalidateSize(false); } catch {}
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mapRef.current) return; 
    if (!containerRef.current) return; 

    let canceled = false;

    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet-draw");

      if (!containerRef.current || canceled) return;
      try { delete (containerRef.current as any)._leaflet_id; } catch {}

      await new Promise((r) => requestAnimationFrame(() => r(null)));
      if (!containerRef.current || canceled) return;

      const map = L.map(containerRef.current, {
        center: [-22.683954, -47.326564],
        zoom: 15,
      });

      const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      });
      tileLayer.addTo(map);
      tileLayerRef.current = tileLayer;

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;

      const drawControl = new (L.Control as any).Draw({
        draw: readOnly
          ? false
          : {
              polyline: false,
              rectangle: false,
              circle: false,
              marker: false,
              circlemarker: false,
              polygon: {
                allowIntersection: false,
                showArea: true,
                drawError: {
                  color: "#e1e100",
                  message: "<strong>Erro:</strong> Não é possível desenhar assim!",
                },
                shapeOptions: {
                  color: STABLE_COLOR,
                  weight: 2,
                  fillOpacity: 0.3,
                  fillColor: STABLE_COLOR,
                },
              },
            },
        edit: readOnly
          ? false
          : {
              featureGroup: drawnItems,
              remove: true,
            },
      });
      map.addControl(drawControl);

      map.on((L as any).Draw.Event.CREATED, function (event: any) {
        const layer = event.layer;
        layer.setStyle({ color: STABLE_COLOR, weight: 2, fillOpacity: 0.3, fillColor: STABLE_COLOR });
        drawnItems.addLayer(layer);
        const coords = layer.getLatLngs()[0].map((latlng: any) => [latlng.lng, latlng.lat]);
        const area = calculatePolygonArea(coords) / 10000;
        const pointCount = coords.length;
        const plotData: PlotData = {
          id: `plot_${Date.now()}`,
          coordinates: coords,
          area: parseFloat(area.toFixed(4)),
          pointCount,
        };
        onPlotCreated && onPlotCreated(plotData);
      });

      const invalidate = () => {
        try {
          map.invalidateSize(false);
        } catch {}
      };
      map.whenReady(() => setTimeout(invalidate, 0));
      window.addEventListener("resize", invalidate);

      (map as any)._resizeInvalidate = invalidate;

      mapRef.current = map;

      try {
        map.whenReady(() => {
          drawInitialPolygon();
        });
      } catch {}
    };

    init();

    return () => {
      canceled = true;
      if (mapRef.current) {
        try {
          const inv = (mapRef.current as any)._resizeInvalidate;
          if (inv) window.removeEventListener("resize", inv);
        } catch {}
        try {
          mapRef.current.remove();
        } catch {}
        mapRef.current = null;
      }
      drawnItemsRef.current = null;
      tileLayerRef.current = null;
      if (containerRef.current) {
        try { delete (containerRef.current as any)._leaflet_id; } catch {}
      }
    };
  }, [readOnly]);

  useEffect(() => {
    if (!mapRef.current || !drawnItemsRef.current) return;
    (async () => {
      try { drawnItemsRef.current.clearLayers(); } catch {}

      if (!initialCoordinates || initialCoordinates.length === 0) return;

      const L = (await import("leaflet")).default;
      const latlngs = initialCoordinates.map((coord) => [coord[1], coord[0]] as [number, number]);
      const polygon = (L as any).polygon(latlngs, {
        color: STABLE_COLOR,
        weight: 2,
        fillOpacity: 0.3,
        fillColor: STABLE_COLOR,
      });
      drawnItemsRef.current.addLayer(polygon);
      try {
        mapRef.current.fitBounds(polygon.getBounds(), { padding: [16, 16] });
      } catch {}
      try {
        mapRef.current.invalidateSize(false);
      } catch {}
    })();
  }, [initialCoordinates]);

  return (
    <div className="w-full h-full">
      <div
        ref={containerRef}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          border: "2px solid #e5e7eb",
        }}
      />
    </div>
  );
}

export default dynamic(() => Promise.resolve(LeafletMapComponent), { ssr: false });
