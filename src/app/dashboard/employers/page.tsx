"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { getAllEmployers, updateEmployerStatus } from "@/lib/services";
import {
  Search,
  Eye,
  Star,
  MapPin,
  Phone,
  Briefcase,
  DollarSign,
  Calendar,
  Loader2,
} from "lucide-react";

interface EmployerData {
  id: string;
  full_name: string;
  phone: string;
  cnic?: string;
  company_name?: string;
  city?: string;
  rating: number;
  total_reviews?: number;
  total_jobs_posted?: number;
  total_spent?: number;
  is_active?: boolean;
  created_at: string;
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
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
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
      <TableCell className="hidden md:table-cell">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
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

function EmployersContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [employers, setEmployers] = useState<EmployerData[]>([]);
  const [selectedEmployer, setSelectedEmployer] = useState<EmployerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEmployers = useCallback(async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (searchQuery) filters.search = searchQuery;
      const data = await getAllEmployers(filters);
      setEmployers(data as EmployerData[]);
    } catch (err) {
      console.error("Failed to fetch employers:", err);
    }
    setLoading(false);
  }, [searchQuery]);

  useEffect(() => {
    fetchEmployers();
  }, [fetchEmployers]);

  const handleToggleStatus = async (employerId: string, currentActive: boolean) => {
    setActionLoading(true);
    try {
      await updateEmployerStatus(employerId, !currentActive);
      setEmployers(employers.map((e) =>
        e.id === employerId ? { ...e, is_active: !currentActive } : e
      ));
      if (selectedEmployer?.id === employerId) {
        setSelectedEmployer({ ...selectedEmployer, is_active: !currentActive });
      }
    } catch (err) {
      console.error("Failed to update employer status:", err);
    }
    setActionLoading(false);
  };

  return (
    <>
      <Header title="Employers" onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <main className="p-4 sm:p-6 space-y-6">
        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, phone, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{employers.length}</span> employers
          </p>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employer</TableHead>
                  <TableHead className="hidden md:table-cell">Company</TableHead>
                  <TableHead className="hidden sm:table-cell">City</TableHead>
                  <TableHead className="hidden lg:table-cell">Rating</TableHead>
                  <TableHead className="hidden lg:table-cell">Jobs Posted</TableHead>
                  <TableHead className="hidden md:table-cell">Total Spent</TableHead>
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
                ) : employers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">No employers found</p>
                        <p className="text-gray-300 text-xs mt-1">Try adjusting your search</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  employers.map((employer) => (
                    <TableRow key={employer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                              {getInitials(employer.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{employer.full_name}</p>
                            <p className="text-xs text-gray-500">{employer.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm text-gray-600">
                          {employer.company_name || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm text-gray-600">{employer.city || "—"}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{employer.rating || 0}</span>
                          <span className="text-xs text-gray-400">({employer.total_reviews || 0})</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm">{employer.total_jobs_posted || 0}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(employer.total_spent || 0)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-xs",
                            employer.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {employer.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEmployer(employer)}
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

        {/* Employer Detail Dialog */}
        <Dialog open={!!selectedEmployer} onOpenChange={() => setSelectedEmployer(null)}>
          <DialogContent className="max-w-2xl">
            {selectedEmployer && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-bold">
                        {getInitials(selectedEmployer.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {selectedEmployer.full_name}
                      <DialogDescription>
                        {selectedEmployer.company_name || "Individual"} • {selectedEmployer.city || "N/A"}
                      </DialogDescription>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      <p className="text-sm font-medium">{selectedEmployer.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">CNIC</p>
                    <p className="text-sm font-medium">{selectedEmployer.cnic || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Location</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      <p className="text-sm font-medium">{selectedEmployer.city || "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Member Since</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <p className="text-sm font-medium">{formatDate(selectedEmployer.created_at)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Star className="h-5 w-5 mx-auto mb-1 text-yellow-400 fill-yellow-400" />
                      <p className="text-xl font-bold">{selectedEmployer.rating || 0}</p>
                      <p className="text-xs text-gray-500">Rating</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Briefcase className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                      <p className="text-xl font-bold">{selectedEmployer.total_jobs_posted || 0}</p>
                      <p className="text-xs text-gray-500">Jobs Posted</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                      <p className="text-xl font-bold">{formatCurrency(selectedEmployer.total_spent || 0)}</p>
                      <p className="text-xs text-gray-500">Total Spent</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="h-5 w-5 mx-auto mb-1 flex items-center justify-center text-green-500 text-lg">💬</div>
                      <p className="text-xl font-bold">{selectedEmployer.total_reviews || 0}</p>
                      <p className="text-xs text-gray-500">Reviews</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <Button
                    variant={selectedEmployer.is_active ? "destructive" : "default"}
                    className={!selectedEmployer.is_active ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                    disabled={actionLoading}
                    onClick={() => handleToggleStatus(selectedEmployer.id, !!selectedEmployer.is_active)}
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : selectedEmployer.is_active ? (
                      "Deactivate Employer"
                    ) : (
                      "Activate Employer"
                    )}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}

export default function EmployersPage() {
  return <EmployersContent />;
}
