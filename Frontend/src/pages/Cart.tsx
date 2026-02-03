import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

    const shipping = subtotal > 0 ? 5 : 0;
    const tax = subtotal * 0.01; // 1% tax
    const total = subtotal + shipping + tax;

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="mb-6 flex justify-center">
                    <ShoppingBag className="h-24 w-24 text-muted-foreground opacity-20" />
                </div>
                <h2 className="mb-4 text-3xl font-bold">Your cart is empty</h2>
                <p className="mb-8 text-muted-foreground">
                    Looks like you haven't added any gemstones to your cart yet.
                </p>
                <Link to="/marketplace">
                    <Button size="lg" className="rounded-full px-8">
                        Explore Shop
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 py-12">
            <div className="container mx-auto px-4">
                <h1 className="mb-8 text-3xl font-bold">Shopping Cart ({totalItems})</h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <Card key={item.id} className="overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>

                                            <div className="flex flex-1 flex-col justify-between space-y-2">
                                                <div className="flex justify-between">
                                                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                                                    <p className="font-bold text-primary">
                                                        ${(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{item.carat} Carats</p>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className="w-8 text-center font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => removeFromCart(item.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 border-primary/20 bg-background/50 backdrop-blur shadow-xl">
                            <CardContent className="p-6">
                                <h3 className="mb-4 text-xl font-bold">Order Summary</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">${subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping Estimate</span>
                                        <span className="font-medium">${shipping.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tax (1%)</span>
                                        <span className="font-medium">${tax.toLocaleString()}</span>
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="flex justify-between text-lg font-bold text-primary">
                                        <span>Order Total</span>
                                        <span>${total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <Link to="/checkout">
                                    <Button className="mt-8 w-full py-6 text-lg font-bold shadow-lg shadow-primary/30">
                                        Proceed to Checkout
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>

                                <p className="mt-4 text-center text-xs text-muted-foreground">
                                    Secure checkout with SSL encryption
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
