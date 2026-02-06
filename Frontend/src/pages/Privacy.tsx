import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-16">
                <div className="mb-12 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="mb-4 text-4xl font-bold text-foreground">Privacy Policy</h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        How we protect and manage your personal data at RoyalStone Lanka.
                    </p>
                </div>

                <div className="mx-auto max-w-4xl">
                    <Card>
                        <CardContent className="p-8 prose prose-slate max-w-none space-y-8">
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-foreground">1. Data Collection</h2>
                                <p className="text-muted-foreground">
                                    We collect information that you provide directly to us when you create an account, make a purchase, or communicate with our support team. This includes your name, email, and shipping address.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 text-foreground">2. Use of Information</h2>
                                <p className="text-muted-foreground">
                                    Your information is used to process your orders, maintain your account, and improve our services. We may also use your email to send you updates about your orders or promotional offers.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 text-foreground">3. Data Security</h2>
                                <p className="text-muted-foreground">
                                    We implement a variety of security measures to maintain the safety of your personal information. Your sensitive data is encrypted and protected by modern security protocols.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 text-foreground">4. Cookies</h2>
                                <p className="text-muted-foreground">
                                    Our website uses cookies to enhance your browsing experience. You can choose to disable cookies in your browser settings, though some features of the site may not function properly.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 text-foreground">5. Third-Party Sharing</h2>
                                <p className="text-muted-foreground">
                                    We do not sell or trade your personal information to outside parties. This does not include trusted third parties who assist us in operating our website or shipping your orders, so long as those parties agree to keep this information confidential.
                                </p>
                            </section>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
