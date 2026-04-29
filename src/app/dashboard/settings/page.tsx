"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Settings,
  Save,
  Percent,
  MapPin,
  Wallet,
  Phone,
  Mail,
  Shield,
  Building,
  DollarSign,
  Plus,
  X,
} from "lucide-react";

function SettingsContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const [commissionRate, setCommissionRate] = useState(15);
  const [minWithdrawal, setMinWithdrawal] = useState(500);
  const [maxJobBudget, setMaxJobBudget] = useState(500000);
  const [supportPhone, setSupportPhone] = useState("+92-300-0000000");
  const [supportEmail, setSupportEmail] = useState("support@mazdoorping.pk");

  const [cities, setCities] = useState([
    "Lahore",
    "Karachi",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Peshawar",
    "Multan",
    "Quetta",
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    "JazzCash",
    "Easypaisa",
    "Bank Transfer",
    "Cash on Delivery",
  ]);

  const [newCity, setNewCity] = useState("");
  const [newPaymentMethod, setNewPaymentMethod] = useState("");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addCity = () => {
    if (newCity.trim() && !cities.includes(newCity.trim())) {
      setCities([...cities, newCity.trim()]);
      setNewCity("");
    }
  };

  const removeCity = (city: string) => {
    setCities(cities.filter((c) => c !== city));
  };

  const addPaymentMethod = () => {
    if (newPaymentMethod.trim() && !paymentMethods.includes(newPaymentMethod.trim())) {
      setPaymentMethods([...paymentMethods, newPaymentMethod.trim()]);
      setNewPaymentMethod("");
    }
  };

  const removePaymentMethod = (method: string) => {
    setPaymentMethods(paymentMethods.filter((m) => m !== method));
  };

  return (
    <>
      <Header title="Settings" onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <main className="p-4 sm:p-6 space-y-6">
        {/* Success toast */}
        {saved && (
          <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
            <Settings className="h-4 w-4" />
            Settings saved successfully!
          </div>
        )}

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="cities">Cities</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-500" />
                  Platform Settings
                </CardTitle>
                <CardDescription>
                  Configure core platform parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-gray-400" />
                      Commission Rate (%)
                    </Label>
                    <Input
                      type="number"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      min={0}
                      max={50}
                    />
                    <p className="text-xs text-gray-400">Platform commission on each job transaction</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      Minimum Withdrawal (PKR)
                    </Label>
                    <Input
                      type="number"
                      value={minWithdrawal}
                      onChange={(e) => setMinWithdrawal(Number(e.target.value))}
                      min={100}
                    />
                    <p className="text-xs text-gray-400">Minimum amount workers can withdraw</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      Maximum Job Budget (PKR)
                    </Label>
                    <Input
                      type="number"
                      value={maxJobBudget}
                      onChange={(e) => setMaxJobBudget(Number(e.target.value))}
                      min={1000}
                    />
                    <p className="text-xs text-gray-400">Maximum budget allowed for a single job</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cities" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  Supported Cities
                </CardTitle>
                <CardDescription>
                  Manage cities where the platform operates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new city..."
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCity()}
                  />
                  <Button onClick={addCity} className="bg-orange-500 hover:bg-orange-600 text-white shrink-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <Badge
                      key={city}
                      variant="secondary"
                      className="text-sm py-1.5 px-3 flex items-center gap-2"
                    >
                      <MapPin className="h-3 w-3" />
                      {city}
                      <button
                        onClick={() => removeCity(city)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-400">{cities.length} cities supported</p>

                <Separator />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Cities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-orange-500" />
                  Payment Methods
                </CardTitle>
                <CardDescription>
                  Manage supported payment methods for the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new payment method..."
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addPaymentMethod()}
                  />
                  <Button onClick={addPaymentMethod} className="bg-orange-500 hover:bg-orange-600 text-white shrink-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {paymentMethods.map((method) => (
                    <Badge
                      key={method}
                      variant="secondary"
                      className="text-sm py-1.5 px-3 flex items-center gap-2"
                    >
                      <Wallet className="h-3 w-3" />
                      {method}
                      <button
                        onClick={() => removePaymentMethod(method)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <Separator />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Payment Methods
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  Support Settings
                </CardTitle>
                <CardDescription>
                  Platform support contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      Support Phone
                    </Label>
                    <Input
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      placeholder="+92-XXX-XXXXXXX"
                    />
                    <p className="text-xs text-gray-400">24/7 helpline number</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      Support Email
                    </Label>
                    <Input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="support@example.com"
                    />
                    <p className="text-xs text-gray-400">Email for support requests</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Support Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Platform Info */}
        <Card className="bg-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building className="h-5 w-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Platform Information</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Version</p>
                <p className="font-medium">1.0.0</p>
              </div>
              <div>
                <p className="text-gray-500">Environment</p>
                <Badge variant="outline" className="text-xs">Production</Badge>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="font-medium">March 20, 2024</p>
              </div>
              <div>
                <p className="text-gray-500">Database</p>
                <Badge variant="outline" className="text-xs text-green-600">Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

export default function SettingsPage() {
  return <SettingsContent />;
}
