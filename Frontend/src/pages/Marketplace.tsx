import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal } from "lucide-react";
import GemCard from "@/components/GemCard";

const Marketplace = () => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCarat, setSelectedCarat] = useState("any");
  const [selectedCertification, setSelectedCertification] = useState("all");

  const gemstones = [
    { id: "1", name: "Blue Sapphire", image: "https://th.bing.com/th/id/R.65571639bbd9b63c8b692060f531e58e?rik=URq0dZiihWg6wA&riu=http%3a%2f%2fwww.lotusgemology.com%2fimages%2flibrary%2farticles%2fquality%2flotus-color-types%2findigo-sapphire.jpg&ehk=LSg35L3DjpU7%2fF7S7EAqHBu14IppEDiuRPxuHfuamfE%3d&risl=&pid=ImgRaw&r=0", price: 5200, carat: 2.5, rating: 4.8, certified: true, type: "sapphire" },
    { id: "2", name: "Ruby", image: "https://tse2.mm.bing.net/th/id/OIP.HmD0HeVZWQo1KoIAN3kjDgHaF-?rs=1&pid=ImgDetMain&o=7&rm=3", price: 3800, carat: 1.8, rating: 4.9, certified: true, type: "ruby" },
    { id: "3", name: "Cat's Eye", image: "https://thevimoksha.com/wp-content/uploads/2024/08/Cat_s-Eye-Gemstone_2.jpg", price: 2100, carat: 3.2, rating: 4.7, certified: true, type: "cats-eye" },
    { id: "4", name: "Emerald", image: "https://www.hirshlondon.com/media/wysiwyg/3reasons/emerald-largercopy.jpg", price: 4500, carat: 2.0, rating: 4.8, certified: false, type: "emerald" },
    { id: "5", name: "Star Sapphire", image: "https://rockseeker.com/wp-content/uploads/2024/03/star-sapphire.jpg", price: 6200, carat: 3.5, rating: 4.9, certified: true, type: "sapphire" },
    { id: "6", name: "Pink Ruby", image: "https://tse1.mm.bing.net/th/id/OIP.SvWPUYuFKDTf2w-mnBk72wHaG2?rs=1&pid=ImgDetMain&o=7&rm=3", price: 4100, carat: 2.2, rating: 4.7, certified: true, type: "ruby" },
    { id: "7", name: "Alexandrite", image: "https://th.bing.com/th/id/R.ad9b9e726e2ddd0866520951624b2a40?rik=0NeSxl48TduQZA&riu=http%3a%2f%2fdiamondrensu.com%2fcdn%2fshop%2farticles%2fc2a0b04860d31458c82408d04dc50065.jpg%3fv%3d1702852021&ehk=U2AFsIPDhk4T%2bymHgEFK7ID3PAzz8y5guj3P59G2XXM%3d&risl=&pid=ImgRaw&r=0", price: 7800, carat: 1.5, rating: 4.9, certified: true, type: "alexandrite" },
    { id: "8", name: "Yellow Sapphire", image: "https://imgcdn1.gempundit.com/media/catalog/category/Yellow_Sapphire.jpg", price: 3200, carat: 2.8, rating: 4.6, certified: false, type: "sapphire" },
    { id: "9", name: "Red Spinel", image: "https://constantinwild.com/wp-content/uploads/2020/11/01422-13-ct-Red-Spinel.jpg", price: 1500, carat: 1.2, rating: 4.5, certified: true, type: "spinel" },
    { id: "10", name: "Blue Topaz", image: "https://th.bing.com/th/id/R.147b8bd8eb5728340c691735e09a15a7?rik=7K6o6OCQ%2bzEqtg&riu=http%3a%2f%2fgandharagems.com%2fcdn%2fshop%2fproducts%2fDeep-Color-London-Blue-Topaz-Gemstone-1.jpg%3fv%3d1653311129&ehk=T9oxjmhHHcLo2I2qy8KQJwiAR6k8EpICKuubSsFVY8E%3d&risl=&pid=ImgRaw&r=0", price: 800, carat: 4.0, rating: 4.4, certified: false, type: "topaz" },
    { id: "11", name: "White Sapphire", image: "https://i.etsystatic.com/22614639/r/il/bdcd23/2850305527/il_fullxfull.2850305527_9s85.jpg", price: 2500, carat: 2.1, rating: 4.6, certified: true, type: "sapphire" },
    { id: "12", name: "Green Garnet", image: "https://th.bing.com/th/id/R.021fdfbca029db43b3b7837662d0056e?rik=NNGu6iJWszbLrw&pid=ImgRaw&r=0", price: 1200, carat: 1.9, rating: 4.5, certified: true, type: "garnet" },
    { id: "13", name: "Moonstone", image: "https://tse4.mm.bing.net/th/id/OIP.zOk95H21QdyjSVrJ2gGljwHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3", price: 450, carat: 5.2, rating: 4.3, certified: false, type: "moonstone" },
    { id: "14", name: "Purple Spinel", image: "https://a.1stdibscdn.com/191ct-fine-deep-purple-spinel-natural-oval-cut-8x7mm-loose-rare-gem-vs-for-sale/22569652/j_184763021676981150893/42_datamatics.jpg", price: 1800, carat: 1.6, rating: 4.6, certified: true, type: "spinel" },
    { id: "15", name: "Padparadscha", image: "https://th.bing.com/th/id/R.76e83e2e71e2b5276265358737ee336b?rik=VBBOL9OEcmur1Q&pid=ImgRaw&r=0", price: 9500, carat: 1.4, rating: 5.0, certified: true, type: "sapphire" },
    { id: "16", name: "Aquamarine", image: "https://th.bing.com/th/id/R.a62edd9af43655f7198347adff677968?rik=BFpAI2SXiUHEoA&pid=ImgRaw&r=0", price: 1100, carat: 2.5, rating: 4.5, certified: true, type: "aquamarine" },
  ];

  const filteredGemstones = gemstones.filter((gem) => {
    // Search Filter
    if (searchQuery && !gem.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Price Filter
    if (gem.price < priceRange[0] || gem.price > priceRange[1]) {
      return false;
    }

    // Type Filter
    if (selectedType !== "all" && gem.type !== selectedType) {
      return false;
    }

    // Carat Filter
    if (selectedCarat !== "any") {
      if (selectedCarat === "1-2" && (gem.carat < 1 || gem.carat > 2)) return false;
      if (selectedCarat === "2-3" && (gem.carat < 2 || gem.carat > 3)) return false;
      if (selectedCarat === "3+" && gem.carat < 3) return false;
    }

    // Certification Filter
    if (selectedCertification !== "all") {
      if (selectedCertification === "certified" && !gem.certified) return false;
      if (selectedCertification === "uncertified" && gem.certified) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Gemstone Shop</h1>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="sapphire">Sapphire</SelectItem>
                      <SelectItem value="ruby">Ruby</SelectItem>
                      <SelectItem value="emerald">Emerald</SelectItem>
                      <SelectItem value="cats-eye">Cat's Eye</SelectItem>
                      <SelectItem value="alexandrite">Alexandrite</SelectItem>
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
                  <Select value={selectedCarat} onValueChange={setSelectedCarat}>
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
                  <Select value={selectedCertification} onValueChange={setSelectedCertification}>
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

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setPriceRange([0, 10000]);
                    setSearchQuery("");
                    setSelectedType("all");
                    setSelectedCarat("any");
                    setSelectedCertification("all");
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{filteredGemstones.length} gemstones found</p>
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

            {filteredGemstones.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredGemstones.map((gem) => (
                  <GemCard key={gem.id} {...gem} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">No gemstones found matching your criteria.</p>
              </div>
            )}

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
