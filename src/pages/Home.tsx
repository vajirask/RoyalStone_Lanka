import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { GraduationCap, Search, ShoppingBag, Award, TrendingUp, Shield } from "lucide-react";
import GemCard from "@/components/GemCard";
import heroImage from "@/assets/hero-sapphire.jpg";
import rubyGem from "@/assets/ruby-gem.jpg";
import catsEyeGem from "@/assets/cats-eye-gem.jpg";
import emeraldGem from "@/assets/emerald-gem.jpg";

const Home = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Education",
      description: "Learn about Sri Lankan gemstones from experts",
    },
    {
      icon: Search,
      title: "AI Recognition",
      description: "Identify gemstones instantly with AI technology",
    },
    {
      icon: ShoppingBag,
      title: "Marketplace",
      description: "Buy and sell authentic certified gemstones",
    },
    {
      icon: Shield,
      title: "Certified Sellers",
      description: "Trade with verified and trusted sellers only",
    },
  ];

  const trendingGems = [
    { id: "1", name: "Blue Sapphire", image: heroImage, price: 5200, carat: 2.5, rating: 4.8, certified: true },
    { id: "2", name: "Ruby", image: rubyGem, price: 3800, carat: 1.8, rating: 4.9, certified: true },
    { id: "3", name: "Cat's Eye", image: catsEyeGem, price: 2100, carat: 3.2, rating: 4.7, certified: true },
    { id: "4", name: "Emerald", image: emeraldGem, price: 4500, carat: 2.0, rating: 4.8, certified: false },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-gold/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(221_83%_53%/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(45_85%_53%/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Learn, Identify & Trade{" "}
                  <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">Authentic Sri Lankan Gemstones</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Discover the world's finest gemstones with expert education, AI-powered recognition, and a trusted marketplace
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/education">
                  <Button size="lg" variant="premium">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Learn Gems
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button size="lg" variant="outline">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Marketplace
                  </Button>
                </Link>
                <Link to="/seller-dashboard">
                  <Button size="lg" variant="gold">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Start Selling
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative lg:pl-8 animate-fade-in [animation-delay:200ms]">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-[0_20px_60px_-15px_hsl(221_83%_53%/0.4)] transition-shadow duration-500 animate-float">
                <img
                  src={heroImage}
                  alt="Premium Sapphire"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-none bg-background shadow-md hover:shadow-2xl group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="h-8 w-8 text-primary group-hover:animate-pulse" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Gemstones */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Trending Gemstones</h2>
            <p className="text-muted-foreground">Explore our most popular authentic Sri Lankan gemstones</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trendingGems.map((gem) => (
              <GemCard key={gem.id} {...gem} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/marketplace">
              <Button size="lg" variant="outline">
                View All Gemstones
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-light to-primary-dark py-16 text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(0_0%_100%/0.1),transparent_70%)]" />
        <div className="container mx-auto px-4 text-center relative">
          <Award className="mx-auto mb-6 h-16 w-16 animate-float" />
          <h2 className="mb-4 text-3xl font-bold">Start Your Gemstone Journey Today</h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of gem enthusiasts and traders on Royalstone Lanka
          </p>
          <Link to="/register">
            <Button size="lg" variant="gold" className="shadow-2xl">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
