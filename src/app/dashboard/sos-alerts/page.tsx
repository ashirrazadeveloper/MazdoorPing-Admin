"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatDate, getInitials, getStatusColor } from "@/lib/utils";
import { getSOSAlerts, updateSOSStatus } from "@/lib/services";
import type { SOSAlert } from "@/types";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Eye,
  Phone,
  MapPin,
  Clock,
  Shield,
  User,
  Briefcase,
  Loader2,
} from "lucide-react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/Map"), { ssr: false });

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SOSAlertsContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSOSAlerts();
      setAlerts(data as SOSAlert[]);
    } catch (err) {
      console.error("Failed to fetch SOS alerts:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const activeCount = alerts.filter((a) => a.status === "active").length;
  const acknowledgedCount = alerts.filter((a) => a.status === "acknowledged").length;
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length;

  const filteredAlerts = alerts.filter(
    (a) => statusFilter === "all" || a.status === statusFilter
  );

  const handleStatusChange = async (id: string, status: "acknowledged" | "resolved") => {
    setActionLoading(true);
    try {
      await updateSOSStatus(id, status);
      setAlerts(
        alerts.map((a) =>
          a.id === id
            ? {
                ...a,
                status,
                resolved_at: status === "resolved" ? new Date().toISOString() : a.resolved_at,
              }
            : a
        )
      );
      if (selectedAlert?.id === id) {
        setSelectedAlert({
          ...selectedAlert,
          status,
          resolved_at: status === "resolved" ? new Date().toISOString() : selectedAlert.resolved_at,
        });
      }
    } catch (err) {
      console.error("Failed to update SOS status:", err);
    }
    setActionLoading(false);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "active": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "acknowledged": return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "resolved": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  return (
    <>
      <Header title="SOS Alerts" onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <main className="p-4 sm:p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className={cn("border-l-4", activeCount > 0 ? "border-l-red-500" : "border-l-gray-300")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Alerts</p>
                  <p className="text-3xl font-bold text-red-600">{activeCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Acknowledged</p>
                  <p className="text-3xl font-bold text-orange-600">{acknowledgedCount}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Resolved</p>
                  <p className="text-3xl font-bold text-green-600">{resolvedCount}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Alerts</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No SOS alerts found</p>
                <p className="text-gray-300 text-xs mt-1">
                  {statusFilter !== "all" ? "No alerts match this filter" : "No active SOS alerts - all clear!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={cn(
                  "transition-all hover:shadow-md cursor-pointer",
                  alert.status === "active" && "border-red-200 bg-red-50/50",
                  alert.status === "acknowledged" && "border-orange-200 bg-orange-50/50",
                  alert.status === "resolved" && "border-green-200 bg-green-50/50"
                )}
                onClick={() => setSelectedAlert(alert)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Status icon */}
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                      alert.status === "active" && "bg-red-100",
                      alert.status === "acknowledged" && "bg-orange-100",
                      alert.status === "resolved" && "bg-green-100"
                    )}>
                      {statusIcon(alert.status)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={cn("text-xs", getStatusColor(alert.status))}>
                              {alert.status}
                            </Badge>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(alert.created_at)}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {alert.worker?.full_name || "Unknown"}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.address}
                            </span>
                            {alert.job_id && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                Job #{alert.job_id}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="shrink-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Alert Detail Dialog */}
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="max-w-2xl">
            {selectedAlert && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {statusIcon(selectedAlert.status)}
                    SOS Alert Details
                  </DialogTitle>
                  <DialogDescription>
                    {formatDate(selectedAlert.created_at)}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  {/* Worker info */}
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-gray-500 mb-2">Worker Information</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
                          {selectedAlert.worker ? getInitials(selectedAlert.worker.full_name) : "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedAlert.worker?.full_name || "Unknown Worker"}</p>
                        <p className="text-sm text-gray-500">{(selectedAlert.worker as any)?.category?.name || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Alert details */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Message</p>
                      <p className="text-sm text-gray-900 bg-red-50 border border-red-200 rounded-lg p-3">
                        {selectedAlert.message}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Location</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          <p className="text-sm font-medium">{selectedAlert.address}</p>
                        </div>
                        <p className="text-xs text-gray-400">
                          {selectedAlert.latitude?.toFixed(4)}, {selectedAlert.longitude?.toFixed(4)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Emergency Contact</p>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          <p className="text-sm font-medium">{selectedAlert.emergency_contact || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  {selectedAlert.latitude && selectedAlert.longitude && (
                    <MapComponent
                      latitude={selectedAlert.latitude}
                      longitude={selectedAlert.longitude}
                      zoom={15}
                      className="h-56 w-full rounded-xl"
                    />
                  )}

                  {/* Actions */}
                  {selectedAlert.status !== "resolved" && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      {selectedAlert.status === "active" && (
                        <Button
                          className="bg-orange-500 hover:bg-orange-600 text-white flex-1"
                          disabled={actionLoading}
                          onClick={() => handleStatusChange(selectedAlert.id, "acknowledged")}
                        >
                          {actionLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Shield className="h-4 w-4 mr-2" />
                          )}
                          Acknowledge Alert
                        </Button>
                      )}
                      <Button
                        className={cn(
                          "flex-1",
                          selectedAlert.status === "acknowledged"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        )}
                        disabled={actionLoading}
                        onClick={() => handleStatusChange(selectedAlert.id, "resolved")}
                      >
                        {actionLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                        )}
                        Mark as Resolved
                      </Button>
                    </div>
                  )}

                  {selectedAlert.resolved_at && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                      Resolved on {formatDate(selectedAlert.resolved_at)}
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}

export default function SOSAlertsPage() {
  return <SOSAlertsContent />;
}
