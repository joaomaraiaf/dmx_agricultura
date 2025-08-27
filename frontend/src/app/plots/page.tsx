"use client";

import { useAuth } from "@/_hooks/useAuth";
import ProtectedRoute from "@/_components/ProtectedRoute";
import { useApi } from "@/_hooks/useApi";
import FieldMap from "@/_components/FieldMap";
import MenuBottom from "@/_components/MenuBottom";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { notify } from "@/_utils/notifications";

interface PlotData {
  id: number;
  name: string;
  culture: string;
  coordinates: [number, number][];
  area: number;
  point_count: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

interface ActivityData {
  id: number;
  field_id: number;
  activity_name: string;
  activity_details: string;
  activity_date: string;
  created_at?: string;
  updated_at?: string;
}

export default function PlotsPage() {
  const { user } = useAuth();
  const { request, loading } = useApi();
  const [plots, setPlots] = useState<PlotData[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);
  const [editingPlot, setEditingPlot] = useState<PlotData | null>(null);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const data = await request("get", "/authenticated/plots");
        const normalized = (data || []).map((p: any) => ({
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
    fetchPlots();
  }, []);

  useEffect(() => {
    const editIdParam = searchParams.get("edit");
    if (!editIdParam) return;

    const id = parseInt(editIdParam, 10);
    if (Number.isNaN(id)) return;

    const found = plots.find((p) => p.id === id);
    if (found) {
      setEditingPlot(found);
      setNewPlot({
        name: found.name,
        culture: found.culture,
        coordinates: Array.isArray(found.coordinates)
          ? found.coordinates
          : (typeof found.coordinates === "string" && (found.coordinates as any).trim?.().startsWith("[")
            ? JSON.parse(found.coordinates as any)
            : []),
        area: Number(found.area) || 0,
        point_count: Number(found.point_count) || 0,
      });
      setShowEditModal(true);
      loadActivities(found.id);
    }
  }, [searchParams, plots]);

  const [newPlot, setNewPlot] = useState<{ name: string; culture: string; coordinates: [number, number][]; area: number; point_count: number }>({ name: "", culture: "", coordinates: [], area: 0, point_count: 0 });
  const [newActivity, setNewActivity] = useState({ activity_name: "", activity_details: "", activity_date: "" });

  const loadPlots = async () => {
    try {
      const response = await request('get', '/authenticated/plots');
      const normalized = (response || []).map((p: any) => ({
        ...p,
        area: typeof p.area === 'number' ? p.area : Number(p.area),
        point_count: typeof p.point_count === 'number' ? p.point_count : Number(p.point_count),
      }));
      setPlots(normalized);
    } catch (error) {
      console.error('Error loading plots:', error);
    }
  };

  const loadActivities = async (plotId: number) => {
    try {
      const response = await request('get', `/authenticated/plots/${plotId}/activities`);
      setActivities(response);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  useEffect(() => {
    loadPlots();
  }, []);

  const handlePlotCreated = (plotData: any) => {
    setNewPlot(prev => ({
      ...prev,
      coordinates: plotData.coordinates,
      area: plotData.area,
      point_count: plotData.pointCount
    }));
  };

  const handleSavePlot = async () => {
    if (newPlot.name && newPlot.culture) {
      try {
        const plotData = {
          name: newPlot.name,
          culture: newPlot.culture,
          coordinates: newPlot.coordinates,
          area: newPlot.area,
          point_count: newPlot.point_count
        };

        await request('post', '/authenticated/plots', plotData);
        await loadPlots();
        setNewPlot({ name: "", culture: "", coordinates: [], area: 0, point_count: 0 });
        setNewActivity({ activity_name: "", activity_details: "", activity_date: "" });
        setShowModal(false);
        notify.success('Talhão criado com sucesso!');
      } catch (error) {
        console.error('Error saving plot:', error);
      }
    }
  };

  const handleUpdatePlot = async () => {
    if (editingPlot && newPlot.name && newPlot.culture) {
      try {
        const plotData = {
          name: newPlot.name,
          culture: newPlot.culture,
          coordinates: newPlot.coordinates,
          area: newPlot.area,
          point_count: newPlot.point_count
        };

        await request('put', `/authenticated/plots/${editingPlot.id}`, plotData);
        await loadPlots();
        setEditingPlot(null);
        setNewPlot({ name: "", culture: "", coordinates: [], area: 0, point_count: 0 });
        setNewActivity({ activity_name: "", activity_details: "", activity_date: "" });
        setShowEditModal(false);
        notify.success('Talhão editado com sucesso!');
      } catch (error) {
        console.error('Error updating plot:', error);
      }
    }
  };

  const handleDeletePlot = async (plotId: number) => {
    try {
      await request('delete', `/authenticated/plots/${plotId}`);
      await loadPlots();
      notify.success('Talhão excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting plot:', error);
    }
  };

  const handleViewPlot = async (plot: PlotData) => {
    setSelectedPlot(plot);
    await loadActivities(plot.id);
    setShowViewModal(true);
  };

  const handleEditPlot = (plot: PlotData) => {
    setEditingPlot(plot);
    setNewPlot({
      name: plot.name,
      culture: plot.culture,
      coordinates: plot.coordinates,
      area: plot.area,
      point_count: plot.point_count
    });
    setShowEditModal(true);
    loadActivities(plot.id);
  };

  const handleSaveActivity = async () => {
    if (editingPlot && newActivity.activity_name && newActivity.activity_date) {
      try {
        const activityData = {
          activity_name: newActivity.activity_name,
          activity_details: newActivity.activity_details,
          activity_date: newActivity.activity_date
        };

        await request('post', `/authenticated/plots/${editingPlot.id}/activities`, activityData);
        await loadActivities(editingPlot.id);
        setNewActivity({ activity_name: "", activity_details: "", activity_date: "" });
        notify.success('Atividade criada com sucesso!');
      } catch (error) {
        console.error('Error saving activity:', error);
      }
    }
  };

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
                  <a className="ms-1 text-sm font-medium text-white hover:text-blue-600 md:ms-2 dark:text-white dark:hover:text-white">Talhões</a>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">Visão geral dos Talhões</h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <span className="ml-3 text-white text-lg">Carregando talhões...</span>
            </div>
          ) : (
            <>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 px-4">
                  <div>
                    <button
                      onClick={() => setShowModal(true)}
                      className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5"
                    >
                      <svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                      </svg>
                      Adicionar Talhão
                    </button>
                  </div>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Nome</th>
                      <th scope="col" className="px-6 py-3">Cultura</th>
                      <th scope="col" className="px-6 py-3">Área (ha)</th>
                      <th scope="col" className="px-6 py-3">Pontos</th>
                      <th scope="col" className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plots.map((plot) => (
                      <tr key={plot.id} className="bg-white border-b hover:bg-gray-50">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {plot.name}
                        </th>
                        <td className="px-6 py-4">{plot.culture}</td>
                        <td className="px-6 py-4">{Number(plot.area).toFixed(2)}</td>
                        <td className="px-6 py-4">{plot.point_count}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditPlot(plot)}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m13.835 7.578-.005.007-7.137 7.137 2.139 2.138 7.143-7.142-2.14-2.14Zm-10.696 3.59 2.139 2.14 7.138-7.137.007-.005-2.141-2.141-7.143 7.143Zm1.433 4.261L2 12.852.051 18.684a1 1 0 0 0 1.265 1.264L7.147 18l-2.575-2.571Zm14.249-14.25a4.03 4.03 0 0 0-5.693 0L11.7 2.611 17.389 8.3l1.432-1.432a4.029 4.029 0 0 0 0-5.689Z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleViewPlot(plot)}
                              className="font-medium text-green-600 hover:underline"
                            >
                              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 14">
                                <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                  <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                  <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z" />
                                </g>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeletePlot(plot.id)}
                              className="font-medium text-red-600 hover:underline"
                            >
                              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {plots.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Nenhum talhão cadastrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
                  <div className="relative w-full max-w-4xl mx-auto my-6">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t">
                        <h3 className="text-3xl text-gray-700 font-semibold">Cadastrar Novo Talhão</h3>
                        <button
                          className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => setShowModal(false)}
                        >
                          <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                        </button>
                      </div>
                      <div className="relative p-6 flex-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Nome do Talhão</label>
                            <input
                              type="text"
                              value={newPlot.name}
                              onChange={(e) => setNewPlot(prev => ({ ...prev, name: e.target.value }))}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Digite o nome do talhão"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Cultura</label>
                            <select
                              value={newPlot.culture}
                              onChange={(e) => setNewPlot(prev => ({ ...prev, culture: e.target.value }))}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="">Selecione a cultura</option>
                              <option value="Soja">Soja</option>
                              <option value="Milho">Milho</option>
                              <option value="Trigo">Trigo</option>
                              <option value="Algodão">Algodão</option>
                              <option value="Cana-de-açúcar">Cana-de-açúcar</option>
                              <option value="Café">Café</option>
                            </select>
                          </div>
                        </div>

                        {newPlot.area > 0 && (
                          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-lg text-gray-700 font-medium mb-2">Informações do Talhão</h4>
                            <p className="text-sm text-gray-600">Área: {newPlot.area.toFixed(2)} hectares</p>
                            <p className="text-sm text-gray-600">Pontos: {newPlot.point_count}</p>
                          </div>
                        )}

                        <div className="mb-6">
                          <label className="block text-gray-700 text-sm font-bold mb-2">Localização - Desenhe o talhão no mapa</label>
                          <div className="h-96 border rounded-lg overflow-hidden">
                            <FieldMap onPlotCreated={handlePlotCreated} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          Cancelar
                        </button>
                        <button
                          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={handleSavePlot}
                          disabled={!newPlot.name || !newPlot.culture || newPlot.area === 0}
                        >
                          Salvar Talhão
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showViewModal && selectedPlot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
                  <div className="relative w-full max-w-6xl mx-auto my-6">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t">
                        <h3 className="text-3xl text-gray-700 font-semibold">Detalhes - {selectedPlot.name}</h3>
                        <button
                          className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => setShowViewModal(false)}
                        >
                          <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                        </button>
                      </div>
                      <div className="relative p-6 flex-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="p-4 text-gray-700 bg-gray-50 rounded-lg">
                            <h4 className="text-lg font-semibold mb-4">Informações Gerais</h4>
                            <p className="mb-2"><strong>Nome:</strong> {selectedPlot.name}</p>
                            <p className="mb-2"><strong>Cultura:</strong> {selectedPlot.culture}</p>
                            <p className="mb-2"><strong>Área:</strong> {Number(selectedPlot.area).toFixed(2)} hectares</p>
                            <p className="mb-2"><strong>Pontos:</strong> {selectedPlot.point_count}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-lg text-gray-700 font-semibold mb-4">Localização</h4>
                            <div className="h-64 border rounded-lg overflow-hidden">
                              <FieldMap
                                onPlotCreated={() => { }}
                                initialCoordinates={selectedPlot?.coordinates}
                                readOnly={true}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="text-lg text-gray-700 font-semibold mb-4">Atividades ({activities.length})</h4>
                          {activities.length > 0 ? (
                            <div className="relative overflow-x-auto">
                              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-6 py-3">Atividade</th>
                                    <th scope="col" className="px-6 py-3">Data</th>
                                    <th scope="col" className="px-6 py-3">Detalhes</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {activities.map((activity) => (
                                    <tr key={activity.id} className="bg-white border-b">
                                      <td className="px-6 py-4 font-medium text-gray-900">{activity.activity_name}</td>
                                      <td className="px-6 py-4">{new Date(activity.activity_date).toLocaleDateString('pt-BR')}</td>
                                      <td className="px-6 py-4">{activity.activity_details}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center py-8">Nenhuma atividade cadastrada para este talhão.</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b">
                        <button
                          className="bg-gray-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => setShowViewModal(false)}
                        >
                          Fechar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showEditModal && editingPlot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
                  <div className="relative w-full max-w-6xl mx-auto my-6">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t">
                        <h3 className="text-3xl font-semibold">Editar Talhão - {editingPlot.name}</h3>
                        <button
                          className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => setShowEditModal(false)}
                        >
                          <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                        </button>
                      </div>
                      <div className="relative p-6 flex-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Nome do Talhão</label>
                            <input
                              type="text"
                              value={newPlot.name}
                              onChange={(e) => setNewPlot(prev => ({ ...prev, name: e.target.value }))}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Digite o nome do talhão"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Cultura</label>
                            <select
                              value={newPlot.culture}
                              onChange={(e) => setNewPlot(prev => ({ ...prev, culture: e.target.value }))}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="">Selecione a cultura</option>
                              <option value="Soja">Soja</option>
                              <option value="Milho">Milho</option>
                              <option value="Trigo">Trigo</option>
                              <option value="Algodão">Algodão</option>
                              <option value="Cana-de-açúcar">Cana-de-açúcar</option>
                              <option value="Café">Café</option>
                            </select>
                          </div>
                        </div>

                        {newPlot.area > 0 && (
                          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-lg text-gray-700 font-semibold mb-2">Informações do Talhão</h4>
                            <p className="text-sm text-gray-600">Área: {newPlot.area.toFixed(2)} hectares</p>
                            <p className="text-sm text-gray-600">Pontos: {newPlot.point_count}</p>
                          </div>
                        )}

                        <div className="mb-6">
                          <label className="block text-gray-700 text-sm font-bold mb-2">Localização - Redesenhe o talhão se necessário</label>
                          <div className="h-96 border rounded-lg overflow-hidden">
                            <FieldMap
                              onPlotCreated={handlePlotCreated}
                              initialCoordinates={editingPlot?.coordinates}
                              readOnly={false}
                            />
                          </div>
                        </div>

                        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                          <h4 className="text-lg text-gray-700 font-semibold mb-4">Adicionar Nova Atividade</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">Nome da Atividade</label>
                              <input
                                type="text"
                                value={newActivity.activity_name}
                                onChange={(e) => setNewActivity(prev => ({ ...prev, activity_name: e.target.value }))}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Ex: Plantio, Colheita, Aplicação de defensivos"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">Data da Atividade</label>
                              <input
                                type="date"
                                value={newActivity.activity_date}
                                onChange={(e) => setNewActivity(prev => ({ ...prev, activity_date: e.target.value }))}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Detalhes da Atividade</label>
                            <textarea
                              value={newActivity.activity_details}
                              onChange={(e) => setNewActivity(prev => ({ ...prev, activity_details: e.target.value }))}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                              placeholder="Descreva os detalhes da atividade agrícola..."
                            />
                          </div>
                          <button
                            onClick={handleSaveActivity}
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                            disabled={!newActivity.activity_name || !newActivity.activity_date}
                          >
                            Adicionar Atividade
                          </button>
                        </div>

                        <div className="relative overflow-x-auto">
                          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3">Atividade</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Detalhes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activities.map((activity) => (
                                <tr key={activity.id} className="bg-white border-b hover:bg-gray-50">
                                  <td className="px-6 py-4 font-medium text-gray-900">{activity.activity_name}</td>
                                  <td className="px-6 py-4">{new Date(activity.activity_date).toLocaleDateString('pt-BR')}</td>
                                  <td className="px-6 py-4 max-w-xs truncate">{activity.activity_details}</td>
                                </tr>
                              ))}
                              {activities.length === 0 && (
                                <tr>
                                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                    Nenhuma atividade cadastrada
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => setShowEditModal(false)}
                        >
                          Cancelar
                        </button>
                        <button
                          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={handleUpdatePlot}
                          disabled={!newPlot.name || !newPlot.culture}
                        >
                          Salvar Alterações
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
