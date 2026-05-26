import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      archivo: 'ARCHIVE',
      referentes: 'REFERENCES',
      comunidad: 'COMMUNITY',
      about: 'ABOUT',
      entrar: 'LOGIN',
      salir: 'LOGOUT',
      liminal_desc: 'CREATIVE DIGITAL ARCHIVE',
    }
  },
  es: {
    translation: {
      archivo: 'ARCHIVO',
      referentes: 'REFERENTES',
      comunidad: 'COMUNIDAD',
      about: 'ABOUT',
      entrar: 'ENTRAR',
      salir: 'SALIR',
      liminal_desc: 'ARCHIVO CREATIVO DIGITAL',
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false }
  })

export default i18n