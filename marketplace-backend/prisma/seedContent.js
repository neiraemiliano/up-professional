const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultContent = [
  // Hero Section
  {
    id: 'hero_title',
    key: 'hero_title',
    name: 'Título Principal',
    value: 'Encuentra el profesional perfecto para tu hogar',
    defaultValue: 'Encuentra el profesional perfecto para tu hogar',
    description: 'Título principal de la página de inicio',
    type: 'text',
    category: 'hero'
  },
  {
    id: 'hero_subtitle',
    key: 'hero_subtitle',
    name: 'Subtítulo Hero',
    value: 'Conectamos hogares con profesionales verificados y confiables',
    defaultValue: 'Conectamos hogares con profesionales verificados y confiables',
    description: 'Subtítulo de la sección hero',
    type: 'text',
    category: 'hero'
  },
  {
    id: 'hero_cta_button',
    key: 'hero_cta_button',
    name: 'Botón CTA Principal',
    value: 'Buscar Profesionales',
    defaultValue: 'Buscar Profesionales',
    description: 'Texto del botón de llamada a la acción principal',
    type: 'text',
    category: 'hero'
  },

  // How It Works Section
  {
    id: 'how_it_works_title',
    key: 'how_it_works_title',
    name: 'Título Cómo Funciona',
    value: 'Cómo funciona nuestra plataforma',
    defaultValue: 'Cómo funciona nuestra plataforma',
    description: 'Título de la sección "Cómo funciona"',
    type: 'text',
    category: 'how_it_works'
  },
  {
    id: 'how_it_works_step1',
    key: 'how_it_works_step1',
    name: 'Paso 1',
    value: 'Describe tu proyecto y recibe cotizaciones',
    defaultValue: 'Describe tu proyecto y recibe cotizaciones',
    description: 'Descripción del paso 1',
    type: 'text',
    category: 'how_it_works'
  },
  {
    id: 'how_it_works_step2',
    key: 'how_it_works_step2',
    name: 'Paso 2',
    value: 'Compara perfiles y elige al mejor profesional',
    defaultValue: 'Compara perfiles y elige al mejor profesional',
    description: 'Descripción del paso 2',
    type: 'text',
    category: 'how_it_works'
  },
  {
    id: 'how_it_works_step3',
    key: 'how_it_works_step3',
    name: 'Paso 3',
    value: 'Agenda, paga y califica el servicio',
    defaultValue: 'Agenda, paga y califica el servicio',
    description: 'Descripción del paso 3',
    type: 'text',
    category: 'how_it_works'
  },

  // Footer
  {
    id: 'footer_company_description',
    key: 'footer_company_description',
    name: 'Descripción de la Empresa',
    value: 'La plataforma más confiable para encontrar profesionales del hogar en Argentina.',
    defaultValue: 'La plataforma más confiable para encontrar profesionales del hogar en Argentina.',
    description: 'Descripción breve de la empresa en el footer',
    type: 'text',
    category: 'footer'
  },
  {
    id: 'footer_copyright',
    key: 'footer_copyright',
    name: 'Copyright',
    value: '© 2024 Home Fixed. Todos los derechos reservados.',
    defaultValue: '© 2024 Home Fixed. Todos los derechos reservados.',
    description: 'Texto de copyright',
    type: 'text',
    category: 'footer'
  },

  // Contact Information
  {
    id: 'contact_phone',
    key: 'contact_phone',
    name: 'Teléfono de Contacto',
    value: '+54 11 1234-5678',
    defaultValue: '+54 11 1234-5678',
    description: 'Número de teléfono principal',
    type: 'text',
    category: 'contact'
  },
  {
    id: 'contact_email',
    key: 'contact_email',
    name: 'Email de Contacto',
    value: 'contacto@homefixed.com',
    defaultValue: 'contacto@homefixed.com',
    description: 'Email de contacto principal',
    type: 'email',
    category: 'contact'
  },
  {
    id: 'whatsapp_number',
    key: 'whatsapp_number',
    name: 'WhatsApp',
    value: '+5491123456789',
    defaultValue: '+5491123456789',
    description: 'Número de WhatsApp para contacto',
    type: 'text',
    category: 'contact'
  },

  // Professional Section
  {
    id: 'professional_cta_title',
    key: 'professional_cta_title',
    name: 'Título CTA Profesionales',
    value: '¿Eres profesional? Únete a nosotros',
    defaultValue: '¿Eres profesional? Únete a nosotros',
    description: 'Título para llamada a la acción de profesionales',
    type: 'text',
    category: 'professional'
  },
  {
    id: 'professional_cta_description',
    key: 'professional_cta_description',
    name: 'Descripción CTA Profesionales',
    value: 'Conecta con clientes y haz crecer tu negocio',
    defaultValue: 'Conecta con clientes y haz crecer tu negocio',
    description: 'Descripción para CTA de profesionales',
    type: 'text',
    category: 'professional'
  },
  {
    id: 'professional_cta_button',
    key: 'professional_cta_button',
    name: 'Botón CTA Profesionales',
    value: 'Registrarme como Profesional',
    defaultValue: 'Registrarme como Profesional',
    description: 'Texto del botón CTA para profesionales',
    type: 'text',
    category: 'professional'
  },

  // Search
  {
    id: 'search_placeholder',
    key: 'search_placeholder',
    name: 'Placeholder Búsqueda',
    value: 'Busca electricista, plomero, jardinero...',
    defaultValue: 'Busca electricista, plomero, jardinero...',
    description: 'Texto placeholder del campo de búsqueda',
    type: 'text',
    category: 'search'
  },
  {
    id: 'search_no_results',
    key: 'search_no_results',
    name: 'Mensaje Sin Resultados',
    value: 'No encontramos profesionales con esos criterios. Intenta con otros términos de búsqueda.',
    defaultValue: 'No encontramos profesionales con esos criterios. Intenta con otros términos de búsqueda.',
    description: 'Mensaje cuando no hay resultados de búsqueda',
    type: 'text',
    category: 'search'
  },

  // Buttons
  {
    id: 'btn_contact',
    key: 'btn_contact',
    name: 'Botón Contactar',
    value: 'Contactar',
    defaultValue: 'Contactar',
    description: 'Texto del botón de contactar',
    type: 'text',
    category: 'buttons'
  },
  {
    id: 'btn_view_profile',
    key: 'btn_view_profile',
    name: 'Botón Ver Perfil',
    value: 'Ver Perfil',
    defaultValue: 'Ver Perfil',
    description: 'Texto del botón ver perfil',
    type: 'text',
    category: 'buttons'
  },
  {
    id: 'btn_book_service',
    key: 'btn_book_service',
    name: 'Botón Reservar Servicio',
    value: 'Reservar Servicio',
    defaultValue: 'Reservar Servicio',
    description: 'Texto del botón reservar servicio',
    type: 'text',
    category: 'buttons'
  },

  // Notifications/Messages
  {
    id: 'success_booking',
    key: 'success_booking',
    name: 'Mensaje Reserva Exitosa',
    value: '¡Tu reserva ha sido enviada exitosamente! El profesional se pondrá en contacto contigo pronto.',
    defaultValue: '¡Tu reserva ha sido enviada exitosamente! El profesional se pondrá en contacto contigo pronto.',
    description: 'Mensaje de éxito al hacer una reserva',
    type: 'text',
    category: 'notifications'
  },
  {
    id: 'error_general',
    key: 'error_general',
    name: 'Error General',
    value: 'Ha ocurrido un error. Por favor intenta nuevamente.',
    defaultValue: 'Ha ocurrido un error. Por favor intenta nuevamente.',
    description: 'Mensaje de error general',
    type: 'text',
    category: 'notifications'
  },

  // Social Media
  {
    id: 'social_facebook',
    key: 'social_facebook',
    name: 'Facebook URL',
    value: 'https://facebook.com/homefixed',
    defaultValue: 'https://facebook.com/homefixed',
    description: 'URL de la página de Facebook',
    type: 'url',
    category: 'social'
  },
  {
    id: 'social_instagram',
    key: 'social_instagram',
    name: 'Instagram URL',
    value: 'https://instagram.com/homefixed',
    defaultValue: 'https://instagram.com/homefixed',
    description: 'URL de la página de Instagram',
    type: 'url',
    category: 'social'
  },
  {
    id: 'social_twitter',
    key: 'social_twitter',
    name: 'Twitter URL',
    value: 'https://twitter.com/homefixed',
    defaultValue: 'https://twitter.com/homefixed',
    description: 'URL de la página de Twitter',
    type: 'url',
    category: 'social'
  }
];

const defaultAnnouncements = [
  {
    title: '¡Bienvenido a Home Fixed!',
    message: 'Encuentra los mejores profesionales para tu hogar. Registrate y obtén tu primera consulta gratis.',
    type: 'info',
    targetUsers: 'customers',
    priority: 1,
    showOnPages: ['home'],
    actionText: 'Registrarme',
    actionUrl: '/auth/signup'
  },
  {
    title: 'Para Profesionales',
    message: '¿Eres profesional? Únete a nuestra plataforma y conecta con más clientes.',
    type: 'promotion',
    targetUsers: 'all',
    priority: 2,
    showOnPages: ['home', 'search'],
    actionText: 'Registrarme como Profesional',
    actionUrl: '/auth/signup?type=professional'
  }
];

async function seedContent() {
  console.log('🌱 Seeding content...');

  try {
    // Seed content
    for (const content of defaultContent) {
      await prisma.content.upsert({
        where: { key: content.key },
        update: {
          name: content.name,
          description: content.description,
          type: content.type,
          category: content.category,
          // Solo actualizar defaultValue, no value (para no sobreescribir cambios del admin)
          defaultValue: content.defaultValue
        },
        create: content
      });
    }

    console.log(`✅ ${defaultContent.length} content items seeded`);

    // Seed announcements
    for (const announcement of defaultAnnouncements) {
      const existing = await prisma.announcement.findFirst({
        where: { 
          title: announcement.title,
          message: announcement.message
        }
      });

      if (!existing) {
        await prisma.announcement.create({
          data: announcement
        });
      }
    }

    console.log(`✅ ${defaultAnnouncements.length} announcements seeded`);

  } catch (error) {
    console.error('❌ Error seeding content:', error);
    throw error;
  }
}

async function main() {
  await seedContent();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });