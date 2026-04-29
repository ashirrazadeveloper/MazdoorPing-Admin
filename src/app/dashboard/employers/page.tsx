"use client";

import React, { useState, useMemo } from "react";
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
import { mockEmployers } from "@/lib/mock-data";
import {
  Search,
  Eye,
  Star,
  MapPin,
  Phone,
  Briefcase,
  DollarSign,
  Building2,
  Calendar,
} from "lucide-react";

function EmployersContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState<(typeof mockEmployers)[0] | null>(null);

  const filteredEmployers = useMemo(() => {
    return mockEmployers.filter((employer) => {
      const matchesSearch =
        employer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employer.phone.includes(searchQuery) ||
        (employer.company_name && employer.company_name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [searchQuery]);

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
            Showing <span className="font-medium text-gray-700">{filteredEmployers.length}</span> employers
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
                {filteredEmployers.map((employer) => (
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
                      <span className="text-sm text-gray-600">{employer.city}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{employer.rating}</span>
                        <span className="text-xs text-gray-400">({employer.total_reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm">{employer.total_jobs_posted}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(employer.total_spent)}
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
                ))}
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
                        {selectedEmployer.company_name || "Individual"} • {selectedEmployer.city}
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
                    <p className="text-sm font-medium">{selectedEmployer.cnic}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Location</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      <p className="text-sm font-medium">{selectedEmployer.city}</p>
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
                      <p className="text-xl font-bold">{selectedEmployer.rating}</p>
                      <p className="text-xs text-gray-500">Rating</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Briefcase className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                      <p className="text-xl font-bold">{selectedEmployer.total_jobs_posted}</p>
                      <p className="text-xs text-gray-500">Jobs Posted</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                      <p className="text-xl font-bold">{formatCurrency(selectedEmployer.total_spent)}</p>
                      <p className="text-xs text-gray-500">Total Spent</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="h-5 w-5 mx-auto mb-1 flex items-center justify-center text-green-500 text-lg">💬</div>
                      <p className="text-xl font-bold">{selectedEmployer.total_reviews}</p>
                      <p className="text-xs text-gray-500">Reviews</p>
                    </CardContent>
                  </Card>
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
