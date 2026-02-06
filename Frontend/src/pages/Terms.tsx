import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale } from "lucide-react";

const Terms = () => {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-16">
                <div className="mb-12 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Scale className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="mb-4 text-4xl font-bold text-foreground">Terms of Trading</h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Please read these terms carefully before using our marketplace.
                    </p>
                </div>

                <div className="mx-auto max-w-4xl">
                    <Card>
                        <CardContent className="p-8 prose prose-slate max-w-none space-y-8">
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-foreground">1. Introduction</h2>
                                <p className="text-muted-foreground">
                                    Welcome to RoyalStone Lanka. These Terms of Trading govern your use of our website and the purchase of gemstones from our marketplace. By accessing our site, you agree to these terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 text-foreground">2. Buying Gemstones</h2>
                                <p className="text-muted-foreground">
                                    All gemstones listed on RoyalStone Lanka are described to the best of our ability. While we use AI for identification assistance, we recommend reviewing the provided certification for final verification.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 text-foreground">3. Pricing and Payment</h2>
                                <p className="text-muted-foreground">
                                    Prices are listed in USD unless otherwise specified. We reserve the right to change prices at any time. Payment must be made in full before any gemstone is shipped.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 text-foreground">4. Shipping and Returns</h2>
                                <p className="text-muted-foreground">
                                    We offer secure worldwide shipping. Due to the valuable nature of gemstones, returns are only accepted if the item received does not match the description provided at the time of sale.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 text-foreground">5. Limitation of Liability</h2>
                                <p className="text-muted-foreground">
                                    RoyalStone Lanka shall not be liable for any indirect, incidental, or consequential damages arising out of the use of our marketplace or the purchase of any gemstones.
                                </p>
                            </section>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Terms;
