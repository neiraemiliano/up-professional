const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const analyticsService = require("../services/analytics.service");

class SearchController {
  // Obtener sugerencias por categoría
  async getSuggestionsByCategory(req, res) {
    try {
      const { categoryId } = req.params;

      const suggestions = await prisma.searchSuggestion.findMany({
        where: { categoryId: parseInt(categoryId) },
        orderBy: { popularity: "desc" }
      });

      res.json({ data: suggestions });
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Búsqueda inteligente con autocompletado
  async intelligentSearch(req, res) {
    try {
      const { query, categoryId, limit = 5 } = req.query;
      const userId = req.user?.id;
      const sessionId = req.sessionId;

      if (!query || query.length < 2) {
        return res.json({ data: [] });
      }

      const where = {
        text: {
          contains: query,
          mode: "insensitive"
        }
      };

      if (categoryId) {
        where.categoryId = parseInt(categoryId);
      }

      const suggestions = await prisma.searchSuggestion.findMany({
        where,
        include: {
          Category: { select: { name: true, icon: true } }
        },
        orderBy: { popularity: "desc" },
        take: parseInt(limit)
      });

      // Track search event
      analyticsService.trackSearch(
        query,
        categoryId,
        suggestions.length,
        userId,
        sessionId,
        {
          limit: parseInt(limit),
          hasResults: suggestions.length > 0
        }
      ).catch(err => console.error("Analytics tracking error:", err));

      res.json({ data: suggestions });
    } catch (error) {
      console.error("Error in intelligent search:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Incrementar popularidad de una sugerencia
  async incrementSuggestionPopularity(req, res) {
    try {
      const { id } = req.params;

      await prisma.searchSuggestion.update({
        where: { id: parseInt(id) },
        data: {
          popularity: {
            increment: 1
          }
        }
      });

      res.json({ success: true, message: "Popularidad incrementada" });
    } catch (error) {
      console.error("Error incrementing popularity:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Obtener sugerencias populares por categoría
  async getPopularSuggestions(req, res) {
    try {
      const { limit = 10 } = req.query;

      const popularByCategory = await prisma.searchSuggestion.groupBy({
        by: ["categoryId"],
        _max: { popularity: true },
        orderBy: { _max: { popularity: "desc" } }
      });

      const suggestions = [];
      
      for (const group of popularByCategory.slice(0, parseInt(limit))) {
        const topSuggestions = await prisma.searchSuggestion.findMany({
          where: { categoryId: group.categoryId },
          include: { Category: { select: { name: true, icon: true } } },
          orderBy: { popularity: "desc" },
          take: 3
        });
        suggestions.push(...topSuggestions);
      }

      res.json({ data: suggestions });
    } catch (error) {
      console.error("Error fetching popular suggestions:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Estimar precio basado en descripción
  async estimatePrice(req, res) {
    try {
      const { description, categoryId } = req.body;

      if (!description) {
        return res.status(400).json({ error: "Descripción es requerida" });
      }

      // Palabras clave para análisis de precio
      const urgentKeywords = ["urgente", "ahora", "ya", "emergencia"];
      const complexKeywords = ["completo", "todo", "grande", "múltiple", "varios"];
      const simpleKeywords = ["pequeño", "simple", "básico", "menor"];

      const desc = description.toLowerCase();
      let priceMultiplier = 1;

      // Análisis de urgencia
      if (urgentKeywords.some(keyword => desc.includes(keyword))) {
        priceMultiplier *= 1.5;
      }

      // Análisis de complejidad
      if (complexKeywords.some(keyword => desc.includes(keyword))) {
        priceMultiplier *= 1.3;
      } else if (simpleKeywords.some(keyword => desc.includes(keyword))) {
        priceMultiplier *= 0.8;
      }

      // Obtener precio promedio de la categoría
      let basePrice = 15000; // Precio base por defecto

      if (categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: parseInt(categoryId) }
        });
        
        if (category?.avgPrice) {
          basePrice = category.avgPrice;
        }
      }

      const estimatedPrice = Math.round(basePrice * priceMultiplier);
      const priceRange = {
        min: Math.round(estimatedPrice * 0.8),
        max: Math.round(estimatedPrice * 1.2)
      };

      res.json({
        data: {
          estimatedPrice,
          priceRange,
          factors: {
            isUrgent: urgentKeywords.some(keyword => desc.includes(keyword)),
            isComplex: complexKeywords.some(keyword => desc.includes(keyword)),
            multiplier: priceMultiplier
          }
        }
      });

    } catch (error) {
      console.error("Error estimating price:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Búsqueda por voz - procesar transcript
  async processVoiceSearch(req, res) {
    try {
      const { transcript } = req.body;

      if (!transcript) {
        return res.status(400).json({ error: "Transcript es requerido" });
      }

      // Detectar categoría del transcript
      const categoryKeywords = {
        electricista: ["electricista", "luz", "eléctric", "tablero", "cable", "enchufe", "toma"],
        plomero: ["plomero", "agua", "caño", "inodoro", "canilla", "pérdida", "destap"],
        gasista: ["gasista", "gas", "calefón", "estufa", "hornalla"],
        pintor: ["pintor", "pintar", "pintura", "pared", "color"],
        albanil: ["albañil", "pared", "construcción", "mampostería", "revoque"],
        carpintero: ["carpintero", "madera", "mueble", "puerta", "ventana"],
        jardinero: ["jardín", "pasto", "plantas", "podar"]
      };

      let detectedCategory = null;
      let confidence = 0;

      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        const matches = keywords.filter(keyword => 
          transcript.toLowerCase().includes(keyword)
        );
        
        if (matches.length > confidence) {
          detectedCategory = category;
          confidence = matches.length;
        }
      }

      // Buscar categoría en base de datos
      let categoryData = null;
      if (detectedCategory) {
        categoryData = await prisma.category.findFirst({
          where: { value: detectedCategory }
        });
      }

      res.json({
        data: {
          transcript,
          detectedCategory: categoryData,
          confidence,
          processedText: transcript.charAt(0).toUpperCase() + transcript.slice(1)
        }
      });

    } catch (error) {
      console.error("Error processing voice search:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = new SearchController();