"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  History,
  RefreshCw,
  Search,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Webhook,
  Link2,
} from "lucide-react";
import {
  apiCreateWebhook,
  apiDeleteWebhook,
  apiDisconnectSocialProvider,
  apiGetSocialAuditLogs,
  apiGetSocialOverview,
  apiRetryWebhookDelivery,
  apiRotateWebhookSecret,
  apiStartSocialOAuth,
  apiSyncSocialProvider,
  apiTestAllSocialEndpoints,
  apiTestWebhook,
  apiToggleSocialProvider,
  apiUpdateWebhook,
  type SocialAuditLogItem,
  type SocialOverviewResponse,
  type SocialTestEndpointResult,
  type WebhookEndpointItem,
} from "@/lib/api";
import SocialProviderCard from "./SocialProviderCard";
import WebhookManagerPanel from "./WebhookManagerPanel";
import WebhookModal from "./WebhookModal";
import OAuthAuditModal from "./OAuthAuditModal";
import TestEndpointsModal from "./TestEndpointsModal";

export default function SocialChannelsManager() {
  const [data, setData] = useState<SocialOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [busyProviderKey, setBusyProviderKey] = useState<string | null>(null);
  const [busyWebhookId, setBusyWebhookId] = useState<string | null>(null);

  // Webhook Modal state
  const [webhookModalOpen, setWebhookModalOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookEndpointItem | null>(null);
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);

  // Audit Modal state
  const [auditOpen, setAuditOpen] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<SocialAuditLogItem[]>([]);

  // Test All Modal state
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testCheckedAt, setTestCheckedAt] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<SocialTestEndpointResult[]>([]);

  const loadOverview = useCallback(async () => {
    setError(null);
    try {
      const res = await apiGetSocialOverview();
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Failed to load social channels & webhooks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();

    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const connected = sp.get("connected");
      const oauthError = sp.get("oauth_error");
      if (connected) {
        setBanner({
          type: "success",
          text: `${connected.toUpperCase()} OAuth connection verified and encrypted in database.`,
        });
      } else if (oauthError) {
        setBanner({
          type: "error",
          text: `OAuth error: ${oauthError}`,
        });
      }
    }
  }, [loadOverview]);

  const filteredChannels = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.channels.filter((ch) => {
      if (statusFilter !== "ALL" && ch.status !== statusFilter) return false;
      if (!q) return true;
      return (
        ch.displayName.toLowerCase().includes(q) ||
        ch.subtitle.toLowerCase().includes(q) ||
        (ch.accountName || "").toLowerCase().includes(q)
      );
    });
  }, [data, search, statusFilter]);

  const handleConnect = async (key: string) => {
    setBusyProviderKey(key);
    setBanner(null);
    try {
      const { authorizeUrl } = await apiStartSocialOAuth(key);
      window.location.href = authorizeUrl;
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to start OAuth flow." });
      setBusyProviderKey(null);
    }
  };

  const handleSync = async (key: string) => {
    setBusyProviderKey(key);
    setBanner(null);
    try {
      await apiSyncSocialProvider(key);
      await loadOverview();
      setBanner({ type: "success", text: `Synced ${key.toUpperCase()} account metadata.` });
    } catch (err: any) {
      await loadOverview();
      setBanner({ type: "error", text: err?.message || `Failed to sync ${key}.` });
    } finally {
      setBusyProviderKey(null);
    }
  };

  const handleToggle = async (key: string) => {
    setBusyProviderKey(key);
    setBanner(null);
    try {
      await apiToggleSocialProvider(key);
      await loadOverview();
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to toggle channel." });
    } finally {
      setBusyProviderKey(null);
    }
  };

  const handleDisconnect = async (key: string) => {
    setBusyProviderKey(key);
    setBanner(null);
    try {
      await apiDisconnectSocialProvider(key);
      await loadOverview();
      setBanner({ type: "success", text: `Disconnected ${key.toUpperCase()} and purged stored token.` });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to disconnect channel." });
    } finally {
      setBusyProviderKey(null);
    }
  };

  const handleTestAll = async () => {
    setTestModalOpen(true);
    setTestLoading(true);
    setTestResults([]);
    try {
      const res = await apiTestAllSocialEndpoints();
      setTestResults(res.results);
      setTestCheckedAt(res.checkedAt);
      await loadOverview();
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Endpoint health check failed." });
      setTestModalOpen(false);
    } finally {
      setTestLoading(false);
    }
  };

  const handleOpenAudit = async () => {
    setAuditOpen(true);
    setAuditLoading(true);
    try {
      const res = await apiGetSocialAuditLogs();
      setAuditLogs(res.logs);
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to load audit logs." });
    } finally {
      setAuditLoading(false);
    }
  };

  const handleSaveWebhook = async (payload: { name: string; url: string; events: string[] }) => {
    if (editingWebhook) {
      await apiUpdateWebhook(editingWebhook.id, payload);
      await loadOverview();
      setWebhookModalOpen(false);
      setEditingWebhook(null);
      setBanner({ type: "success", text: `Updated webhook "${payload.name}".` });
    } else {
      const res = await apiCreateWebhook(payload);
      await loadOverview();
      setRevealedSecret(res.plaintextSecret);
      setBanner({ type: "success", text: `Registered webhook "${payload.name}".` });
    }
  };

  const handleRotateSecret = async (id: string) => {
    setBusyWebhookId(id);
    try {
      const res = await apiRotateWebhookSecret(id);
      await loadOverview();
      setEditingWebhook(null);
      setRevealedSecret(res.plaintextSecret);
      setWebhookModalOpen(true);
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to rotate webhook secret." });
    } finally {
      setBusyWebhookId(null);
    }
  };

  const handleTestWebhook = async (id: string) => {
    setBusyWebhookId(id);
    try {
      const { delivery } = await apiTestWebhook(id);
      await loadOverview();
      setBanner({
        type: delivery.status === "SUCCESS" ? "success" : "error",
        text:
          delivery.status === "SUCCESS"
            ? `Test webhook delivered (HTTP ${delivery.responseStatus}, ${delivery.latencyMs}ms).`
            : `Test webhook failed: ${delivery.errorMessage || "Delivery error"}`,
      });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to test webhook." });
    } finally {
      setBusyWebhookId(null);
    }
  };

  const handleToggleWebhook = async (wh: WebhookEndpointItem) => {
    setBusyWebhookId(wh.id);
    try {
      await apiUpdateWebhook(wh.id, { isActive: !wh.isActive });
      await loadOverview();
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to update webhook." });
    } finally {
      setBusyWebhookId(null);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    setBusyWebhookId(id);
    try {
      await apiDeleteWebhook(id);
      await loadOverview();
      setBanner({ type: "success", text: "Webhook endpoint deleted." });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to delete webhook." });
    } finally {
      setBusyWebhookId(null);
    }
  };

  const handleRetryDelivery = async (deliveryId: string) => {
    try {
      const { delivery } = await apiRetryWebhookDelivery(deliveryId);
      await loadOverview();
      setBanner({
        type: delivery.status === "SUCCESS" ? "success" : "error",
        text:
          delivery.status === "SUCCESS"
            ? `Retry succeeded (HTTP ${delivery.responseStatus}).`
            : `Retry failed: ${delivery.errorMessage || "Error"}`,
      });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Retry failed." });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center space-y-3">
        <AlertTriangle className="w-6 h-6 text-rose-500 mx-auto" />
        <p className="text-sm font-medium text-[var(--text-primary)]">{error || "Unable to load data"}</p>
        <button
          type="button"
          onClick={loadOverview}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)]"
        >
          Retry
        </button>
      </div>
    );
  }

  const { metrics } = data;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Social Channels & Webhooks
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage real OAuth 2.0 integrations, AES-256-GCM encrypted tokens, and HMAC-signed webhooks.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAudit}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)]"
          >
            <History className="w-3.5 h-3.5" />
            Audit Logs
          </button>
          <button
            type="button"
            onClick={handleTestAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)]"
          >
            <Activity className="w-3.5 h-3.5" />
            Test All Endpoints
          </button>
          <button
            type="button"
            onClick={loadOverview}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {banner && (
        <div
          className={`rounded-2xl border p-3.5 text-xs flex items-center justify-between gap-3 ${
            banner.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {banner.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{banner.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="text-[11px] font-semibold underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Real Database Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
          <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
            <span>Connected Channels</span>
            <Link2 className="w-4 h-4 text-[var(--brand-primary)]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
            {metrics.connectedChannels}{" "}
            <span className="text-sm font-normal text-[var(--text-tertiary)]">
              / {metrics.totalChannels}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
            {metrics.notConfiguredChannels} awaiting env credentials
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
          <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
            <span>Token Health</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
            {metrics.errorChannels + metrics.expiringSoonChannels}
          </div>
          <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
            {metrics.expiringSoonChannels} expiring soon · {metrics.errorChannels} errors
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
          <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
            <span>Active Webhooks</span>
            <Webhook className="w-4 h-4 text-[var(--brand-primary)]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
            {metrics.activeWebhooks}{" "}
            <span className="text-sm font-normal text-[var(--text-tertiary)]">
              / {metrics.totalWebhooks}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
            {metrics.totalDeliveries24h} deliveries (24h) · {metrics.failedDeliveries24h} failed
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
          <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
            <span>Token Encryption</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-lg font-bold font-mono text-[var(--text-primary)]">
            {metrics.encryptionConfigured ? "AES-256-GCM" : "Unconfigured"}
          </div>
          <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
            Key version v{metrics.encryptionKeyVersion} · server-side only
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter providers or connected accounts..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="CONNECTED">Connected</option>
          <option value="DISCONNECTED">Disconnected</option>
          <option value="NOT_CONFIGURED">Not Configured</option>
          <option value="EXPIRING_SOON">Expiring Soon</option>
          <option value="ERROR">Errors / Reauth</option>
          <option value="UNAVAILABLE">API Unavailable</option>
        </select>
      </div>

      {/* Social Channel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredChannels.map((ch) => (
          <SocialProviderCard
            key={ch.key}
            channel={ch}
            busyKey={busyProviderKey}
            onConnect={handleConnect}
            onSync={handleSync}
            onToggle={handleToggle}
            onDisconnect={handleDisconnect}
          />
        ))}
      </div>

      {/* Custom Webhooks & Delivery Logs */}
      <WebhookManagerPanel
        webhooks={data.webhooks}
        deliveries={data.recentDeliveries}
        busyWebhookId={busyWebhookId}
        onOpenCreate={() => {
          setEditingWebhook(null);
          setRevealedSecret(null);
          setWebhookModalOpen(true);
        }}
        onOpenEdit={(wh) => {
          setEditingWebhook(wh);
          setRevealedSecret(null);
          setWebhookModalOpen(true);
        }}
        onRotateSecret={handleRotateSecret}
        onTest={handleTestWebhook}
        onToggleActive={handleToggleWebhook}
        onDelete={handleDeleteWebhook}
        onRetryDelivery={handleRetryDelivery}
      />

      {/* Modals */}
      <WebhookModal
        key={editingWebhook?.id || (revealedSecret ? "secret" : "create")}
        open={webhookModalOpen}
        editing={editingWebhook}
        supportedEvents={data.supportedEvents}
        revealedSecret={revealedSecret}
        onClose={() => {
          setWebhookModalOpen(false);
          setEditingWebhook(null);
          setRevealedSecret(null);
        }}
        onSubmit={handleSaveWebhook}
      />

      <OAuthAuditModal
        open={auditOpen}
        loading={auditLoading}
        logs={auditLogs}
        onClose={() => setAuditOpen(false)}
      />

      <TestEndpointsModal
        open={testModalOpen}
        loading={testLoading}
        checkedAt={testCheckedAt}
        results={testResults}
        onClose={() => setTestModalOpen(false)}
      />
    </div>
  );
}
