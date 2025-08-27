"use client";

import { useAuth } from "@/_hooks/useAuth";
import ProtectedRoute from "@/_components/ProtectedRoute";
import { useApi } from "@/_hooks/useApi";
import FieldMap from "@/_components/FieldMap";
import MenuBottom from "@/_components/MenuBottom";
import { useEffect, useMemo, useState } from "react";

interface PlotData {
  id: number;
  name: string;
  culture: string;
  coordinates: [number, number][];
  area: number;
  point_count: number;
  created_at?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { request, loading } = useApi();
  const [plots, setPlots] = useState<PlotData[]>([]);

  const formatHa = (value: number) =>
    Number(value || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  useEffect(() => {
    const loadPlots = async () => {
      try {
        const response = await request("get", "/authenticated/plots");
        const normalized = (response || []).map((p: any) => ({
          ...p,
          area: typeof p.area === "number" ? p.area : Number(p.area),
          point_count: typeof p.point_count === "number" ? p.point_count : Number(p.point_count),
          coordinates: Array.isArray(p.coordinates)
            ? p.coordinates
            : (typeof p.coordinates === "string" && p.coordinates.trim().startsWith("[")
                ? JSON.parse(p.coordinates)
                : []),
        }));
        setPlots(normalized);
      } catch (error) {
        console.error("Erro ao carregar talhões:", error);
      }
    };
    loadPlots();
  }, []);

  const metrics = useMemo(() => {
    const totalPlots = plots.length;
    const totalArea = plots.reduce((sum, p) => sum + (Number(p.area) || 0), 0);
    const cultureCount: Record<string, number> = {};
    plots.forEach((p) => {
      const key = (p.culture || "").trim();
      if (!key) return;
      cultureCount[key] = (cultureCount[key] || 0) + 1;
    });
    const topCulture = Object.entries(cultureCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
    return { totalPlots, totalArea, topCulture };
  }, [plots]);

  const latest5 = useMemo(() => plots.slice(0, 5), [plots]);
  const latest4 = useMemo(() => plots.slice(0, 4), [plots]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-stone-500">
        <MenuBottom />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <a className="inline-flex items-center text-sm font-medium text-white hover:text-blue-600 dark:text-white dark:hover:text-white">
                  <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Home
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <a className="ms-1 text-sm font-medium text-white hover:text-blue-600 md:ms-2 dark:text-white dark:hover:text-white">Dashboard</a>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className="mb-6 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">Visão geral dos Talhões</h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <span className="ml-3 text-white text-lg">Carregando talhões...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-stone-500">Total de Talhões</p>
              <p className="mt-2 text-3xl font-bold text-stone-800 dark:text-white">{metrics.totalPlots}</p>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-stone-500">Área Total (ha)</p>
              <p className="mt-2 text-3xl font-bold text-stone-800 dark:text-white">{formatHa(metrics.totalArea)}</p>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-stone-500">Cultura mais comum</p>
              <p className="mt-2 text-2xl font-semibold text-stone-800 dark:text-white">{metrics.topCulture}</p>
            </div>
          </div>

          <div className="w-full max-w-2xl p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Últimos Talhões</h5>
            </div>
            <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                {latest5.map((plot) => (
                  <li key={plot.id} className="py-3 sm:py-4">
                    <div className="flex items-center">
                      <div className="shrink-0">
                        <div className="w-8 h-8 rounded-full bg-stone-200 border border-stone-300" />
                      </div>
                      <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {plot.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          Plantação: {plot.culture}
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        ha: {formatHa(plot.area)}
                      </div>
                    </div>
                  </li>
                ))}
                {latest5.length === 0 && (
                  <li className="py-3 sm:py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Nenhum talhão cadastrado</div>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white mb-4">Mapas recentes</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latest4.map((plot) => (
                <div key={plot.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="text-lg font-semibold text-gray-900 dark:text-white">{plot.name}</h6>
                  </div>
                  <div
                    className="h-56 border rounded-lg overflow-hidden cursor-pointer"
                  >
                    <FieldMap onPlotCreated={() => { }} initialCoordinates={plot.coordinates} readOnly={true} />
                  </div>
                </div>
              ))}
              {latest4.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">Nenhum talhão para exibir no mapa</div>
              )}
            </div>
          </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}