import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Sparkles } from "lucide-react";
import gemsCollection from "@/assets/gems-collection.jpg";

const Education = () => {
  const gemTypes = [
    { name: "Sapphire", color: "Blue", description: "The king of gemstones, known for its royal blue color. Sapphires come in all colors except red." },
    { name: "Ruby", color: "Red", description: "Precious corundum variety with vibrant red color, one of the most valuable gemstones." },
    { name: "Emerald", color: "Green", description: "Beryl variety prized for its rich green hue, symbolizing rebirth and love." },
    { name: "Cat's Eye", color: "Golden", description: "Chrysoberyl exhibiting a unique chatoyancy effect resembling a cat's eye." },
    { name: "Alexandrite", color: "Color Change", description: "A rare chrysoberyl variety that changes color from green in daylight to red in incandescent light." },
    { name: "Spinel", color: "Various", description: "A durable and brilliant gemstone often confused with ruby. Comes in red, pink, blue, and purple." },
    { name: "Topaz", color: "Blue/Yellow", description: "A popular gemstone available in many colors, with Blue Topaz being a favorite for jewelry." },
    { name: "Moonstone", color: "White/Blue", description: "Known for its adularescence, a ghostly sheen that moves across the stone." },
    { name: "Garnet", color: "Red/Green", description: "A group of silicate minerals. While often red, rare green Tsavorite garnets are highly prized." },
    { name: "Aquamarine", color: "Light Blue", description: "A blue-green variety of beryl, named after the color of seawater." },
    { name: "Tourmaline", color: "Multi-color", description: "Available in almost every color of the rainbow. Sri Lankan pink and green varieties are world-famous." },
    { name: "Zircon", color: "Various", description: "The oldest mineral on Earth. Sri Lankan Zircons, especially the blue and 'Starlight' varieties, are highly brilliant." },
    { name: "Amethyst", color: "Purple", description: "The most precious variety of quartz, ranging from deep violet to pale lavender." },
    { name: "Citrine", color: "Yellow/Orange", description: "A vibrant golden quartz stone associated with success and prosperity." },
    { name: "Iolite", color: "Violet-Blue", description: "Also known as 'Water Sapphire' for its intense blue-violet color and strong pleochroism." },
    { name: "Peridot", color: "Olive Green", description: "A beautiful olive-green gemstone that forms deep within the earth's mantle." },
    { name: "Morganite", color: "Pink/Peach", description: "The pink to orange-pink variety of beryl, known for its soft, feminine hues." },
    { name: "Chrysoberyl", color: "Honey/Green", description: "A very hard and durable stone. The yellow-green variety is prized for its high brilliance." },
    { name: "Hessonite", color: "Cinnamon", description: "A variety of garnet known for its characteristic 'honey and oil' internal appearance." },
    { name: "Rose Quartz", color: "Soft Pink", description: "The stone of universal love, known for its soft translucent pink color." }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Book className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground">Gem Guide</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Learn everything about Sri Lankan gemstones from identification to valuation
          </p>
        </div>

        {/* Featured Image */}
        <div className="mb-12 overflow-hidden rounded-2xl">
          <img
            src={gemsCollection}
            alt="Gemstone Collection"
            className="h-[400px] w-full object-cover"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-24 h-fit max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories ({gemTypes.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {gemTypes.map((gem) => (
                  <button
                    key={gem.name}
                    onClick={() => scrollToSection(gem.name.toLowerCase().replace(/\s+/g, '-'))}
                    className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-muted active:scale-[0.98]"
                  >
                    <span className="font-medium text-foreground">{gem.name}</span>
                    <Badge variant="secondary" className="text-[10px]">{gem.color}</Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">Introduction to Sri Lankan Gemstones</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none space-y-4 text-muted-foreground">
                <p>
                  Sri Lanka, historically known as "Ratna-Dweepa" (Island of Gems), has been a source of
                  precious gemstones for over 2,000 years. The country is renowned worldwide for producing
                  some of the finest quality gemstones, particularly sapphires.
                </p>
                <p>
                  The gem-bearing gravels of Sri Lanka, known as "Illam," are found in various parts of the
                  island, with Ratnapura being the most famous gem mining area. These alluvial deposits
                  contain a remarkable variety of precious and semi-precious stones.
                </p>
              </CardContent>
            </Card>

            {/* Gem Type Cards */}
            <div className="space-y-6">
              {gemTypes.map((gem) => (
                <div key={gem.name} id={gem.name.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-24">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{gem.name}</CardTitle>
                        <Badge className="bg-primary">{gem.color}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{gem.description}</p>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Key Characteristics:</h4>
                        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                          <li>Chemical composition and crystal structure</li>
                          <li>Color variations and grading</li>
                          <li>Clarity characteristics and inclusions</li>
                          <li>Cut styles and proportions</li>
                          <li>Treatment methods and detection</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Identification Tips:</h4>
                        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                          <li>Visual inspection techniques</li>
                          <li>Testing for hardness and specific gravity</li>
                          <li>Examining under different light sources</li>
                          <li>Using gemological instruments</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
