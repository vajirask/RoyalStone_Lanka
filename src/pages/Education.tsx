import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Sparkles } from "lucide-react";
import gemsCollection from "@/assets/gems-collection.jpg";

const Education = () => {
  const gemTypes = [
    { name: "Sapphire", color: "Blue", description: "The king of gemstones, known for its royal blue color" },
    { name: "Ruby", color: "Red", description: "Precious corundum variety with vibrant red color" },
    { name: "Emerald", color: "Green", description: "Beryl variety prized for its rich green hue" },
    { name: "Cat's Eye", color: "Golden", description: "Chrysoberyl with unique chatoyancy effect" },
  ];

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
          <h1 className="mb-4 text-4xl font-bold text-foreground">Gemstone Education</h1>
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
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {gemTypes.map((gem) => (
                  <button
                    key={gem.name}
                    className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-muted"
                  >
                    <span className="font-medium text-foreground">{gem.name}</span>
                    <Badge variant="secondary">{gem.color}</Badge>
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
                <Card key={gem.name}>
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

                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Value Factors:</h4>
                      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        <li>Color intensity and saturation</li>
                        <li>Clarity and transparency</li>
                        <li>Carat weight and size</li>
                        <li>Cut quality and proportions</li>
                        <li>Origin and certification</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
