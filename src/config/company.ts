/**
 * Configuración centralizada con la información de contacto de la empresa
 * Este archivo permite mantener estos datos en un solo lugar y acceder a ellos desde cualquier parte de la aplicación
 */

export const companyInfo = {
  name: 'InnovaCare', // Nombre de la empresa
  address: 'Calle Granito 20, 28045 Madrid', // Dirección de la empresa
  phone: '+34660490797', // Número de teléfono
  email: 'info@clinicainnovacare.es', // Email de contacto
  metro: 'Arganzuela-Planetario, Legazpi, Delicias', // Estaciones de metro cercanas
  razonSocial: 'INTIMATECARE AND BALANCE, S.L.P.', // Razón social
  NIF: 'B75388397', // NIF
  domicilio: 'AV Cordoba 29, 11C 28026 Madrid ', // Domicilio fiscal
  web: 'https://clinicainnovacare.es', // URL de la web
}

// Función auxiliar para obtener toda la información de la empresa
export const getCompanyInfo = () => {
  return companyInfo
}

// Funciones auxiliares para obtener datos específicos
export const getCompanyAddress = () => companyInfo.address
export const getCompanyPhone = () => companyInfo.phone
export const getCompanyEmail = () => companyInfo.email
export const getCompanyMetro = () => companyInfo.metro
export const getCompanyRazonSocial = () => companyInfo.razonSocial
export const getCompanyNIF = () => companyInfo.NIF
export const getCompanyDomicilio = () => companyInfo.domicilio
export const getCompanyWeb = () => companyInfo.web
