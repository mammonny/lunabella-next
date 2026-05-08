import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, SetStepNav } from '@payloadcms/ui'
import { TranslateMockup } from './TranslateMockup.client'
import './index.scss'

export default async function TranslateView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={req.user ?? undefined}
      visibleEntities={visibleEntities}
    >
      <SetStepNav nav={[{ label: 'Traducir sitio' }]} />
      <div className="lbt">
        <Gutter className="lbt__gutter">
          <TranslateMockup />
        </Gutter>
      </div>
    </DefaultTemplate>
  )
}
