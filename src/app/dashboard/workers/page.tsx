"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCurrency, formatDate, getInitials, getStatusColor } from "@/lib/utils";
import {
  getAllWorkers,
  getAllCategories,
  updateWorkerStatus,
  getWorkerSkills,
} from "@/lib/services";
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Ban,
  Star,
  MapPin,
  Phone,
  Briefcase,
  DollarSign,
  Shield,
  Loader2,
} from "lucide-react";

interface WorkerData {
  id: string;
  user_id?: string;
  full_name: string;
  phone: string;
  cnic?: string;
  category_id?: string;
  city: string;
  area?: string;
  rating: number;
  total_reviews: number;
  total_jobs: number;
  total_earnings?: number;
  is_verified: boolean;
  is_active?: boolean;
  is_available?: boolean;
  base_rate?: number;
  experience_years?: number;
  bio?: string;
  wallet_balance?: number;
  status: string;
  created_at: string;
  updated_at?: string;
  category?: { id: string; name: string; icon: string } | null;
}

interface CategoryData {
  id: string;
  name: string;
  icon: string;
  is_active?: boolean;
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-1">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
      </TableCell>
      <TableCell className="text-right">
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto" />
      </TableCell>
    </TableRow>
  );
}

function WorkersContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workers, setWorkers] = useState<WorkerData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<WorkerData | null>(null);
  const [workerSkills, setWorkerSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (statusFilter && statusFilter !== "all") filters.status = statusFilter;
      if (categoryFilter && categoryFilter !== "all") filters.category = categoryFilter;
      if (cityFilter && cityFilter !== "all") filters.city = cityFilter;
      if (searchQuery) filters.search = searchQuery;

      const data = await getAllWorkers(filters);
      setWorkers(data as WorkerData[]);
    } catch (err) {
      console.error("Failed to fetch workers:", err);
    }
    setLoading(false);
  }, [statusFilter, categoryFilter, cityFilter, searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data as CategoryData[]);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const cities = useMemo(() => {
    const unique = Array.from(new Set(workers.map((w) => w.city).filter(Boolean)));
    return unique.sort();
  }, [workers]);

  const handleViewWorker = async (worker: WorkerData) => {
    setSelectedWorker(worker);
    try {
      const skills = await getWorkerSkills(worker.id);
      setWorkerSkills(skills);
    } catch {
      setWorkerSkills([]);
    }
  };

  const handleUpdateStatus = async (workerId: string, status: "active" | "rejected" | "suspended") => {
    setActionLoading(true);
    try {
      await updateWorkerStatus(workerId, status);
      if (selectedWorker?.id === workerId) {
        setSelectedWorker({ ...selectedWorker, status });
      }
      fetchWorkers();
    } catch (err) {
      console.error("Failed to update worker status:", err);
    }
    setActionLoading(false);
  };

  const getStatusBadge = (worker: WorkerData) => {
    const status = worker.status || (worker.is_active ? "active" : "inactive");
    switch (status) {
      case "active":
        return <Badge className={cn("text-xs", getStatusColor("active"))}>Active</Badge>;
      case "pending":
        return <Badge className={cn("text-xs", getStatusColor("pending"))}>Pending</Badge>;
      case "rejected":
        return <Badge className={cn("text-xs", getStatusColor("rejected"))}>Rejected</Badge>;
      case "suspended":
        return <Badge className={cn("text-xs bg-red-100 text-red-800")}>Suspended</Badge>;
      default:
        return <Badge className={cn("text-xs", getStatusColor("inactive"))}>Inactive</Badge>;
    }
  };

  return (
    <>
      <Header title="Workers" onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <main className="p-4 sm:p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, phone, or CNIC..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">
                    <span className="flex items-center gap-2">
                      Pending
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                    </span>
                  </SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{workers.length}</span> workers
          </p>
        </div>

        {/* Workers Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden sm:table-cell">City</TableHead>
                  <TableHead className="hidden lg:table-cell">Rating</TableHead>
                  <TableHead className="hidden lg:table-cell">Jobs</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                ) : workers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">No workers found</p>
                        <p className="text-gray-300 text-xs mt-1">Try adjusting your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  workers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-orange-100 text-orange-700 text-xs font-semibold">
                              {getInitials(worker.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{worker.full_name}</p>
                            <p className="text-xs text-gray-500">{worker.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <span>{worker.category?.icon}</span>
                          <span className="text-sm">{worker.category?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm text-gray-600">{worker.city || "—"}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{worker.rating || 0}</span>
                          <span className="text-xs text-gray-400">({worker.total_reviews || 0})</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm">{worker.total_jobs || 0}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getStatusBadge(worker)}
                          {!worker.is_verified && worker.status !== "pending" && (
                            <Badge className="text-xs" variant="outline">
                              Unverified
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewWorker(worker)}
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Worker Detail Dialog */}
        <Dialog open={!!selectedWorker} onOpenChange={() => { setSelectedWorker(null); setWorkerSkills([]); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedWorker && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-orange-100 text-orange-700 text-lg font-bold">
                        {getInitials(selectedWorker.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        {selectedWorker.full_name}
                        {selectedWorker.is_verified && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <DialogDescription>
                        {selectedWorker.category?.icon} {selectedWorker.category?.name || "N/A"} • {selectedWorker.city || "N/A"}
                      </DialogDescription>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="profile" className="mt-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="earnings">Earnings</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Phone</p>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          <p className="text-sm font-medium">{selectedWorker.phone}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">CNIC</p>
                        <p className="text-sm font-medium">{selectedWorker.cnic || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Location</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          <p className="text-sm font-medium">{selectedWorker.area || ""}, {selectedWorker.city}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="text-sm font-medium">{selectedWorker.experience_years || 0} years</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Bio</p>
                      <p className="text-sm text-gray-700">{selectedWorker.bio || "No bio provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {workerSkills.length > 0 ? (
                          workerSkills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">No skills listed</span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Member Since</p>
                        <p className="text-sm font-medium">{formatDate(selectedWorker.created_at)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Base Rate</p>
                        <p className="text-sm font-medium">{formatCurrency(selectedWorker.base_rate || 0)}/hr</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Star className="h-5 w-5 mx-auto mb-1 text-yellow-400 fill-yellow-400" />
                          <p className="text-2xl font-bold">{selectedWorker.rating || 0}</p>
                          <p className="text-xs text-gray-500">Rating</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Briefcase className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                          <p className="text-2xl font-bold">{selectedWorker.total_jobs || 0}</p>
                          <p className="text-xs text-gray-500">Total Jobs</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="h-5 w-5 mx-auto mb-1 flex items-center justify-center text-green-500 text-lg">💬</div>
                          <p className="text-2xl font-bold">{selectedWorker.total_reviews || 0}</p>
                          <p className="text-xs text-gray-500">Reviews</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <DollarSign className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                          <p className="text-2xl font-bold">{formatCurrency(selectedWorker.total_earnings || 0)}</p>
                          <p className="text-xs text-gray-500">Total Earnings</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="earnings" className="mt-4">
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Total Earnings</span>
                          <span className="text-lg font-bold text-gray-900">{formatCurrency(selectedWorker.total_earnings || 0)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Wallet Balance</span>
                          <span className="text-lg font-bold text-green-600">{formatCurrency(selectedWorker.wallet_balance || Math.round((selectedWorker.total_earnings || 0) * 0.7))}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Pending Withdrawal</span>
                          <span className="text-lg font-bold text-orange-600">{formatCurrency(Math.round((selectedWorker.total_earnings || 0) * 0.3))}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Base Rate</span>
                          <span className="text-lg font-bold">{formatCurrency(selectedWorker.base_rate || 0)}/hr</span>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="actions" className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {selectedWorker.status === "pending" && (
                        <>
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={actionLoading}
                            onClick={() => handleUpdateStatus(selectedWorker.id, "active")}
                          >
                            {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                            Approve Worker
                          </Button>
                          <Button
                            variant="destructive"
                            disabled={actionLoading}
                            onClick={() => handleUpdateStatus(selectedWorker.id, "rejected")}
                          >
                            {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                            Reject Worker
                          </Button>
                        </>
                      )}
                      {selectedWorker.status !== "pending" && (
                        <Button
                          variant={selectedWorker.status === "active" ? "destructive" : "default"}
                          className={selectedWorker.status !== "active" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                          disabled={actionLoading}
                          onClick={() => handleUpdateStatus(selectedWorker.id, selectedWorker.status === "active" ? "suspended" : "active")}
                        >
                          {actionLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : selectedWorker.status === "active" ? (
                            <><Ban className="h-4 w-4 mr-2" /> Suspend</>
                          ) : (
                            <><CheckCircle2 className="h-4 w-4 mr-2" /> Activate</>
                          )}
                        </Button>
                      )}
                    </div>
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Warning:</strong> Suspending a worker will remove them from search results and prevent them from receiving new job requests.
                      </p>
                    </div>
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

export default function WorkersPage() {
  return <WorkersContent />;
}
