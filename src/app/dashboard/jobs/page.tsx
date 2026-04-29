"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { mockJobs } from "@/lib/mock-data";
import {
  Search,
  Eye,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PlayCircle,
  DollarSign,
  User,
  Calendar,
  Zap,
} from "lucide-react";

function JobsContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<(typeof mockJobs)[0] | null>(null);

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const statusIcon = (status: string) => {
    switch (status) {
      case "open": return <Clock className="h-3.5 w-3.5" />;
      case "in_progress": return <PlayCircle className="h-3.5 w-3.5" />;
      case "completed": return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "cancelled": return <XCircle className="h-3.5 w-3.5" />;
      case "disputed": return <AlertTriangle className="h-3.5 w-3.5" />;
      default: return null;
    }
  };

  const statusCounts = useMemo(() => ({
    all: mockJobs.length,
    open: mockJobs.filter((j) => j.status === "open").length,
    in_progress: mockJobs.filter((j) => j.status === "in_progress").length,
    completed: mockJobs.filter((j) => j.status === "completed").length,
    cancelled: mockJobs.filter((j) => j.status === "cancelled").length,
    disputed: mockJobs.filter((j) => j.status === "disputed").length,
  }), []);

  return (
    <>
      <Header title="Jobs" onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <main className="p-4 sm:p-6 space-y-6">
        {/* Status summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { key: "all", label: "All", color: "bg-gray-100 text-gray-700" },
            { key: "open", label: "Open", color: "bg-yellow-100 text-yellow-800" },
            { key: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
            { key: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
            { key: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
            { key: "disputed", label: "Disputed", color: "bg-orange-100 text-orange-800" },
          ].map(({ key, label, color }) => (
            <Card
              key={key}
              className={cn("cursor-pointer transition-all hover:shadow-md", statusFilter === key && "ring-2 ring-orange-500")}
              onClick={() => setStatusFilter(key)}
            >
              <CardContent className="p-3 text-center">
                <p className={cn("text-2xl font-bold", color.includes("text-") ? color.split(" ").pop() : "text-gray-900")}>
                  {statusCounts[key as keyof typeof statusCounts]}
                </p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead className="hidden sm:table-cell">Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        {job.is_urgent && <Zap className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{job.title}</p>
                          <p className="text-xs text-gray-500">
                            {job.employer?.full_name} • {formatDate(job.created_at)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <span>{job.category?.icon}</span>
                        <span className="text-sm">{job.category?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600">{job.city}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <p className="text-sm font-medium">
                          {job.final_price
                            ? formatCurrency(job.final_price)
                            : `${formatCurrency(job.budget_min)} - ${formatCurrency(job.budget_max)}`}
                        </p>
                        {job.commission > 0 && (
                          <p className="text-xs text-green-600">Comm: {formatCurrency(job.commission)}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs flex items-center gap-1", getStatusColor(job.status))}>
                        {statusIcon(job.status)}
                        {job.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedJob(job)}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Job Detail Dialog */}
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedJob && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedJob.title}
                    {selectedJob.is_urgent && (
                      <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedJob.category?.icon} {selectedJob.category?.name} • Posted {formatDate(selectedJob.created_at)}
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="details" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="people">People</TabsTrigger>
                    <TabsTrigger value="financials">Financials</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Description</p>
                      <p className="text-sm text-gray-700">{selectedJob.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Location</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          <p className="text-sm font-medium">{selectedJob.address}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Status</p>
                        <Badge className={cn("text-xs", getStatusColor(selectedJob.status))}>
                          {selectedJob.status.replace("_", " ")}
                        </Badge>
                      </div>
                      {selectedJob.scheduled_date && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500">Scheduled</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            <p className="text-sm font-medium">
                              {selectedJob.scheduled_date} {selectedJob.scheduled_time && `at ${selectedJob.scheduled_time}`}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedJob.completed_at && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500">Completed</p>
                          <p className="text-sm font-medium">{formatDate(selectedJob.completed_at)}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="people" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div className="rounded-lg border p-4">
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <User className="h-3 w-3" /> Employer
                        </p>
                        <p className="font-medium text-sm">{selectedJob.employer?.full_name}</p>
                        <p className="text-xs text-gray-500">{selectedJob.employer?.phone} • {selectedJob.employer?.city}</p>
                      </div>
                      {selectedJob.worker ? (
                        <div className="rounded-lg border p-4">
                          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                            <User className="h-3 w-3" /> Assigned Worker
                          </p>
                          <p className="font-medium text-sm">{selectedJob.worker.full_name}</p>
                          <p className="text-xs text-gray-500">{selectedJob.worker.phone} • {selectedJob.worker.city}</p>
                          <p className="text-xs text-gray-500">Rating: {selectedJob.worker.rating} ⭐</p>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed p-4 text-center">
                          <p className="text-sm text-gray-400">No worker assigned yet</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="financials" className="mt-4">
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Budget Range</span>
                          <span className="text-sm font-medium">
                            {formatCurrency(selectedJob.budget_min)} - {formatCurrency(selectedJob.budget_max)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Final Price</span>
                          <span className="text-lg font-bold">
                            {selectedJob.final_price ? formatCurrency(selectedJob.final_price) : "Not set"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Platform Commission (15%)</span>
                          <span className="text-sm font-medium text-orange-600">
                            {formatCurrency(selectedJob.commission)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Worker Payout</span>
                          <span className="text-sm font-medium text-green-600">
                            {selectedJob.final_price
                              ? formatCurrency(selectedJob.final_price - selectedJob.commission)
                              : "—"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    {selectedJob.status === "disputed" && (
                      <div className="mt-4 space-y-3">
                        <h4 className="text-sm font-semibold text-gray-900">Resolve Dispute</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <Button className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approve & Pay Worker
                          </Button>
                          <Button variant="destructive">
                            <XCircle className="h-4 w-4 mr-2" />
                            Refund Employer
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}

export default function JobsPage() {
  return <JobsContent />;
}
