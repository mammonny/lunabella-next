'use client'

import { Banner } from '@payloadcms/ui/elements/Banner'
import { useAuth } from '@payloadcms/ui'
import React from 'react'

import './index.scss'

const BeforeDashboard: React.FC = () => {
  const { user } = useAuth()
  const isAdmin = (user as any)?.roles === 'admin'

  return (
    <div className="before-dashboard">
      <Banner className="before-dashboard__banner" type="success">
        <h4>Bienvenido a LunaBella</h4>
      </Banner>
      <p>
        {isAdmin
          ? 'Gestiona tus perros, camadas, cachorros y contenido del sitio web desde aqui.'
          : 'Gestiona los ejemplares y exposiciones desde aqui.'}
      </p>
    </div>
  )
}

export default BeforeDashboard
