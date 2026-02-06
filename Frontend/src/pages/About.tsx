import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, History, Target, Award } from "lucide-react";

const About = () => {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-16">
                <div className="mb-12 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <History className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="mb-4 text-4xl font-bold text-foreground">Our Origin</h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        The story of RoyalStone Lanka, rooted in the ancient gem-bearing soils of Sri Lanka.
                    </p>
                </div>

                <div className="mx-auto max-w-4xl space-y-12">
                    <section className="grid gap-8 md:grid-cols-2 items-center">
                        <div>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Info className="h-6 w-6 text-primary" />
                                Who We Are
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                RoyalStone Lanka was founded with a single mission: to bring the authentic brilliance of Sri Lankan gemstones to the world. Sri Lanka, historically known as "Ratna-Dweepa" (Island of Gems), has been our home and inspiration for generations.
                            </p>
                        </div>
                        <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
                            <p className="italic text-primary font-medium">
                                "We believe that every gemstone tells a story that began millions of years ago, deep within the earth of our beautiful island."
                            </p>
                        </div>
                    </section>

                    <section className="grid gap-8 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Target className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Our Mission</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    To provide a transparent and trusted marketplace for authentic, ethically sourced Sri Lankan gemstones, powered by advanced technology.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Award className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Our Values</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Authenticity, integrity, and sustainability are at the heart of everything we do, from mining to the final sale.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Info className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Our Technology</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Merging ancient tradition with modern AI, we ensure every gem is correctly identified and valued for our customers.
                                </p>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;
