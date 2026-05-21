import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })
dotenvConfig({ path: '.env' })

async function main() {
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY no está definida en .env.local — añádela antes de probar.')
    process.exit(1)
  }

  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })

  const to = process.argv[2] || 'mammonny@gmail.com'
  console.log(`Enviando email de prueba a: ${to} ...`)

  const result = await payload.sendEmail({
    to,
    from: '"LunaBella" <noreply@lunabella.es>',
    subject: '✅ Prueba de envío — LunaBella (Resend)',
    html: '<p>Si lees esto, el envío de emails con Resend funciona correctamente. El remitente debería mostrarse como <strong>LunaBella</strong>.</p>',
  })

  console.log('Resultado del envío:')
  console.log(JSON.stringify(result, null, 2))
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Falló el envío:')
  console.error(err)
  process.exit(1)
})
