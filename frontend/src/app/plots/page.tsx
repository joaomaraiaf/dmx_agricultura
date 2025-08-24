"use client";

import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useApi } from "@/hooks/useApi";
import FieldMap from "@/components/FieldMap";
import MenuBottom from "@/components/MenuBottom";
import { useEffect, useState } from "react";

interface PlotData {
  id: string;
  coordinates: [number, number][];
  area: number;
  pointCount: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { request, loading } = useApi();
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [plots, setPlots] = useState<PlotData[]>([]);

  const handlePlotCreated = async (plotData: PlotData) => {
    try {
      setPlots(prev => [...prev, plotData]);
      console.log('Novo talhão criado:', plotData);
    } catch (error) {
      console.error('Erro ao salvar talhão:', error);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // const data = await request("get", "/authenticated/users");
        // setDashboardData(data);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      }
    };

    fetchDashboardData();
  }, [request]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-stone-500">
        {/* <div className="grid grid-cols-4 gap-4 p-4">
          <div className="bg-gray-500 h-16 w-32 flex items-center justify-center text-white">gray-500</div>
          <div className="bg-slate-500 h-16 w-32 flex items-center justify-center text-white">slate-500</div>
          <div className="bg-zinc-500 h-16 w-32 flex items-center justify-center text-white">zinc-500</div>
          <div className="bg-neutral-500 h-16 w-32 flex items-center justify-center text-white">neutral-500</div>
          <div className="bg-stone-500 h-16 w-32 flex items-center justify-center text-white">stone-500</div>
          <div className="bg-red-500 h-16 w-32 flex items-center justify-center text-white">red-500</div>
          <div className="bg-orange-500 h-16 w-32 flex items-center justify-center text-white">orange-500</div>
          <div className="bg-amber-500 h-16 w-32 flex items-center justify-center text-white">amber-500</div>
          <div className="bg-yellow-500 h-16 w-32 flex items-center justify-center text-black">yellow-500</div>
          <div className="bg-lime-500 h-16 w-32 flex items-center justify-center text-black">lime-500</div>
          <div className="bg-green-500 h-16 w-32 flex items-center justify-center text-white">green-500</div>
          <div className="bg-emerald-500 h-16 w-32 flex items-center justify-center text-white">emerald-500</div>
          <div className="bg-teal-500 h-16 w-32 flex items-center justify-center text-white">teal-500</div>
          <div className="bg-cyan-500 h-16 w-32 flex items-center justify-center text-white">cyan-500</div>
          <div className="bg-sky-500 h-16 w-32 flex items-center justify-center text-white">sky-500</div>
          <div className="bg-blue-500 h-16 w-32 flex items-center justify-center text-white">blue-500</div>
          <div className="bg-indigo-500 h-16 w-32 flex items-center justify-center text-white">indigo-500</div>
          <div className="bg-violet-500 h-16 w-32 flex items-center justify-center text-white">violet-500</div>
          <div className="bg-purple-500 h-16 w-32 flex items-center justify-center text-white">purple-500</div>
          <div className="bg-fuchsia-500 h-16 w-32 flex items-center justify-center text-white">fuchsia-500</div>
          <div className="bg-pink-500 h-16 w-32 flex items-center justify-center text-white">pink-500</div>
          <div className="bg-rose-500 h-16 w-32 flex items-center justify-center text-white">rose-500</div>
        </div> */}

        <MenuBottom />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total de Usuários</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {dashboardData?.length || 0}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Talhões Criados</h3>
                <p className="text-3xl font-bold text-green-600">{plots.length}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Área Total</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {plots.reduce((sum, plot) => sum + plot.area, 0).toFixed(2)} ha
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Usuário</h3>
                <p className="text-sm text-gray-600">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Gerenciamento de Talhões
              </h2>
              <FieldMap onPlotCreated={handlePlotCreated} />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}