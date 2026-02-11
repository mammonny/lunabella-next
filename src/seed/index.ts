import type { Payload } from 'payload'
import fs from 'fs'
import path from 'path'

async function uploadImage(payload: Payload, imagePath: string, altText: string): Promise<number> {
  const fullPath = path.join(process.cwd(), imagePath)
  const imageBuffer = fs.readFileSync(fullPath)
  const fileName = path.basename(imagePath)

  const media = await payload.create({
    collection: 'media',
    data: { alt: altText },
    file: {
      data: imageBuffer,
      mimetype: 'image/jpeg',
      name: fileName,
      size: imageBuffer.length,
    },
  })
  return media.id
}

export const seed = async (payload: Payload): Promise<void> => {
  // DESACTIVADO - No ejecutar seed hasta nuevo aviso
  payload.logger.info('Seed disabled')
  return

  // Buscar o crear la raza Golden Retriever
  const goldenRetriever = await payload.find({
    collection: 'breeds',
    where: { slug: { equals: 'golden-retriever' } },
    limit: 1,
  })

  let breedId: number

  if (goldenRetriever.docs.length === 0) {
    payload.logger.info('Creating Golden Retriever breed...')

    // Upload breed placeholder image
    const breedImageId = await uploadImage(
      payload,
      'public/images/lunabella/hero-bg.jpg',
      'Golden Retriever'
    )

    const newBreed = await payload.create({
      collection: 'breeds',
      data: {
        name: 'Golden Retriever',
        slug: 'golden-retriever',
        mainImage: breedImageId,
        description: {
          root: {
            type: 'root',
            version: 1,
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            children: [
              {
                type: 'paragraph',
                version: 1,
                direction: 'ltr' as const,
                format: '' as const,
                indent: 0,
                textFormat: 0,
                textStyle: '',
                children: [{ type: 'text', version: 1, format: 0, style: '', detail: 0, mode: 'normal' as const, text: 'El Golden Retriever es una raza de perro amigable, inteligente y leal.' }],
              },
            ],
          },
        },
        size: 'large',
        groomingNeeds: 'high',
        exerciseNeeds: 'high',
        _status: 'published',
      },
    })
    breedId = newBreed.id
  } else {
    breedId = goldenRetriever.docs[0]!.id
  }

  // Upload dog placeholder image
  const dogImageId = await uploadImage(
    payload,
    'public/images/lunabella/filosofia.jpg',
    'Dog placeholder'
  )

  // Datos de perros de muestra
  const sampleDogs = [
    {
      name: 'Zeus',
      breed: breedId,
      breedingStatus: 'active' as const,
      gender: 'male' as const,
      birthDate: '2020-03-15',
      color: 'Dorado Claro',
      weight: 32,
      height: 58,
      pedigreeNumber: 'LOE-2345678',
      breeder: 'Criadero LunaBella',
      parents: { father: 'Champion Golden Star', mother: 'Lady Sunshine' },
      mainImage: dogImageId,
      description: {
        root: {
          type: 'root',
          children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Zeus es nuestro semental principal. Un ejemplar excepcional con un temperamento equilibrado.' }] }],
        },
      },
      _status: 'published' as const,
    },
    {
      name: 'Luna',
      breed: breedId,
      breedingStatus: 'active' as const,
      gender: 'female' as const,
      birthDate: '2021-06-20',
      color: 'Dorado',
      weight: 28,
      height: 54,
      pedigreeNumber: 'LOE-3456789',
      breeder: 'Criadero LunaBella',
      parents: { father: 'Golden Duke', mother: 'Bella Aurora' },
      mainImage: dogImageId,
      description: {
        root: {
          type: 'root',
          children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Luna es una hembra dulce y cariñosa. Es una madre excepcional.' }] }],
        },
      },
      _status: 'published' as const,
    },
    {
      name: 'Apollo',
      breed: breedId,
      breedingStatus: 'active' as const,
      gender: 'male' as const,
      birthDate: '2022-01-10',
      color: 'Dorado Oscuro',
      weight: 34,
      height: 60,
      pedigreeNumber: 'LOE-4567890',
      breeder: 'Golden Dreams Kennel',
      parents: { father: 'Sir Maximus', mother: 'Princess Golden' },
      mainImage: dogImageId,
      description: {
        root: {
          type: 'root',
          children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Apollo es un joven semental con un futuro prometedor.' }] }],
        },
      },
      _status: 'published' as const,
    },
    {
      name: 'Bella',
      breed: breedId,
      breedingStatus: 'active' as const,
      gender: 'female' as const,
      birthDate: '2020-09-05',
      color: 'Crema',
      weight: 27,
      height: 52,
      pedigreeNumber: 'LOE-5678901',
      breeder: 'Criadero LunaBella',
      parents: { father: 'Golden Champion', mother: 'Sweet Honey' },
      mainImage: dogImageId,
      description: {
        root: {
          type: 'root',
          children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Bella es nuestra hembra más experimentada con varias camadas excepcionales.' }] }],
        },
      },
      _status: 'published' as const,
    },
    {
      name: 'Rocky',
      breed: breedId,
      breedingStatus: 'retired' as const,
      gender: 'male' as const,
      birthDate: '2015-04-12',
      color: 'Dorado',
      weight: 30,
      height: 56,
      pedigreeNumber: 'LOE-1234567',
      breeder: 'Criadero LunaBella',
      parents: { father: 'Golden King', mother: 'Queen Daisy' },
      mainImage: dogImageId,
      description: {
        root: {
          type: 'root',
          children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Rocky fue nuestro semental fundador. Ahora disfruta de su retiro.' }] }],
        },
      },
      _status: 'published' as const,
    },
    {
      name: 'Daisy',
      breed: breedId,
      breedingStatus: 'deceased' as const,
      gender: 'female' as const,
      birthDate: '2012-02-28',
      color: 'Dorado Claro',
      weight: 26,
      height: 51,
      pedigreeNumber: 'LOE-0123456',
      breeder: 'Criadero LunaBella',
      parents: { father: 'Sir Golden', mother: 'Lady Rose' },
      mainImage: dogImageId,
      description: {
        root: {
          type: 'root',
          children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Daisy fue la matriarca de nuestro criadero. Siempre la recordaremos.' }] }],
        },
      },
      _status: 'published' as const,
    },
  ]

  for (const dogData of sampleDogs) {
    // Verificar si el perro ya existe por nombre
    const existingDog = await payload.find({
      collection: 'dogs',
      where: { name: { equals: dogData.name } },
      limit: 1,
    })

    if (existingDog.docs.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.create({ collection: 'dogs', data: dogData as any })
      payload.logger.info(`Created dog: ${dogData.name}`)
    } else {
      payload.logger.info(`Dog already exists, skipping: ${dogData.name}`)
    }
  }

  payload.logger.info('Seed completed!')
}
