import React, { useState } from 'react';
import { useFinancialMetrics } from '../../hooks/api/admin';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Filter,
  Download
} from 'lucide-react';

const PaymentMetrics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d'); // '7d', '30d', '90d', '1y'
  const [viewType, setViewType] = useState('overview'); // 'overview', 'detailed', 'professionals'
  
  const { data: financialMetrics, isLoading: loading, error } = useFinancialMetrics();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          <p>Error al cargar las métricas de pagos: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!financialMetrics?.data) {
    return null;
  }

  const paymentData = financialMetrics.data;

  // Calculate growth rates
  const getGrowthRate = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Métricas de Pagos</h2>
          <p className="text-gray-600">Analíticas financieras y de transacciones</p>
        </div>
        
        <div className="flex gap-3">
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
          </select>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <div className="text-right">
              <div className="flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm">+12.5%</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-green-100 text-sm">Ingresos Totales</p>
            <p className="text-2xl font-bold">
              {formatCurrency(paymentData.totalRevenue || 0)}
            </p>
          </div>
        </div>

        {/* Total Payments */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="w-8 h-8" />
            <div className="text-right">
              <div className="flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm">+8.3%</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Total Transacciones</p>
            <p className="text-2xl font-bold">
              {(paymentData.totalTransactions || 0).toLocaleString('es-AR')}
            </p>
          </div>
        </div>

        {/* Commissions */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <div className="text-right">
              <div className="flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm">+15.7%</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-orange-100 text-sm">Comisiones</p>
            <p className="text-2xl font-bold">
              {formatCurrency(paymentData.commissionStats?.totalCommissions || 0)}
            </p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8" />
            <div className="text-right">
              <div className="flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm">+2.1%</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-purple-100 text-sm">Tasa de Comisión</p>
            <p className="text-2xl font-bold">
              {formatPercentage(paymentData.commissionStats?.commissionRate * 100 || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        {paymentData.paymentMethods && paymentData.paymentMethods.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pago</h3>
            <div className="space-y-4">
              {paymentData.paymentMethods.map((method, index) => {
                const total = paymentData.paymentMethods.reduce((sum, m) => sum + m.count, 0);
                const percentage = ((method.count / total) * 100).toFixed(1);
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="capitalize font-medium">
                        {method.method === 'mercadopago' ? 'MercadoPago' : method.method}
                      </span>
                      <span className="text-sm text-gray-600">
                        {method.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-orange-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Outstanding Payments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Pagos</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Pagos Completados</span>
              </div>
              <span className="font-bold text-green-600">
                {formatCurrency(paymentData.totalRevenue - (paymentData.outstandingPayments || 0))}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Pagos Pendientes</span>
              </div>
              <span className="font-bold text-yellow-600">
                {formatCurrency(paymentData.outstandingPayments || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      {paymentData.monthlyRevenue && paymentData.monthlyRevenue.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia Mensual de Ingresos</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {paymentData.monthlyRevenue.map((month, index) => {
              const maxAmount = Math.max(...paymentData.monthlyRevenue.map(m => Number(m.revenue)));
              const height = (Number(month.revenue) / maxAmount) * 100;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t min-h-[20px] relative group cursor-pointer"
                    style={{ height: `${Math.max(height, 10)}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatCurrency(Number(month.revenue))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">
                    {month.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Financial Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Financiero</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Ingresos Netos</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(paymentData.totalRevenue - (paymentData.commissionStats?.totalCommissions || 0))}
            </p>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Crecimiento</p>
            <p className="text-xl font-bold text-blue-600">
              {paymentData.revenueGrowth?.percentage?.toFixed(1) || 0}%
            </p>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <PieChart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Transacciones</p>
            <p className="text-xl font-bold text-purple-600">
              {(paymentData.totalTransactions || 0).toLocaleString('es-AR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMetrics;