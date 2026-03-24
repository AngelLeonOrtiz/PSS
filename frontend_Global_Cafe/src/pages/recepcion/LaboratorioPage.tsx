import { useState, useEffect } from "react";
import { TestTube, Search, Beaker, Save, Loader2, Printer, MoreVertical } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty, TablePagination } from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";
import toast from "react-hot-toast";

// APIs
import { getReceptionsApi, DetalleRecepcion } from "../../api/reception.api";
import { getProveedoresApi, getCatadoresApi, getCalidadesApi, getDefectosApi, getZarandasApi, getTazasApi } from "../../api/catalogs.api";
import { createAnalisisApi, getAnalisisPendientesApi, CreateAnalisisRequest } from "../../api/analisis.api";

const colors = moduleColors.recepcion;

interface MuestraPendiente extends DetalleRecepcion {
  numero_entrada: string;
  proveedor_nombre: string;
  analisis?: any; // Añadido para la impresión
}

export default function LaboratorioPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [muestras, setMuestras] = useState<MuestraPendiente[]>([]);
  const [selectedMuestra, setSelectedMuestra] = useState<MuestraPendiente | null>(null);
  const [muestraToPrint, setMuestraToPrint] = useState<MuestraPendiente | null>(null);
  
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);
  
  // Catálogos
  const [catadores, setCatadores] = useState<any[]>([]);
  const [calidades, setCalidades] = useState<any[]>([]);
  const [defectos, setDefectos] = useState<any[]>([]);
  const [zarandas, setZarandas] = useState<any[]>([]);
  const [tazas, setTazas] = useState<any[]>([]);

  // Estado del Formulario
  const [formData, setFormData] = useState({
    id_catador: "",
    id_calidad: "",
    humedad: "",
    dano: "",
    primer_rendimiento: "",
    segundo_rendimiento: "",
    observaciones: "",
    defectos: {} as Record<number, string>,
    zarandas: {} as Record<number, string>,
    tazas: {} as Record<number, string>,
  });

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
      const [recepciones, provs, cat, cal, def, zar, taz, analisisPendientes] = await Promise.all([
        getReceptionsApi(), getProveedoresApi(), getCatadoresApi(), getCalidadesApi(), getDefectosApi(), getZarandasApi(), getTazasApi(), getAnalisisPendientesApi()
      ]);

      setCatadores(cat); setCalidades(cal); setDefectos(def); setZarandas(zar); setTazas(taz);

      const pendientes: MuestraPendiente[] = [];
      recepciones.forEach(rec => {
        if (!rec.estado) return;
        rec.detalles.forEach(det => {
          // Filtramos solo los que están "Muestreado" (La bolsa ya llegó al laboratorio físico)
          if (det.estado && det.estado_transaccion?.nombre === "Muestreado") {
            pendientes.push({
              ...det,
              numero_entrada: rec.numero_entrada,
              proveedor_nombre: provs.find(p => p.id_proveedor === det.id_proveedor)?.nombre || "N/A"
            });
          }
        });
      });

      // Añadimos las que están pendientes de aprobación de Gerencia
      analisisPendientes.forEach(ana => {
        const det = ana.detalle_recepcion;
        if (det && det.estado_transaccion?.nombre === "Muestra Previa Pendiente de Aprobacion") {
           pendientes.push({
             ...det,
             numero_entrada: det.recepcion?.numero_entrada || "N/A",
             proveedor_nombre: det.proveedor?.nombre || "N/A",
             analisis: ana
           });
        }
      });

      setMuestras(pendientes);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los datos del laboratorio");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (muestra: MuestraPendiente) => {
    setSelectedMuestra(muestra);
    setFormData({
      id_catador: "", id_calidad: "", humedad: "", dano: "", primer_rendimiento: "", segundo_rendimiento: "", observaciones: "",
      defectos: {}, zarandas: {}, tazas: {}
    });
  };

  const handlePrintClick = (muestra: MuestraPendiente) => {
    setMuestraToPrint(muestra);
    setActionMenuOpen(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMuestra) return;

    try {
      setSubmitting(true);

      // Mapeamos los objetos Record a arreglos limpios para Prisma (solo los que tengan cantidad > 0)
      const payload: CreateAnalisisRequest = {
        id_detalle_recepcion: selectedMuestra.id_detalle_recepcion,
        tipo_analisis: "Muestra Previa",
        id_catador: Number(formData.id_catador),
        id_calidad: formData.id_calidad ? Number(formData.id_calidad) : undefined,
        humedad: formData.humedad ? Number(formData.humedad) : undefined,
        dano: formData.dano ? Number(formData.dano) : undefined,
        primer_rendimiento: formData.primer_rendimiento ? Number(formData.primer_rendimiento) : undefined,
        segundo_rendimiento: formData.segundo_rendimiento ? Number(formData.segundo_rendimiento) : undefined,
        observaciones: formData.observaciones || undefined,
        defectos: Object.entries(formData.defectos).map(([id, val]) => ({ id_defecto: Number(id), cantidad: Number(val) })).filter(d => d.cantidad > 0),
        zarandas: Object.entries(formData.zarandas).map(([id, val]) => ({ id_zaranda: Number(id), cantidad: Number(val) })).filter(z => z.cantidad > 0),
        tazas: Object.entries(formData.tazas).map(([id, val]) => ({ id_tazas: Number(id), cantidad: Number(val) })).filter(t => t.cantidad > 0)
      };

      await createAnalisisApi(payload);
      toast.success("Análisis guardado exitosamente. Pasando a Gerencia.");

      setSelectedMuestra(null);
      loadData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al guardar el análisis");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMuestras = muestras.filter(m => 
    m.numero_entrada.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.remision.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.proveedor_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Laboratorio" subtitle="Bandeja de Catación y Análisis Físico" icon={TestTube} iconBg={colors.bg} iconColor={colors.icon} />

      <Card className="mb-6">
        <CardContent className="p-4">
          <Input placeholder="Buscar por ingreso, remisión o proveedor..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </CardContent>
      </Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead align="center" className="w-32">Acción</TableHead>
              <TableHead>No. Ingreso</TableHead>
              <TableHead>Remisión Física</TableHead>
              <TableHead>Proveedor / Productor</TableHead>
              <TableHead align="right">Volumen</TableHead>
              <TableHead align="center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center" className="py-8"><Loader2 className="w-6 h-6 animate-spin inline-block text-neutral-400"/> Cargando bandeja de laboratorio...</TableCell></TableRow>
            ) : filteredMuestras.length === 0 ? (
              <TableEmpty message="Laboratorio limpio. No hay muestras en espera de catación." />
            ) : (
              filteredMuestras.map((m) => {
                const isMuestreado = m.estado_transaccion?.nombre === "Muestreado";
                const isPendienteAprobacion = m.estado_transaccion?.nombre === "Muestra Previa Pendiente de Aprobacion";
                
                return (
                <TableRow key={m.id_detalle_recepcion}>
                  <TableCell align="center">
                    <div className="relative inline-block text-left">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActionMenuOpen(actionMenuOpen === m.id_detalle_recepcion ? null : m.id_detalle_recepcion); }}
                        className="p-1.5 rounded-lg hover:bg-neutral-200 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-neutral-600" />
                      </button>
                      {actionMenuOpen === m.id_detalle_recepcion && (
                        <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 py-1" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); if(isMuestreado) { handleOpenModal(m); setActionMenuOpen(null); } }} 
                            disabled={!isMuestreado}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${isMuestreado ? "text-neutral-700 hover:bg-neutral-50" : "text-neutral-400 cursor-not-allowed"}`}
                          >
                            <Beaker className="w-4 h-4"/> Crear Análisis
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); if(isPendienteAprobacion) handlePrintClick(m); }} 
                            disabled={!isPendienteAprobacion}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${isPendienteAprobacion ? "text-neutral-700 hover:bg-neutral-50" : "text-neutral-400 cursor-not-allowed"}`}
                          >
                            <Printer className="w-4 h-4"/> Imprimir Boleta
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-neutral-600">{m.numero_entrada}</TableCell>
                  <TableCell className="font-bold text-coffee-700">{m.remision}</TableCell>
                  <TableCell>{m.proveedor_nombre}</TableCell>
                  <TableCell align="right">{Number(m.cantidad_qq).toFixed(2)} QQ</TableCell>
                  <TableCell align="center">
                    <Badge variant={isMuestreado ? "warning" : "info"} size="sm">
                      {isMuestreado ? "En Laboratorio" : "Esperando Aprobación"}
                    </Badge>
                  </TableCell>
                </TableRow>
              )})
            )}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={filteredMuestras.length} />
      </Card>

      {/* Modal Masivo del Formulario de Catación */}
      <Modal isOpen={!!selectedMuestra} onClose={() => setSelectedMuestra(null)} title="Ingreso de Resultados de Catación" size="lg">
        {selectedMuestra && (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Datos Generales */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">Información General y Rendimiento</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Catador Responsable" value={formData.id_catador} onChange={(e) => setFormData({...formData, id_catador: e.target.value})} options={[{value: "", label: "Seleccione catador"}, ...catadores.map(c => ({value: c.id_catador.toString(), label: c.nombre}))]} required />
                <Select label="Grado de Calidad" value={formData.id_calidad} onChange={(e) => setFormData({...formData, id_calidad: e.target.value})} options={[{value: "", label: "Seleccione calidad"}, ...calidades.map(c => ({value: c.id_calidad.toString(), label: c.nombre}))]} />
                <div className="md:col-span-1"></div>
                <Input label="Humedad (%)" type="number" step="0.01" placeholder="0.00" value={formData.humedad} onChange={(e) => setFormData({...formData, humedad: e.target.value})} />
                <Input label="Daño Total (%)" type="number" step="0.01" placeholder="0.00" value={formData.dano} onChange={(e) => setFormData({...formData, dano: e.target.value})} />
                <div className="md:col-span-1"></div>
                <Input label="Primer Rendimiento" type="number" step="0.01" placeholder="0.00" value={formData.primer_rendimiento} onChange={(e) => setFormData({...formData, primer_rendimiento: e.target.value})} />
                <Input label="Segundo Rendimiento" type="number" step="0.01" placeholder="0.00" value={formData.segundo_rendimiento} onChange={(e) => setFormData({...formData, segundo_rendimiento: e.target.value})} />
              </div>
            </div>

            {/* 2. Defectos Físicos */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">Análisis de Defectos Físicos (Gramos / Porcentaje)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {defectos.map(def => (
                  <Input 
                    key={def.id_defecto} 
                    label={def.nombre} 
                    type="number" 
                    step="0.01" 
                    placeholder="0" 
                    value={formData.defectos[def.id_defecto] || ""} 
                    onChange={(e) => setFormData({...formData, defectos: {...formData.defectos, [def.id_defecto]: e.target.value}})} 
                  />
                ))}
              </div>
            </div>

            {/* 3. Mallas / Zarandas */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">Análisis de Tamaño (Mallas / Zarandas)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {zarandas.map(zar => (
                  <Input 
                    key={zar.id_zaranda} 
                    label={zar.nombre} 
                    type="number" 
                    step="0.01" 
                    placeholder="0" 
                    value={formData.zarandas[zar.id_zaranda] || ""} 
                    onChange={(e) => setFormData({...formData, zarandas: {...formData.zarandas, [zar.id_zaranda]: e.target.value}})} 
                  />
                ))}
              </div>
            </div>

            {/* 4. Atributos de Taza */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">Catación y Atributos de Taza (Puntos)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {tazas.map(taza => (
                  <Input 
                    key={taza.id_tazas} 
                    label={taza.nombre} 
                    type="number" 
                    step="0.01" 
                    placeholder="0" 
                    value={formData.tazas[taza.id_tazas] || ""} 
                    onChange={(e) => setFormData({...formData, tazas: {...formData.tazas, [taza.id_tazas]: e.target.value}})} 
                  />
                ))}
              </div>
            </div>

            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <Input label="Observaciones Finales del Laboratorio" placeholder="Notas sobre olor, color o recomendaciones para gerencia..." value={formData.observaciones} onChange={(e) => setFormData({...formData, observaciones: e.target.value})} />
            </div>

            <ModalFooter>
              <Button variant="outline" type="button" onClick={() => setSelectedMuestra(null)} disabled={submitting}>Cancelar</Button>
              <Button type="submit" loading={submitting} leftIcon={<Save className="w-4 h-4"/>}>Guardar Resultados</Button>
            </ModalFooter>
          </form>
        )}
      </Modal>

      {/* Modal para Imprimir Boleta */}
      <Modal isOpen={!!muestraToPrint} onClose={() => setMuestraToPrint(null)} title="Imprimir Boleta" size="md">
        {muestraToPrint && muestraToPrint.analisis && (
          <div className="space-y-4">
             <style>{`
              @media print {
                @page { margin: 0; size: letter portrait; } /* Eliminamos margen automático del navegador */
                
                /* Forzamos a que el documento mida exactamente 1 sola página y no haya scroll */
                html, body {
                  height: 100vh !important;
                  overflow: hidden !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }
                
                body * { visibility: hidden; }
                /* Forzamos a que ningún contenedor del modal desplace la hoja hacia abajo */
                * {
                  transform: none !important;
                }
                #print-boleta { 
                  position: fixed !important; 
                  left: 0.5cm !important; 
                  top: 0.5cm !important; 
                  margin: 0 !important;
                  padding: 1cm !important; /* Relleno interior para que el texto no toque el marco */
                  width: calc(100% - 1cm) !important; /* Evita que se salga del lado derecho */
                  visibility: visible !important;
                  font-family: sans-serif;  
                  border: none !important; /* Quitamos el borde negro exterior para un estilo membretado limpio */
                  border: 2px solid black !important; /* Restauramos el marco negro exterior */
                  box-sizing: border-box !important;
                }
                #print-boleta * { visibility: visible !important; }
              }
            `}</style>
            
            <div className="bg-amber-50 p-6 rounded-xl border-2 border-dashed border-amber-200 text-neutral-800">
              <p className="text-sm text-amber-700 mb-4 font-medium flex items-center gap-2">
                <Printer className="w-4 h-4" /> 
                Vista previa de la boleta a imprimir.
              </p>
              
              <div id="print-boleta" className="p-8 border-2 border-black rounded-lg bg-white text-black">
                <div className="text-center border-b-2 border-black pb-4 mb-4">
                  <h1 className="text-2xl font-bold">GLOBAL COFFEE GROUP</h1>
                  <h2 className="text-lg uppercase">BOLETA DE MUESTRA PREVIA</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <p><strong>N° Entrada:</strong> {muestraToPrint.numero_entrada}</p>
                  <p><strong>N° Remisión:</strong> {muestraToPrint.remision}</p>
                  <p className="col-span-2"><strong>Proveedor:</strong> {muestraToPrint.proveedor_nombre}</p>
                  <p><strong>Fecha/Hora:</strong> {new Date(muestraToPrint.analisis.fecha_analisis).toLocaleString()}</p>
                  <p><strong>Catador:</strong> {muestraToPrint.analisis.catador?.nombre || ""}</p>
                  <p><strong>Humedad:</strong> {muestraToPrint.analisis.humedad}%</p>
                  <p><strong>Daño:</strong> {muestraToPrint.analisis.dano}%</p>
                  <p><strong>Calidad:</strong> {muestraToPrint.analisis.calidad?.nombre || "N/A"}</p>
                  <p><strong>Rendimiento 1:</strong> {muestraToPrint.analisis.primer_rendimiento || "N/A"}</p>
                  <p><strong>Rendimiento 2:</strong> {muestraToPrint.analisis.segundo_rendimiento || "N/A"}</p>
                </div>
                
                {/* Tablas de Resultados (Defectos, Zarandas, Tazas) */}
                <div className="grid grid-cols-3 gap-6 mb-4 text-sm">
                  <div>
                    <h3 className="font-bold border-b border-black mb-2 text-center">Defectos Físicos</h3>
                    <table className="w-full">
                      <tbody>
                        {muestraToPrint.analisis.analisis_defectos?.length > 0 ? muestraToPrint.analisis.analisis_defectos.map((d: any) => (
                          <tr key={d.id_analisis_defectos}><td className="py-0.5">{d.defecto?.nombre}</td><td className="py-0.5 text-right">{d.cantidad}</td></tr>
                        )) : <tr><td colSpan={2} className="text-center text-neutral-500 text-xs italic py-1">Sin defectos</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h3 className="font-bold border-b border-black mb-2 text-center">Zarandas / Mallas</h3>
                    <table className="w-full">
                      <tbody>
                        {muestraToPrint.analisis.analisis_zarandas?.length > 0 ? muestraToPrint.analisis.analisis_zarandas.map((z: any) => (
                          <tr key={z.id_analisis_zarandas}><td className="py-0.5">{z.zaranda?.nombre}</td><td className="py-0.5 text-right">{z.cantidad}</td></tr>
                        )) : <tr><td colSpan={2} className="text-center text-neutral-500 text-xs italic py-1">Sin zarandas</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h3 className="font-bold border-b border-black mb-2 text-center">Atributos de Taza</h3>
                    <table className="w-full">
                      <tbody>
                        {muestraToPrint.analisis.analisis_tazas?.length > 0 ? muestraToPrint.analisis.analisis_tazas.map((t: any) => (
                          <tr key={t.id_analisis_tazas}><td className="py-0.5">{t.taza?.nombre}</td><td className="py-0.5 text-right">{t.cantidad}</td></tr>
                        )) : <tr><td colSpan={2} className="text-center text-neutral-500 text-xs italic py-1">Sin atributos</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mb-4 text-sm">
                  <strong>Observaciones:</strong>
                  <p className="mt-1 whitespace-pre-wrap">{muestraToPrint.analisis.observaciones || "Ninguna."}</p>
                </div>

                <p className="text-center font-bold text-lg mt-6 border-t-2 border-dashed border-black pt-4">PENDIENTE DE APROBACIÓN DE GERENCIA</p>
              </div>
            </div>

            <ModalFooter>
              <Button variant="outline" onClick={() => setMuestraToPrint(null)}>Cerrar</Button>
              <Button onClick={() => window.print()} leftIcon={<Printer className="w-4 h-4"/>}>Imprimir Boleta</Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  );
}
