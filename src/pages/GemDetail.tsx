import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, MessageCircle, ShoppingCart, Award } from "lucide-react";
import { useParams } from "react-router-dom";
import heroImage from "@/assets/hero-sapphire.jpg";

const GemDetail = () => {
  const { id } = useParams();

  // Mock data - in a real app, this would come from an API
  const gemstone = {
    id,
    name: "Blue Sapphire",
    image: heroImage,
    price: 5200,
    carat: 2.5,
    color: "Deep Blue",
    clarity: "VS",
    cut: "Oval",
    origin: "Ratnapura, Sri Lanka",
    certification: "GIA Certified",
    rating: 4.8,
    reviews: 23,
    certified: true,
    seller: {
      name: "Gems Lanka Pvt Ltd",
      rating: 4.9,
      verified: true,
    },
    description:
      "Exceptional quality blue sapphire from the gem-rich region of Ratnapura. This stunning stone exhibits a deep, vivid blue color with excellent clarity and brilliance. Perfect for engagement rings or fine jewelry collection.",
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
              <Button size="lg" className="flex-1">
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
