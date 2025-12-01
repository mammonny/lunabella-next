import { Button } from '@/components/ui/button'
import { Dribbble, Linkedin, Twitch, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const teamMembers = [
  {
    name: 'Dra. Marta Recio',
    title: 'Ginecología Regenerativa, Estética y Salud hormonal',
    bio: 'Atención integral y personalizada para la salud hormonal, el dolor ginecológico y el bienestar íntimo, desde un enfoque empático y holístico.',
    imageUrl: '/team/Dra_Marta_Recio_thumbnail.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/marta-recio/',
  },
  {
    name: 'Dr. Carlos Udina',
    title: 'Medicina Física y Rehabilitación',
    bio: 'Experto en dolor crónico y rehabilitación funcional. Referente en terapias regenerativas y neuroadaptativas para la mejora de la calidad de vida de sus pacientes.',
    imageUrl: '/team/Dr_Carlos_Udina.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/carlos-udina-cortes',
  },
  {
    name: 'Dr. Gonzalo Zeballos',
    title: 'Pediatra y Neonatólogo',
    bio: 'Especialista en prematuridad, bajo peso, crecimiento y neurodesarrollo, cuenta con más de 17 años de experiencia.',
    imageUrl: '/team/Dr_Gonzalo_Verballos.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/marta-recio/',
  },
  {
    name: 'Dr. Miguel Salmerón',
    title: 'Ginecólogo y Obstetra',
    bio: 'Especialista en medicina materno-fetal, diagnóstico prenatal y embarazos de alto riesgo, con más de 15 años de experiencia acompañando a madres en cada etapa de la gestación.',
    imageUrl: '/team/Dr_Miguel_Salmeron.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/miguel-salmer%C3%B3n-celi-5a3524142/',
  },
]

const Team04Page = () => {
  return (
    <div className="flex flex-col  justify-center py-10 sm:py-20 px-6 lg:px-20 max-w-screen-xl mx-auto gap-16">
      <div className="text-center max-w-2xl mx-auto">
        <b className="text-center text-secondary text-base font-semibold">¡Conócenos!</b>
        <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
          <span className="[text-shadow:-10px_6px_15px_hsla(35,66%,53%,0.5)]">Nuestro equipo</span>
        </h2>
        <p className="mt-6 text-base sm:text-lg">
          Our philosophy is simple — hire a team of diverse, passionate people and foster a culture
          that empowers you to do you best work.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row-reverse sm:justify-center gap-3">
          {/* <Button size="lg">Nuestro equipo</Button>
          <Button size="lg" variant="outline">
            Acerca de nosotros
          </Button> */}
        </div>
      </div>

      <div className="w-full grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-12">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="flex flex-col items-center text-center bg-secondary/15 py-8 px-6 rounded-xl"
          >
            <Image
              src={member.imageUrl}
              alt={member.name}
              className="shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover bg-secondary"
              width={120}
              height={120}
            />
            <h3 className="mt-5 text-lg text-primary font-bold">{member.name}</h3>
            <p className="text-muted-foreground text-sm">{member.title}</p>
            <p className="mt-2 mb-6">{member.bio}</p>
            <div className="mt-auto flex items-center gap-4">
              <Link href="#" target="_blank">
                <Twitter className="stroke-muted-foreground h-5 w-5" />
              </Link>
              <Link href={member.linkedinUrl} target="_blank">
                <Linkedin className="stroke-muted-foreground h-5 w-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Team04Page
