import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface GemCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  carat: number;
  rating: number;
  certified: boolean;
}

const GemCard = ({ id, name, image, price, carat, rating, certified }: GemCardProps) => {
  return (
    <Link to={`/gemstone/${id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {certified && (
            <Badge className="absolute right-2 top-2 bg-gradient-to-r from-gold to-gold-light text-gold-foreground shadow-lg shadow-gold/40 animate-pulse">
              <Shield className="mr-1 h-3 w-3" />
              Certified
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">{name}</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{carat} Carat</span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span className="font-medium">{rating}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border p-4 bg-muted/30">
          <div className="flex w-full items-center justify-between">
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">${price.toLocaleString()}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default GemCard;
