import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, Check } from "lucide-react";

type Option = {
  value: string | number;
  label: string;
};

type Props = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
  label?: string;
  error?: string;
  helperText?: string;
  options: Option[];
  placeholder?: string;
  onChange?: (e: any) => void;
};

const Select = React.forwardRef<HTMLDivElement, Props>(
  ({ label, error, helperText, options, placeholder, className = "", id, value, onChange, name, disabled, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number; width: number } | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Calcula la posición exacta del selector en la pantalla
    const updatePosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDropdownCoords({
          top: rect.bottom + 4, // 4px de separación (equivalente a mt-1)
          left: rect.left,
          width: rect.width,
        });
      }
    };

    // Cierra el menú al hacer clic fuera del componente
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          containerRef.current && !containerRef.current.contains(target) &&
          menuRef.current && !menuRef.current.contains(target)
        ) {
          setIsOpen(false);
          setSearchTerm(""); // Limpiamos la búsqueda al cerrar
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Recalcular posición si la ventana cambia de tamaño o se hace scroll
    useEffect(() => {
      if (isOpen) {
        updatePosition();
        const handleScroll = (e: Event) => {
          // Evitar que se recalcule o cierre si el scroll es DENTRO de la propia lista
          if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
          updatePosition();
        };
        window.addEventListener("scroll", handleScroll, true); // true para capturar scroll de contenedores anidados
        window.addEventListener("resize", updatePosition);
        return () => {
          window.removeEventListener("scroll", handleScroll, true);
          window.removeEventListener("resize", updatePosition);
        };
      }
    }, [isOpen]);

    const filteredOptions = options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find((opt) => String(opt.value) === String(value));

    const handleSelect = (optValue: string | number) => {
      if (onChange) {
        // Simulamos el evento nativo para no romper componentes existentes
        onChange({ target: { name, value: String(optValue) } } as any);
      }
      setIsOpen(false);
      setSearchTerm("");
    };

    return (
      <div className="w-full" ref={ref}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
          </label>
        )}
      <div className="relative" ref={containerRef}>
          {/* Botón Principal (Simula ser el select) */}
          <div
            id={selectId}
            className={`
              flex items-center justify-between w-full h-11 px-4
              bg-white border rounded-xl text-neutral-900
              cursor-pointer transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent
              ${disabled ? "bg-neutral-100 cursor-not-allowed opacity-70" : "hover:border-coffee-400"}
              ${error ? "border-red-500 focus:ring-red-500" : "border-neutral-300"}
              ${className}
            `}
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
              if (!isOpen) updatePosition();
            }
          }}
            tabIndex={disabled ? -1 : 0}
          >
            <span className={`truncate ${!selectedOption ? "text-neutral-500" : ""}`}>
              {selectedOption ? selectedOption.label : placeholder || "Seleccione una opción"}
            </span>
            <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </div>

        {/* Menú Desplegable con Buscador (Portado al Body para evitar cortes de scroll en el Modal) */}
        {isOpen && dropdownCoords && createPortal(
          <div 
            ref={menuRef}
            style={{
              position: "fixed",
              top: `${dropdownCoords.top}px`,
              left: `${dropdownCoords.left}px`,
              width: `${dropdownCoords.width}px`,
              zIndex: 99999
            }}
            className="bg-white border border-neutral-200 rounded-xl shadow-2xl max-h-60 flex flex-col overflow-hidden"
          >
              <div className="p-2 border-b border-neutral-100 bg-neutral-50/50">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()} // Evita que se cierre al clickear el input
                    autoFocus
                  />
                </div>
              </div>
              <ul className="overflow-y-auto p-1 flex-1">
                {filteredOptions.length === 0 ? (
                  <li className="px-3 py-3 text-sm text-neutral-500 text-center">No se encontraron resultados</li>
                ) : (
                  filteredOptions.map((opt) => (
                    <li
                      key={opt.value}
                      className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors
                        ${String(value) === String(opt.value) ? "bg-coffee-50 text-coffee-900 font-medium" : "text-neutral-700 hover:bg-neutral-100"}`}
                      onClick={() => handleSelect(opt.value)}
                    >
                      <span className="truncate">{opt.label}</span>
                      {String(value) === String(opt.value) && <Check className="w-4 h-4 text-coffee-600 shrink-0" />}
                    </li>
                  ))
                )}
              </ul>
          </div>,
          document.body
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
