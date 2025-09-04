const prisma = require("../config/db");

class IntelligentSearchService {
  
  // Búsqueda inteligente con matching por IA
  async intelligentSearch(query, userPreferences = {}) {
    try {
      const {
        location,
        budget,
        urgency = 'normal', // 'urgent', 'normal', 'flexible'
        timeframe = 'anytime', // 'today', 'this_week', 'this_month', 'anytime'
        previousExperiences = []
      } = userPreferences;

      // 1. Procesar query con IA (simulación de NLP)
      const processedQuery = await this.processNaturalLanguage(query);

      // 2. Buscar profesionales base
      const baseProfessionals = await prisma.professional.findMany({
        where: {
          // Filtros básicos basados en disponibilidad
          ...(urgency === 'urgent' && { supportsUrgent: true }),
          ...(location && {
            location: {
              OR: [
                { city: { contains: location, mode: 'insensitive' } },
                { province: { contains: location, mode: 'insensitive' } }
              ]
            }
          }),
          ...(budget && { priceFrom: { lte: parseFloat(budget) } }),
          
          // Buscar por especialidades y servicios
          OR: [
            {
              Specialties: {
                some: {
                  Specialty: {
                    name: { contains: processedQuery.category, mode: 'insensitive' }
                  }
                }
              }
            },
            {
              Services: {
                some: {
                  OR: [
                    { title: { contains: processedQuery.service, mode: 'insensitive' } },
                    { description: { contains: processedQuery.service, mode: 'insensitive' } }
                  ]
                }
              }
            },
            { bio: { contains: processedQuery.keywords, mode: 'insensitive' } }
          ]
        },
        include: {
          User: {
            select: { name: true, lastName: true, avatarUrl: true, phone: true }
          },
          location: true,
          Services: {
            include: { Category: true }
          },
          Reviews: {
            select: { rating: true, comment: true, wouldRecommend: true, createdAt: true }
          },
          Specialties: {
            include: { Specialty: true }
          },
          Certifications: {
            where: { isVerified: true }
          }
        }
      });

      // 3. Aplicar algoritmo de scoring inteligente
      const scoredProfessionals = baseProfessionals.map(professional => {
        const score = this.calculateIntelligentScore(professional, processedQuery, userPreferences);
        return {
          ...professional,
          aiScore: score.total,
          matchReasons: score.reasons,
          confidenceLevel: score.confidence
        };
      });

      // 4. Ordenar por score de IA
      scoredProfessionals.sort((a, b) => b.aiScore - a.aiScore);

      // 5. Formatear respuesta
      return {
        query: processedQuery,
        totalResults: scoredProfessionals.length,
        aiRecommendation: this.generateAIRecommendation(scoredProfessionals.slice(0, 3), processedQuery),
        professionals: scoredProfessionals.map(this.formatProfessionalForAI)
      };

    } catch (error) {
      console.error('Error in intelligent search:', error);
      throw new Error('Error en la búsqueda inteligente');
    }
  }

  // Procesar lenguaje natural (simulación de NLP)
  async processNaturalLanguage(query) {
    const keywords = query.toLowerCase();
    
    // Categorías detectadas
    const categoryMappings = {
      'electricista|eléctrico|luz|iluminación|cableado|enchufe': 'Electricidad',
      'plomero|plomería|caño|destape|grifo|baño': 'Plomería',
      'carpintero|madera|mueble|puerta|ventana': 'Carpintería',
      'pintor|pintura|pared|color': 'Pintura',
      'aire|acondicionado|clima|frío|calor': 'Climatización',
      'jardín|pasto|plantas|paisaje': 'Jardinería',
      'limpieza|limpiar|aspirar': 'Limpieza'
    };

    let detectedCategory = '';
    for (const [pattern, category] of Object.entries(categoryMappings)) {
      if (new RegExp(pattern, 'i').test(keywords)) {
        detectedCategory = category;
        break;
      }
    }

    // Servicios específicos detectados
    const serviceKeywords = keywords.split(' ').filter(word => word.length > 3);
    
    // Urgencia detectada
    const urgencyWords = ['urgente', 'ya', 'ahora', 'emergencia', 'rápido'];
    const isUrgent = urgencyWords.some(word => keywords.includes(word));

    return {
      originalQuery: query,
      category: detectedCategory,
      service: serviceKeywords.join(' '),
      keywords: keywords,
      urgency: isUrgent ? 'urgent' : 'normal',
      confidence: detectedCategory ? 0.8 : 0.4
    };
  }

  // Algoritmo de scoring inteligente
  calculateIntelligentScore(professional, processedQuery, userPreferences) {
    let score = 0;
    const reasons = [];
    
    // 1. Puntuación base por rating (25%)
    const ratingScore = (professional.avgRating || 0) * 5;
    score += ratingScore;
    if (professional.avgRating >= 4.5) {
      reasons.push('Excelente reputación (4.5+ estrellas)');
    }

    // 2. Puntuación por experiencia (20%)
    const experienceScore = Math.min((professional.experience || 0) * 2, 20);
    score += experienceScore;
    if (professional.experience >= 10) {
      reasons.push('Más de 10 años de experiencia');
    }

    // 3. Matching de especialidades (25%)
    let specialtyMatch = 0;
    professional.Specialties?.forEach(spec => {
      if (spec.Specialty.name.toLowerCase().includes(processedQuery.category.toLowerCase())) {
        specialtyMatch += 15;
        reasons.push(`Especialista en ${spec.Specialty.name}`);
      }
    });
    score += Math.min(specialtyMatch, 25);

    // 4. Puntuación por verificación y certificaciones (15%)
    if (professional.isVerified) {
      score += 8;
      reasons.push('Profesional verificado');
    }
    const certCount = professional.Certifications?.length || 0;
    score += Math.min(certCount * 2, 7);
    if (certCount > 0) {
      reasons.push(`${certCount} certificación${certCount > 1 ? 'es' : ''} verificada${certCount > 1 ? 's' : ''}`);
    }

    // 5. Disponibilidad y urgencia (10%)
    if (userPreferences.urgency === 'urgent' && professional.supportsUrgent) {
      score += 8;
      reasons.push('Disponible para servicios urgentes');
    }
    if (professional.respondsQuickly) {
      score += 2;
      reasons.push('Respuesta rápida');
    }

    // 6. Historial de recomendaciones (5%)
    const recommendationRate = this.calculateRecommendationRate(professional.Reviews);
    score += recommendationRate * 5;
    if (recommendationRate > 0.9) {
      reasons.push('Alta tasa de recomendación');
    }

    // Normalizar score (0-100)
    const normalizedScore = Math.min(score, 100);
    
    return {
      total: normalizedScore,
      reasons: reasons.slice(0, 5), // Top 5 razones
      confidence: this.calculateConfidence(normalizedScore, reasons.length)
    };
  }

  // Calcular tasa de recomendación
  calculateRecommendationRate(reviews = []) {
    if (reviews.length === 0) return 0.5; // Neutro si no hay reviews
    
    const recommendCount = reviews.filter(r => r.wouldRecommend).length;
    return recommendCount / reviews.length;
  }

  // Calcular nivel de confianza del matching
  calculateConfidence(score, reasonCount) {
    const scoreConfidence = score / 100;
    const reasonConfidence = Math.min(reasonCount / 5, 1);
    return (scoreConfidence + reasonConfidence) / 2;
  }

  // Generar recomendación de IA
  generateAIRecommendation(topProfessionals, processedQuery) {
    if (topProfessionals.length === 0) {
      return "No encontramos profesionales que coincidan con tu búsqueda. Te sugerimos ampliar los criterios.";
    }

    const best = topProfessionals[0];
    const reasons = best.matchReasons.slice(0, 3).join(', ');
    
    let recommendation = `Te recomendamos a ${best.User.name} ${best.User.lastName} `;
    
    if (best.aiScore >= 80) {
      recommendation += `como tu mejor opción. ${reasons}.`;
    } else if (best.aiScore >= 60) {
      recommendation += `como una excelente opción. ${reasons}.`;
    } else {
      recommendation += `entre nuestras opciones disponibles. ${reasons}.`;
    }

    if (processedQuery.urgency === 'urgent' && best.supportsUrgent) {
      recommendation += " ✨ Perfecto para tu servicio urgente.";
    }

    return recommendation;
  }

  // Formatear profesional para respuesta de IA
  formatProfessionalForAI(professional) {
    return {
      id: professional.id,
      name: `${professional.User.name} ${professional.User.lastName}`,
      avatar: professional.User.avatarUrl,
      location: professional.location ? 
        `${professional.location.city}, ${professional.location.province}` : null,
      rating: professional.avgRating,
      experience: professional.experience,
      specialties: professional.Specialties?.map(s => s.Specialty.name) || [],
      services: professional.Services?.slice(0, 3).map(s => ({
        title: s.title,
        price: s.price,
        category: s.Category.name
      })) || [],
      certifications: professional.Certifications?.length || 0,
      isVerified: professional.isVerified,
      supportsUrgent: professional.supportsUrgent,
      respondsQuickly: professional.respondsQuickly,
      priceFrom: professional.priceFrom,
      completedJobs: professional.completedJobs,
      aiScore: professional.aiScore,
      matchReasons: professional.matchReasons,
      confidenceLevel: professional.confidenceLevel
    };
  }

  // Obtener sugerencias inteligentes basadas en el contexto del usuario
  async getSmartSuggestions(userContext = {}) {
    const { location, recentSearches = [], preferences = {} } = userContext;
    
    // Analizar tendencias populares
    const popularCategories = await prisma.professional.groupBy({
      by: ['id'],
      where: {
        ...(location && {
          location: {
            city: { contains: location, mode: 'insensitive' }
          }
        })
      },
      _count: { Services: true },
      orderBy: { _count: { Services: 'desc' } },
      take: 5
    });

    return {
      trending: [
        "Reparación de aires acondicionados (muy solicitado)",
        "Instalaciones eléctricas domiciliarias",
        "Plomería urgente 24/7",
        "Pintores profesionales"
      ],
      recommendations: [
        "Electricistas verificados cerca tuyo",
        "Plomeros con servicio urgente",
        "Carpinteros especializados en muebles"
      ]
    };
  }
}

module.exports = new IntelligentSearchService();