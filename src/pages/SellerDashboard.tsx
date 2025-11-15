import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, TrendingUp, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SellerDashboard = () => {
  const stats = [
    { label: "Total Products", value: "24", icon: Package, change: "+3 this month" },
    { label: "Total Sales", value: "$52,400", icon: DollarSign, change: "+12% this month" },
    { label: "Active Listings", value: "18", icon: TrendingUp, change: "6 pending approval" },
  ];

  const products = [
    { id: 1, name: "Blue Sapphire", price: "$5,200", carat: "2.5", status: "Active", certified: true },
    { id: 2, name: "Ruby", price: "$3,800", carat: "1.8", status: "Active", certified: true },
    { id: 3, name: "Emerald", price: "$4,500", carat: "2.0", status: "Pending", certified: false },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your gemstone listings</p>
          </div>
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add New Gemstone
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Carat</TableHead>
                  <TableHead>Certification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.carat} ct</TableCell>
                    <TableCell>
                      {product.certified ? (
                        <Badge className="bg-gold">Certified</Badge>
                      ) : (
                        <Badge variant="secondary">Not Certified</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.status === "Active" ? "default" : "secondary"}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
