import { ArrowRight, PhoneOutgoing, Heart, Home, Award } from 'lucide-react'
import Image from 'next/image'
import { Button } from 'src/components/ui/button'
import { NavbarCombined } from '@/components/Header/navbar-combined'
import { Container } from '@/components/Container/container'
import { Badge } from 'src/components/ui/badge'
// Eliminamos importaciones no utilizadas
import { Hero } from '@/components/Hero/Hero'
import Services from '@/components/Services/Services'
import ContactSection2 from '@/components/ContactSection2/contact'
import CTASection2 from '@/components/CTASection/ctasection2'
import Testimonials from '@/components/Testimonials/testimonials'
import LogoCloud from '@/components/LogoCloud/logocloud'
// import { Header } from '@/Header/Component' // Comentado o eliminado si no se usa
// Eliminamos importación no utilizada
import Team2 from '@/components/Team/team2'
import { companyInfo } from '@/config/company'
import Link from 'next/link'
import TestimonialsGrid from '@/components/Testimonials/testimonialsgrid'

const features = [
  {
    name: 'Centro de cría familiar.',
    /*     description: 'Especializado en Bichon Maltés y Shih Tzu con Núcleo Zoológico registrado.',
     */ icon: Home,
  },
  {
    name: 'Crianza con amor y pasión.',
    /*     description: 'Cada cachorro es especial y valioso, criado en un entorno familiar cariñoso.',
     */ icon: Heart,
  },
  {
    name: 'Socialización adecuada.',
    /*     description: 'Nuestros perritos crecen como parte de nuestro hogar para ser bien socializados.',
     */ icon: Award,
  },
]

const HomePage3 = () => (
  <>
    <main className="isolate">
      <Hero
        variant="home"
        title={
          <>
            Cría <br />
            Familiar
            <br />{' '}
            <span className="[text-shadow:-10px_6px_15px_hsla(35,66%,53%,0.5)]">Goiz-Ametz</span>
          </>
        }
        description="Núcleo Zoológico: ES261110000003"
        additionalText="Un acogedor centro de cría familiar especializado en Bichon Maltés, Shih Tzu, Lou Lou Pomerania y Yorkshire Terrier ubicado en Ollauri (La Rioja)."
        imageSrc="/fotos/bichonmaltesraza.webp"
        imageAlt="Perro corriendo en el criadero Goiz Ametz"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
      {/* Hero section */}

      {/* Cierre del primer div w-full py-20 lg:pb-40 */}
      <div id="quiensomos" className="w-full py-24 sm:py-56">
        {' '}
        {/* Re-abrir un div contenedor si es necesario o ajustar estructura */}
        {/* hero2 bien */}
        {/* Content section */}
        <div className=" container max-w-7xl overflow-hidden lg:overflow-visible">
          <div className="mx-auto max-w-7xl ">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
              <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  <span className="[text-shadow:-10px_6px_15px_hsla(35,66%,53%,0.5)]">
                    Bienvenido a Goiz-Ametz
                  </span>
                </h2>
                <p className="mt-6 text-base leading-8 ">
                  Somos Goiz Ametz, un acogedor centro de cría familiar especializado en Bichon
                  Maltés y Shih Tzu, ubicado en Ollauri (La Rioja). Contamos con el Núcleo Zoológico
                  ES261110000003.
                </p>
                <p className="mt-6 text-base leading-7 ">
                  No somos simplemente un criadero; somos una familia con una profunda conexión con
                  el reino animal, donde las mascotas son más que simples compañeros, son nuestra
                  pasión, nuestro trabajo y nuestra forma de vivir. Creemos fervientemente que los
                  perros merecen crecer en un entorno familiar para ser socializados adecuadamente.
                </p>
                <p className="mt-6 text-base leading-7 ">
                  En Goiz Ametz, nos esforzamos por hacer las cosas correctamente porque cada
                  pequeño que criamos es especial y valioso. Así nació Goiz Ametz, que en euskera
                  significa “Sueños Alegres“, porque nuestros perritos son cariñosos y
                  verdaderamente parte de nuestro hogar.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7  lg:max-w-none">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-8">
                      <dt className="inline font-semibold text-primary">
                        <feature.icon
                          className="absolute left-0 top-1 h-5 w-5"
                          aria-hidden="true"
                        />
                        <span className="text-stone-600">{feature.name}</span>
                      </dt>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
                <div className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
                  {/* Modified Image 1 */}
                  <div className="relative aspect-[5/7] w-[37rem] max-w-none rounded-2xl bg-gray-50">
                    <Image
                      src="/fotos/Agatha.jpg"
                      alt="Exterior de la clínica InnovaCare"
                      fill
                      className="rounded-2xl object-cover"
                    />
                  </div>
                </div>
                <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
                  <div className="order-first flex w-64 flex-none justify-end self-end lg:w-auto">
                    {/* Modified Image 2 */}
                    <div className="relative aspect-[4/3] w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50">
                      <Image
                        src="/fotos/dscn1739.jpg"
                        alt="Team meeting"
                        fill
                        className="rounded-2xl object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                    {/* Modified Image 3 */}
                    <div className="relative aspect-[7/5] w-[37rem] max-w-none flex-none rounded-2xl bg-gray-50">
                      <Image
                        src="/fotos/llamadas.jpg"
                        alt="Colleagues collaborating"
                        fill
                        className="rounded-2xl object-cover"
                      />
                    </div>
                  </div>
                  <div className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                    {/* Modified Image 4 */}
                    <div className="relative aspect-[4/3] w-[24rem] max-w-none rounded-2xl bg-gray-50">
                      <Image
                        src="/fotos/nena.jpg"
                        alt="Person working on laptop"
                        fill
                        className="rounded-2xl object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Services />
      <CTASection2 />

      {/* <Testimonials /> */}
      <TestimonialsGrid />
      <ContactSection2 />
    </main>
  </>
)
export default HomePage3
