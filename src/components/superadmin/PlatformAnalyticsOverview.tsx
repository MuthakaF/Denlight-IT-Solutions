import React, { useState, useEffect } from 'react';
import {
  PlatformAnalyticsState,
  getPlatformAnalytics,
  subscribeToAnalytics,
  toggleRealtimeMonitoring,
  setMonitoringInterval
} from '../../utils/analyticsRealtimeManager';
import {
  Activity,
  TrendingUp,
  Users,
  DollarSign,
  Cpu,
  Globe,
  Radio,
  Play,
  Pause,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Laptop
} from 'lucide-react';

export const PlatformAnalyticsOverview: React.FC = () => {
  const [analytics, setAnalytics] = useState<PlatformAnalyticsState>(getPlatformAnalytics);
  const [chartMetric, setChartMetric] = useState<'users' | 'revenue' | 'load'>('users');

  useEffect(() => {
    const unsubscribe = subscribeToAnalytics((newState) => {
      setAnalytics(newState);
    });
    return () => unsubscribe();
  }, []);

  // Sparkline Chart Calculation for SVG
  const points = analytics.recentTrends || [];
  const maxVal = Math.max(
    ...points.map((p) =>
      chartMetric === 'users' ? p.activeUsers : chartMetric === 'revenue' ? p.revenueKsh : p.systemLoad
    ),
    1
  );
  const minVal = Math.min(
    ...points.map((p) =>
      chartMetric === 'users' ? p.activeUsers : chartMetric === 'revenue' ? p.revenueKsh : p.systemLoad
    ),
    0
  );

  const range = maxVal - minVal || 1;
  const svgWidth = 600;
  const svgHeight = 180;
  const paddingY = 20;

  const svgCoordinates = points.map((p, idx) => {
    const x = (idx / Math.max(1, points.length - 1)) * svgWidth;
    const rawY =
      chartMetric === 'users' ? p.activeUsers : chartMetric === 'revenue' ? p.revenueKsh : p.systemLoad;
    const y = svgHeight - paddingY - ((rawY - minVal) / range) * (svgHeight - paddingY * 2);
    return { x, y, raw: rawY, time: p.timestamp };
  });

  const pathD =
    svgCoordinates.length > 0
      ? `M ${svgCoordinates[0].x} ${svgCoordinates[0].y} ` +
        svgCoordinates
          .slice(1)
          .map((coord) => `L ${coord.x} ${coord.y}`)
          .join(' ')
      : '';

  const areaD =
    svgCoordinates.length > 0
      ? `${pathD} L ${svgCoordinates[svgCoordinates.length - 1].x} ${svgHeight} L ${svgCoordinates[0].x} ${svgHeight} Z`
      : '';

  return (
    <div className="space-y-6">
      {/* Top Realtime Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-700/60 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30">
            <Radio className={`w-5 h-5 ${analytics.isLiveMonitoring ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
            {analytics.isLiveMonitoring && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                Platform Analytics & Real-Time Monitor
              </h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                analytics.isLiveMonitoring
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                {analytics.isLiveMonitoring ? 'Live' : 'Paused'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Live heartbeat every {analytics.refreshIntervalMs / 1000}s • Polled: {analytics.lastUpdated}
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleRealtimeMonitoring}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              analytics.isLiveMonitoring
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {analytics.isLiveMonitoring ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{analytics.isLiveMonitoring ? 'Pause Feed' : 'Resume Live'}</span>
          </button>

          <select
            value={analytics.refreshIntervalMs}
            onChange={(e) => setMonitoringInterval(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value={1000}>1s Tick (High Freq)</option>
            <option value={3000}>3s Tick (Normal)</option>
            <option value={5000}>5s Tick (Eco)</option>
          </select>
        </div>
      </div>

      {/* 4 Core KPI Metric Cards (Real Data Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Users */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/80 p-5 relative overflow-hidden group hover:border-slate-600 transition-all shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Active Live Users
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-display font-black text-white tracking-tight">
              {analytics.activeUsers}
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              Live Session
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-700/60">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
            <span className="text-slate-300 font-semibold">{analytics.totalPageViews} total views</span>
          </div>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/80 p-5 relative overflow-hidden group hover:border-slate-600 transition-all shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Total Revenue (KES)
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-red-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-display font-black text-white tracking-tight">
              KSh {analytics.totalRevenueKsh.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-700/60">
            <span>Orders / Leads</span>
            <span className="text-slate-300 font-semibold">{analytics.totalOrders} recorded</span>
          </div>
        </div>

        {/* Card 3: System Load & Performance */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/80 p-5 relative overflow-hidden group hover:border-slate-600 transition-all shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              System Load
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-display font-black text-white tracking-tight">
              {analytics.systemLoad}%
            </span>
            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
              analytics.systemLoad < 50
                ? 'bg-emerald-500/20 text-emerald-300'
                : analytics.systemLoad < 80
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-red-500/20 text-red-300'
            }`}>
              {analytics.systemLoad < 50 ? 'Optimal' : analytics.systemLoad < 80 ? 'Elevated' : 'High'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-700/60">
            <span>CPU: {analytics.cpuLoad}% • RAM: {analytics.memoryLoad}%</span>
            <span className="text-slate-300 font-semibold">{analytics.apiLatencyMs}ms ping</span>
          </div>
        </div>

        {/* Card 4: System Health & Uptime */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/80 p-5 relative overflow-hidden group hover:border-slate-600 transition-all shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              System Health
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-display font-black text-white tracking-tight">
              {analytics.uptimePercentage}%
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              Operational
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-700/60">
            <span>Error Rate: {analytics.errorRate}%</span>
            <span className="text-slate-300 font-semibold">Live Monitor</span>
          </div>
        </div>
      </div>

      {/* Interactive Wave/Spline Statistics Chart */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              Real-Time Activity & Performance Waveform
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Live stream of real website visits, revenue transactions, and server vitals.
            </p>
          </div>

          {/* Metric View Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700/80">
            <button
              type="button"
              onClick={() => setChartMetric('users')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                chartMetric === 'users'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Users
            </button>
            <button
              type="button"
              onClick={() => setChartMetric('revenue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                chartMetric === 'revenue'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Revenue (KSh)
            </button>
            <button
              type="button"
              onClick={() => setChartMetric('load')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                chartMetric === 'load'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              System Load %
            </button>
          </div>
        </div>

        {/* SVG Chart Rendering */}
        <div className="relative w-full h-48 bg-slate-900/60 rounded-xl border border-slate-700/50 p-2 overflow-hidden">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-20">
            <div className="border-b border-slate-500 border-dashed w-full" />
            <div className="border-b border-slate-500 border-dashed w-full" />
            <div className="border-b border-slate-500 border-dashed w-full" />
            <div className="border-b border-slate-500 border-dashed w-full" />
          </div>

          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="chartGradientUsers" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="chartGradientRevenue" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="chartGradientLoad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient Area Fill */}
            <path
              d={areaD}
              fill={
                chartMetric === 'users'
                  ? 'url(#chartGradientUsers)'
                  : chartMetric === 'revenue'
                  ? 'url(#chartGradientRevenue)'
                  : 'url(#chartGradientLoad)'
              }
            />

            {/* Main Stroke Line */}
            <path
              d={pathD}
              fill="none"
              stroke={
                chartMetric === 'users'
                  ? '#10b981'
                  : chartMetric === 'revenue'
                  ? '#ef4444'
                  : '#3b82f6'
              }
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glowing Live Tip Point */}
            {svgCoordinates.length > 0 && (
              <g>
                <circle
                  cx={svgCoordinates[svgCoordinates.length - 1].x}
                  cy={svgCoordinates[svgCoordinates.length - 1].y}
                  r="5"
                  fill="#ffffff"
                  stroke={
                    chartMetric === 'users'
                      ? '#10b981'
                      : chartMetric === 'revenue'
                      ? '#ef4444'
                      : '#3b82f6'
                  }
                  strokeWidth="3"
                />
                <circle
                  cx={svgCoordinates[svgCoordinates.length - 1].x}
                  cy={svgCoordinates[svgCoordinates.length - 1].y}
                  r="10"
                  fill="none"
                  stroke={
                    chartMetric === 'users'
                      ? '#10b981'
                      : chartMetric === 'revenue'
                      ? '#ef4444'
                      : '#3b82f6'
                  }
                  strokeWidth="1.5"
                  opacity="0.6"
                  className="animate-ping"
                />
              </g>
            )}
          </svg>

          {/* Value Labels & Timeline */}
          <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
            <span>Start ({svgCoordinates[0]?.time || '00:00'})</span>
            <span className="text-white font-bold bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              Live Peak: {maxVal.toLocaleString()}{chartMetric === 'load' ? '%' : chartMetric === 'revenue' ? ' KSh' : ' users'}
            </span>
            <span>Now ({analytics.lastUpdated})</span>
          </div>
        </div>
      </div>

      {/* Grid: Demographics, Traffic Channels & Template Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Geographic Distribution (Real client locale) */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              Active Region & Demographics
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Live Client Geo</span>
          </div>

          <div className="space-y-3">
            {analytics.topRegions.map((region, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span>{region.flag}</span>
                    <span className="font-semibold text-white">{region.country}</span>
                  </span>
                  <span className="text-slate-400 font-bold">{region.percentage}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${region.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{region.region}</span>
                  <span>{region.users} active session</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Channels Breakdown */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Traffic Sources & Referrals
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">Real Referrers</span>
          </div>

          <div className="space-y-3">
            {analytics.trafficSources.map((source, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                  <div>
                    <div className="text-xs font-bold text-slate-200">{source.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{source.visitors} visitor(s)</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-white">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Device Distribution */}
          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-around text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Smartphone className="w-3.5 h-3.5 text-red-400" />
              <span>Mobile Client</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Laptop className="w-3.5 h-3.5 text-blue-400" />
              <span>Desktop Client</span>
            </div>
          </div>
        </div>

        {/* Dashboard Template & Live State Card */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Live Control Center
              </h4>
              <span className="text-[10px] bg-red-600/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded font-mono font-bold">
                REAL DATA ONLY
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Live statistics and metrics collected directly from active customer interactions and server state.
            </p>

            {/* Template Container */}
            <div className="relative rounded-xl overflow-hidden border border-slate-700 group bg-slate-950 aspect-video flex items-center justify-center">
              <img
                src="/web.webp"
                alt="Dashboard Template Reference"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity"
              />

              <div className="absolute inset-0 p-3 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-mono text-slate-300 font-bold ml-1">Real-Time Telemetry</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Live Active</span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-1">
                  <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                    <div className="text-[8px] text-slate-400 font-mono">Revenue</div>
                    <div className="text-[11px] font-bold text-white font-mono">KSh {analytics.totalRevenueKsh.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                    <div className="text-[8px] text-slate-400 font-mono">Users</div>
                    <div className="text-[11px] font-bold text-emerald-400 font-mono">{analytics.activeUsers} Live</div>
                  </div>
                  <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                    <div className="text-[8px] text-slate-400 font-mono">Vitals</div>
                    <div className="text-[11px] font-bold text-blue-400 font-mono">{analytics.systemLoad}%</div>
                  </div>
                </div>

                <div className="h-6 w-full opacity-60">
                  <svg viewBox="0 0 100 25" className="w-full h-full">
                    <path
                      d="M 0 18 Q 20 8, 40 14 T 70 10 T 100 12"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3 flex flex-col justify-end pointer-events-none z-10">
                <div className="text-[11px] font-mono text-white font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                  <span>Real-Time Website Monitoring</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Denlight IT Solutions Control Center
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Status: Live Telemetry</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
