import { Routes, Route, useLocation } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Layout from "./components/layout/Layout.jsx";
import Inicio from "./pages/Inicio.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import DetallesProducto from "./pages/DetalleProducto.jsx";
import Carrito from "./pages/Carrito.jsx";
import Pago from "./pages/ProcesoPago.jsx";
import ConfirmacionPedido from "./pages/ConfirmacionPedido.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/RegistroUsuario.jsx";
import Perfil from "./pages/Perfil.jsx";
import ListaPedidos from "./pages/ListaPedidos.jsx";
import Puntos from "./pages/SistemaPuntos.jsx";
import Blog from "./pages/Blog.jsx";
import ArticuloN1 from "./pages/ArticuloN1.jsx";
import Soporte from "./pages/Soporte.jsx";
import MenuAdmin from "./pages/MenuAdmin.jsx";
import PaginaError from "./pages/PaginaError.jsx";

export default function App() {
  const { key } = useLocation();

  return (
    <ErrorBoundary resetKey={key}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/detalle" element={<DetallesProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/pago" element={<Pago />} />
          <Route path="/confirmacion" element={<ConfirmacionPedido />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/articuloN1" element={<ArticuloN1 />} />
          <Route path="/soporte" element={<Soporte />} />
          <Route path="/admin" element={<MenuAdmin />} />
        </Route>

        {/* Fuera del Layout no mostrara la navbar */}
        <Route path="/pedidos" element={<ListaPedidos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/404" element={<PaginaError />} />
        <Route path="*" element={<PaginaError />} />
        <Route path="/puntos" element={<Puntos />} />
      </Routes>
    </ErrorBoundary>
  );
}