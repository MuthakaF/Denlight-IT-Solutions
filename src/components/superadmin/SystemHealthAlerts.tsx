import React, { useState, useEffect } from 'react';
import {
  SystemAlert,
  PlatformAnalyticsState,
  getSystemAlerts,
  subscribeToAlerts,
  resolveSystemAlert,
  dismissSystemAlert,
  clearResolvedAlerts,
  getPlatformAnalytics,
  subscribeToAnalytics
} from '../../utils/analyticsRealtimeManager';
import {
  AlertTriangle,
  ShieldAlert,
  Zap,
  Server,
  Cpu,
  HardDrive,
  Activity,
  CheckCircle2,
  Check,
  X,
  Bell,
  Clock,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';

export const SystemHealthAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>(getSystemAlerts);
  const [analytics, setAnalytics] = useState<PlatformAnalyticsState>(getPlatformAnalytics);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved'>('all');

  useEffect(() => {
    const unsubAlerts = subscribeToAlerts((updated) => setAlerts(updated));
    const unsubAnalytics = subscribeToAnalytics((updated) => setAnalytics(updated));
    return () => {
      unsubAlerts();
      unsubAnalytics();
    };
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterStatus === 'active' && alert.resolved) return false;
    if (filterStatus === 'resolved' && !alert.resolved) return false;
    return true;
  });

  const criticalCount = alerts.filter((a) => !a.resolved && a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => !a.resolved && a.severity === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Top Health Header & System Status Overview */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-700/80 p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
            criticalCount > 0
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : warningCount > 0
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            {criticalCount > 0 ? (
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            ) : warningCount > 0 ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                System Health & Diagnostics Monitor
              </h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                criticalCount > 0
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : warningCount > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {criticalCount > 0 ? 'Critical Incident' : warningCount > 0 ? 'Warning Active' : 'All Systems Operational'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Real-time monitoring of client execution, response latency, network requests, and security events.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Diagnostics Active
          </span>
        </div>
      </div>

      {/* Real-Time Hardware & Service Vitals Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: CPU Load */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">CPU Event Loop Load</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-display font-black text-white">{analytics.cpuLoad}%</span>
            <span className="text-[11px] font-mono text-slate-400">Thread Activity</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                analytics.cpuLoad > 75 ? 'bg-red-500' : analytics.cpuLoad > 50 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${analytics.cpuLoad}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Memory Pressure */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Heap Memory</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-display font-black text-white">{analytics.memoryLoad}%</span>
            <span className="text-[11px] font-mono text-slate-400">JS Memory Heap</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                analytics.memoryLoad > 80 ? 'bg-red-500' : analytics.memoryLoad > 60 ? 'bg-amber-500' : 'bg-purple-500'
              }`}
              style={{ width: `${analytics.memoryLoad}%` }}
            />
          </div>
        </div>

        {/* Metric 3: API Latency */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Network Ping Latency</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-display font-black text-white">{analytics.apiLatencyMs}ms</span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">Origin RTT</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                analytics.apiLatencyMs > 200 ? 'bg-red-500' : analytics.apiLatencyMs > 80 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (analytics.apiLatencyMs / 120) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Error Rate */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Real Error Rate</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-display font-black text-white">{analytics.errorRate}%</span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">Real Exceptions</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${analytics.errorRate > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.max(2, Math.min(100, analytics.errorRate * 20))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Alerts Feed & Controls */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-6 shadow-lg space-y-4">
        {/* Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-500" />
              Live Server Errors, Bottlenecks & Security Alerts ({alerts.length})
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Active telemetry capturing real client script errors, failed network calls, and latency anomalies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Severity Filter */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
              {(['all', 'critical', 'warning', 'info'] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold capitalize transition-all cursor-pointer ${
                    filterSeverity === sev
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
              {(['all', 'active', 'resolved'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold capitalize transition-all cursor-pointer ${
                    filterStatus === st
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Clear Resolved */}
            {alerts.some((a) => a.resolved) && (
              <button
                type="button"
                onClick={clearResolvedAlerts}
                className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-mono border border-slate-700 transition-all cursor-pointer"
              >
                Clear Resolved
              </button>
            )}
          </div>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <div className="text-sm font-bold text-white mb-1">All Systems Operational</div>
            <div className="text-slate-400">Zero errors, performance bottlenecks, or security incidents detected.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  alert.resolved
                    ? 'bg-slate-900/40 border-slate-800 text-slate-400 opacity-75'
                    : alert.severity === 'critical'
                    ? 'bg-red-950/30 border-red-500/50 shadow-md'
                    : alert.severity === 'warning'
                    ? 'bg-amber-950/30 border-amber-500/50'
                    : 'bg-blue-950/20 border-blue-500/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      alert.severity === 'critical'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : alert.severity === 'warning'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    }`}>
                      {alert.type === 'server_error' ? (
                        <Server className="w-4 h-4" />
                      ) : alert.type === 'performance_bottleneck' ? (
                        <Zap className="w-4 h-4" />
                      ) : (
                        <ShieldAlert className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{alert.title}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          alert.severity === 'critical'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : alert.severity === 'warning'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Source: {alert.source}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
                        {alert.description}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {new Date(alert.timestamp).toLocaleTimeString()} ({new Date(alert.timestamp).toLocaleDateString()})
                        </span>
                        {alert.resolved && (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Resolved at {new Date(alert.resolvedAt || '').toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    {!alert.resolved && (
                      <button
                        type="button"
                        onClick={() => resolveSystemAlert(alert.id)}
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => dismissSystemAlert(alert.id)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                      title="Dismiss from view"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
