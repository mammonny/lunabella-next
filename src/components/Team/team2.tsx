const people = [
  {
    name: 'Dra. Marta Recio',
    role: 'Ginecología Regenerativa, Estética y Salud hormonal',
    bio: 'Atención integral y personalizada del bienestar íntimo de la mujer, el abordaje regenerativo del dolor ginecológico y la estética genital, así como el tratamiento de los problemas hormonales a cualquier edad, en hombres y mujeres.',
    imageUrl: '/team/Dra_Marta_Recio_thumbnail.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/marta-recio/',
    twitterUrl: '#',
  },
  {
    name: 'Dr. Gonzalo Zeballos',
    role: 'Pediatra y Neonatólogo',
    bio: 'Especialista en prematuridad, bajo peso, crecimiento y neurodesarrollo, cuenta con más de 17 años de experiencia.',
    imageUrl: '/team/Dr_Gonzalo_Zeballos.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/marta-recio/',
    twitterUrl: '#',
  },
  {
    name: 'Dr. Carlos Udina',
    role: 'Farmacéutico especialista en terapia neuroadaptativa y estética',
    bio: 'Farmacéutico especialista en terapia neuroadaptativa para el tratamiento del dolor agudo o crónico, los problemas autoinmunes y la estética.',
    imageUrl: '/team/Dr_Carlos_Udina.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/carlos-udina-cortes',
    twitterUrl: '#',
  },
  {
    name: 'Dr. Miguel Salmerón Celi',
    role: 'Rehabilitación Médica, Suelo Pélvico, Dolor, Estética y Terapias con Ondas de Choque',
    bio: 'Atención integral y personalizada para la recuperación funcional, el manejo del dolor, el cuidado del suelo pélvico y la estética médica, desde un enfoque empático, científico y centrado en el bienestar global del paciente.',
    imageUrl: '/team/Dr_Miguel_Salmeron.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/miguel-salmer%C3%B3n-celi-5a3524142/',
    twitterUrl: '#',
  },
  {
    name: 'Dr. David Carracedo Calvo',
    role: 'Responsable de la Unidad de Urología Funcional Femenina y Urodinámia',
    bio: 'Especialista en Cirugía Robótica, Incontinencia Urinaria, Prolapso de órganos pélvicos y Urología Funcional y Femenina.',
    imageUrl: '/team/David-Carracedo.png.webp', // TODO: Reemplazar con la URL de imagen real
    linkedinUrl: 'https://www.linkedin.com/in/david-carracedo-calvo-0763b8280/', //
    twitterUrl: '#',
  },
]

export default function Team2() {
  return (
    <div id="equipo" className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-5 items-start">
        <div className="max-w-2xl xl:col-span-2 xl:sticky top-20">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            <span className="[text-shadow:-10px_6px_15px_hsla(35,66%,53%,0.5)]">
              Nuestro equipo
            </span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-stone-600">
            En InnovaCare contamos con un equipo de profesionales que combinan experiencia,
            innovación y un trato humano. Especialistas comprometidos en ofrecer soluciones
            personalizadas para cuidar de tu bienestar y acompañarte en cada etapa de tu vida.
          </p>
        </div>
        <ul role="list" className="space-y-12 divide-y divide-stone-200 xl:col-span-3">
          {' '}
          {/* Eliminado -mt-12 */}
          {people.map((person) => (
            <li key={person.name} className="flex flex-col gap-10 pt-12 sm:flex-row">
              <img
                className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover"
                src={person.imageUrl}
                alt=""
              />
              <div className="max-w-xl flex-auto">
                <h3 className="text-lg font-semibold leading-8 tracking-tight text-primary">
                  {person.name}
                </h3>
                <p className="text-base leading-7 text-stone-600">{person.role}</p>
                <p className="mt-6 text-base leading-7 text-stone-600">{person.bio}</p>
                <ul role="list" className="mt-6 flex gap-x-6">
                  <li>
                    <a href={person.linkedinUrl} className="text-secondary hover:text-stone-500">
                      <span className="sr-only">LinkedIn</span>
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href={person.twitterUrl}
                      className="text-secondary hover:text-stone-500 hidden"
                    >
                      <span className="sr-only">Twitter</span>
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
