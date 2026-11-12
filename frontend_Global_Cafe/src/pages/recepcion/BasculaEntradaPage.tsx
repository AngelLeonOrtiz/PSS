import React, { useState, useEffect } from "react";
import { Scale, Search, Loader2, Weight, Save, ChevronRight, ChevronDown, AlertCircle, MoreVertical, Truck } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty, TablePagination } from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";
import toast from "react-hot-toast";

// APIs
import { getPendientesBasculaApi, registrarPesadaEntradaApi, registrarPesadaSalidaApi, registrarSalidaCabezalApi, registrarEntradaCabezalApi } from "../../api/reception.api";
import { getBodegasApi, Bodega, getPlacasCabezalApi, PlacaCabezal } from "../../api/catalogs.api";

const colors = moduleColors.recepcion;

export default function BasculaEntradaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [recepciones, setRecepciones] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [placasCabezal, setPlacasCabezal] = useState<PlacaCabezal[]>([]);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);
  
  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"ENTRADA" | "SALIDA" | "SALIDA_CABEZAL" | "ENTRADA_CABEZAL">("ENTRADA");
  const [selectedRecepcion, setSelectedRecepcion] = useState<any | null>(null);
  const [selectedCarga, setSelectedCarga] = useState<any | null>(null);
  const [pesoInput, setPesoInput] = useState("");
  const [bodegaSearch, setBodegaSearch] = useState("");
  const [placaInput, setPlacaInput] = useState("");

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
      const [data, bods, placas] = await Promise.all([
        getPendientesBasculaApi(),
        getBodegasApi(),
        getPlacasCabezalApi()
      ]);
      setRecepciones(data);
      setBodegas(bods);
      setPlacasCabezal(placas);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los vehículos en báscula");
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id: number) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
  };

  const handleOpenModal = (recepcion: any, carga: any, mode: "ENTRADA" | "SALIDA" | "SALIDA_CABEZAL" | "ENTRADA_CABEZAL") => {
    setSelectedRecepcion(recepcion);
    setSelectedCarga(carga);
    setModalMode(mode);
    setPesoInput("");
    setBodegaSearch("");
    if (mode === "SALIDA_CABEZAL") {
      // Encontrar la placa actual: la última placa entrante si hubo cambios previos, o la placa original del viaje
      let currentCabezal = recepcion.id_placa_cabezal?.toString() || "";
      if (carga?.cambios_cabezal && carga.cambios_cabezal.length > 0) {
        const completedChanges = carga.cambios_cabezal.filter((c: any) => c.id_placa_cabezal_entrante != null);
        if (completedChanges.length > 0) {
          currentCabezal = completedChanges[completedChanges.length - 1].id_placa_cabezal_entrante.toString();
        }
      }
      setPlacaInput(currentCabezal);
    } else {
      setPlacaInput("");
    }
    setIsModalOpen(true);
  };

  const handleSubmitPeso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarga) return;

    const peso = Number(pesoInput);
    if (isNaN(peso) || peso <= 0) {
      toast.error("Por favor ingrese un peso válido mayor a cero.");
      return;
    }

    // Validaciones de sentido lógico de peso
    if (modalMode !== "ENTRADA" && selectedCarga.pesada_entrada && peso >= Number(selectedCarga.pesada_entrada)) {
      toast.error("El peso capturado no puede ser mayor o igual al Peso Bruto de la carga completa.");
      return;
    }

    if ((modalMode === "SALIDA_CABEZAL" || modalMode === "ENTRADA_CABEZAL") && !placaInput) {
      toast.error("Por favor, seleccione la placa del cabezal a registrar.");
      return;
    }

    try {
      setSubmitting(true);
      if (modalMode === "ENTRADA") {
        if (!bodegaSearch) {
          toast.error("Por favor, seleccione una bodega válida de la lista.");
          setSubmitting(false);
          return;
        }
        await registrarPesadaEntradaApi(selectedCarga.id_detalle_recepcion, peso, Number(bodegaSearch));
        toast.success("Peso Bruto registrado. El vehículo puede ir a descargar a bodega.");
      } else if (modalMode === "SALIDA_CABEZAL") {
        await registrarSalidaCabezalApi(selectedCarga.id_detalle_recepcion, Number(placaInput), peso);
        toast.success("Destarse de cabezal registrado. La carga queda 'Sin Cabezal'.");
      } else if (modalMode === "ENTRADA_CABEZAL") {
        await registrarEntradaCabezalApi(selectedCarga.id_detalle_recepcion, Number(placaInput), peso);
        toast.success("Nuevo cabezal enganchado. Peso Bruto corregido automáticamente.");
      } else {
        await registrarPesadaSalidaApi(selectedCarga.id_detalle_recepcion, peso);
        toast.success("Tara registrada. Pesaje completado correctamente.");
      }
      
      setIsModalOpen(false);
      loadData(); // Refrescar la tabla
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al registrar el peso en el sistema.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtro de búsqueda
  const filteredRecepciones = recepciones.filter(r => {
    const term = searchTerm.toLowerCase();
    return (
      r.numero_entrada?.toLowerCase().includes(term) ||
      r.placa_cabezal?.placa?.toLowerCase().includes(term) ||
      r.placa_furgon?.placa?.toLowerCase().includes(term) ||
      r.detalles?.some((d: any) => d.remision?.toLowerCase().includes(term)) ||
      r.detalles?.some((d: any) => d.proveedor?.nombre?.toLowerCase().includes(term))
    );
  });

  return (
    <div>
      <PageHeader title="Báscula de Entrada" subtitle="Control de Pesaje Bruto y Tara" icon={Scale} iconBg={colors.bg} iconColor={colors.icon} />

      <Card className="mb-6">
        <CardContent className="p-4">
          <Input placeholder="Buscar por ingreso, remisión o proveedor..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </CardContent>
      </Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>No. Entrada</TableHead>
              <TableHead>Fecha / Hora</TableHead>
              <TableHead>Transporte</TableHead>
              <TableHead>Placas</TableHead>
              <TableHead>Conductor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center" className="py-8"><Loader2 className="w-6 h-6 animate-spin inline-block text-neutral-400 mr-2"/> Cargando vehículos en báscula...</TableCell></TableRow>
            ) : filteredRecepciones.length === 0 ? (
              <TableEmpty message="No hay vehículos en patio en espera de pesaje." />
            ) : (
              filteredRecepciones.map((r) => {
                const isExpanded = expandedRows.includes(r.id_recepcion);
                const transporteName = r.conductor?.transporte?.nombre || "N/A";
                const conductorName = r.conductor?.nombre || "N/A";
                const cabezal = r.placa_cabezal?.placa || "N/A";
                const furgon = r.placa_furgon?.placa;

                // Verificar si el vehículo ya tiene alguna carga en proceso de pesaje
                const isVehicleOnScale = r.detalles?.some((d: any) => 
                  ['Pesada Abierta', 'Sin Cabezal'].includes(d.estado_transaccion?.nombre || '')
                );

                return (
                  <React.Fragment key={r.id_recepcion}>
                    <TableRow className={isExpanded ? "bg-amber-50/30" : "hover:bg-neutral-50"}>
                      <TableCell>
                        <button onClick={() => toggleRow(r.id_recepcion)} className="p-1 rounded-md hover:bg-neutral-200 text-neutral-500 transition-colors">
                          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                      </TableCell>
                      <TableCell className="font-bold text-coffee-700">{r.numero_entrada}</TableCell>
                      <TableCell>{new Date(r.fecha_entrada).toLocaleString()}</TableCell>
                      <TableCell>{transporteName}</TableCell>
                      <TableCell>
                        <div className="text-sm">Cab: <span className="font-medium">{cabezal}</span></div>
                        {furgon && <div className="text-sm text-neutral-500">Fur: <span className="font-medium">{furgon}</span></div>}
                      </TableCell>
                      <TableCell>{conductorName}</TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow className="bg-neutral-50/50 hover:bg-neutral-50/50">
                        <TableCell colSpan={6} className="p-0 border-b border-neutral-200">
                          <div className="pl-14 pr-6 py-4">
                            <div className="border border-neutral-200 rounded-lg bg-white shadow-sm">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-neutral-50">
                                      <TableHead align="center" className="w-20">Acciones</TableHead>
                                    <TableHead>Remisión</TableHead>
                                    <TableHead>Proveedor / Finca</TableHead>
                                    <TableHead align="center">Sacos</TableHead>
                                    <TableHead align="right">Pesada Entrada (Bruto)</TableHead>
                                    <TableHead align="right">Pesada Salida (Tara)</TableHead>
                                    <TableHead align="right">Cafe Neto</TableHead>
                                    <TableHead align="center">Estado</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {r.detalles.map((carga: any) => {
                                    const estadoNombre = carga.estado_transaccion?.nombre || "";
                                    const isMuestraAprobada = estadoNombre === "Muestra Aprobada";
                                    
                                    const isEntrada = isMuestraAprobada && !isVehicleOnScale;
                                    const isBloqueadoPorBascula = isMuestraAprobada && isVehicleOnScale;
                                    const isSalida = estadoNombre === "Pesada Abierta";
                                    const isSinCabezal = estadoNombre === "Sin Cabezal";
                                    const isPendiente = estadoNombre.includes("Pendiente");
                                    const isRechazada = estadoNombre.includes("Rechazada") || estadoNombre === "Devolución";
                                    const isCompletado = estadoNombre === "Pesaje Completado" || estadoNombre === "En Bodega";

                                    let rowClasses = "";
                                    if (isSalida || isSinCabezal) rowClasses = "bg-blue-50/40";
                                    if (isPendiente) rowClasses = "bg-amber-100/40 animate-[pulse_3s_ease-in-out_infinite]";
                                    if (isRechazada) rowClasses = "bg-red-100/40 animate-[pulse_3s_ease-in-out_infinite]";
                                    if (isCompletado) rowClasses = "opacity-60";

                                    return (
                                      <TableRow key={carga.id_detalle_recepcion} className={rowClasses}>
                                        <TableCell align="center">
                                          {(isEntrada || isSalida || isSinCabezal) ? (
                                            <div className={`relative inline-block text-left ${actionMenuOpen === carga.id_detalle_recepcion ? 'z-50' : ''}`}>
                                              <button onClick={(e) => { e.stopPropagation(); setActionMenuOpen(actionMenuOpen === carga.id_detalle_recepcion ? null : carga.id_detalle_recepcion); }} className="p-1.5 rounded-lg hover:bg-neutral-200 transition-colors">
                                                <MoreVertical className="w-5 h-5 text-neutral-600" />
                                              </button>
                                              {actionMenuOpen === carga.id_detalle_recepcion && (
                                                <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 py-1" onClick={e => e.stopPropagation()}>
                                                  {isEntrada && (
                                                    <button onClick={() => { setActionMenuOpen(null); handleOpenModal(r, carga, "ENTRADA"); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2">
                                                      <Scale className="w-4 h-4 text-coffee-600"/> Pesar Entrada (Bruto)
                                                    </button>
                                                  )}
                                                  {isSalida && (
                                                    <>
                                                      <button onClick={() => { setActionMenuOpen(null); handleOpenModal(r, carga, "SALIDA"); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2">
                                                        <Scale className="w-4 h-4 text-emerald-600"/> Pesar Salida (Tara)
                                                      </button>
                                                      <button onClick={() => { setActionMenuOpen(null); handleOpenModal(r, carga, "SALIDA_CABEZAL"); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 border-t border-neutral-100">
                                                        <Truck className="w-4 h-4 text-amber-600"/> Destarse (Salida de Cabezal)
                                                      </button>
                                                    </>
                                                  )}
                                                  {isSinCabezal && (
                                                    <button onClick={() => { setActionMenuOpen(null); handleOpenModal(r, carga, "ENTRADA_CABEZAL"); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2">
                                                      <Truck className="w-4 h-4 text-blue-600"/> Reenganchar (Entrada Cabezal)
                                                    </button>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          ) : (
                                            <>
                                              {isPendiente && <span className="text-xs font-semibold text-amber-700 flex items-center justify-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Esperando Aprob.</span>}
                                              {isRechazada && <span className="text-xs font-bold text-red-600 flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3"/> Rechazada</span>}
                                              {isCompletado && <span className="text-xs font-semibold text-neutral-500">Procesado</span>}
                                              {isBloqueadoPorBascula && <span className="text-xs font-semibold text-amber-600 flex items-center justify-center gap-1" title="Otra carga de este vehículo está en báscula"><Scale className="w-3 h-3"/> En Fila</span>}
                                            </>
                                          )}
                                        </TableCell>
                                        <TableCell className="font-medium text-neutral-700">{carga.remision}</TableCell>
                                        <TableCell>{carga.proveedor?.nombre}</TableCell>
                                        <TableCell align="center">{carga.cantidad_sacos}</TableCell>
                                        <TableCell align="right" className="font-mono text-neutral-600">{carga.pesada_entrada ? Number(carga.pesada_entrada).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "---"} LB</TableCell>
                                        <TableCell align="right" className="font-mono text-neutral-600">{carga.pesada_salida ? Number(carga.pesada_salida).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "---"} LB</TableCell>
                                        <TableCell align="right" className="font-mono font-bold text-coffee-800 text-base">{carga.peso_neto ? Number(carga.peso_neto).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "---"} LB</TableCell>
                                        <TableCell align="center">
                                          <Badge variant={isSalida || isSinCabezal ? "info" : isEntrada ? "success" : isRechazada ? "danger" : isPendiente ? "warning" : "default"} size="sm">{estadoNombre}</Badge>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={
        modalMode === "ENTRADA" ? "Pesada de Entrada (Vehículo Lleno)" : 
        modalMode === "SALIDA" ? "Pesada de Salida (Vehículo Vacío)" :
        modalMode === "SALIDA_CABEZAL" ? "Destarse - Registrar Salida de Cabezal" : 
        "Reenganchar - Registrar Entrada de Cabezal"
      } size="sm">
        {selectedRecepcion && selectedCarga && (
          <form onSubmit={handleSubmitPeso} className="space-y-6">
            
            <div className="bg-neutral-50 p-4 rounded-xl text-sm border border-neutral-200">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-neutral-500">Ingreso / Remisión:</p>
                <p className="font-bold text-right text-coffee-700">{selectedRecepcion.numero_entrada} / {selectedCarga.remision}</p>
                <p className="text-neutral-500">Proveedor:</p>
                <p className="font-medium text-right truncate">{selectedCarga.proveedor?.nombre}</p>
                <p className="text-neutral-500">Sacos Declarados:</p>
                <p className="font-medium text-right">{selectedCarga.cantidad_sacos}</p>
              </div>
              
              {modalMode !== "ENTRADA" && selectedCarga.pesada_entrada && (
                <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between items-center text-blue-800">
                  <span className="font-medium">Peso Bruto de Referencia:</span>
                  <span className="font-mono font-bold">{Number(selectedCarga.pesada_entrada).toLocaleString()} LB</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-700">Lectura del Indicador de la Báscula</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Weight className="h-6 w-6 text-neutral-400" /></div>
                <input
                  type="number" step="0.01" autoFocus required value={pesoInput} onChange={(e) => setPesoInput(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 text-right text-3xl font-mono font-black text-slate-800 border-2 border-neutral-300 rounded-xl focus:ring-coffee-500 focus:border-coffee-500"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"><span className="text-neutral-500 font-bold text-lg">LB</span></div>
              </div>
            </div>

            {/* Selector de Bodega (Solo visible en ENTRADA) */}
            {modalMode === "ENTRADA" && (
              <div className="space-y-2 mt-4 pt-4 border-t border-neutral-200">
                <Select
                  label="Bodega de Descarga"
                  value={bodegaSearch}
                  onChange={(e) => setBodegaSearch(e.target.value)}
                  options={[{ value: "", label: "Seleccione a qué bodega física debe dirigirse..." }, ...bodegas.map(b => ({ value: b.id_bodega.toString(), label: b.nombre }))]}
                  required={modalMode === "ENTRADA"}
                />
              </div>
            )}

            {/* Selector de Placa (Visible en CAMBIOS DE CABEZAL) */}
            {(modalMode === "SALIDA_CABEZAL" || modalMode === "ENTRADA_CABEZAL") && (
              <div className="space-y-2 mt-4 pt-4 border-t border-neutral-200">
                <Select
                  label={modalMode === "SALIDA_CABEZAL" ? "Placa del Cabezal que SALE" : "Placa del Cabezal que ENTRA"}
                  value={placaInput}
                  onChange={(e) => setPlacaInput(e.target.value)}
                  options={[{ value: "", label: "Seleccione la placa..." }, ...placasCabezal.map(p => ({ value: p.id_placa_cabezal.toString(), label: p.placa }))]}
                  required
                  disabled={modalMode === "SALIDA_CABEZAL"}
                />
              </div>
            )}

            <ModalFooter>
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancelar</Button>
              <Button type="submit" loading={submitting} leftIcon={<Save className="w-4 h-4"/>}>Guardar Peso</Button>
            </ModalFooter>
          </form>
        )}
      </Modal>
    </div>
  );
}
