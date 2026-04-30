"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";
import { getAllCategories, updateCategory, toggleCategoryActive } from "@/lib/services";
import type { Category } from "@/types";
import {
  Plus,
  Pencil,
  Search,
  CheckCircle2,
  XCircle,
  Users,
  Loader2,
} from "lucide-react";

function CategoriesContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "🔧",
    base_rate: 0,
    commission_rate: 15,
    is_active: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await getAllCategories();
        setCategories(data as Category[]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setFormData({
      name: "",
      description: "",
      icon: "🔧",
      base_rate: 0,
      commission_rate: 15,
      is_active: true,
    });
    setEditCategory(null);
    setIsCreateOpen(true);
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon,
      base_rate: category.base_rate,
      commission_rate: category.commission_rate,
      is_active: category.is_active,
    });
    setEditCategory(category);
    setIsCreateOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editCategory) {
        await updateCategory(editCategory.id, formData);
        setCategories(
          categories.map((c) =>
            c.id === editCategory.id
              ? { ...c, ...formData }
              : c
          )
        );
      }
      // Note: creating new categories requires a separate insert service
      // For now, editing is supported
      setIsCreateOpen(false);
    } catch (err) {
      console.error("Failed to save category:", err);
    }
    setSaving(false);
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await toggleCategoryActive(id, !currentActive);
      setCategories(
        categories.map((c) =>
          c.id === id ? { ...c, is_active: !currentActive } : c
        )
      );
    } catch (err) {
      console.error("Failed to toggle category:", err);
    }
  };

  return (
    <>
      <Header title="Categories" onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <main className="p-4 sm:p-6 space-y-6">
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={handleCreate}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{loading ? "—" : categories.length}</p>
              <p className="text-xs text-gray-500">Total Categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-600">
                {loading ? "—" : categories.filter((c) => c.is_active).length}
              </p>
              <p className="text-xs text-gray-500">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-500">
                {loading ? "—" : categories.filter((c) => !c.is_active).length}
              </p>
              <p className="text-xs text-gray-500">Inactive</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-orange-600">
                {loading ? "—" : categories.reduce((sum, c) => sum + (c.total_workers || 0), 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total Workers</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Base Rate</TableHead>
                  <TableHead className="hidden md:table-cell">Commission</TableHead>
                  <TableHead className="hidden sm:table-cell">Workers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                          <div className="space-y-1">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></TableCell>
                      <TableCell className="hidden md:table-cell"><div className="h-4 w-12 bg-gray-200 rounded animate-pulse" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><div className="h-4 w-8 bg-gray-200 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-5 w-16 bg-gray-200 rounded animate-pulse" /></TableCell>
                      <TableCell className="text-right"><div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">No categories found</p>
                        <p className="text-gray-300 text-xs mt-1">Create a new category to get started</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{category.name}</p>
                            <p className="text-xs text-gray-500 max-w-[200px] truncate">{category.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm font-medium">{formatCurrency(category.base_rate)}/hr</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm font-medium">{category.commission_rate}%</span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm">{category.total_workers || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleToggleActive(category.id, category.is_active)}
                          className="flex items-center gap-1.5"
                        >
                          {category.is_active ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                            className="text-gray-500 hover:text-orange-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription>
                {editCategory
                  ? "Update category details"
                  : "Create a new worker category"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Category name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🔧"
                    className="text-center text-2xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Base Rate (PKR/hr)</Label>
                  <Input
                    type="number"
                    value={formData.base_rate}
                    onChange={(e) => setFormData({ ...formData, base_rate: Number(e.target.value) })}
                    placeholder="800"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Commission Rate (%)</Label>
                  <Input
                    type="number"
                    value={formData.commission_rate}
                    onChange={(e) => setFormData({ ...formData, commission_rate: Number(e.target.value) })}
                    placeholder="15"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!formData.name || saving}
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {editCategory ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}

export default function CategoriesPage() {
  return <CategoriesContent />;
}
