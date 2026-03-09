// Componente Footer
import { Link } from 'react-router-dom';
import { 
  Package, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Shield,
  Truck,
  CreditCard,
  HeadphonesIcon
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Acerca de Nosotros', href: '/about' },
      { name: 'Nuestro Equipo', href: '/team' },
      { name: 'Carreras', href: '/careers' },
      { name: 'Noticias', href: '/news' }
    ],
    support: [
      { name: 'Centro de Ayuda', href: '/help' },
      { name: 'Contacto', href: '/contact' },
      { name: 'Envíos y Devoluciones', href: '/shipping' },
      { name: 'Guía de Tallas', href: '/size-guide' }
    ],
    legal: [
      { name: 'Términos y Condiciones', href: '/terms' },
      { name: 'Política de Privacidad', href: '/privacy' },
      { name: 'Política de Cookies', href: '/cookies' },
      { name: 'Política de Devoluciones', href: '/returns' }
    ],
    categories: [
      { name: 'Electrónicos', href: '/categoria/electronics' },
      { name: 'Ropa', href: '/categoria/clothing' },
      { name: 'Hogar', href: '/categoria/home' },
      { name: 'Deportes', href: '/categoria/sports' }
    ]
  };

  const features = [
    {
      icon: Truck,
      title: 'Envío Gratis',
      description: 'En compras mayores a $100.000'
    },
    {
      icon: Shield,
      title: 'Compra Segura',
      description: 'Protección SSL 256-bit'
    },
    {
      icon: CreditCard,
      title: 'Pago Fácil',
      description: 'Múltiples métodos de pago'
    },
    {
      icon: HeadphonesIcon,
      title: 'Soporte 24/7',
      description: 'Atención al cliente siempre'
    }
  ];

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Características principales */}
      <div className="border-b border-secondary-800">
        <div className="container-padding py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-secondary-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enlaces principales */}
      <div className="container-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo y descripción */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TiendaEcomerce</span>
            </div>
            <p className="text-secondary-300 text-sm mb-6">
              Tu tienda online de confianza. Encuentra los mejores productos 
              con la mejor calidad y precios competitivos.
            </p>
            
            {/* Redes sociales */}
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enlaces de la empresa */}
          <div>
            <h3 className="font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-secondary-300 hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enlaces de soporte */}
          <div>
            <h3 className="font-semibold text-white mb-4">Soporte</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-secondary-300 hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="font-semibold text-white mb-4">Categorías</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-secondary-300 hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                <span className="text-secondary-300 text-sm">
                  Calle 123 #45-67<br />
                  Bogotá, Colombia
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                <span className="text-secondary-300 text-sm">
                  +57 (1) 234-5678
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                <span className="text-secondary-300 text-sm">
                  info@tiendaecomerce.com
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-medium text-white mb-2">Newsletter</h4>
              <p className="text-secondary-300 text-sm mb-3">
                Recibe ofertas exclusivas y novedades
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 px-3 py-2 bg-secondary-800 border border-secondary-700 rounded-l-lg text-white placeholder-secondary-400 focus:outline-none focus:border-primary-500 text-sm"
                />
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-r-lg transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enlaces legales */}
      <div className="border-t border-secondary-800">
        <div className="container-padding py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-secondary-400 hover:text-primary-400 text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="text-secondary-400 text-sm">
              © {currentYear} TiendaEcomerce. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>

      {/* Métodos de pago */}
      <div className="border-t border-secondary-800">
        <div className="container-padding py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <span className="text-secondary-400 text-sm">Métodos de pago aceptados:</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-secondary-400 text-xs">
                <CreditCard className="w-4 h-4" />
                <span>Visa</span>
                <span>•</span>
                <span>Mastercard</span>
                <span>•</span>
                <span>PSE</span>
                <span>•</span>
                <span>Nequi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;