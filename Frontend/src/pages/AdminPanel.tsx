import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Package, TrendingUp, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminPanel = () => {
  const stats = [
    { label: "Total Users", value: "1,234", icon: Users, change: "+10% this month" },
    { label: "Total Products", value: "456", icon: Package, change: "+5% this month" },
    { label: "Pending Approvals", value: "23", icon: TrendingUp, change: "Needs attention" },
    { label: "Total Revenue", value: "$124K", icon: DollarSign, change: "+15% this month" },
  ];

  const pendingApprovals = [
    { id: 1, seller: "John Gems Ltd", product: "Blue Sapphire", price: "$5,200", submitted: "2 hours ago" },
    { id: 2, seller: "Ceylon Stones", product: "Ruby", price: "$3,800", submitted: "5 hours ago" },
    { id: 3, seller: "Lanka Gems Co", product: "Emerald", price: "$4,500", submitted: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground">Manage platform operations</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Neural Training Studio Quick Access Banner */}
        <Card className="mb-8 border-primary/30 bg-gradient-to-r from-primary/10 via-background to-primary/5">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Package className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-foreground">AI Gemstone Training & Model Studio</h3>
                <p className="text-sm text-muted-foreground">Train new gemstone varieties, upload dataset photos, and manage active neural embeddings.</p>
              </div>
            </div>
            <a href="/ai-recognition">
              <Button size="lg" className="font-bold shadow-md">
                Open AI Training Studio
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Product Approval Queue</CardTitle>
              <Badge variant="secondary">{pendingApprovals.length} pending</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seller</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApprovals.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.seller}</TableCell>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell className="text-muted-foreground">{item.submitted}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="default">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        Reject
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

export default AdminPanel;
