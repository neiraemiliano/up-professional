const intelligentSearchService = require('../services/intelligentSearch.service');

class IntelligentSearchController {
  
  // Búsqueda inteligente principal
  async intelligentSearch(req, res) {
    try {
      const { q, location, budget, urgency, timeframe } = req.query;
      
      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Se requiere una consulta de búsqueda'
        });
      }

      const userPreferences = {
        location: location,
        budget: budget ? parseFloat(budget) : null,
        urgency: urgency || 'normal',
        timeframe: timeframe || 'anytime',
        // En producción, esto vendría del perfil del usuario
        previousExperiences: []
      };

      const result = await intelligentSearchService.intelligentSearch(q, userPreferences);

      res.json({
        success: true,
        data: result,
        message: "Búsqueda inteligente completada"
      });

    } catch (error) {
      console.error('Error in intelligent search controller:', error);
      res.status(500).json({
        success: false,
        error: 'Error en la búsqueda inteligente',
        message: error.message
      });
    }
  }

  // Obtener sugerencias inteligentes
  async getSmartSuggestions(req, res) {
    try {
      const { location } = req.query;
      
      const userContext = {
        location,
        recentSearches: req.user?.recentSearches || [],
        preferences: req.user?.preferences || {}
      };

      const suggestions = await intelligentSearchService.getSmartSuggestions(userContext);

      res.json({
        success: true,
        data: suggestions
      });

    } catch (error) {
      console.error('Error getting smart suggestions:', error);
      res.status(500).json({
        success: false,
        error: 'Error obteniendo sugerencias'
      });
    }
  }

  // Análisis de consulta (para autocompletar y sugerencias)
  async analyzeQuery(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.json({
          success: true,
          data: {
            suggestions: [],
            categories: [],
            keywords: []
          }
        });
      }

      // Simular análisis de NLP
      const analysis = await intelligentSearchService.processNaturalLanguage(q);
      
      // Sugerencias basadas en el análisis
      const suggestions = [
        `${q} urgente`,
        `${q} certificado`,
        `${q} cerca mío`,
        `${q} económico`
      ].filter(s => s !== q);

      res.json({
        success: true,
        data: {
          analysis,
          suggestions,
          categories: analysis.category ? [analysis.category] : [],
          keywords: analysis.keywords.split(' ')
        }
      });

    } catch (error) {
      console.error('Error analyzing query:', error);
      res.status(500).json({
        success: false,
        error: 'Error analizando consulta'
      });
    }
  }

  // Feedback de búsqueda (para mejorar el algoritmo)
  async submitSearchFeedback(req, res) {
    try {
      const { query, selectedProfessionalId, wasHelpful, feedback } = req.body;

      // En producción, esto se guardaría en la base de datos
      // para entrenar y mejorar el algoritmo de IA
      console.log('Search feedback received:', {
        query,
        selectedProfessionalId,
        wasHelpful,
        feedback,
        timestamp: new Date()
      });

      res.json({
        success: true,
        message: 'Gracias por tu feedback. Nos ayuda a mejorar las búsquedas.'
      });

    } catch (error) {
      console.error('Error submitting search feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Error enviando feedback'
      });
    }
  }
}

module.exports = new IntelligentSearchController();