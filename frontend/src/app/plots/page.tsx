"use client";

import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { request, loading } = useApi();
  const [dashboardData, setDashboardData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await request("get", "/authenticated/users");
        setDashboardData(data);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      }
    };

    fetchDashboardData();
  }, [request]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Bem-vindo, <span className="font-medium">{user?.name}</span>
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Sistema DMX - Visão Geral
                </h2>
                <p className="text-gray-600 mb-6">
                  Aqui será exibida a visão geral do sistema com gráficos, estatísticas e informações importantes.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Total de Usuários</h3>
                    <p className="text-3xl font-bold text-indigo-600">
                      {dashboardData?.length}
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Plots Ativos</h3>
                    <p className="text-3xl font-bold text-green-600">0</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios</h3>
                    <p className="text-3xl font-bold text-blue-600">0</p>
                  </div>
                </div>

                <div className="mt-8 bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Sessão</h3>
                  <div className="text-left space-y-2">
                    <p><span className="font-medium">ID:</span> {user?.id}</p>
                    <p><span className="font-medium">Nome:</span> {user?.name}</p>
                    <p><span className="font-medium">Email:</span> {user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}