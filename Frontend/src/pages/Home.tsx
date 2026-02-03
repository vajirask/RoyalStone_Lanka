import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { GraduationCap, Search, ShoppingBag, Award, TrendingUp, Shield, Target, Rocket } from "lucide-react";
import GemCard from "@/components/GemCard";
import heroImage from "@/assets/hero-sapphire.jpg";
import rubyGem from "@/assets/ruby-gem.jpg";
import catsEyeGem from "@/assets/cats-eye-gem.jpg";
import emeraldGem from "@/assets/emerald-gem.jpg";

const Home = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Gem Guide",
      description: "Learn about Sri Lankan gemstones from experts",
      path: "/education"
    },
    {
      icon: Search,
      title: "AI Recognition",
      description: "Identify gemstones instantly with AI technology",
      path: "/ai-recognition"
    },
    {
      icon: ShoppingBag,
      title: "Shop",
      description: "Buy and sell authentic certified gemstones",
      path: "/marketplace"
    },
    {
      icon: Shield,
      title: "Certified Sellers",
      description: "Trade with verified and trusted sellers only",
      path: "/marketplace"
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
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden pb-20 bg-gradient-to-br from-primary/5 via-background to-gold/5">
        {/* Simple Content */}
        <div className="container relative z-10 mx-auto px-4 text-center">

          <div className="mx-auto max-w-4xl space-y-8 animate-fade-in pt-32">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Learn, Identify & Trade{" "}
              <span className="block mt-4 bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent bg-[length:200%_auto]">
                Authentic Sri Lankan Gemstones
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
              Discover the world's finest gemstones with expert Gem Guide, AI-powered recognition, and a trusted shop
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 pb-12">
              <Link to="/education">
                <Button size="lg" variant="premium" className="h-14 px-8 text-lg shadow-xl shadow-primary/10 border-primary/10">
                  <GraduationCap className="mr-2 h-6 w-6" />
                  Learn Gems
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-background border-border text-foreground hover:bg-muted font-bold">
                  <ShoppingBag className="mr-2 h-6 w-6" />
                  Shop
                </Button>
              </Link>
              <Link to="/seller-dashboard">
                <Button size="lg" variant="gold" className="h-14 px-8 text-lg shadow-xl shadow-gold/10">
                  <TrendingUp className="mr-2 h-6 w-6" />
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* Features Section */}
      <section className="relative -mt-20 z-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Link key={index} to={feature.path}>
                <Card className="border-white/20 bg-white/10 backdrop-blur-md shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="flex flex-col items-center space-y-4 p-8 text-center relative z-10">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Stats Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Users", value: "10k+", color: "text-blue-600" },
              { label: "Verified Sellers", value: "500+", color: "text-purple-600" },
              { label: "Gems Identified", value: "50k+", color: "text-green-600" },
              { label: "Trading Volume", value: "$2M+", color: "text-amber-600" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <h3 className={`text-4xl md:text-5xl font-extrabold ${stat.color}`}>{stat.value}</h3>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section id="about" className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div id="vision" className="space-y-6 p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 hover:border-primary/30 transition-all duration-500 group">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To be the global benchmark for Sri Lankan gemstone authenticity and excellence, connecting the world to the island's rich geological heritage through transparency, technology, and trust.
              </p>
              <div className="h-1 w-20 bg-primary/40 rounded-full group-hover:w-32 transition-all duration-500" />
            </div>

            <div id="mission" className="space-y-6 p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 hover:border-primary/30 transition-all duration-500 group">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We empower gem enthusiasts and traders by providing innovative AI identification tools, expert-led education, and a secure certified marketplace that guarantees the origin and quality of every stone.
              </p>
              <div className="h-1 w-20 bg-primary/40 rounded-full group-hover:w-32 transition-all duration-500" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
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
              <Button size="lg" variant="outline" className="min-w-[200px]">
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
