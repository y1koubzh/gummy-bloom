import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { BarChart3, Package, ShoppingCart, Users, Plus } from 'lucide-react';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'customers';

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'products' as const, label: 'Products', icon: Package },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingCart },
    { id: 'customers' as const, label: 'Customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Orders', value: '1,234', icon: ShoppingCart },
                { label: 'Revenue', value: '$45,678', icon: BarChart3 },
                { label: 'Customers', value: '892', icon: Users },
                { label: 'Products', value: '156', icon: Package },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <Icon size={32} className="text-primary opacity-50" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Orders */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Order ID</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map(i => (
                      <tr key={i} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">#ORD-{1000 + i}</td>
                        <td className="py-3 px-4">Customer {i}</td>
                        <td className="py-3 px-4">$99.99</td>
                        <td className="py-3 px-4">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2">
              <Plus size={18} />
              Add Product
            </Button>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-xl font-bold mb-4">Products</h3>
              <div className="text-center py-12 text-muted-foreground">
                <Package size={48} className="mx-auto mb-4 opacity-50" />
                <p>Product management coming soon</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-xl font-bold mb-4">Orders</h3>
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
              <p>Order management coming soon</p>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-xl font-bold mb-4">Customers</h3>
            <div className="text-center py-12 text-muted-foreground">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>Customer management coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
