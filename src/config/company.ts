/**
 * Configuración centralizada con la información de contacto de la empresa
 * Este archivo permite mantener estos datos en un solo lugar y acceder a ellos desde cualquier parte de la aplicación
 */

export const companyInfo = {
  name: 'Criadero de Golden Retriever LunaBella', // Nombre de la empresa
  address: 'Barrio Elbarrena 31, 20247 Zaldibia (Gipuzkoa), Espana', // Dirección de la empresa
  phone: '+34670004089', // Número de teléfono
  email: 'maria@lunabella.es', // Email de contacto
  metro: '-', // Estaciones de metro cercanas
  razonSocial: 'GAMA KALITATE SL', // Razón social
  NIF: 'B72663669', // NIF
  domicilio: 'Barrio Elbarrena 31, 20247 Zaldibia (Gipuzkoa), Espana', // Domicilio fiscal
  web: 'https://lunabella.es/', // URL de la web
}

/**
 * Configuración de WhatsApp con ofuscación para prevenir spam
 * El número se construye dinámicamente para dificultar el scraping automático
 */
const whatsappParts = ['3', '4', '6', '7', '0', '0', '0', '4', '0', '8', '9']

/**
 * Obtiene el número de WhatsApp construyéndolo dinámicamente
 * @returns Número de WhatsApp sin espacios ni símbolos (formato: 34660490797)
 */
export const getWhatsAppNumber = (): string => {
  return whatsappParts.join('')
}

/**
 * Obtiene el mensaje predeterminado para WhatsApp
 * @returns Mensaje de contacto predeterminado
 */
export const getWhatsAppMessage = (): string => {
  return 'Hola, me gustaría tener más información'
}

/**
 * Obtiene el mensaje de WhatsApp para consultas sobre servicios
 * @returns Mensaje para información de servicios
 */
export const getWhatsAppMessageBotonWhatsApp = (): string => {
  return 'Hola, me gustaría tener más información'
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
