// Utilidades de validación
import * as yup from 'yup';

// Validaciones personalizadas
export const customValidations = {
  // Validar email
  email: yup
    .string()
    .email('Formato de email inválido')
    .required('El email es obligatorio')
    .max(150, 'El email no puede exceder 150 caracteres'),

  // Validar contraseña
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),

  // Validar nombre de usuario
  username: yup
    .string()
    .required('El nombre de usuario es obligatorio')
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(30, 'El nombre de usuario no puede exceder 30 caracteres')
    .matches(
      /^[a-zA-Z0-9._-]+$/,
      'Solo se permiten letras, números, puntos, guiones y guiones bajos'
    )
    .test('no-consecutive-dots', 'No se permiten puntos consecutivos', (value) => {
      return value ? !value.includes('..') : true;
    })
    .test('no-start-end-special', 'No puede empezar o terminar con puntos o guiones', (value) => {
      if (!value) return true;
      return !value.startsWith('.') && !value.startsWith('-') && 
             !value.endsWith('.') && !value.endsWith('-');
    }),

  // Validar nombre
  name: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),

  // Validar teléfono
  phone: yup
    .string()
    .matches(/^[\d\s\-\(\)\+]+$/, 'Formato de teléfono inválido')
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(15, 'El teléfono no puede exceder 15 caracteres'),

  // Validar precio
  price: yup
    .number()
    .required('El precio es obligatorio')
    .positive('El precio debe ser mayor a 0')
    .max(999999.99, 'El precio no puede exceder $999,999.99'),

  // Validar cantidad
  quantity: yup
    .number()
    .required('La cantidad es obligatoria')
    .integer('La cantidad debe ser un número entero')
    .min(1, 'La cantidad debe ser al menos 1')
    .max(999, 'La cantidad no puede exceder 999'),

  // Validar código de verificación
  verificationCode: yup
    .string()
    .required('El código es obligatorio')
    .matches(/^\d{6}$/, 'El código debe tener 6 dígitos')
};

// Esquemas de validación completos
export const validationSchemas = {
  // Registro de usuario
  register: yup.object({
    nombre: customValidations.name,
    apellido: yup.string().max(100, 'El apellido no puede exceder 100 caracteres'),
    correo: customValidations.email,
    telefono: customValidations.phone.optional(),
    direccion: yup.string().max(150, 'La dirección no puede exceder 150 caracteres'),
    usuario: customValidations.username,
    contrasena: customValidations.password,
    confirmarContrasena: yup
      .string()
      .required('Confirma tu contraseña')
      .oneOf([yup.ref('contrasena')], 'Las contraseñas no coinciden')
  }),

  // Login
  login: yup.object({
    usuario: yup.string().required('El usuario es obligatorio'),
    contrasena: yup.string().required('La contraseña es obligatoria')
  }),

  // Recuperación de contraseña - solicitar código
  requestPasswordReset: yup.object({
    correo: customValidations.email
  }),

  // Recuperación de contraseña - verificar código y cambiar
  resetPassword: yup.object({
    correo: customValidations.email,
    codigo: customValidations.verificationCode,
    nuevaContrasena: customValidations.password,
    confirmarContrasena: yup
      .string()
      .required('Confirma tu nueva contraseña')
      .oneOf([yup.ref('nuevaContrasena')], 'Las contraseñas no coinciden')
  }),

  // Actualizar perfil
  updateProfile: yup.object({
    nombre: customValidations.name,
    apellido: yup.string().max(100, 'El apellido no puede exceder 100 caracteres'),
    telefono: customValidations.phone.optional(),
    direccion: yup.string().max(150, 'La dirección no puede exceder 150 caracteres')
  }),

  // Cambiar credenciales
  updateCredentials: yup.object({
    usuario: customValidations.username,
    contrasena: customValidations.password,
    confirmarContrasena: yup
      .string()
      .required('Confirma tu contraseña')
      .oneOf([yup.ref('contrasena')], 'Las contraseñas no coinciden')
  }),

  // Crear/actualizar producto
  product: yup.object({
    title: yup
      .string()
      .required('El título es obligatorio')
      .min(3, 'El título debe tener al menos 3 caracteres')
      .max(255, 'El título no puede exceder 255 caracteres'),
    price: customValidations.price,
    description: yup
      .string()
      .max(1000, 'La descripción no puede exceder 1000 caracteres'),
    category: yup
      .string()
      .required('La categoría es obligatoria')
      .max(100, 'La categoría no puede exceder 100 caracteres'),
    image: yup
      .string()
      .url('Debe ser una URL válida')
      .max(500, 'La URL de la imagen no puede exceder 500 caracteres')
  }),

  // Crear pedido
  order: yup.object({
    productos: yup
      .array()
      .of(
        yup.object({
          id: yup.number().required(),
          cantidad: customValidations.quantity,
          precio: customValidations.price
        })
      )
      .min(1, 'Debe incluir al menos un producto')
      .required('Los productos son obligatorios'),
    id_ubicacion: yup.number().optional()
  }),

  // Dirección de envío
  address: yup.object({
    nombre: yup
      .string()
      .required('El nombre de la dirección es obligatorio')
      .max(100, 'El nombre no puede exceder 100 caracteres'),
    direccion: yup
      .string()
      .required('La dirección es obligatoria')
      .max(255, 'La dirección no puede exceder 255 caracteres'),
    ciudad: yup
      .string()
      .required('La ciudad es obligatoria')
      .max(100, 'La ciudad no puede exceder 100 caracteres'),
    codigo_postal: yup
      .string()
      .matches(/^\d{5,6}$/, 'El código postal debe tener 5 o 6 dígitos'),
    telefono: customValidations.phone.optional(),
    es_principal: yup.boolean()
  })
};

// Funciones de validación individuales
export const validators = {
  // Validar email en tiempo real
  isValidEmail: (email) => {
    try {
      customValidations.email.validateSync(email);
      return { isValid: true, error: null };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  },

  // Validar contraseña en tiempo real
  isValidPassword: (password) => {
    try {
      customValidations.password.validateSync(password);
      return { isValid: true, error: null };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  },

  // Validar nombre de usuario en tiempo real
  isValidUsername: (username) => {
    try {
      customValidations.username.validateSync(username);
      return { isValid: true, error: null };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  },

  // Validar precio en tiempo real
  isValidPrice: (price) => {
    try {
      customValidations.price.validateSync(price);
      return { isValid: true, error: null };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  },

  // Validar que las contraseñas coincidan
  passwordsMatch: (password, confirmPassword) => {
    return password === confirmPassword;
  },

  // Validar código de verificación
  isValidVerificationCode: (code) => {
    try {
      customValidations.verificationCode.validateSync(code);
      return { isValid: true, error: null };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }
};