import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { DribbbleIcon, GithubIcon, TwitchIcon, TwitterIcon } from 'lucide-react'
import Link from 'next/link'
import { showCookiePreferences } from '@/components/CookieConsent/CookieConsent'

const footerLinks = [
  {
    title: 'Overview',
    href: '#',
  },
  {
    title: 'Features',
    href: '#',
  },
  {
    title: 'Pricing',
    href: '#',
  },
  {
    title: 'Careers',
    href: '#',
  },
  {
    title: 'Help',
    href: '#',
  },
  {
    title: 'Privacy',
    href: '#',
  },
  {
    title: 'Cookies',
    href: '/cookies',
  },
]

const Footer3 = () => {
  return (
    <div className=" flex flex-col">
      <div className="grow bg-muted" />
      <footer className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
            <div className="space-y-4">
              {/* Logo */}
              <img className="h-10" src="/logosemidoradomini.svg" alt="InnovaCare" />
              <p className="text-sm leading-6 text-stone-300">
                Making the world a better place through constructing elegant hierarchies.
              </p>
              <div className="flex items-center gap-5 text-muted-foreground">
                <Link href="#" target="_blank">
                  <TwitterIcon className="h-5 w-5" />
                </Link>
                <Link href="#" target="_blank">
                  <DribbbleIcon className="h-5 w-5" />
                </Link>
                <Link href="#" target="_blank">
                  <TwitchIcon className="h-5 w-5" />
                </Link>
                <Link href="#" target="_blank">
                  <GithubIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Subscribe Newsletter */}
            <div className="max-w-md w-full">
              <h6 className="font-semibold">Stay up to date</h6>
              <ul className="mt-6 flex items-center gap-4 flex-wrap">
                {footerLinks.map(({ title, href }) => (
                  <li key={title}>
                    <Link href={href} className="text-muted-foreground hover:text-foreground">
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                onClick={showCookiePreferences}
                className="mt-4 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Configuración de cookies
              </button>
            </div>
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()}{' '}
              <Link href="/" target="_blank">
                Shadcn UI Blocks
              </Link>
              . All rights reserved.
            </span>

            <div className="flex items-center gap-5 text-muted-foreground">
              <Link href="#" target="_blank">
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <DribbbleIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <TwitchIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <GithubIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer3
