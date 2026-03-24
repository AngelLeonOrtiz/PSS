import { useState, useEffect } from "react";
import { FlaskConical, Search, Printer, Clock, Loader2, SaveIcon, HandCoins } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty, TablePagination } from "../../components/ui/Table";
import { Badge, Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";
import toast from "react-hot-toast";

// APIs
import { getReceptionsApi, cambiarEstadoDetalleApi, Recepcion, DetalleRecepcion } from "../../api/reception.api";
import { getProveedoresApi, Proveedor } from "../../api/catalogs.api";

const colors = moduleColors.recepcion;

// Interface extendida localmente para aplanar los datos en la tabla
interface CargaPendiente extends DetalleRecepcion {
  numero_entrada: string;
  fecha_entrada: string;
  proveedor_nombre: string;
}

export default function MuestreoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [cargasPendientes, setCargasPendientes] = useState<CargaPendiente[]>([]);
  const [selectedCarga, setSelectedCarga] = useState<CargaPendiente | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipo_analisis: "Muestra Previa",
    observaciones: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recepciones, proveedores] = await Promise.all([
        getReceptionsApi(),
        getProveedoresApi()
      ]);

      // "Aplanamos" los datos: Extraemos todos los detalles de todos los viajes
      // Y filtramos SOLO los que están "Pendiente de Muestrear"
      const cargas: CargaPendiente[] = [];
      
      recepciones.forEach(rec => {
        if (!rec.estado) return; // Ignorar viajes anulados
        
        rec.detalles.forEach(det => {
          if (det.estado && det.estado_transaccion?.nombre === "Pendiente de Muestrear") {
            cargas.push({
              ...det,
              numero_entrada: rec.numero_entrada,
              fecha_entrada: rec.fecha_entrada,
              proveedor_nombre: proveedores.find(p => p.id_proveedor === det.id_proveedor)?.nombre || "N/A"
            });
          }
        });
      });

      setCargasPendientes(cargas);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar las muestras pendientes");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (carga: CargaPendiente) => {
    setSelectedCarga(carga);
    setFormData({ tipo_analisis: "Muestra Previa", observaciones: "" });
    setIsModalOpen(true);
  };

  const handleConfirmarMuestra = async () => {
    if (!selectedCarga) return;
    
    try {
      setSubmitting(true);
      // 1. Imprimir la viñeta (Abre el diálogo de la impresora)
      // window.print(); // Omitido temporalmente por solicitud
      
      // 2. Cambiar el estado a "Muestreado" en el backend
      await cambiarEstadoDetalleApi(selectedCarga.id_detalle_recepcion, "Muestreado");
      
      toast.success("Muestra registrada. El Vehículo pasó a estado Muestreado.");
      setIsModalOpen(false);
      
      // 3. Recargar la tabla (esto hará que la fila desaparezca mágicamente)
      loadData();
    } catch (error: any) {
      console.error("Error confirmando muestra:", error);
      toast.error(error.response?.data?.message || "Error al registrar la muestra");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtrado por buscador
  const filteredCargas = cargasPendientes.filter(c => 
    c.numero_entrada.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.remision.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.proveedor_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Muestreo en Patio" subtitle="Cargas en espera de toma de muestra física" icon={FlaskConical} iconBg={colors.bg} iconColor={colors.icon} />

      <Card className="mb-6">
        <CardContent className="p-4">
          <Input placeholder="Buscar por remisión, ingreso o proveedor..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </CardContent>
      </Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead align="center" className="w-36">Acción</TableHead>
              <TableHead>No. Ingreso</TableHead>
              <TableHead>Remisión Física</TableHead>
              <TableHead>Proveedor / Finca</TableHead>
              <TableHead align="center">Sacos Declarados</TableHead>
              <TableHead align="center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center" className="py-8"><Loader2 className="w-6 h-6 animate-spin inline-block text-neutral-400"/> Cargando cola de trabajo...</TableCell></TableRow>
            ) : filteredCargas.length === 0 ? (
              <TableEmpty message="Patio limpio. No hay camiones pendientes de muestreo." />
            ) : (
              filteredCargas.map((carga) => (
                <TableRow key={carga.id_detalle_recepcion}>
                  <TableCell align="center">
                    <Button size="sm" onClick={() => handleOpenModal(carga)}>Muestrear</Button>
                  </TableCell>
                  <TableCell className="font-medium text-neutral-600">{carga.numero_entrada}</TableCell>
                  <TableCell className="font-bold text-coffee-700">{carga.remision}</TableCell>
                  <TableCell>{carga.proveedor_nombre}</TableCell>
                  <TableCell align="center">{carga.cantidad_sacos}</TableCell>
                  <TableCell align="center">
                    <Badge variant="warning" size="sm" className="flex items-center gap-1 justify-center w-max mx-auto"><Clock className="w-3 h-3"/> Esperando Muestra</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={filteredCargas.length} />
      </Card>

      {/* Modal para Confirmar e Imprimir Viñeta */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirmar Toma de Muestra" size="md">
        {selectedCarga && (
          <div className="space-y-6">
            
            {/* CSS Oculto para la viñeta térmica */}
            <style>{`
              @media print {
                @page { margin: 0; size: 10cm 5cm; } /* Tamaño etiqueta estándar térmica (4x2 pulgadas) */
                body * { visibility: hidden; }
                #print-label, #print-label * { visibility: visible; }
                #print-label {
                  position: absolute;
                  left: 0; top: 0;
                  width: 10cm; height: 5cm;
                  padding: 0.5cm;
                  font-family: sans-serif;
                  color: black;
                }
              }
            `}</style>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm">
              <p className="text-blue-800 font-medium mb-2">Información de la Carga a Muestrear:</p>
              <div className="grid grid-cols-2 gap-2 text-blue-900">
                <p><strong>Ingreso:</strong> {selectedCarga.numero_entrada}</p>
                <p><strong>Remisión:</strong> {selectedCarga.remision}</p>
                <p><strong>Sacos:</strong> {selectedCarga.cantidad_sacos}</p>
                <p className="col-span-2"><strong>Proveedor:</strong> {selectedCarga.proveedor_nombre}</p>
              </div>
            </div>

            <div className="space-y-4">
              <Select 
                label="Tipo de Análisis Solicitado" 
                value={formData.tipo_analisis}
                onChange={(e) => setFormData({...formData, tipo_analisis: e.target.value})}
                options={[
                  { value: "Muestra Previa", label: "Muestra Previa (Camión sin descargar)" },
                  { value: "Muestra General", label: "Muestra General (Durante/Post descarga)" }
                ]}
              />
              <Input 
                label="Observaciones del Muestreador (Opcional)" 
                placeholder="Ej. Sacos rotos, café mojado..." 
                value={formData.observaciones}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
              />
            </div>

            {/* Área de la Etiqueta (Se imprime en la térmica, pero no estorba en la pantalla normal) */}
            <div className="hidden">
              <div id="print-label" className="border-2 border-black rounded-lg bg-white flex flex-col justify-between">
                <div className="text-center border-b-2 border-black pb-1 mb-1">
                  <h1 className="font-bold text-lg leading-tight">GLOBAL COFFEE GROUP</h1>
                  <h2 className="text-sm font-bold uppercase">{formData.tipo_analisis}</h2>
                </div>
                <div className="text-sm flex-1 flex flex-col justify-center leading-snug space-y-1">
                  <p><strong>ING:</strong> {selectedCarga.numero_entrada} | <strong>REM:</strong> {selectedCarga.remision}</p>
                  <p className="truncate"><strong>PROV:</strong> {selectedCarga.proveedor_nombre}</p>
                  <p><strong>SACOS:</strong> {selectedCarga.cantidad_sacos} | <strong>QQ:</strong> {selectedCarga.cantidad_qq}</p>
                  <p><strong>FECHA:</strong> {new Date().toLocaleString()}</p>
                </div>
                <div className="text-center text-[10px] mt-1 pt-1 border-t border-dashed border-black">
                  Pegar esta etiqueta en la bolsa de muestra
                </div>
              </div>
            </div>

            <ModalFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancelar</Button>
              <Button onClick={handleConfirmarMuestra} loading={submitting} leftIcon={<HandCoins className="w-4 h-4"/>}>Confirmar Muestra</Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  );
}
