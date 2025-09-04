-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT DEFAULT 'general',
    "configData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_id_key" ON "FeatureFlag"("id");

-- Insert initial feature flags
INSERT INTO "FeatureFlag" (id, name, description, "isEnabled", category) VALUES 
('ai_search', 'Búsqueda IA', 'Sistema de búsqueda inteligente con procesamiento de lenguaje natural', true, 'search'),
('urgent_booking', 'Reservas Urgentes', 'Permite a los usuarios solicitar servicios de emergencia con recargo', true, 'booking'),
('professional_verification', 'Verificación de Profesionales', 'Sistema de verificación de identidad y certificaciones', true, 'professional'),
('subscription_plans', 'Planes de Suscripción', 'Sistema de suscripciones para profesionales', true, 'monetization'),
('portfolio_gallery', 'Galería de Portfolio', 'Permite a profesionales subir imágenes de trabajos anteriores', true, 'professional'),
('advanced_filters', 'Filtros Avanzados', 'Filtros adicionales en búsqueda de profesionales', true, 'search'),
('review_system', 'Sistema de Reseñas', 'Permite a clientes dejar reseñas y calificaciones', true, 'review'),
('payment_integration', 'Integración de Pagos', 'Procesamiento de pagos online con MercadoPago/Stripe', true, 'payment');