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
import { getFinancialData, approveWithdrawal, rejectWithdrawal } from "@/lib/services";
import {
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  Wallet,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";

interface TransactionData {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  job_id?: string;
  worker_id?: string;
  employer_id?: string;
  created_at: string;
}

interface WithdrawalData {
  id: string;
  worker_id: string;
  amount: number;
  method?: string;
  account_details?: string;
  status: string;
  created_at: string;
  processed_at?: string;
  worker?: { id: string; full_name: string; phone?: string } | null;
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <TableRow>
      {Array.from({ length: cols }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 w-full max-w-[120px] bg-gray-200 rounded animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  );
}

function FinancialsContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalData | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalData[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalPayouts, setTotalPayouts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchFinancialData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFinancialData();
      setTransactions((data.transactions || []) as TransactionData[]);
      setWithdrawals((data.withdrawals || []) as WithdrawalData[]);
      setTotalEarnings(data.totalEarnings || 0);
      setTotalPayouts(data.totalPayouts || 0);
    } catch (err) {
      console.error("Failed to fetch financial data:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  const pendingWithdrawals = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + Number(w.amount), 0);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = (t.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const txnTypeIcon = (type: string) => {
    switch (type) {
      case "commission": return <DollarSign className="h-4 w-4 text-green-500" />;
      case "payout": return <ArrowUpRight className="h-4 w-4 text-orange-500" />;
      case "refund": return <RotateCcw className="h-4 w-4 text-blue-500" />;
      case "withdrawal": return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default: return <DollarSign className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleWithdrawalAction = async (id: string, action: "approved" | "rejected") => {
    setActionLoading(true);
    try {
      if (action === "approved") {
        await approveWithdrawal(id);
      } else {
        await rejectWithdrawal(id);
      }
      setWithdrawals(
        withdrawals.map((w) =>
          w.id === id
            ? { ...w, status: action, processed_at: new Date().toISOString() }
            : w
        )
      );
      setSelectedWithdrawal(null);
    } catch (err) {
      console.error("Failed to process withdrawal:", err);
    }
    setActionLoading(false);
  };

  return (
    <>
      <Header title="Financials" onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <main className="p-4 sm:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "—" : formatCurrency(totalEarnings)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100">
                  <CreditCard className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Commission Collected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "—" : formatCurrency(totalEarnings)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Payouts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "—" : formatCurrency(totalPayouts)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100">
                  <Wallet className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Withdrawals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "—" : formatCurrency(pendingWithdrawals)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="withdrawals">
              Withdrawal Requests
              {withdrawals.filter((w) => w.status === "pending").length > 0 && (
                <Badge className="ml-2 bg-orange-500 text-white text-xs">
                  {withdrawals.filter((w) => w.status === "pending").length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4 mt-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-[160px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="commission">Commission</SelectItem>
                      <SelectItem value="payout">Payout</SelectItem>
                      <SelectItem value="refund">Refund</SelectItem>
                      <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[160px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
                    ) : filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <div className="text-center">
                            <p className="text-gray-400 text-sm">No transactions found</p>
                            <p className="text-gray-300 text-xs mt-1">Try adjusting your filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {txnTypeIcon(txn.type)}
                              <span className="text-sm font-medium capitalize">{txn.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-700 max-w-[300px] truncate">{txn.description}</p>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="text-sm text-gray-500">{formatDate(txn.created_at)}</span>
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              "text-sm font-semibold",
                              txn.type === "commission" || txn.type === "withdrawal" ? "text-green-600" :
                              txn.type === "refund" ? "text-red-600" : "text-orange-600"
                            )}>
                              {txn.type === "refund" ? "-" : "+"}{formatCurrency(Number(txn.amount))}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs", getStatusColor(txn.status))}>
                              {txn.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Worker</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden md:table-cell">Method</TableHead>
                      <TableHead className="hidden lg:table-cell">Account</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
                    ) : withdrawals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="text-center">
                            <p className="text-gray-400 text-sm">No withdrawal requests found</p>
                            <p className="text-gray-300 text-xs mt-1">Withdrawal requests from workers will appear here</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      withdrawals.map((wd) => (
                        <TableRow key={wd.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-orange-100 text-orange-700 text-xs font-semibold">
                                  {wd.worker ? getInitials(wd.worker.full_name) : "??"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{wd.worker?.full_name || "Unknown"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-semibold">{formatCurrency(Number(wd.amount))}</span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline" className="text-xs">{wd.method || "N/A"}</Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span className="text-xs text-gray-500 max-w-[150px] truncate block">{wd.account_details || "N/A"}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs", getStatusColor(wd.status))}>
                              {wd.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className="text-xs text-gray-500">{formatDate(wd.created_at)}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            {wd.status === "pending" ? (
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleWithdrawalAction(wd.id, "approved")}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  disabled={actionLoading}
                                >
                                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleWithdrawalAction(wd.id, "rejected")}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  disabled={actionLoading}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button variant="ghost" size="sm" onClick={() => setSelectedWithdrawal(wd)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Withdrawal Detail Dialog */}
        <Dialog open={!!selectedWithdrawal} onOpenChange={() => setSelectedWithdrawal(null)}>
          <DialogContent>
            {selectedWithdrawal && (
              <>
                <DialogHeader>
                  <DialogTitle>Withdrawal Details</DialogTitle>
                  <DialogDescription>
                    Request from {selectedWithdrawal.worker?.full_name || "Unknown"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-lg font-bold">{formatCurrency(Number(selectedWithdrawal.amount))}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Method</p>
                      <p className="text-sm font-medium">{selectedWithdrawal.method || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Account Details</p>
                      <p className="text-sm font-medium">{selectedWithdrawal.account_details || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Status</p>
                      <Badge className={cn("text-xs", getStatusColor(selectedWithdrawal.status))}>
                        {selectedWithdrawal.status}
                      </Badge>
                    </div>
                  </div>
                  {selectedWithdrawal.processed_at && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Processed At</p>
                      <p className="text-sm font-medium">{formatDate(selectedWithdrawal.processed_at)}</p>
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

export default function FinancialsPage() {
  return <FinancialsContent />;
}
