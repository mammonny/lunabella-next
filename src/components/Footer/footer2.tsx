import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { showCookiePreferences } from '@/components/CookieConsent/CookieConsent'

const footerLinks = [
  {
    title: 'Nosotros',
    href: '/nosotros',
  },
  {
    title: 'Nuestros Perros',
    href: '/nuestros-perros',
  },
  {
    title: 'Cachorros',
    href: '/cachorros',
  },
  {
    title: 'Exposiciones',
    href: '/exposiciones',
  },
  {
    title: 'Galeria',
    href: '/galeria',
  },
  {
    title: 'Contacto',
    href: '/contacto',
  },
]

const navigation = {
  social: [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/lunabellagolden',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/lunabellagolden',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
}

export default function Footer2() {
  return (
    <footer style={{ backgroundColor: '#ece8e1' }} aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-2 xl:gap-8">
          <div className="space-y-8 max-w-sm">
            {/* Logo LunaBella para footer */}
            <Image
              src="/logo-lunabella-golden-footer.png"
              alt="LunaBella Golden Retriever"
              width={280}
              height={100}
              className="h-20 w-auto"
            />
            <p className="text-sm leading-6 text-gray-700">
              Cría familiar, responsable y exclusiva de Golden Retriever. Una forma ética de entender
              la crianza.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Links de navegación */}
          <div className="mt-8 sm:mt-0 h-full flex flex-col justify-end items-start sm:items-end">
            <ul className="flex justify-start items-start gap-4 flex-wrap sm:justify-end">
              {footerLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Brand signature - Golden silhouette divider */}
        <div className="mt-16 sm:mt-20 lg:mt-24 flex items-center justify-center gap-6">
          <div className="flex-1 h-px bg-[#a58a1b]/20 max-w-[120px]" />
          <div
            className="w-10 h-7 opacity-30 hover:opacity-50 transition-opacity duration-500"
            style={{
              backgroundColor: '#a58a1b',
              maskImage: `url('/silueta-golden.svg')`,
              WebkitMaskImage: `url('/silueta-golden.svg')`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
            }}
          />
          <div className="flex-1 h-px bg-[#a58a1b]/20 max-w-[120px]" />
        </div>

        {/* Sección inferior con copyright y links legales */}
        <div
          className="mt-8 border-t border-gray-300 pt-8 flex flex-col items-center gap-y-4 sm:flex-row sm:justify-between sm:items-center sm:gap-y-0"
        >
          <span className="text-xs leading-5 text-center sm:text-left" style={{ color: '#a58a1b' }}>
            &copy; {new Date().getFullYear()}{' '}
            <Link href="/" className="hover:opacity-80" style={{ color: '#a58a1b' }}>
              LunaBella Golden Retriever
            </Link>
            . Todos los derechos reservados.
          </span>

          <div>
            <div className="flex justify-center sm:justify-start gap-x-4">
              <Link
                href="/politica-privacidad"
                className="text-xs leading-5 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Aviso Legal
              </Link>
              <Link
                href="/cookies"
                className="text-xs leading-5 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Cookies
              </Link>
              <button
                onClick={showCookiePreferences}
                className="text-xs leading-5 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200"
              >
                Configuración de cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
