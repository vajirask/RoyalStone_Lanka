import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Sparkles, Camera } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AIRecognition = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setResult({
        type: "Blue Sapphire",
        confidence: 94,
        properties: [
          { label: "Color", value: "Deep Blue" },
          { label: "Estimated Carat", value: "2.3-2.6" },
          { label: "Clarity", value: "VS-VVS" },
          { label: "Probable Origin", value: "Sri Lanka" },
        ],
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground">AI Gemstone Recognition</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Upload a photo of your gemstone and let our AI identify it instantly
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Gemstone Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center transition-colors hover:border-primary">
                  <Camera className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-sm font-medium text-foreground">
                    Drag and drop your image here
                  </p>
                  <p className="mb-4 text-xs text-muted-foreground">
                    or click to browse files
                  </p>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Analyze Gemstone
                    </>
                  )}
                </Button>

                <div className="rounded-lg bg-primary/5 p-4 text-sm text-muted-foreground">
                  <p className="mb-2 font-semibold text-foreground">Tips for best results:</p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Use good lighting</li>
                    <li>Clean the gemstone first</li>
                    <li>Capture from multiple angles</li>
                    <li>Avoid reflections</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                {!result && !analyzing && (
                  <div className="flex min-h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
                    <Sparkles className="mb-4 h-12 w-12 opacity-20" />
                    <p>Upload an image to see AI analysis results</p>
                  </div>
                )}

                {analyzing && (
                  <div className="flex min-h-[300px] flex-col items-center justify-center space-y-4">
                    <Sparkles className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Analyzing gemstone properties...</p>
                  </div>
                )}

                {result && (
                  <div className="space-y-6">
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-foreground">{result.type}</h3>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Confidence</p>
                          <p className="text-2xl font-bold text-primary">{result.confidence}%</p>
                        </div>
                      </div>
                      <Progress value={result.confidence} className="h-2" />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Key Properties</h4>
                      {result.properties.map((prop: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg bg-muted p-3"
                        >
                          <span className="text-sm font-medium text-foreground">{prop.label}</span>
                          <span className="text-sm text-muted-foreground">{prop.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg bg-gold/10 p-4">
                      <p className="text-sm text-foreground">
                        <strong>Note:</strong> This is an AI-powered estimation. For accurate
                        certification, please consult with a certified gemologist.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecognition;
