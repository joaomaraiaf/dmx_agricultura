"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

declare module "leaflet" {
  namespace Draw {
    const Event: {
      CREATED: string;
      DELETED: string;
    };
  }
  namespace Control {
    class Draw extends L.Control {
      constructor(options?: any);
    }
  }
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
  const metersPerDegreeLat = earthRadius * Math.PI / 180;
  const metersPerDegreeLng = metersPerDegreeLat * Math.cos(latRadians);
  
  return area * metersPerDegreeLat * metersPerDegreeLng;
}

interface PlotData {
  id: string;
  coordinates: [number, number][];
  area: number;
  pointCount: number;
}

interface LeafletMapComponentProps {
  onPlotCreated?: (plotData: PlotData) => void;
}

export default function LeafletMapComponent({ onPlotCreated }: LeafletMapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [plots, setPlots] = useState<PlotData[]>([]);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("field-map", {
      center: [-22.683954, -47.326564],
      zoom: 15,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
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
            color: "#2563eb",
            weight: 2,
            fillOpacity: 0.2,
          },
        },
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (event: any) {
      const layer = event.layer;
      drawnItems.addLayer(layer);

      const coords = layer.getLatLngs()[0].map((latlng: any) => [
        latlng.lng,
        latlng.lat,
      ]);

      const area = calculatePolygonArea(coords) / 10000;
      const pointCount = coords.length;

      const plotData: PlotData = {
        id: `plot_${Date.now()}`,
        coordinates: coords,
        area: parseFloat(area.toFixed(4)),
        pointCount,
      };

      setPlots((prev) => [...prev, plotData]);
      
      if (onPlotCreated) {
        onPlotCreated(plotData);
      }

      layer.bindPopup(
        `<div>
          <strong>Talhão ${plotData.id}</strong><br/>
          Área: ${plotData.area} hectares<br/>
          Pontos: ${plotData.pointCount}
        </div>`
      );
    });

    map.on(L.Draw.Event.DELETED, function (event: any) {
      const layers = event.layers;
      layers.eachLayer(function (layer: any) {
        console.log("Talhão removido");
      });
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onPlotCreated]);

  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Criar Talhões
        </h3>
        <p className="text-blue-700 text-sm">
          Use a ferramenta de polígono para desenhar talhões no mapa. 
          Clique nos pontos para formar a área desejada.
        </p>
        {plots.length > 0 && (
          <div className="mt-3">
            <p className="text-blue-800 font-medium">
              Talhões criados: {plots.length}
            </p>
            <p className="text-blue-700 text-sm">
              Área total: {plots.reduce((sum, plot) => sum + plot.area, 0).toFixed(2)} hectares
            </p>
          </div>
        )}
      </div>
      
      <div
        id="field-map"
        style={{
          height: "600px",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          border: "2px solid #e5e7eb",
        }}
      />
    </div>
  );
}