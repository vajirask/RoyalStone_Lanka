import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal } from "lucide-react";
import GemCard from "@/components/GemCard";
import heroImage from "@/assets/hero-sapphire.jpg";
import rubyGem from "@/assets/ruby-gem.jpg";
import catsEyeGem from "@/assets/cats-eye-gem.jpg";
import emeraldGem from "@/assets/emerald-gem.jpg";

const Marketplace = () => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  const gemstones = [
    { id: "1", name: "Blue Sapphire", image: heroImage, price: 5200, carat: 2.5, rating: 4.8, certified: true },
    { id: "2", name: "Ruby", image: rubyGem, price: 3800, carat: 1.8, rating: 4.9, certified: true },
    { id: "3", name: "Cat's Eye", image: catsEyeGem, price: 2100, carat: 3.2, rating: 4.7, certified: true },
    { id: "4", name: "Emerald", image: emeraldGem, price: 4500, carat: 2.0, rating: 4.8, certified: false },
    { id: "5", name: "Star Sapphire", image: heroImage, price: 6200, carat: 3.5, rating: 4.9, certified: true },
    { id: "6", name: "Pink Ruby", image: rubyGem, price: 4100, carat: 2.2, rating: 4.7, certified: true },
    { id: "7", name: "Alexandrite", image: catsEyeGem, price: 7800, carat: 1.5, rating: 4.9, certified: true },
    { id: "8", name: "Yellow Sapphire", image: emeraldGem, price: 3200, carat: 2.8, rating: 4.6, certified: false },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Gemstone Marketplace</h1>
          <p className="text-muted-foreground">Browse authentic certified Sri Lankan gemstones</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search gemstones..."
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className={`space-y-6 lg:block ${showFilters ? "block" : "hidden"}`}>
            <Card>
              <CardContent className="space-y-6 p-6">
                <div>
                  <h3 className="mb-4 font-semibold text-foreground">Gem Type</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="sapphire">Sapphire</SelectItem>
                      <SelectItem value="ruby">Ruby</SelectItem>
                      <SelectItem value="emerald">Emerald</SelectItem>
                      <SelectItem value="cats-eye">Cat's Eye</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="mb-4 font-semibold text-foreground">Price Range</h3>
                  <Slider
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-semibold text-foreground">Carat Weight</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1-2">1-2 Carat</SelectItem>
                      <SelectItem value="2-3">2-3 Carat</SelectItem>
                      <SelectItem value="3+">3+ Carat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="mb-4 font-semibold text-foreground">Certification</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="certified">Certified Only</SelectItem>
                      <SelectItem value="uncertified">Uncertified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{gemstones.length} gemstones found</p>
              <Select defaultValue="featured">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {gemstones.map((gem) => (
                <GemCard key={gem.id} {...gem} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              <Button variant="outline" disabled>Previous</Button>
              <Button variant="outline" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
