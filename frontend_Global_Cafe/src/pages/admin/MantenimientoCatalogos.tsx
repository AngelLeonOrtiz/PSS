import { useState, useEffect } from "react";
import { Database, Plus, Edit, Loader2, Search } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { Button, Modal, ModalFooter, Input, Select } from "../../components/ui";
import toast from "react-hot-toast";

// Importamos las funciones y tipos que creaste en el Paso 1 y 2
import { 
  getCosechasApi, getProveedoresApi, getConductoresApi, 
  getPlacasCabezalApi, getPlacasFurgonApi, getMunicipiosApi, getTransportesApi, getDepartamentosApi,
  createProveedorApi, updateProveedorApi,
  createConductorApi, updateConductorApi,
  createPlacaCabezalApi, updatePlacaCabezalApi,
  createPlacaFurgonApi, updatePlacaFurgonApi,
  createCosechaApi, updateCosechaApi,
  createMunicipioApi, updateMunicipioApi,
  createTransporteApi, updateTransporteApi,
  createDepartamentoApi, updateDepartamentoApi,
  getCatadoresApi, createCatadorApi, updateCatadorApi,
  getCalidadesApi, createCalidadApi, updateCalidadApi,
  getDefectosApi, createDefectoApi, updateDefectoApi,
  getZarandasApi, createZarandaApi, updateZarandaApi,
  getTazasApi, createTazaApi, updateTazaApi,
  Cosecha, Proveedor, Conductor, PlacaCabezal, PlacaFurgon, Municipio, Transporte, Departamento,
  Catador, Calidad, Defecto, Zaranda, Taza
} from "../../api/catalogs.api";

type TabType = "proveedores" | "transportes" | "conductores" | "placas-cabezal" | "placas-furgon" | "cosechas" | "departamentos" | "municipios" | "catadores" | "calidades" | "defectos" | "zarandas" | "tazas";

export default function MantenimientoCatalogos() {
  const [activeTab, setActiveTab] = useState<TabType>("proveedores");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para almacenar los datos
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [placasCabezal, setPlacasCabezal] = useState<PlacaCabezal[]>([]);
  const [placasFurgon, setPlacasFurgon] = useState<PlacaFurgon[]>([]);
  const [cosechas, setCosechas] = useState<Cosecha[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [transportes, setTransportes] = useState<Transporte[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [catadores, setCatadores] = useState<Catador[]>([]);
  const [calidades, setCalidades] = useState<Calidad[]>([]);
  const [defectos, setDefectos] = useState<Defecto[]>([]);
  const [zarandas, setZarandas] = useState<Zaranda[]>([]);
  const [tazas, setTazas] = useState<Taza[]>([]);

  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Cargamos todos los catálogos en paralelo para mayor velocidad
      const [provs, conds, pCabezal, pFurgon, cos, muns, trans, deptos, cat, cal, def, zar, taz] = await Promise.all([
        getProveedoresApi(),
        getConductoresApi(),
        getPlacasCabezalApi(),
        getPlacasFurgonApi(),
        getCosechasApi(),
        getMunicipiosApi(),
        getTransportesApi(),
        getDepartamentosApi(),
        getCatadoresApi(),
        getCalidadesApi(),
        getDefectosApi(),
        getZarandasApi(),
        getTazasApi()
      ]);

      setProveedores(provs);
      setConductores(conds);
      setPlacasCabezal(pCabezal);
      setPlacasFurgon(pFurgon);
      setCosechas(cos);
      setMunicipios(muns);
      setTransportes(trans);
      setDepartamentos(deptos);
      setCatadores(cat);
      setCalidades(cal);
      setDefectos(def);
      setZarandas(zar);
      setTazas(taz);
    } catch (error) {
      console.error("Error cargando catálogos:", error);
      toast.error("Error al cargar los catálogos del servidor");
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "proveedores", label: "Proveedores" },
    { id: "transportes", label: "Transportistas" },
    { id: "conductores", label: "Conductores" },
    { id: "placas-cabezal", label: "Placas Cabezales" },
    { id: "placas-furgon", label: "Placas Furgones" },
    { id: "cosechas", label: "Cosechas" },
    { id: "departamentos", label: "Departamentos" },
    { id: "municipios", label: "Municipios" },
    { id: "catadores", label: "Catadores" },
    { id: "calidades", label: "Calidades" },
    { id: "defectos", label: "Defectos" },
    { id: "zarandas", label: "Mallas / Zarandas" },
    { id: "tazas", label: "Atributos de Taza" },
  ];

  // Todas las pestañas permiten crear y editar ahora
  const canEditTab = true;

  const handleCreate = () => {
    setEditingId(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (item: any, idField: string) => {
    setEditingId(item[idField]);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === "proveedores") {
        const payload = { nombre: formData.nombre, rtn: formData.rtn, id_municipio: Number(formData.id_municipio), direccion: formData.direccion, telefono: formData.telefono };
        if (editingId) await updateProveedorApi(editingId, { ...payload, estado: formData.estado });
        else await createProveedorApi(payload);
      } 
      else if (activeTab === "transportes") {
        const payload = { nombre: formData.nombre, rtn: formData.rtn, id_municipio: Number(formData.id_municipio), direccion: formData.direccion, contacto: formData.contacto, telefono: formData.telefono };
        if (editingId) await updateTransporteApi(editingId, { ...payload, estado: formData.estado });
        else await createTransporteApi(payload);
      }
      else if (activeTab === "conductores") {
        const payload = { nombre: formData.nombre, dni: formData.dni, licencia: formData.licencia, id_municipio: Number(formData.id_municipio), id_transporte: Number(formData.id_transporte), telefono: formData.telefono };
        if (editingId) await updateConductorApi(editingId, { ...payload, estado: formData.estado });
        else await createConductorApi(payload);
      } 
      else if (activeTab === "placas-cabezal") {
        if (editingId) await updatePlacaCabezalApi(editingId, { placa: formData.placa, estado: formData.estado });
        else await createPlacaCabezalApi({ placa: formData.placa });
      } 
      else if (activeTab === "placas-furgon") {
        if (editingId) await updatePlacaFurgonApi(editingId, { placa: formData.placa, estado: formData.estado });
        else await createPlacaFurgonApi({ placa: formData.placa });
      }
      else if (activeTab === "cosechas") {
        const payload = { cosecha: formData.cosecha, cosecha_actual: formData.cosecha_actual || false };
        if (editingId) await updateCosechaApi(editingId, { ...payload, estado: formData.estado });
        else await createCosechaApi(payload);
      }
      else if (activeTab === "municipios") {
        const payload = { nombre: formData.nombre, id_departamento: Number(formData.id_departamento) };
        if (editingId) await updateMunicipioApi(editingId, { ...payload, estado: formData.estado });
        else await createMunicipioApi(payload);
      }
      else if (activeTab === "departamentos") {
        const payload = { nombre: formData.nombre };
        if (editingId) await updateDepartamentoApi(editingId, { ...payload, estado: formData.estado });
        else await createDepartamentoApi(payload);
      }
      else if (activeTab === "catadores") {
        if (editingId) await updateCatadorApi(editingId, { nombre: formData.nombre, estado: formData.estado });
        else await createCatadorApi({ nombre: formData.nombre });
      }
      else if (activeTab === "calidades") {
        if (editingId) await updateCalidadApi(editingId, { nombre: formData.nombre, estado: formData.estado });
        else await createCalidadApi({ nombre: formData.nombre });
      }
      else if (activeTab === "defectos") {
        if (editingId) await updateDefectoApi(editingId, { nombre: formData.nombre, estado: formData.estado });
        else await createDefectoApi({ nombre: formData.nombre });
      }
      else if (activeTab === "zarandas") {
        if (editingId) await updateZarandaApi(editingId, { nombre: formData.nombre, estado: formData.estado });
        else await createZarandaApi({ nombre: formData.nombre });
      }
      else if (activeTab === "tazas") {
        if (editingId) await updateTazaApi(editingId, { nombre: formData.nombre, estado: formData.estado });
        else await createTazaApi({ nombre: formData.nombre });
      }

      toast.success("Registro guardado exitosamente");
      handleCloseModal();
      loadData(); // Recargamos para ver los cambios
    } catch (error: any) {
      console.error("Error al guardar:", error);
      toast.error(error.response?.data?.message || "Ocurrió un error al intentar guardar");
    }
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          {/* @ts-ignore */}
          <TableCell colSpan={5} align="center" className="py-8 text-neutral-500">
            <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" /> Cargando datos...
          </TableCell>
        </TableRow>
      );
    }

    const term = searchTerm.toLowerCase();

    switch (activeTab) {
      case "proveedores":
        return proveedores.filter(p => p.nombre.toLowerCase().includes(term) || p.rtn?.toLowerCase().includes(term)).map((p) => (
          <TableRow key={p.id_proveedor}>
            <TableCell className="font-medium">{p.nombre}</TableCell>
            <TableCell>{p.rtn || "N/A"}</TableCell>
            <TableCell>{p.telefono || "N/A"}</TableCell>
            <TableCell align="center">
              <Badge variant={p.estado ? "success" : "danger"} size="sm">
                {p.estado ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            {canEditTab && (
              <TableCell align="center">
                <button onClick={() => handleEdit(p, "id_proveedor")} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Editar">
                  <Edit className="w-4 h-4 text-neutral-600" />
                </button>
              </TableCell>
            )}
          </TableRow>
        ));
      case "transportes":
        return transportes.filter(t => t.nombre.toLowerCase().includes(term) || t.rtn?.toLowerCase().includes(term)).map((t) => (
          <TableRow key={t.id_transporte}>
            <TableCell className="font-medium">{t.nombre}</TableCell>
            <TableCell>{t.rtn || "N/A"}</TableCell>
            <TableCell>{t.telefono || "N/A"}</TableCell>
            <TableCell align="center">
              <Badge variant={t.estado ? "success" : "danger"} size="sm">
                {t.estado ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            {canEditTab && (
              <TableCell align="center">
                <button onClick={() => handleEdit(t, "id_transporte")} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Editar">
                  <Edit className="w-4 h-4 text-neutral-600" />
                </button>
              </TableCell>
            )}
          </TableRow>
        ));
      case "conductores":
        return conductores.filter(c => c.nombre.toLowerCase().includes(term) || c.dni?.toLowerCase().includes(term) || c.licencia?.toLowerCase().includes(term)).map((c) => (
          <TableRow key={c.id_conductor}>
            <TableCell className="font-medium">{c.nombre}</TableCell>
            <TableCell>{c.dni || "N/A"}</TableCell>
            <TableCell>{c.licencia || "N/A"}</TableCell>
            <TableCell>{c.telefono || "N/A"}</TableCell>
            <TableCell align="center">
              <Badge variant={c.estado ? "success" : "danger"} size="sm">
                {c.estado ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            {canEditTab && (
              <TableCell align="center">
                <button onClick={() => handleEdit(c, "id_conductor")} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Editar">
                  <Edit className="w-4 h-4 text-neutral-600" />
                </button>
              </TableCell>
            )}
          </TableRow>
        ));
      case "placas-cabezal":
        return placasCabezal.filter(p => p.placa.toLowerCase().includes(term)).map((p) => (
          <TableRow key={p.id_placa_cabezal}>
            <TableCell className="font-medium">{p.placa}</TableCell>
            <TableCell align="center">
              <Badge variant={p.estado ? "success" : "danger"} size="sm">
                {p.estado ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            {canEditTab && (
              <TableCell align="center">
                <button onClick={() => handleEdit(p, "id_placa_cabezal")} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Editar">
                  <Edit className="w-4 h-4 text-neutral-600" />
                </button>
              </TableCell>
            )}
          </TableRow>
        ));
      case "placas-furgon":
        return placasFurgon.filter(p => p.placa.toLowerCase().includes(term)).map((p) => (
          <TableRow key={p.id_placa_furgon}>
            <TableCell className="font-medium">{p.placa}</TableCell>
            <TableCell align="center">
              <Badge variant={p.estado ? "success" : "danger"} size="sm">
                {p.estado ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            {canEditTab && (
              <TableCell align="center">
                <button onClick={() => handleEdit(p, "id_placa_furgon")} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Editar">
                  <Edit className="w-4 h-4 text-neutral-600" />
                </button>
              </TableCell>
            )}
          </TableRow>
        ));
      case "cosechas":
        return cosechas.filter(c => c.cosecha.toLowerCase().includes(term)).map((c) => (
          <TableRow key={c.id_cosecha}>
            <TableCell className="font-medium">{c.cosecha}</TableCell>
            <TableCell align="center">
              {c.cosecha_actual ? <Badge variant="info" size="sm">Cosecha Actual</Badge> : ""}
            </TableCell>
            <TableCell align="center">
              <Badge variant={c.estado ? "success" : "danger"} size="sm">
                {c.estado ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            {canEditTab && (
              <TableCell align="center">
                <button onClick={() => handleEdit(c, "id_cosecha")} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Editar">
                  <Edit className="w-4 h-4 text-neutral-600" />
                </button>
              </TableCell>
            )}
          </TableRow>
        ));
      case "departamentos":
        return departamentos.filter(d => d.nombre.toLowerCase().includes(term)).map((d) => (
          <TableRow key={d.id_departamento}>
            <TableCell className="font-medium">{d.nombre}</TableCell>
            <TableCell align="center">
              <Badge variant={d.estado ? "success" : "danger"} size="sm">
                {d.estado ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            {canEditTab && (
              <TableCell align="center">
                <button onClick={() => handleEdit(d, "id_departamento")} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Editar">
                  <Edit className="w-4 h-4 text-neutral-600" />
                </button>
              </TableCell>
            )}
          </TableRow>
        ));
      case "municipios":
        return municipios.filter(m => m.nombre.toLowerCase().includes(term) || m.departamento?.nombre.toLowerCase().includes(term)).map((m) => (
          <TableRow key={m.id_municipio}>
            <TableCell className="font-medium">{m.nombre}</TableCell>
            <TableCell>{m.departamento?.nombre || "N/A"}</TableCell>
            <TableCell align="center">
              <Badge variant={m.estado ? "success" : "danger"} size="sm">
                {m.estado ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            {canEditTab && (
              <TableCell align="center">
                <button onClick={() => handleEdit(m, "id_municipio")} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Editar">
                  <Edit className="w-4 h-4 text-neutral-600" />
                </button>
              </TableCell>
            )}
          </TableRow>
        ));
      case "catadores":
        return catadores.filter(c => c.nombre.toLowerCase().includes(term)).map((c) => <TableRow key={c.id_catador}><TableCell className="font-medium">{c.nombre}</TableCell><TableCell align="center"><Badge variant={c.estado ? "success" : "danger"} size="sm">{c.estado ? "Activo" : "Inactivo"}</Badge></TableCell>{canEditTab && <TableCell align="center"><button onClick={() => handleEdit(c, "id_catador")} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Editar"><Edit className="w-4 h-4 text-neutral-600" /></button></TableCell>}</TableRow>);
      case "calidades":
        return calidades.filter(c => c.nombre.toLowerCase().includes(term)).map((c) => <TableRow key={c.id_calidad}><TableCell className="font-medium">{c.nombre}</TableCell><TableCell align="center"><Badge variant={c.estado ? "success" : "danger"} size="sm">{c.estado ? "Activo" : "Inactivo"}</Badge></TableCell>{canEditTab && <TableCell align="center"><button onClick={() => handleEdit(c, "id_calidad")} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Editar"><Edit className="w-4 h-4 text-neutral-600" /></button></TableCell>}</TableRow>);
      case "defectos":
        return defectos.filter(d => d.nombre.toLowerCase().includes(term)).map((d) => <TableRow key={d.id_defecto}><TableCell className="font-medium">{d.nombre}</TableCell><TableCell align="center"><Badge variant={d.estado ? "success" : "danger"} size="sm">{d.estado ? "Activo" : "Inactivo"}</Badge></TableCell>{canEditTab && <TableCell align="center"><button onClick={() => handleEdit(d, "id_defecto")} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Editar"><Edit className="w-4 h-4 text-neutral-600" /></button></TableCell>}</TableRow>);
      case "zarandas":
        return zarandas.filter(z => z.nombre.toLowerCase().includes(term)).map((z) => <TableRow key={z.id_zaranda}><TableCell className="font-medium">{z.nombre}</TableCell><TableCell align="center"><Badge variant={z.estado ? "success" : "danger"} size="sm">{z.estado ? "Activo" : "Inactivo"}</Badge></TableCell>{canEditTab && <TableCell align="center"><button onClick={() => handleEdit(z, "id_zaranda")} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Editar"><Edit className="w-4 h-4 text-neutral-600" /></button></TableCell>}</TableRow>);
      case "tazas":
        return tazas.filter(t => t.nombre.toLowerCase().includes(term)).map((t) => <TableRow key={t.id_tazas}><TableCell className="font-medium">{t.nombre}</TableCell><TableCell align="center"><Badge variant={t.estado ? "success" : "danger"} size="sm">{t.estado ? "Activo" : "Inactivo"}</Badge></TableCell>{canEditTab && <TableCell align="center"><button onClick={() => handleEdit(t, "id_tazas")} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Editar"><Edit className="w-4 h-4 text-neutral-600" /></button></TableCell>}</TableRow>);
    }
  };

  // Dibuja los inputs del modal dependiendo de la pestaña activa
  const renderModalForm = () => {
    const modalContent = {
      "proveedores": (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nombre del Proveedor" value={formData.nombre || ""} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
          <Input label="RTN (Opcional)" value={formData.rtn || ""} onChange={(e) => setFormData({...formData, rtn: e.target.value})} />
          <Select label="Municipio" value={formData.id_municipio || ""} onChange={(e) => setFormData({...formData, id_municipio: e.target.value})} options={[{ value: "", label: "Seleccione un municipio" }, ...municipios.map(m => ({ value: m.id_municipio.toString(), label: `${m.nombre}${((m as any).departamento?.nombre) ? `- ${(m as any).departamento.nombre}` : ''}`}))]} required />
          <Input label="Teléfono (Opcional)" value={formData.telefono || ""} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
          <div className="md:col-span-2">
            <Input label="Dirección (Opcional)" value={formData.direccion || ""} onChange={(e) => setFormData({...formData, direccion: e.target.value})} />
          </div>
        </div>
      ),
      "transportes": (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nombre de la Empresa" value={formData.nombre || ""} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
          <Input label="RTN (Opcional)" value={formData.rtn || ""} onChange={(e) => setFormData({...formData, rtn: e.target.value})} />
          <Select label="Municipio" value={formData.id_municipio || ""} onChange={(e) => setFormData({...formData, id_municipio: e.target.value})} options={[{ value: "", label: "Seleccione un municipio" }, ...municipios.map(m => ({ value: m.id_municipio.toString(), label: m.nombre }))]} required />
          <Input label="Contacto Principal" value={formData.contacto || ""} onChange={(e) => setFormData({...formData, contacto: e.target.value})} />
          <Input label="Teléfono (Opcional)" value={formData.telefono || ""} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
          <div className="md:col-span-2">
            <Input label="Dirección (Opcional)" value={formData.direccion || ""} onChange={(e) => setFormData({...formData, direccion: e.target.value})} />
          </div>
        </div>
      ),
      "conductores": (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nombre del Conductor" value={formData.nombre || ""} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
          <Input label="DNI (Opcional)" value={formData.dni || ""} onChange={(e) => setFormData({...formData, dni: e.target.value})} />
          <Input label="Licencia (Opcional)" value={formData.licencia || ""} onChange={(e) => setFormData({...formData, licencia: e.target.value})} />
          <Select label="Empresa de Transporte" value={formData.id_transporte || ""} onChange={(e) => setFormData({...formData, id_transporte: e.target.value})} options={[{ value: "", label: "Seleccione transporte" }, ...transportes.map(t => ({ value: t.id_transporte.toString(), label: t.nombre }))]} required />
          <Select label="Municipio" value={formData.id_municipio || ""} onChange={(e) => setFormData({...formData, id_municipio: e.target.value})} options={[{ value: "", label: "Seleccione municipio" }, ...municipios.map(m => ({ value: m.id_municipio.toString(), label: m.nombre }))]} required />
          <Input label="Teléfono (Opcional)" value={formData.telefono || ""} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
        </div>
      ),
      "placas-cabezal": (
        <div className="space-y-4">
          <Input label="Número de Placa (Cabezal)" value={formData.placa || ""} onChange={(e) => setFormData({...formData, placa: e.target.value})} required />
        </div>
      ),
      "placas-furgon": (
        <div className="space-y-4">
          <Input label="Número de Placa (Furgón)" value={formData.placa || ""} onChange={(e) => setFormData({...formData, placa: e.target.value})} required />
        </div>
      ),
      "cosechas": (
        <div className="space-y-4">
          <Input label="Periodo de Cosecha" placeholder="Ej: 2024-2025" value={formData.cosecha || ""} onChange={(e) => setFormData({...formData, cosecha: e.target.value})} required />
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input type="checkbox" checked={formData.cosecha_actual ?? false} onChange={(e) => setFormData({...formData, cosecha_actual: e.target.checked})} className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4" />
            <span className="text-sm font-medium text-neutral-700">Establecer como Cosecha Actual</span>
          </label>
        </div>
      ),
      "departamentos": (
        <div className="space-y-4">
          <Input label="Nombre del Departamento" value={formData.nombre || ""} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
        </div>
      ),
      "municipios": (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nombre del Municipio" value={formData.nombre || ""} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
          <Select label="Departamento" value={formData.id_departamento || ""} onChange={(e) => setFormData({...formData, id_departamento: e.target.value})} options={[{ value: "", label: "Seleccione departamento" }, ...departamentos.map(d => ({ value: d.id_departamento.toString(), label: d.nombre }))]} required />
        </div>
      ),
      "catadores": (
        <div className="space-y-4">
          <Input label="Nombre del Catador" value={formData.nombre || ""} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
        </div>
      ),
      "calidades": (
        <div className="space-y-4">
          <Input label="Descripción de Calidad" placeholder="Ej: Estrictamente Altura (SHG)" value={formData.nombre || ""} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
        </div>
      ),
      "defectos": (
        <div className="space-y-4">
          <Input label="Nombre del Defecto" placeholder="Ej: Grano Negro" value={formData.nombre || ""} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
        </div>
      ),
      "zarandas": (
        <div className="space-y-4">
          <Input label="Malla / Zaranda" placeholder="Ej: Malla 18" value={formData.nombre || ""} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
        </div>
      ),
      "tazas": (
        <div className="space-y-4">
          <Input label="Atributo de Taza" placeholder="Ej: Acidez, Cuerpo..." value={formData.nombre || ""} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
        </div>
      )
    };

    return (
      <div className="space-y-4">
        {modalContent[activeTab as keyof typeof modalContent]}
        
        {/* Checkbox de estado solo al editar */}
        {editingId && (
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input type="checkbox" checked={formData.estado ?? true} onChange={(e) => setFormData({...formData, estado: e.target.checked})} className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4" />
            <span className="text-sm font-medium text-neutral-700">Registro Activo</span>
          </label>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Catálogos Operativos" 
        subtitle="Mantenimiento general de catálogos del sistema" 
        icon={Database} 
        actions={canEditTab ? [{ label: `Nuevo ${tabs.find(t => t.id === activeTab)?.label.replace("es", "")}`, onClick: handleCreate, icon: Plus }] : []} 
      />

      {/* Selector de Catálogo y Buscador */}
      <Card className="mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:max-w-sm">
            <Select 
              value={activeTab} 
              onChange={(e) => { setActiveTab(e.target.value as TabType); setSearchTerm(""); }} 
              options={tabs.map(t => ({ value: t.id, label: t.label }))} 
            />
          </div>
          <div className="w-full sm:max-w-md">
            <Input 
              placeholder={`Buscar en ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
              leftIcon={<Search className="w-4 h-4 text-neutral-400" />} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>
      </Card>

      {/* Tabla Dinámica */}
      <Card padding="none">
        <CardHeader className="px-4 pt-4"><CardTitle>{tabs.find(t => t.id === activeTab)?.label}</CardTitle></CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción principal</TableHead>
              {(activeTab === "proveedores" || activeTab === "transportes") && <TableHead>RTN</TableHead>}
              {activeTab === "conductores" && <TableHead>DNI</TableHead>}
              {activeTab === "conductores" && <TableHead>Licencia</TableHead>}
              {["proveedores", "conductores", "transportes"].includes(activeTab) && <TableHead>Teléfono</TableHead>}
              {activeTab === "municipios" && <TableHead>Departamento</TableHead>}
              {activeTab === "cosechas" && <TableHead align="center">Status</TableHead>}
              <TableHead align="center">Estado</TableHead>
              {canEditTab && <TableHead align="center">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </Card>

      {/* Modal para Crear/Editar */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? "Editar Registro" : "Nuevo Registro"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderModalForm()}
          <ModalFooter>
            <Button variant="outline" type="button" onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit">{editingId ? "Guardar Cambios" : "Crear Registro"}</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}