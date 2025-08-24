
"use client";

import { useEffect, useRef, useState } from "react";
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

function generateRandomColor(): string {
    const colors = [
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
        "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
        "#F8C471", "#82E0AA", "#F1948A", "#85C1E9", "#D7BDE2",
        "#A3E4D7", "#F9E79F", "#FAD7A0", "#D5A6BD", "#AED6F1"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function LeafletMapComponent({ onPlotCreated }: FieldMapProps) {
    const mapRef = useRef<any>(null);
    const drawnItemsRef = useRef<any>(null);
    const tileLayerRef = useRef<any>(null);
    const [plots, setPlots] = useState<PlotData[]>([]);
    const [isMapReady, setIsMapReady] = useState(false);
    const [isSatellite, setIsSatellite] = useState(false);

    const toggleMapType = () => {
        if (!mapRef.current || !tileLayerRef.current) return;

        const map = mapRef.current;
        map.removeLayer(tileLayerRef.current);

        if (isSatellite) {
            tileLayerRef.current = (window as any).L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                { attribution: "© OpenStreetMap contributors" }
            );
        } else {
            tileLayerRef.current = (window as any).L.tileLayer(
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                { attribution: "© Esri" }
            );
        }

        tileLayerRef.current.addTo(map);
        setIsSatellite(!isSatellite);
    };

    useEffect(() => {
        if (typeof window === "undefined" || mapRef.current) return;

        const loadLeaflet = async () => {
            const L = (await import("leaflet")).default;
            require("leaflet-draw");

            const mapElement = document.getElementById("field-map");
            if (mapElement && (mapElement as any)._leaflet_id) {
                return;
            }

            const map = L.map("field-map", {
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
                            fillOpacity: 0.3,
                        },
                    },
                },
                edit: {
                    featureGroup: drawnItems,
                    remove: true,
                },
            });
            map.addControl(drawControl);

            map.on((L as any).Draw.Event.CREATED, function (event: any) {
                const layer = event.layer;
                const polygonColor = generateRandomColor();

                layer.setStyle({
                    color: polygonColor,
                    weight: 2,
                    fillOpacity: 0.3,
                    fillColor: polygonColor
                });

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
              <strong style="color: ${polygonColor}">Talhão ${plotData.id}</strong><br/>
              Área: ${plotData.area} hectares<br/>
              Pontos: ${plotData.pointCount}<br/>
              <div style="width: 20px; height: 20px; background-color: ${polygonColor}; border: 1px solid #000; margin-top: 5px;"></div>
            </div>`
                );
            });

            map.on((L as any).Draw.Event.DELETED, function (event: any) {
                const layers = event.layers;
                layers.eachLayer(function (layer: any) {
                    console.log("Talhão removido");
                });
            });

            mapRef.current = map;
            setIsMapReady(true);
        };

        loadLeaflet();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                drawnItemsRef.current = null;
                setIsMapReady(false);
            }
        };
    }, []);

    return (
        <div className="w-full">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-blue-900">
                        Criar Talhões
                    </h3>
                    <button
                        onClick={toggleMapType}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {isSatellite ? "🗺️ Mapa" : "🛰️ Satélite"}
                    </button>
                </div>
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

const DynamicLeafletMap = dynamic(() => Promise.resolve(LeafletMapComponent), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <div className="text-gray-500">Carregando mapa...</div>
        </div>
    ),
});

export default function FieldMap({ onPlotCreated }: FieldMapProps) {
    return <DynamicLeafletMap onPlotCreated={onPlotCreated} />;
}
