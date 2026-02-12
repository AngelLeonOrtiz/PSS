import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Coffee, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../auth/useAuth";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario || !password) {
      toast.error("Por favor ingrese usuario y contraseña");
      return;
    }

    setLoading(true);
    try {
      await login({ usuario, password });
      toast.success("¡Bienvenido!");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-900 via-coffee-800 to-coffee-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
            <Coffee className="w-8 h-8 text-coffee-300" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Global Café</h1>
          <p className="text-coffee-300">Sistema de Gestión Integral</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6 text-center">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full h-12 px-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-all"
                placeholder="Ingrese su usuario"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 pr-12 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-all"
                  placeholder="Ingrese su contraseña"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-coffee-700 hover:bg-coffee-800 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-coffee-700/25 hover:shadow-xl hover:shadow-coffee-700/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            ¿Olvidó su contraseña?{" "}
            <a href="#" className="text-coffee-600 hover:text-coffee-700 font-medium">
              Contacte al administrador
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-coffee-400 mt-6">
          © 2025 Global Café. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
