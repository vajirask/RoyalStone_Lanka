import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, MessageCircle, ShoppingCart, Award } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const GemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  /* Shared Gemstones Data (Normally this would comprise a single source of truth or API) */
  const gemstones = [
    { id: "1", name: "Blue Sapphire", image: "https://th.bing.com/th/id/R.65571639bbd9b63c8b692060f531e58e?rik=URq0dZiihWg6wA&riu=http%3a%2f%2fwww.lotusgemology.com%2fimages%2flibrary%2farticles%2fquality%2flotus-color-types%2findigo-sapphire.jpg&ehk=LSg35L3DjpU7%2fF7S7EAqHBu14IppEDiuRPxuHfuamfE%3d&risl=&pid=ImgRaw&r=0", price: 5200, carat: 2.5, rating: 4.8, certified: true, type: "sapphire", color: "Deep Blue", clarity: "VS", cut: "Oval", origin: "Ratnapura, Sri Lanka" },
    { id: "2", name: "Ruby", image: "https://tse2.mm.bing.net/th/id/OIP.HmD0HeVZWQo1KoIAN3kjDgHaF-?rs=1&pid=ImgDetMain&o=7&rm=3", price: 3800, carat: 1.8, rating: 4.9, certified: true, type: "ruby", color: "Pigeon Blood Red", clarity: "VVS", cut: "Cushion", origin: "Mogok, Myanmar" },
    { id: "3", name: "Cat's Eye", image: "https://thevimoksha.com/wp-content/uploads/2024/08/Cat_s-Eye-Gemstone_2.jpg", price: 2100, carat: 3.2, rating: 4.7, certified: true, type: "cats-eye", color: "Honey Yellow", clarity: "SI", cut: "Cabochon", origin: "Ratnapura, Sri Lanka" },
    { id: "4", name: "Emerald", image: "https://www.hirshlondon.com/media/wysiwyg/3reasons/emerald-largercopy.jpg", price: 4500, carat: 2.0, rating: 4.8, certified: false, type: "emerald", color: "Vivid Green", clarity: "VS", cut: "Emerald", origin: "Colombia" },
    { id: "5", name: "Star Sapphire", image: "https://rockseeker.com/wp-content/uploads/2024/03/star-sapphire.jpg", price: 6200, carat: 3.5, rating: 4.9, certified: true, type: "sapphire", color: "Cornflower Blue", clarity: "VS", cut: "Cabochon", origin: "Ratnapura, Sri Lanka" },
    { id: "6", name: "Pink Ruby", image: "https://tse1.mm.bing.net/th/id/OIP.SvWPUYuFKDTf2w-mnBk72wHaG2?rs=1&pid=ImgDetMain&o=7&rm=3", price: 4100, carat: 2.2, rating: 4.7, certified: true, type: "ruby", color: "Vivid Pink", clarity: "VVS", cut: "Oval", origin: "Mozambique" },
    { id: "7", name: "Alexandrite", image: "https://th.bing.com/th/id/R.ad9b9e726e2ddd0866520951624b2a40?rik=0NeSxl48TduQZA&riu=http%3a%2f%2fdiamondrensu.com%2fcdn%2fshop%2farticles%2fc2a0b04860d31458c82408d04dc50065.jpg%3fv%3d1702852021&ehk=U2AFsIPDhk4T%2bymHgEFK7ID3PAzz8y5guj3P59G2XXM%3d&risl=&pid=ImgRaw&r=0", price: 7800, carat: 1.5, rating: 4.9, certified: true, type: "alexandrite", color: "Color Change (Green to Red)", clarity: "IF", cut: "Cushion", origin: "Ural Mountains" },
    { id: "8", name: "Yellow Sapphire", image: "https://imgcdn1.gempundit.com/media/catalog/category/Yellow_Sapphire.jpg", price: 3200, carat: 2.8, rating: 4.6, certified: false, type: "sapphire", color: "Golden Yellow", clarity: "VS", cut: "Radiant", origin: "Sri Lanka" },
    { id: "9", name: "Red Spinel", image: "https://constantinwild.com/wp-content/uploads/2020/11/01422-13-ct-Red-Spinel.jpg", price: 1500, carat: 1.2, rating: 4.5, certified: true, type: "spinel", color: "Vivid Red", clarity: "VS", cut: "Round", origin: "Tanzania" },
    { id: "10", name: "Blue Topaz", image: "https://th.bing.com/th/id/R.147b8bd8eb5728340c691735e09a15a7?rik=7K6o6OCQ%2bzEqtg&riu=http%3a%2f%2fgandharagems.com%2fcdn%2fshop%2fproducts%2fDeep-Color-London-Blue-Topaz-Gemstone-1.jpg%3fv%3d1653311129&ehk=T9oxjmhHHcLo2I2qy8KQJwiAR6k8EpICKuubSsFVY8E%3d&risl=&pid=ImgRaw&r=0", price: 800, carat: 4.0, rating: 4.4, certified: false, type: "topaz", color: "Swiss Blue", clarity: "VVS", cut: "Pear", origin: "Brazil" },
    { id: "11", name: "White Sapphire", image: "https://i.etsystatic.com/22614639/r/il/bdcd23/2850305527/il_fullxfull.2850305527_9s85.jpg", price: 2500, carat: 2.1, rating: 4.6, certified: true, type: "sapphire", color: "Colorless", clarity: "IF", cut: "Princess", origin: "Sri Lanka" },
    { id: "12", name: "Green Garnet", image: "https://th.bing.com/th/id/R.021fdfbca029db43b3b7837662d0056e?rik=NNGu6iJWszbLrw&pid=ImgRaw&r=0", price: 1200, carat: 1.9, rating: 4.5, certified: true, type: "garnet", color: "Tsavorite Green", clarity: "VS", cut: "Cushion", origin: "Kenya" },
    { id: "13", name: "Moonstone", image: "https://tse4.mm.bing.net/th/id/OIP.zOk95H21QdyjSVrJ2gGljwHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3", price: 450, carat: 5.2, rating: 4.3, certified: false, type: "moonstone", color: "Blue Sheen", clarity: "Translucent", cut: "Cabochon", origin: "Sri Lanka" },
    { id: "14", name: "Purple Spinel", image: "https://a.1stdibscdn.com/191ct-fine-deep-purple-spinel-natural-oval-cut-8x7mm-loose-rare-gem-vs-for-sale/22569652/j_184763021676981150893/42_datamatics.jpg", price: 1800, carat: 1.6, rating: 4.6, certified: true, type: "spinel", color: "Lavender Purple", clarity: "VS", cut: "Oval", origin: "Vietnam" },
    { id: "15", name: "Padparadscha", image: "https://th.bing.com/th/id/R.76e83e2e71e2b5276265358737ee336b?rik=VBBOL9OEcmur1Q&pid=ImgRaw&r=0", price: 9500, carat: 1.4, rating: 5.0, certified: true, type: "sapphire", color: "Pink-Orange", clarity: "VVS", cut: "Oval", origin: "Sri Lanka" },
    { id: "16", name: "Aquamarine", image: "https://th.bing.com/th/id/R.a62edd9af43655f7198347adff677968?rik=BFpAI2SXiUHEoA&pid=ImgRaw&r=0", price: 1100, carat: 2.5, rating: 4.5, certified: true, type: "aquamarine", color: "Sea Blue", clarity: "VVS", cut: "Emerald", origin: "Madagascar" },
  ];

  const foundGem = gemstones.find((g) => g.id === id);

  if (!foundGem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Gemstone Not Found</h1>
          <Button onClick={() => navigate("/marketplace")}>Back to Shop</Button>
        </div>
      </div>
    )
  }

  const gemstone = {
    ...foundGem,
    certification: foundGem.certified ? "GIA Certified" : "Not Certified",
    reviews: Math.floor(Math.random() * 50) + 10, // Randomized review count
    seller: {
      name: "Gems Lanka Pvt Ltd",
      rating: 4.9,
      verified: true,
    },
    description: `Exceptional quality ${foundGem.name} from the gem-rich region. This stunning stone exhibits a ${foundGem.color} color with excellent clarity and brilliance. Perfect for engagement rings or fine jewelry collection.`
  };

  const handleBuyNow = () => {
    addToCart({
      id: gemstone.id,
      name: gemstone.name,
      price: gemstone.price,
      image: gemstone.image,
      carat: gemstone.carat,
      quantity: 1,
    });
    toast.success(`${gemstone.name} added to cart`);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-background">
              <img
                src={gemstone.image}
                alt={gemstone.name}
                className="h-full w-full object-cover"
              />
              {gemstone.certified && (
                <Badge className="absolute right-4 top-4 bg-gold text-gold-foreground">
                  <Shield className="mr-1 h-4 w-4" />
                  {gemstone.certification}
                </Badge>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-foreground">{gemstone.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="mr-1 h-5 w-5 fill-gold text-gold" />
                  <span className="font-medium">{gemstone.rating}</span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    ({gemstone.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-4xl font-bold text-primary">
              ${gemstone.price.toLocaleString()}
            </div>

            <Card>
              <CardContent className="grid grid-cols-2 gap-4 p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Carat Weight</p>
                  <p className="font-semibold text-foreground">{gemstone.carat} Carat</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Color</p>
                  <p className="font-semibold text-foreground">{gemstone.color}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clarity</p>
                  <p className="font-semibold text-foreground">{gemstone.clarity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cut</p>
                  <p className="font-semibold text-foreground">{gemstone.cut}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-semibold text-foreground">{gemstone.origin}</p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="mb-2 font-semibold text-foreground">Description</h3>
              <p className="text-muted-foreground">{gemstone.description}</p>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{gemstone.seller.name}</p>
                    {gemstone.seller.verified && (
                      <Award className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="mr-1 h-4 w-4 fill-gold text-gold" />
                    <span>{gemstone.seller.rating} seller rating</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button size="lg" className="flex-1" onClick={handleBuyNow}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                <MessageCircle className="mr-2 h-5 w-5" />
                Message Seller
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GemDetail;

