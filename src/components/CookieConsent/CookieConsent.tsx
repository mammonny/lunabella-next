'use client'

import { useEffect } from 'react'
import { companyInfo } from '@/config/company'

// Importamos la biblioteca y sus estilos
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import './cookieconsent-custom.css' // Importamos nuestros estilos personalizados

// Declaramos la interfaz global para window.cookieconsent
declare global {
  interface Window {
    cookieconsent: any
    cookieConsentIntervalId?: ReturnType<typeof setInterval>
  }
}

// Exportamos una función para mostrar las preferencias de cookies
// que puede ser utilizada desde cualquier componente
export const showCookiePreferences = () => {
  if (
    typeof window !== 'undefined' &&
    window.cookieconsent &&
    typeof window.cookieconsent.showPreferences === 'function'
  ) {
    window.cookieconsent.showPreferences()
  }
}

export const CookieConsentBanner = () => {
  useEffect(() => {
    // Declaramos el observer fuera del bloque try para poder acceder a él en el return
    const observer: MutationObserver | null = null

    // Importamos la biblioteca dinámicamente para evitar problemas con SSR
    const initCookieConsent = async () => {
      try {
        // Importamos la biblioteca
        const cookieConsentModule = await import('vanilla-cookieconsent')

        // Verificamos si el módulo tiene una propiedad default o si el módulo mismo es la biblioteca
        const CookieConsent = cookieConsentModule.default || cookieConsentModule

        if (!CookieConsent || typeof CookieConsent.run !== 'function') {
          console.error('Error: CookieConsent.run is not a function', CookieConsent)
          return
        }

        // Aplicamos estilos personalizados directamente
        const applyCustomStyles = () => {
          // Creamos un elemento de estilo
          const styleElement = document.createElement('style')
          styleElement.id = 'cc-custom-styles'

          // Definimos los estilos personalizados
          styleElement.textContent = `
            :root {
              --cc-bg: #ffffff !important;
              --cc-text: #3d3630 !important;
              --cc-btn-primary-bg: #a58a1b !important;
              --cc-btn-primary-text: #ffffff !important;
              --cc-btn-primary-hover-bg: #8a7316 !important;
              --cc-btn-secondary-bg: #e7e5e4 !important; /* Stone-300 de Tailwind */
              --cc-btn-secondary-text: #3d3630 !important; /* Texto oscuro para contraste */
              --cc-btn-secondary-hover-bg: #a8a29e !important; /* Stone-400 de Tailwind */
              --cc-toggle-bg-off: #e7e5e4 !important;
              --cc-toggle-bg-on: #a58a1b !important;
              --cc-toggle-bg-readonly: #e7e5e4 !important;
              --cc-toggle-knob-bg: #fff !important;
              --cc-toggle-knob-icon-color: #fff !important;
              --cc-block-text: #3d3630 !important;
              --cc-cookie-category-block-bg: #fafaf9 !important;
              --cc-cookie-category-block-bg-hover: #f5f5f4 !important;
              --cc-section-border: #e7e5e4 !important;
              --cc-cookie-table-border: #e7e5e4 !important;
              --cc-overlay-bg: rgba(0, 0, 0, 0.7) !important;
              --cc-webkit-scrollbar-bg: #e7e5e4 !important;
              --cc-webkit-scrollbar-bg-hover: #78716c !important;
            }

            .cc_div #cm {
              background-color: var(--cc-bg) !important;
              color: var(--cc-text) !important;
              border: 1px solid var(--cc-section-border) !important;
            }

            .cc_div .c-bn {
              background-color: var(--cc-btn-primary-bg) !important;
              color: var(--cc-btn-primary-text) !important;
              border-radius: 4px !important;
              font-weight: 600 !important;
              padding: 8px 16px !important;
            }

            .cc_div .c-bn:hover {
              background-color: var(--cc-btn-primary-hover-bg) !important;
            }

            .cc_div .c-bn.c-bl {
              background-color: transparent !important;
              color: var(--cc-btn-secondary-bg) !important;
              text-decoration: underline !important;
              margin-right: 10px !important;
            }

            .cc_div .c-bn.c-bl:hover {
              color: var(--cc-btn-secondary-hover-bg) !important;
            }

            .cc_div #cm.box.inline {
              border-top: 3px solid #a58a1b !important;
              right: 20px !important;
              bottom: 20px !important;
              left: auto !important;
              max-width: 350px !important;
            }

            .cc_div .cc_title {
              font-family: 'Playfair Display', serif !important;
              font-weight: 600 !important;
              color: #3d3630 !important;
            }

            .cc_div a {
              color: #a58a1b !important;
              text-decoration: underline !important;
            }

            .cc_div a:hover {
              color: #e7e5e4 !important; /* Stone-300 de Tailwind */
            }

            .cc_div .cc_message {
              color: #3d3630 !important;
            }
          `

          // Añadimos el elemento de estilo al head
          document.head.appendChild(styleElement)
        }

        // Inicializamos cookieconsent cuando el componente se monta
        CookieConsent.run({
          // Configuración general
          root: 'body',
          autoShow: true,
          disablePageInteraction: false,
          hideFromBots: true,

          // Configuración de la interfaz de usuario
          guiOptions: {
            consentModal: {
              layout: 'box inline',
              position: 'bottom right',
              equalWeightButtons: false,
              flipButtons: false,
            },
            preferencesModal: {
              layout: 'box',
              position: 'right',
              equalWeightButtons: false,
              flipButtons: false,
            },
          },

          // Configuración de las categorías de cookies
          categories: {
            necessary: {
              enabled: true, // Siempre habilitado
              readOnly: true, // No se puede desactivar
            },
          },

          // Configuración del lenguaje
          language: {
            default: 'es',
            translations: {
              es: {
                consentModal: {
                  title: 'Utilizamos cookies',
                  description:
                    'Utilizamos cookies técnicas necesarias para garantizar el correcto funcionamiento de nuestro sitio web.',
                  acceptAllBtn: 'Aceptar',
                  showPreferencesBtn: 'Más información',
                  footer: `
                <a href="/cookies" target="_blank">Política de Cookies</a>
              `,
                },
                preferencesModal: {
                  title: 'Preferencias de cookies',
                  acceptAllBtn: 'Aceptar todas',
                  acceptNecessaryBtn: 'Rechazar todas',
                  savePreferencesBtn: 'Guardar preferencias',
                  closeIconLabel: 'Cerrar',
                  sections: [
                    {
                      title: 'Uso de Cookies',
                      description: `Para mejorar su experiencia en nuestro sitio web ${companyInfo.web}, utilizamos cookies y tecnologías similares. Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio.`,
                    },
                    {
                      title: 'Cookies estrictamente necesarias',
                      description:
                        'Estas cookies son esenciales para el funcionamiento básico del sitio web. Incluyen cookies que permiten recordar su sesión mientras navega por el sitio o acceder a áreas seguras. El sitio web no puede funcionar correctamente sin estas cookies, por lo que no pueden ser desactivadas.',
                      cookieTable: {
                        headers: {
                          name: 'Nombre',
                          domain: 'Dominio',
                          desc: 'Descripción',
                          exp: 'Expiración',
                        },
                        body: [
                          {
                            name: 'session',
                            domain: companyInfo.web,
                            desc: 'Cookie de sesión para mantener el estado del usuario durante la navegación',
                            exp: 'Sesión',
                          },
                          {
                            name: 'cookie-consent',
                            domain: companyInfo.web,
                            desc: 'Almacena sus preferencias de consentimiento de cookies',
                            exp: '12 meses',
                          },
                        ],
                      },
                    },
                    {
                      title: 'Más información',
                      description: `Para cualquier consulta relacionada con nuestra política de cookies y sus opciones, por favor <a href="mailto:${companyInfo.email}">contáctenos</a>.`,
                    },
                  ],
                },
              },
            },
          },
        })

        // Guardamos la instancia para poder destruirla después y acceder a ella desde otros componentes
        window.cookieconsent = CookieConsent

        // Aplicamos los estilos personalizados después de inicializar cookieconsent
        setTimeout(() => {
          applyCustomStyles()
        }, 100)

        // Añadimos un botón flotante para acceder a las preferencias de cookies
        // Este botón será visible solo después de que el usuario haya cerrado el banner principal
        /*
        const createCookieSettingsButton = () => {
          // Verificamos si ya existe el botón para evitar duplicados
          if (document.getElementById('cc-settings-button')) return

          const button = document.createElement('button')
          button.id = 'cc-settings-button'
          button.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/></svg>'
          button.setAttribute('aria-label', 'Configuración de cookies')
          button.style.position = 'fixed'
          button.style.bottom = '20px'
          button.style.right = '20px'
          button.style.zIndex = '999999'
          button.style.width = '50px'
          button.style.height = '50px'
          button.style.borderRadius = '50%'
          button.style.backgroundColor = '#006160'
          button.style.color = 'white'
          button.style.border = 'none'
          button.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)'
          button.style.cursor = 'pointer'
          button.style.display = 'flex'
          button.style.alignItems = 'center'
          button.style.justifyContent = 'center'
          button.style.transition = 'transform 0.3s ease, background-color 0.3s ease'

          button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.1)'
            button.style.backgroundColor = '#004b4a'
          })

          button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)'
            button.style.backgroundColor = '#006160'
          })

          button.addEventListener('click', () => {
            if (
              window.cookieconsent &&
              typeof window.cookieconsent.showPreferences === 'function'
            ) {
              window.cookieconsent.showPreferences()
            }
          })

          document.body.appendChild(button)
        }

        // Creamos una función para verificar si el banner está cerrado
        const checkIfBannerClosed = () => {
          const consentModal = document.querySelector('#cc-main .cm')
          // Si el banner no existe o está oculto, mostramos el botón flotante
          if (
            !consentModal ||
            (consentModal && window.getComputedStyle(consentModal).visibility === 'hidden')
          ) {
            createCookieSettingsButton()
          }
        }

        // Observamos cuando el banner de cookies se cierra para mostrar el botón flotante
        observer = new MutationObserver(() => {
          checkIfBannerClosed()
        })

        // Iniciamos la observación del DOM después de un breve retraso para asegurar que el banner se ha renderizado
        setTimeout(() => {
          const ccMain = document.getElementById('cc-main')
          if (ccMain && observer) {
            observer.observe(ccMain, { childList: true, subtree: true, attributes: true })
          }

          // También verificamos inmediatamente si el banner está cerrado
          // Esto es útil si el usuario ya ha aceptado las cookies en una visita anterior
          checkIfBannerClosed()

          // Configuramos un intervalo para verificar periódicamente si el banner está cerrado
          // Esto es una medida adicional para asegurarnos de que el botón aparezca
          const intervalId = setInterval(checkIfBannerClosed, 2000)

          // Guardamos el ID del intervalo en window para poder limpiarlo después
          window.cookieConsentIntervalId = intervalId
        }, 1000)
        */
      } catch (error) {
        console.error('Error initializing cookie consent:', error)
      }
    }

    initCookieConsent()

    // Limpieza al desmontar el componente
    return () => {
      if (window.cookieconsent && typeof window.cookieconsent.destroy === 'function') {
        window.cookieconsent.destroy()
      }

      // Eliminamos el botón flotante y el observer al desmontar el componente
      /*
      const button = document.getElementById('cc-settings-button')
      if (button) {
        button.remove()
      }
      */

      // Eliminamos los estilos personalizados
      const customStyles = document.getElementById('cc-custom-styles')
      if (customStyles) {
        customStyles.remove()
      }

      // Limpiamos el intervalo
      /*
      if (window.cookieConsentIntervalId) {
        clearInterval(window.cookieConsentIntervalId)
      }
      */

      /*
      if (observer) {
        observer.disconnect()
      }
      */
    }
  }, [])

  return null // Este componente no renderiza nada visible
}
