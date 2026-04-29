"use client";

import React, { useState, useMemo } from "react";
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
import { mockWorkers, mockCategories } from "@/lib/mock-data";
import {
  Search,
  Filter,
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
} from "lucide-react";

function WorkersContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedWorker, setSelectedWorker] = useState<(typeof mockWorkers)[0] | null>(null);

  const cities = useMemo(() => {
    const unique = Array.from(new Set(mockWorkers.map((w) => w.city)));
    return unique.sort();
  }, []);

  const filteredWorkers = useMemo(() => {
    return mockWorkers.filter((worker) => {
      const matchesSearch =
        worker.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.phone.includes(searchQuery) ||
        worker.cnic.includes(searchQuery);
      const matchesCategory =
        categoryFilter === "all" || worker.category_id === categoryFilter;
      const matchesCity = cityFilter === "all" || worker.city === cityFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && worker.is_active) ||
        (statusFilter === "inactive" && !worker.is_active) ||
        (statusFilter === "verified" && worker.is_verified) ||
        (statusFilter === "unverified" && !worker.is_verified);
      return matchesSearch && matchesCategory && matchesCity && matchesStatus;
    });
  }, [searchQuery, categoryFilter, cityFilter, statusFilter]);

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
                  {mockCategories.map((cat) => (
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{filteredWorkers.length}</span> workers
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
                {filteredWorkers.map((worker) => (
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
                      <span className="text-sm text-gray-600">{worker.city}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{worker.rating}</span>
                        <span className="text-xs text-gray-400">({worker.total_reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm">{worker.total_jobs}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge
                          className={cn(
                            "text-xs",
                            worker.is_active ? getStatusColor("active") : getStatusColor("inactive")
                          )}
                        >
                          {worker.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {!worker.is_verified && (
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
                        onClick={() => setSelectedWorker(worker)}
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

        {/* Worker Detail Dialog */}
        <Dialog open={!!selectedWorker} onOpenChange={() => setSelectedWorker(null)}>
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
                        {selectedWorker.category?.icon} {selectedWorker.category?.name} • {selectedWorker.city}
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
                        <p className="text-sm font-medium">{selectedWorker.cnic}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Location</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          <p className="text-sm font-medium">{selectedWorker.area}, {selectedWorker.city}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="text-sm font-medium">{selectedWorker.experience_years} years</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Bio</p>
                      <p className="text-sm text-gray-700">{selectedWorker.bio}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedWorker.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Member Since</p>
                        <p className="text-sm font-medium">{formatDate(selectedWorker.created_at)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Base Rate</p>
                        <p className="text-sm font-medium">{formatCurrency(selectedWorker.base_rate)}/hr</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Star className="h-5 w-5 mx-auto mb-1 text-yellow-400 fill-yellow-400" />
                          <p className="text-2xl font-bold">{selectedWorker.rating}</p>
                          <p className="text-xs text-gray-500">Rating</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Briefcase className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                          <p className="text-2xl font-bold">{selectedWorker.total_jobs}</p>
                          <p className="text-xs text-gray-500">Total Jobs</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="h-5 w-5 mx-auto mb-1 flex items-center justify-center text-green-500 text-lg">💬</div>
                          <p className="text-2xl font-bold">{selectedWorker.total_reviews}</p>
                          <p className="text-xs text-gray-500">Reviews</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <DollarSign className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                          <p className="text-2xl font-bold">{formatCurrency(selectedWorker.total_earnings)}</p>
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
                          <span className="text-lg font-bold text-gray-900">{formatCurrency(selectedWorker.total_earnings)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Available Balance</span>
                          <span className="text-lg font-bold text-green-600">{formatCurrency(Math.round(selectedWorker.total_earnings * 0.7))}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Pending Withdrawal</span>
                          <span className="text-lg font-bold text-orange-600">{formatCurrency(Math.round(selectedWorker.total_earnings * 0.3))}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Base Rate</span>
                          <span className="text-lg font-bold">{formatCurrency(selectedWorker.base_rate)}/hr</span>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="actions" className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {!selectedWorker.is_verified && (
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => {
                          setSelectedWorker({ ...selectedWorker, is_verified: true });
                        }}>
                          <Shield className="h-4 w-4 mr-2" />
                          Verify Worker
                        </Button>
                      )}
                      <Button
                        variant={selectedWorker.is_active ? "destructive" : "default"}
                        className={!selectedWorker.is_active ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                        onClick={() => {
                          setSelectedWorker({ ...selectedWorker, is_active: !selectedWorker.is_active });
                        }}
                      >
                        {selectedWorker.is_active ? (
                          <><Ban className="h-4 w-4 mr-2" /> Deactivate</>
                        ) : (
                          <><CheckCircle2 className="h-4 w-4 mr-2" /> Activate</>
                        )}
                      </Button>
                    </div>
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Warning:</strong> Deactivating a worker will remove them from search results and prevent them from receiving new job requests.
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
