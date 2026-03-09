// Componente Layout principal
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import CartSidebar from '../cart/CartSidebar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Loading from '../ui/Loading.jsx';

const Layout = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen text="Cargando aplicación..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      {/* Header */}
      <Header />
      
      {/* Contenido principal */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Carrito lateral */}
      <CartSidebar />
      
      {/* Notificaciones toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '14px',
            maxWidth: '400px'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff'
            }
          },
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff'
            }
          }
        }}
      />
    </div>
  );
};

export default Layout;