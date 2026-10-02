import React, { useState, useEffect } from 'react';
import {
  AuditLogEntry,
  getAuditLogs,
  subscribeToAudit,
  clearAuditLogs,
  exportAuditLogs
} from '../../utils/analyticsRealtimeManager';
import {
  Shield,
  Search,
  Download,
  Trash2,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';

export const AuditLogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(getAuditLogs);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToAudit((updated) => setLogs(updated));
    return () => unsub();
  }, []);

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all historical audit logs?')) {
      clearAuditLogs();
      showStatus('Audit logs cleared.');
    }
  };

  const handleExport = (format: 'json' | 'csv') => {
    exportAuditLogs(format);
    showStatus(`Exported audit logs to ${format.toUpperCase()}`);
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (severityFilter !== 'all' && log.severity !== severityFilter) return false;
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchActor = log.actor.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      const matchTarget = log.target.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchIp = log.ipAddress.toLowerCase().includes(q);
      return matchActor || matchAction || matchTarget || matchDetails || matchIp;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Export Controls */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-700/80 p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">
              Security Audit Logs & Event Trail
            </h2>
            <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              {logs.length} Real Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Chronological audit trail of actual administrative actions, credential modifications, and system events.
          </p>
        </div>

        {/* Export and Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {logs.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => handleExport('csv')}
                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => handleExport('json')}
                className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={handleClearLogs}
                className="p-2 bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-700 hover:border-red-500/40 rounded-xl transition-all cursor-pointer"
                title="Clear logs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-4 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by actor, action, IP, or details..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="all">All Action Types</option>
            <option value="LOGIN">LOGIN</option>
            <option value="LOGOUT">LOGOUT</option>
            <option value="PROFILE_UPDATE">PROFILE_UPDATE</option>
            <option value="PASSWORD_CHANGE">PASSWORD_CHANGE</option>
            <option value="THEME_CHANGE">THEME_CHANGE</option>
            <option value="SITE_SETTINGS_UPDATE">SITE_SETTINGS</option>
            <option value="SECTION_TOGGLE">SECTION_TOGGLE</option>
            <option value="SECTION_CREATE">SECTION_CREATE</option>
            <option value="PRODUCT_UPDATE">PRODUCT_UPDATE</option>
            <option value="SECURITY_EVENT">SECURITY_EVENT</option>
            <option value="SYSTEM_ALERT">SYSTEM_ALERT</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-mono text-xs">
            <Info className="w-10 h-10 text-slate-500 mx-auto mb-2 opacity-50" />
            <div className="text-sm font-bold text-white mb-1">No Audit Logs Yet</div>
            <div className="text-slate-400 max-w-sm mx-auto">
              Real-time actions performed by administrators (such as logins, password changes, site settings, and section edits) will appear here automatically.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-700 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Details & Payload</th>
                  <th className="py-3 px-4">IP Address / Geo</th>
                  <th className="py-3 px-4 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredLogs.map((log) => {
                  const d = new Date(log.timestamp);
                  const timeFormatted = d.toLocaleTimeString();
                  const dateFormatted = d.toLocaleDateString();

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-750/50 transition-colors group"
                    >
                      {/* Timestamp */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                        <div className="font-semibold text-slate-200">{timeFormatted}</div>
                        <div className="text-[10px] text-slate-500">{dateFormatted}</div>
                      </td>

                      {/* Actor */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <User className="w-3.5 h-3.5 text-red-400" />
                          <span>{log.actor}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">{log.role}</div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-[11px] font-bold">
                          {log.action}
                        </span>
                      </td>

                      {/* Target */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-300 font-semibold">
                        {log.target}
                      </td>

                      {/* Details */}
                      <td className="py-3 px-4 max-w-xs md:max-w-md text-slate-300 font-sans text-xs">
                        {log.details}
                      </td>

                      {/* IP Address */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{log.ipAddress}</span>
                        </div>
                      </td>

                      {/* Severity Pill */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          log.severity === 'critical'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : log.severity === 'warning'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : log.severity === 'success'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}>
                          {log.severity === 'critical' && <AlertOctagon className="w-3 h-3 text-red-400" />}
                          {log.severity === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                          {log.severity === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          {log.severity === 'info' && <Info className="w-3 h-3 text-blue-400" />}
                          <span>{log.severity}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
