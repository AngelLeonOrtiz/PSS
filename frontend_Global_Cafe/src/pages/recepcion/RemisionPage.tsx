import React, { useState, useEffect } from "react";
import { ClipboardList, Plus, Search, Filter, Loader2, Trash2, ChevronRight, ChevronDown, MoreVertical, Edit, Printer } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty, TablePagination } from "../../components/ui/Table";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import Badge from "../../components/ui/Badge";
import { moduleColors } from "../../config/colors.config";
import toast from "react-hot-toast";

// APIs
import { 
  getCosechasApi, getPlacasCabezalApi, getPlacasFurgonApi, getTransportesApi,
  getConductoresApi, getMunicipiosApi, getProveedoresApi, 
  Cosecha, PlacaCabezal, PlacaFurgon, Conductor, Municipio, Proveedor, Transporte
} from "../../api/catalogs.api";
import { getReceptionsApi, createReceptionApi, updateReceptionApi, deleteReceptionApi, registrarImpresionApi, Recepcion, CreateReceptionRequest } from "../../api/reception.api";

const colors = moduleColors.recepcion;

// Interfaz para tipar correctamente nuestro formulario
interface RemisionFormData {
  id_cosecha: string;
  tipo_vehiculo: string;
  id_placa_cabezal: string;
  id_placa_furgon: string;
  id_transporte: string;
  id_conductor: string;
  id_municipio: string;
  marchamo: string;
  observaciones: string;
  detalles: {
    id_detalle_recepcion?: number;
    id_proveedor: string;
    cantidad_sacos: string;
    cantidad_qq: string;
    remision: string;
    observaciones: string;
    is_editable?: boolean;
  }[];
}

const initialState: RemisionFormData = {
  id_cosecha: "",
  tipo_vehiculo: "Camión Rígido",
  id_placa_cabezal: "",
  id_placa_furgon: "",
  id_transporte: "", // <-- Agregado para controlar la cascada
  id_conductor: "",
  id_municipio: "",
  marchamo: "",
  observaciones: "", // Observaciones generales del viaje
  detalles: [{
    id_proveedor: "",
    cantidad_sacos: "",
    cantidad_qq: "",
    remision: "",
    observaciones: "", // Observaciones específicas de esta carga
    is_editable: true
  }]
};

export default function RemisionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Catálogos para los Dropdowns
  const [cosechas, setCosechas] = useState<Cosecha[]>([]);
  const [placasCabezal, setPlacasCabezal] = useState<PlacaCabezal[]>([]);
  const [placasFurgon, setPlacasFurgon] = useState<PlacaFurgon[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [transportes, setTransportes] = useState<Transporte[]>([]);
  
  // Datos principales de la tabla
  const [recepciones, setRecepciones] = useState<Recepcion[]>([]);
  const [formData, setFormData] = useState(initialState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);
  
  // Estados para Anular (Eliminar)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [receptionToDelete, setReceptionToDelete] = useState<Recepcion | null>(null);
  
  // Estados para Imprimir Boleta
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [receptionToPrint, setReceptionToPrint] = useState<Recepcion | null>(null);

  // Efecto para cerrar el Dropdown al dar clic fuera
  useEffect(() => {
    const handleClickOutside = () => setActionMenuOpen(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cos, pc, pf, cond, mun, prov, trans, recs] = await Promise.all([
        getCosechasApi(),
        getPlacasCabezalApi(),
        getPlacasFurgonApi(),
        getConductoresApi(),
        getMunicipiosApi(),
        getProveedoresApi(),
        getTransportesApi(),
        getReceptionsApi()
      ]);
      setCosechas(cos);
      setPlacasCabezal(pc);
      setPlacasFurgon(pf);
      setConductores(cond);
      setMunicipios(mun);
      setProveedores(prov);
      setTransportes(trans);
      setRecepciones(recs);

      // Pre-seleccionar la cosecha actual por defecto para ahorrarle un paso al guardia
      const cosechaActual = cos.find(c => c.cosecha_actual);
      if (cosechaActual) {
        setFormData(prev => ({ ...prev, id_cosecha: cosechaActual.id_cosecha.toString() }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los datos del servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData(initialState);
    const cosechaActual = cosechas.find(c => c.cosecha_actual);
    if (cosechaActual) {
      setFormData(prev => ({ ...prev, id_cosecha: cosechaActual.id_cosecha.toString() }));
    }
    setIsModalOpen(true);
  };

  // Función para cargar los datos al modal cuando se hace clic en Editar
  const handleEdit = (recepcion: Recepcion) => {
    setEditingId(recepcion.id_recepcion);
    
    // Buscamos la empresa de transporte en base al conductor actual
    const conductorInfo = conductores.find(c => c.id_conductor === recepcion.id_conductor);
    const id_transporte = conductorInfo ? conductorInfo.id_transporte.toString() : "";

    setFormData({
      id_cosecha: recepcion.id_cosecha.toString(),
      tipo_vehiculo: recepcion.tipo_vehiculo,
      id_placa_cabezal: recepcion.id_placa_cabezal.toString(),
      id_placa_furgon: recepcion.id_placa_furgon ? recepcion.id_placa_furgon.toString() : "",
      id_transporte,
      id_conductor: recepcion.id_conductor.toString(),
      id_municipio: recepcion.id_municipio.toString(),
      marchamo: recepcion.marchamo || "",
      observaciones: recepcion.observaciones || "",
      // Solo cargamos los detalles que estén activos (estado = true)
      detalles: recepcion.detalles.filter(d => d.estado).map(d => ({
        id_detalle_recepcion: d.id_detalle_recepcion,
        id_proveedor: d.id_proveedor.toString(),
        cantidad_sacos: d.cantidad_sacos.toString(),
        cantidad_qq: d.cantidad_qq.toString(),
        remision: d.remision,
        observaciones: d.observaciones || "",
        is_editable: d.estado_transaccion?.nombre === "Pendiente de Muestrear"
      }))
    });
    
    setIsModalOpen(true);
  };

  const toggleRow = (id: number) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
  };

  const handleDeleteClick = (recepcion: Recepcion) => {
    setReceptionToDelete(recepcion);
    setActionMenuOpen(null);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!receptionToDelete) return;
    try {
      setSubmitting(true);
      await deleteReceptionApi(receptionToDelete.id_recepcion);
      toast.success("Ingreso anulado exitosamente");
      setIsDeleteModalOpen(false);
      loadData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al anular el ingreso");
    } finally {
      setSubmitting(false);
    }
  };

  // Funciones para Imprimir
  const handlePrintClick = (recepcion: Recepcion) => {
    setReceptionToPrint(recepcion);
    setActionMenuOpen(null);
    setIsPrintModalOpen(true);
  };

  const confirmPrint = async () => {
    window.print(); // Dispara la ventana de impresión del navegador
    
    // Registramos silenciosamente en el backend que se imprimió
    if (receptionToPrint) {
      try {
        await registrarImpresionApi(receptionToPrint.id_recepcion);
        loadData(); // Refrescamos la tabla por debajo para actualizar el contador
      } catch (error) {
        console.error("Error al registrar impresión:", error);
      }
    }
  };

  // Funciones para manejar los múltiples detalles de carga
  const handleDetalleChange = (index: number, field: string, value: string) => {
    const nuevosDetalles = [...formData.detalles];
    nuevosDetalles[index] = { ...nuevosDetalles[index], [field]: value };
    setFormData({ ...formData, detalles: nuevosDetalles });
  };

  const addDetalle = () => {
    setFormData({
      ...formData,
      detalles: [...formData.detalles, { id_proveedor: "", cantidad_sacos: "", cantidad_qq: "", remision: "", observaciones: "", is_editable: true }]
    });
  };

  const removeDetalle = (index: number) => {
    setFormData({ ...formData, detalles: formData.detalles.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload: CreateReceptionRequest = {
        id_cosecha: Number(formData.id_cosecha),
        tipo_vehiculo: formData.tipo_vehiculo,
        id_placa_cabezal: Number(formData.id_placa_cabezal),
        id_placa_furgon: formData.id_placa_furgon ? Number(formData.id_placa_furgon) : undefined,
        id_conductor: Number(formData.id_conductor),
        id_municipio: Number(formData.id_municipio),
        marchamo: formData.marchamo || undefined,
        observaciones: formData.observaciones || undefined,
        detalles: formData.detalles.map(d => ({
          id_detalle_recepcion: d.id_detalle_recepcion,
          id_proveedor: Number(d.id_proveedor),
          cantidad_sacos: Number(d.cantidad_sacos),
          cantidad_qq: Number(d.cantidad_qq),
          remision: d.remision,
          observaciones: d.observaciones || undefined
        }))
      };

      // Decidimos dinámicamente si crear o actualizar
      if (editingId) {
        await updateReceptionApi(editingId, payload);
        toast.success("Remisión actualizada correctamente");
      } else {
        await createReceptionApi(payload);
        toast.success("Remisión registrada en portería correctamente");
      }

      setIsModalOpen(false);
      loadData(); // Recargamos la tabla para ver el nuevo registro
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al registrar la remisión");
    } finally {
      setSubmitting(false);
    }
  };

  // 1. Filtrar solo los viajes que tengan al menos 1 carga "Pendiente de Muestrear"
  const recepcionesActivas = recepciones.filter(r => 
    r.detalles?.some(d => d.estado && d.estado_transaccion?.nombre === "Pendiente de Muestrear")
  );

  // 2. Aplicar el filtro de búsqueda de texto
  const filteredRecepciones = recepcionesActivas.filter(r => {
    const detallesActivos = r.detalles?.filter(d => d.estado) || [];
    const provNames = detallesActivos.map(d => proveedores.find(p => p.id_proveedor === d.id_proveedor)?.nombre || "");
    
    const conductorObj = conductores.find(c => c.id_conductor === r.id_conductor);
    const transporteName = transportes.find(t => t.id_transporte === conductorObj?.id_transporte)?.nombre || "";

    const term = searchTerm.toLowerCase();
    return r.numero_entrada.toLowerCase().includes(term) || transporteName.toLowerCase().includes(term) || provNames.some(name => name.toLowerCase().includes(term));
  });

  return (
    <div>
      <PageHeader title="Ingreso de Remisión" subtitle="Registro de vehículos y carga en portería" icon={ClipboardList} iconBg={colors.bg} iconColor={colors.icon} actions={[{ label: "Nueva Remisión", onClick: handleOpenModal, icon: Plus }]} />

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Buscar por número de entrada o proveedor..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead> {/* Columna para el ícono de expandir */}
              <TableHead align="center" className="w-20">Acciones</TableHead>
              <TableHead>No. Entrada</TableHead>
              <TableHead>Fecha / Hora</TableHead>
              <TableHead>Transporte</TableHead>
              <TableHead>Placas</TableHead>
              <TableHead>Conductor</TableHead>
              <TableHead align="center">Sacos</TableHead>
              <TableHead align="right">Quintales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" className="py-8 text-neutral-500">
                  <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" /> Cargando remisiones...
                </TableCell>
              </TableRow>
            ) : filteredRecepciones.length === 0 ? (
              <TableEmpty message="No hay ingresos pendientes de muestrear" />
            ) : (
              filteredRecepciones.map((r) => {
                // Consideramos todos los detalles activos (no eliminados) del viaje para mantener el contexto completo
                const detallesActivos = r.detalles?.filter(d => d.estado) || [];
                
                const totalSacos = detallesActivos.reduce((sum, d) => sum + d.cantidad_sacos, 0);
                const totalQq = detallesActivos.reduce((sum, d) => sum + Number(d.cantidad_qq), 0);
                const cabezal = placasCabezal.find(p => p.id_placa_cabezal === r.id_placa_cabezal)?.placa || "N/A";
                const furgon = r.id_placa_furgon ? placasFurgon.find(p => p.id_placa_furgon === r.id_placa_furgon)?.placa : null;
                
                const conductorObj = conductores.find(c => c.id_conductor === r.id_conductor);
                const conductor = conductorObj?.nombre || "N/A";
                const transporteName = transportes.find(t => t.id_transporte === conductorObj?.id_transporte)?.nombre || "N/A";
                const isExpanded = expandedRows.includes(r.id_recepcion);
                
                // Validación para ver si se puede editar o anular (TODOS los detalles activos deben estar pendientes)
                const activeDetails = r.detalles?.filter(d => d.estado) || [];
                const canModify = activeDetails.length > 0 && activeDetails.every(d => d.estado_transaccion?.nombre === "Pendiente de Muestrear");
                
                return (
                  <React.Fragment key={r.id_recepcion}>
                    {/* FILA PRINCIPAL (El Viaje) */}
                    <TableRow className={isExpanded ? "bg-amber-50/30" : ""}>
                      <TableCell>
                        <button onClick={() => toggleRow(r.id_recepcion)} className="p-1 rounded-md hover:bg-neutral-200 text-neutral-500 transition-colors">
                          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                      </TableCell>
                      <TableCell align="center">
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActionMenuOpen(actionMenuOpen === r.id_recepcion ? null : r.id_recepcion); }}
                            className="p-1.5 rounded-lg hover:bg-neutral-200 transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-neutral-600" />
                          </button>
                          {actionMenuOpen === r.id_recepcion && (
                            <div className="absolute left-0 top-full mt-1 w-40 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 py-1" onClick={e => e.stopPropagation()}>
                              <button 
                                onClick={(e) => { e.stopPropagation(); if(canModify) handleEdit(r); }} 
                                disabled={!canModify}
                                title={!canModify ? "No se puede editar porque ya hay cargas en proceso" : ""}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${canModify ? "text-neutral-700 hover:bg-neutral-50" : "text-neutral-400 cursor-not-allowed"}`}
                              >
                                <Edit className="w-4 h-4"/> Editar Viaje
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handlePrintClick(r); }} 
                                className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                              >
                                <Printer className="w-4 h-4 text-neutral-500"/> Imprimir Boleta
                              </button>
                              <div className="border-t border-neutral-100 my-1"></div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); if(canModify) handleDeleteClick(r); }} 
                                disabled={!canModify}
                                title={!canModify ? "No se puede anular porque ya hay cargas en proceso" : ""}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${canModify ? "text-red-600 hover:bg-red-50" : "text-neutral-400 cursor-not-allowed"}`}
                              >
                                <Trash2 className="w-4 h-4"/> Anular Ingreso
                              </button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-coffee-700">{r.numero_entrada}</TableCell>
                      <TableCell>
                        {new Date(r.fecha_entrada).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell>{transporteName}</TableCell>
                      <TableCell>
                        <div className="text-sm">Cab: <span className="font-medium">{cabezal}</span></div>
                        {furgon && <div className="text-sm text-neutral-500">Fur: <span className="font-medium">{furgon}</span></div>}
                      </TableCell>
                      <TableCell>{conductor}</TableCell>
                      <TableCell align="center">{totalSacos}</TableCell>
                      <TableCell align="right" className="font-semibold">{totalQq.toFixed(2)} QQ</TableCell>
                    </TableRow>

                    {/* SUB-TABLA EXPANDIDA (Las Cargas) */}
                    {isExpanded && (
                      <TableRow className="bg-neutral-50/50 hover:bg-neutral-50/50">
                        <TableCell colSpan={9} className="p-0 border-b border-neutral-200">
                          <div className="pl-14 pr-6 py-4">
                            <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-sm">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-neutral-50">
                                    <TableHead>Remisión Física</TableHead>
                                    <TableHead>Productor / Finca</TableHead>
                                    <TableHead align="center">Sacos</TableHead>
                                    <TableHead align="right">Quintales</TableHead>
                                    <TableHead align="center">Estado de Carga</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {detallesActivos.map((d) => (
                                    <TableRow key={d.id_detalle_recepcion}>
                                      <TableCell className="font-medium text-neutral-700">{d.remision}</TableCell>
                                      <TableCell>{proveedores.find(p => p.id_proveedor === d.id_proveedor)?.nombre}</TableCell>
                                      <TableCell align="center">{d.cantidad_sacos}</TableCell>
                                      <TableCell align="right">{Number(d.cantidad_qq).toFixed(2)} QQ</TableCell>
                                      <TableCell align="center">
                                        <Badge variant="warning" size="sm">{d.estado_transaccion?.nombre}</Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={filteredRecepciones.length} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Remisión (Ingreso a Portería)" size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Sección 1: Datos del Viaje */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">1</span>
              Datos del Viaje y Transporte
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Cosecha" value={formData.id_cosecha} onChange={(e) => setFormData({...formData, id_cosecha: e.target.value})} options={cosechas.map(c => ({ value: c.id_cosecha.toString(), label: c.cosecha }))} required />
              <Select label="Municipio de Origen" value={formData.id_municipio} onChange={(e) => setFormData({...formData, id_municipio: e.target.value})} options={[{value: "", label: "Seleccione un municipio"}, ...municipios.map(m => ({ value: m.id_municipio.toString(), label: `${m.nombre}${((m as any).departamento?.nombre) ? `, ${(m as any).departamento.nombre}` : ''}` }))]} required />
              
              {/* Cascada: Primero Empresa de Transporte */}
              <Select label="Empresa de Transporte" value={formData.id_transporte} onChange={(e) => setFormData({...formData, id_transporte: e.target.value, id_conductor: ""})} options={[{value: "", label: "Seleccione transporte"}, ...transportes.map(t => ({ value: t.id_transporte.toString(), label: t.nombre }))]} required />
              
              {/* Cascada: El Conductor se filtra por el Transporte seleccionado */}
              <Select label="Conductor" value={formData.id_conductor} onChange={(e) => setFormData({...formData, id_conductor: e.target.value})} options={[{value: "", label: "Seleccione un conductor"}, ...conductores.filter(c => c.id_transporte.toString() === formData.id_transporte).map(c => ({ value: c.id_conductor.toString(), label: c.nombre }))]} required disabled={!formData.id_transporte} />
              
              <Select 
                label="Tipo de Vehículo" 
                value={formData.tipo_vehiculo} 
                onChange={(e) => setFormData({
                  ...formData, 
                  tipo_vehiculo: e.target.value,
                  // Limpiar la placa del furgón automáticamente si no es Rastra
                  id_placa_furgon: e.target.value === "Rastra" ? formData.id_placa_furgon : ""
                })} 
                options={[
                  { value: "Camión Rígido", label: "Camión Rígido" },
                  { value: "Rastra", label: "Rastra (Cabezal y Furgón)" },
                  { value: "Pick-up", label: "Pick-up / Vehículo Liviano" }
                ]} 
                required 
              />

              <Select label="Placa Cabezal (Tractor o Vehículo)" value={formData.id_placa_cabezal} onChange={(e) => setFormData({...formData, id_placa_cabezal: e.target.value})} options={[{value: "", label: "Seleccione placa"}, ...placasCabezal.map(p => ({ value: p.id_placa_cabezal.toString(), label: p.placa }))]} required />
              
              <Select 
                label="Placa Furgón (Tráiler)" 
                value={formData.id_placa_furgon} 
                onChange={(e) => setFormData({...formData, id_placa_furgon: e.target.value})} 
                options={[{value: "", label: "Sin furgón"}, ...placasFurgon.map(p => ({ value: p.id_placa_furgon.toString(), label: p.placa }))]} 
                disabled={formData.tipo_vehiculo !== "Rastra"}
              />

              <div className="md:col-span-2">
                <Input label="Número de Marchamo (Opcional)" value={formData.marchamo} onChange={(e) => setFormData({...formData, marchamo: e.target.value})} placeholder="Si trae sello de seguridad..." />
              </div>
            </div>
          </div>

          {/* Sección 2: Datos de la Carga */}
          <div className="space-y-4">
            <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">2</span>
              Datos de la Carga (Café por Proveedor)
            </h3>
            
            {formData.detalles.map((detalle, index) => {
              const isReadOnly = detalle.is_editable === false;
              return (
              <div key={index} className={`bg-neutral-50 p-4 rounded-xl border border-neutral-200 relative ${isReadOnly ? 'opacity-80' : ''}`}>
                {index > 0 && !isReadOnly && (
                  <button type="button" onClick={() => removeDetalle(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors" title="Eliminar carga">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                {isReadOnly && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="warning" size="sm">No editable (En Proceso)</Badge>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 pr-8">
                    <Select label={`Proveedor / Finca ${index + 1}`} value={detalle.id_proveedor} onChange={(e) => handleDetalleChange(index, "id_proveedor", e.target.value)} options={[{value: "", label: "Busque y seleccione al proveedor"}, ...proveedores.map(p => ({ value: p.id_proveedor.toString(), label: p.nombre }))]} required disabled={isReadOnly} />
                  </div>
                  <Input label="Documento de Remisión" value={detalle.remision} onChange={(e) => handleDetalleChange(index, "remision", e.target.value)} placeholder="No. de Guía o Remisión Física" required disabled={isReadOnly} />
                  <div className="hidden md:block"></div>{/* Spacer */}
                  
                  <Input label="Cantidad de Sacos (Declarados)" type="number" value={detalle.cantidad_sacos} onChange={(e) => handleDetalleChange(index, "cantidad_sacos", e.target.value)} placeholder="0" required disabled={isReadOnly} />
                  <Input label="Peso Estimado (Quintales)" type="number" step="0.01" value={detalle.cantidad_qq} onChange={(e) => handleDetalleChange(index, "cantidad_qq", e.target.value)} placeholder="0.00" required disabled={isReadOnly} />
                  
                  <div className="md:col-span-2">
                    <Input label="Observaciones de esta carga" value={detalle.observaciones} onChange={(e) => handleDetalleChange(index, "observaciones", e.target.value)} placeholder="Humedad estimada, daños visibles..." disabled={isReadOnly} />
                  </div>
                </div>
              </div>
            )})}

            <Button type="button" variant="outline" size="sm" onClick={addDetalle} leftIcon={<Plus className="w-4 h-4" />}>
              Añadir otra remisión a este viaje
            </Button>
          </div>

          <ModalFooter>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancelar</Button>
            <Button type="submit" loading={submitting}>{editingId ? "Guardar Cambios" : "Registrar Ingreso"}</Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal de Confirmación de Anulación */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Anular Ingreso" size="sm">
        <div className="space-y-4">
          <p className="text-neutral-600">
            ¿Está seguro que desea anular el ingreso <span className="font-bold text-neutral-900">{receptionToDelete?.numero_entrada}</span>? 
            Esta acción cancelará permanentemente todas las cargas asociadas a este viaje y no se podrá deshacer.
          </p>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={submitting}>Cancelar</Button>
            <Button onClick={confirmDelete} loading={submitting} className="bg-red-600 hover:bg-red-700 text-white border-red-600 focus:ring-red-500">Sí, Anular Ingreso</Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Modal de Impresión de Boleta (Formato Preimpreso) */}
      <Modal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} title="Imprimir Boleta de Ingreso" size="lg">
        {receptionToPrint && (
          <div className="space-y-6">
            {/* 1. ESTILOS DE IMPRESIÓN (Solo se activan al imprimir) */}
            <style>{`
              @media print {
                /* Quita encabezados y pies de página automáticos del navegador */
                @page { margin: 0; size: 21.59cm 13.97cm; } /* Tamaño Carta Ancho, Media Carta Alto (Forma Continua Matricial) */
                
                /* Forzar al navegador a medir solo una página exacta y cortar el sobrante */
                html, body {
                  width: 21.59cm !important;
                  height: 13.97cm !important;
                  overflow: hidden !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }

                /* Ocultar toda la app y el modal normal */
                body * { visibility: hidden; }
                
                /* Mostrar solo el área de impresión */
                #print-area, #print-area * { visibility: visible; }
                
                #print-area {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 21.59cm; /* Ancho de carta completa */
                  height: 13.97cm; /* Alto de media carta */
                  font-family: 'Courier New', Courier, monospace; /* Fuente ideal para impresoras matriciales */
                  font-size: 11pt;
                  font-weight: bold;
                  color: black;
                }

                /* COORDENADAS EXACTAS (Optimizadas para matricial de medio formato) */
                .print-field { position: absolute; }
                .coord-numero { top: 1.0cm; left: 14.5cm; } 
                .coord-fecha  { top: 1.5cm; left: 14.5cm; }
                .coord-reimpresion { top: 2.0cm; left: 14.5cm; font-size: 14pt; color: black; border: 2px solid black; padding: 2px; }
                
                /* Columna Izquierda */
                .coord-transp { top: 3.0cm; left: 1.5cm; }
                .coord-conduc { top: 3.5cm; left: 1.5cm; }
                .coord-placas { top: 4.0cm; left: 1.5cm; }
                
                /* Columna Derecha */
                .coord-origen   { top: 3.0cm; left: 11.5cm; }
                .coord-marchamo { top: 3.5cm; left: 11.5cm; }
                
                .coord-tabla  { top: 5.5cm; left: 1.5cm; width: 18cm; }
                .coord-tabla td, .coord-tabla th { padding: 0.1cm 0; }
              }
            `}</style>

            {/* 2. VISTA PREVIA (Para la pantalla) */}
            <div className="bg-amber-50 p-6 rounded-xl border-2 border-dashed border-amber-200 text-neutral-800">
              <p className="text-sm text-amber-700 mb-4 font-medium flex items-center gap-2">
                <Printer className="w-4 h-4" /> 
                Revise los datos. Al imprimir, el sistema usará las coordenadas para el formato preimpreso.
              </p>
              
              {/* 3. ÁREA DE IMPRESIÓN (Lo que viaja a la impresora) */}
              <div id="print-area">
                <div className="print-field coord-numero">N° Ingreso: {receptionToPrint.numero_entrada}</div>
                <div className="print-field coord-fecha">Fecha: {new Date(receptionToPrint.fecha_entrada).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                {receptionToPrint.cantidad_impresiones > 0 && (
                  <div className="print-field coord-reimpresion">*** REIMPRESIÓN ***</div>
                )}
                
                {(() => {
                  const cond = conductores.find(c => c.id_conductor === receptionToPrint.id_conductor);
                  const transp = transportes.find(t => t.id_transporte === cond?.id_transporte);
                  const cab = placasCabezal.find(p => p.id_placa_cabezal === receptionToPrint.id_placa_cabezal)?.placa;
                  const fur = receptionToPrint.id_placa_furgon ? placasFurgon.find(p => p.id_placa_furgon === receptionToPrint.id_placa_furgon)?.placa : "";
                  
                  const muni = municipios.find(m => m.id_municipio === receptionToPrint.id_municipio);
                  const depto = muni ? (muni as any).departamento?.nombre : "";
                  const origen = muni ? (depto ? `${muni.nombre}, ${depto}` : muni.nombre) : "N/A";
                  
                  return (
                    <>
                      <div className="print-field coord-transp">Transporte: {transp?.nombre || "N/A"}</div>
                      <div className="print-field coord-conduc">Conductor: {cond?.nombre || "N/A"}</div>
                      <div className="print-field coord-placas">Placas: {cab} {fur ? ` / ${fur}` : ""}</div>
                      <div className="print-field coord-origen">Origen del café: {origen || "N/A"}</div>
                      <div className="print-field coord-marchamo">Marchamos: {receptionToPrint.marchamo || "N/A"}</div>
                    </>
                  );
                })()}

                <table className="print-field coord-tabla w-full text-left">
                  <thead className="border-b-2 border-black">
                    <tr>
                      <th className="pb-2 font-bold">Remisión</th>
                      <th className="pb-2 font-bold">Proveedor</th>
                      <th className="pb-2 text-center font-bold">Sacos</th>
                      <th className="pb-2 text-right font-bold">QQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receptionToPrint.detalles.map(d => (
                      <tr key={d.id_detalle_recepcion}>
                        <td>{d.remision}</td>
                        <td>{proveedores.find(p => p.id_proveedor === d.id_proveedor)?.nombre}</td>
                        <td className="text-center">{d.cantidad_sacos}</td>
                        <td className="text-right">{Number(d.cantidad_qq).toFixed(2)} QQ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <ModalFooter>
              <Button variant="outline" onClick={() => setIsPrintModalOpen(false)}>Cancelar</Button>
              <Button onClick={confirmPrint} leftIcon={<Printer className="w-4 h-4"/>}>Imprimir Formato</Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  );
}
