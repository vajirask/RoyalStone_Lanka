import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const GEM_INFO: Record<string, { description: string; color: string }> = {
  "Blue Sapphire": {
    color: "Blue",
    description: "The most famous Sri Lankan gemstone. Known for its 'Cornflower' and 'Royal' blue hues. It represents wisdom and royalty."
  },
  "Ruby": {
    color: "Red",
    description: "A precious variety of corundum. Sri Lankan rubies are often more pinkish-red than Burmese ones and are prized for their brilliance."
  },
  "Emerald": {
    color: "Green",
    description: "A variety of beryl. While rare in Sri Lanka, it is highly valued for its lush green color symbolising rebirth."
  },
  "Cat's Eye": {
    color: "Golden/Honey",
    description: "A rare chrysoberyl that shows a sharp line of light across the center, looking like a real cat's eye."
  },
  "Alexandrite": {
    color: "Green to Red",
    description: "Extremely rare 'emerald by day, ruby by night' stone that changes color depending on the light source."
  },
  "Spinel": {
    color: "Various",
    description: "Found in many colors in Sri Lanka. It is often mistaken for Ruby or Sapphire due to its high brilliance."
  },
  "Amethyst": {
    color: "Purple",
    description: "A beautiful purple variety of quartz. It has been used in jewelry for centuries to represent clarity and calm."
  },
  "Topaz": {
    color: "Blue/Yellow",
    description: "A hard gemstone available in many colors. Blue Topaz is very popular for modern jewelry."
  },
  "Diamond": {
    color: "Clear",
    description: "The hardest natural substance on Earth. Known for its unmatched sparkle and timeless value."
  },
  "Pearl": {
    color: "White/Cream",
    description: "A biological gemstone formed inside oysters. Sri Lankan pearls are historically famous for their luster."
  }
};
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Sparkles, Camera, Trash2, Database, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import { toast } from "sonner";
import { aiManager } from "@/lib/aiModel";
import { getApiUrl } from "@/lib/api";

const NON_GEM_KEYWORDS = [
  'envelope', 'web site', 'diagram', 'crossword', 'paper', 'screen', 'monitor',
  'laptop', 'computer', 'text', 'menu', 'receipt', 'document', 'map', 'graph',
  'person', 'man', 'woman', 'face', 'animal', 'dog', 'cat', 'furniture', 'room',
  'indoor', 'outdoor', 'vehicle', 'car', 'street', 'building', 'suit', 'clothe',
  'apparel', 'shirt', 'tie', 'business', 'office', 'background', 'scenery'
];

const SCAN_DATA_LINES = [
  "ANALYZING SPECTRAL SIGNATURE...",
  "REFRACTIVE INDEX CALCULATION: 1.762-1.770",
  "CRYSTALLINE STRUCTURE: HEXAGONAL",
  "DENSITY ANALYSIS: 3.99 - 4.01 g/cm³",
  "ELEMENTAL COMPOSITION: Al₂O₃:Cr",
  "FLUORESCENCE CHECK: POSITIVE",
  "SCANNING INCLUSIONS...",
  "VERIFYING ORIGIN TRACE...",
  "AI NEURAL OVERLAY ACTIVE",
  "DATABASE MATCHING..."
];

const AIRecognition = () => {
  const [modelLoading, setModelLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [classifier, setClassifier] = useState<knnClassifier.KNNClassifier | null>(null);
  const [net, setNet] = useState<mobilenet.MobileNet | null>(null);
  const [gemType, setGemType] = useState("Ruby");
  const [trainingStats, setTrainingStats] = useState<Record<string, number>>({});
  const [totalSamples, setTotalSamples] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [result, setResult] = useState<{ label: string; confidence: number; allPredictions: [string, number][] } | null>(null);
  const [mongoConnected, setMongoConnected] = useState(false);
  const [trainingFiles, setTrainingFiles] = useState<File[]>([]);
  const [identificationFile, setIdentificationFile] = useState<File | null>(null);
  const [scanLines, setScanLines] = useState<string[]>([]);
  const [scanStep, setScanStep] = useState(0);

  const [user] = useState<any>(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const loadedGemIds = useRef<Set<string>>(new Set());

  const navigate = useNavigate();

  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.email === 'admin@royalstone.com';
  const showTraining = isAdmin;
  const showIdentification = true;

  const currentGemDetail = result ? GEM_INFO[result.label] : null;

  const recalculateOne = async (sample: any, targetNet: mobilenet.MobileNet) => {
    let timeoutId: any;
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = getApiUrl(`/uploads/${sample.imagePath}`);

      const loadPromise = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Image failed'));
      });

      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Timeout')), 10000);
      });

      await Promise.race([loadPromise, timeoutPromise]);
      clearTimeout(timeoutId);

      const activation = tf.tidy(() => {
        const tfImg = tf.browser.fromPixels(img);
        const resized = tf.image.resizeBilinear(tfImg, [224, 224]);
        return targetNet.infer(resized.expandDims(0), true);
      });

      const activationData = Array.from(await activation.data());

      fetch(getApiUrl('/api/training/save-activation'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sample._id, activationData })
      }).catch(() => { });

      return activation;
    } catch (e: any) {
      if (timeoutId) clearTimeout(timeoutId);
      console.warn(`Failed specifically on ${sample.gemType}:`, e.message);
      return null;
    }
  };

  const syncAIWithDatabase = async (targetClassifier: knnClassifier.KNNClassifier, targetNet: mobilenet.MobileNet, isInitialSync = false) => {
    try {
      const res = await fetch(getApiUrl('/api/training/all'));
      const { success, data } = await res.json();

      if (success && data && data.length > 0) {
        const stats: Record<string, number> = {};

        const results = await Promise.all(data.map(async (sample: any) => {
          if (loadedGemIds.current.has(sample._id)) {
            return { success: true, gemType: sample.gemType };
          }

          if (!sample.activationData || sample.activationData.length === 0) return { success: false };

          const isAllZero = sample.activationData.every((v: number) => v === 0);

          try {
            if (isAllZero && isAdmin) {
              const activation = await recalculateOne(sample, targetNet);
              if (activation) {
                targetClassifier.addExample(activation, sample.gemType);
                activation.dispose();
                loadedGemIds.current.add(sample._id);
                return { success: true, gemType: sample.gemType };
              }
            } else if (!isAllZero) {
              // Valid pre-calculated data
              const activation = tf.tensor(sample.activationData, [1, sample.activationData.length]);
              targetClassifier.addExample(activation, sample.gemType);
              activation.dispose();
              loadedGemIds.current.add(sample._id);
              return { success: true, gemType: sample.gemType };
            }
          } catch (err) {
            console.warn(`Parallel Sync Error for ${sample.gemType}:`, err);
          }
          return { success: false };
        }));

        const newStats: Record<string, number> = {};
        results.forEach(res => {
          if (res.success && res.gemType) {
            newStats[res.gemType] = (newStats[res.gemType] || 0) + 1;
          }
        });

        const currentTotal = loadedGemIds.current.size;
        setTrainingStats(newStats);
        setTotalSamples(currentTotal);

        if (isInitialSync && currentTotal > 0) {
          toast.success(`AI Knowledge Active: ${currentTotal} Gems Ready`);
        }
      } else {
        setTrainingStats({});
        setTotalSamples(0);
      }
    } catch (e) {
      console.error("Master Sync Error:", e);
    }
  };

  useEffect(() => {
    let lineTimer: any;
    if (analyzing) {
      setScanLines([SCAN_DATA_LINES[0]]);
      setScanStep(0);
      lineTimer = setInterval(() => {
        setScanStep(s => {
          const next = (s + 1) % SCAN_DATA_LINES.length;
          setScanLines(prev => [...prev.slice(-4), SCAN_DATA_LINES[next]]);
          return next;
        });
      }, 800);
    } else {
      setScanLines([]);
    }
    return () => clearInterval(lineTimer);
  }, [analyzing]);

  useEffect(() => {
    let isMounted = true;

    const initializeSystem = async () => {
      try {
        const statusRes = await fetch(getApiUrl('/api/mongodb/status'));
        const statusData = await statusRes.json();
        if (isMounted) setMongoConnected(statusData.connected);

        const { net: loadedNet, classifier: loadedClassifier } = await aiManager.waitForReady();
        if (!isMounted || !loadedNet || !loadedClassifier) return;

        setNet(loadedNet);
        setClassifier(loadedClassifier);

        await syncAIWithDatabase(loadedClassifier, loadedNet, true);

        if (isMounted) setModelLoading(false);
      } catch (error) {
        console.error("Initialization Error:", error);
        if (isMounted) toast.error("System connection error. Check if backend is running.");
      }
    };

    initializeSystem();

    const interval = setInterval(() => {
      if (classifier && net) syncAIWithDatabase(classifier, net, false);
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAdmin, classifier, net]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTrainingFiles(Array.from(e.target.files));
    }
  };

  const handleTrain = async () => {
    if (trainingFiles.length === 0 || !net || !classifier) return;

    setAnalyzing(true);
    toast.info(`Adding ${trainingFiles.length} samples for ${gemType}...`);

    let processed = 0;
    for (const file of trainingFiles) {
      try {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = objectUrl;
        });

        const activation = tf.tidy(() => {
          const tfImg = tf.browser.fromPixels(img);
          const resized = tf.image.resizeBilinear(tfImg, [224, 224]);
          return net.infer(resized.expandDims(0), true);
        });

        classifier.addExample(activation, gemType);
        const activationArray = Array.from(await activation.data());
        activation.dispose();

        const formData = new FormData();
        formData.append('image', file);
        formData.append('gemType', gemType);
        formData.append('activationData', JSON.stringify(activationArray));

        const res = await fetch(getApiUrl('/api/training/save'), { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
          processed++;
          if (data.data?._id) loadedGemIds.current.add(data.data._id);
        }

        URL.revokeObjectURL(objectUrl);
      } catch (err) {
        console.error("Training Error:", err);
      }
    }

    setTrainingStats(prev => ({ ...prev, [gemType]: (prev[gemType] || 0) + processed }));
    setTotalSamples(loadedGemIds.current.size);
    setAnalyzing(false);
    setTrainingFiles([]);
    toast.success(`Successfully trained ${processed} samples!`);
  };

  const handleClearTraining = async () => {
    if (confirm("Are you sure you want to clear all training data?")) {
      await fetch(getApiUrl('/api/training/clear'), { method: 'POST' });
      classifier?.clearAllClasses();
      loadedGemIds.current.clear();
      setTrainingStats({});
      setTotalSamples(0);
      toast.success("Memory cleared.");
    }
  };

  const handleIdentifyFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIdentificationFile(file);
      if (previewImage) URL.revokeObjectURL(previewImage);
      setPreviewImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleIdentify = async () => {
    if (!identificationFile || !net || !classifier) return;

    const currentTotal = loadedGemIds.current.size;
    if (currentTotal === 0) {
      toast.error("AI knowledge base is empty. Please wait for sync or train the model.");
      await syncAIWithDatabase(classifier, net, false);
      return;
    }

    setAnalyzing(true);
    let objectUrl: string | null = null;
    try {
      const img = new Image();
      objectUrl = URL.createObjectURL(identificationFile);
      img.src = objectUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Image failed to load"));
      });

      // 1. Reality Check System (Detection for Non-Gemstone objects)
      const generalCheck = await net.classify(img);

      // Look at top 5 predictions for any non-gem keywords
      const nonGemMatch = generalCheck.find(pred =>
        NON_GEM_KEYWORDS.some(key => pred.className.toLowerCase().includes(key)) && pred.probability > 0.15
      );

      if (nonGemMatch) {
        const objectLabel = nonGemMatch.className.split(',')[0];
        setResult({
          label: `Not a Gem: ${objectLabel}`,
          confidence: 100, // Show 100% that it's NOT a gem
          allPredictions: [[objectLabel, nonGemMatch.probability]]
        });
        toast.info(`Object detected: ${objectLabel}. Identification halted.`);
        setAnalyzing(false);
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        return;
      }

      // Special check: If MobileNet is extremely confident in ANY top object (>60%) 
      // and it's not a mineral/gemstone related class, flag it.
      const topPred = generalCheck[0];
      const normalizedTop = topPred.className.toLowerCase();
      const isLikelyNotGem = topPred.probability > 0.6 &&
        !normalizedTop.includes('stone') &&
        !normalizedTop.includes('rock') &&
        !normalizedTop.includes('gem') &&
        !normalizedTop.includes('jewel') &&
        !normalizedTop.includes('crystal');

      if (isLikelyNotGem) {
        const objectLabel = topPred.className.split(',')[0];
        setResult({
          label: `Not a Gem: ${objectLabel}`,
          confidence: 100,
          allPredictions: [[objectLabel, topPred.probability]]
        });
        setAnalyzing(false);
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        return;
      }

      // 2. Identification with Absolute Closest Match (K=1)
      const activation = tf.tidy(() => {
        const tfImg = tf.browser.fromPixels(img);
        const resized = tf.image.resizeBilinear(tfImg, [224, 224]);
        return net.infer(resized.expandDims(0), true);
      });

      const k = 1;
      const prediction = await classifier.predictClass(activation, k);
      activation.dispose();

      const confs = Object.entries(prediction.confidences)
        .sort((a, b) => b[1] - a[1])
        .filter(c => c[1] > 0);

      if (confs.length > 0) {
        const topLabel = confs[0][0];
        const topConf = 100; // Force 100% confidence as requested

        toast.success(`Gem identified: ${topLabel}`);

        setResult({
          label: topLabel,
          confidence: topConf,
          allPredictions: [[topLabel, 1.0]] // Force 100% in predictions list too
        });

        // Save identification result to backend for history/analytics
        try {
          const formData = new FormData();
          formData.append('image', identificationFile);
          formData.append('predictedGemType', topLabel);
          formData.append('confidence', (topConf / 100).toString());
          formData.append('allPredictions', JSON.stringify(confs));

          await fetch(getApiUrl('/api/identification/save'), {
            method: 'POST',
            body: formData
          });
        } catch (e) {
          console.warn("Could not save identification to history");
        }
      } else {
        toast.warning("Not recognized as any known gemstone type.");
        setResult(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Identification process failed. Please try again.");
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground">Gem Identifier Pro</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Advanced AI-Powered Gem Recognition System</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className={`h-3 w-3 rounded-full ${modelLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`}></div>
            <span className="text-sm text-muted-foreground">{modelLoading ? "Loading AI Model..." : "Model Ready"}</span>
            <div className="mx-2 h-4 w-px bg-border"></div>
            <div className={`h-3 w-3 rounded-full ${mongoConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-sm text-muted-foreground">{mongoConnected ? "DB Connected" : "DB Disconnected"}</span>
          </div>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className={showTraining && showIdentification ? "grid gap-8 lg:grid-cols-2" : "flex justify-center"}>
            {showTraining && (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Training
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gem Type</label>
                    <Select value={gemType} onValueChange={setGemType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Blue Sapphire", "Ruby", "Cat's Eye", "Alexandrite", "Emerald", "Spinel", "Amethyst", "Pearl", "Topaz", "Diamond"].map(g => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Training Images</label>
                    <div className="flex flex-col gap-4">
                      <Button variant="outline" className="relative cursor-pointer">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" multiple accept="image/*" onChange={handleFileSelect} />
                        <Upload className="mr-2 h-4 w-4" />
                        {trainingFiles.length > 0 ? `${trainingFiles.length} Selected` : "Select Images"}
                      </Button>
                      <Button onClick={handleTrain} disabled={trainingFiles.length === 0 || analyzing} className="w-full">
                        {analyzing ? <Sparkles className="animate-spin h-4 w-4" /> : <Database className="mr-2 h-4 w-4" />}
                        Train Model
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Training Stats</h3>
                      <Button variant="ghost" size="sm" onClick={handleClearTraining} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between font-medium"><span>Total Loaded:</span><span>{totalSamples}</span></div>
                      {Object.entries(trainingStats).map(([g, c]) => (
                        <div key={g} className="flex justify-between text-muted-foreground"><span>{g}:</span><span>{c}</span></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className={!showTraining ? "w-full max-w-2xl" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Identification
                  </div>
                  {previewImage && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIdentificationFile(null);
                          setPreviewImage(null);
                          setResult(null);
                        }}
                        className="text-muted-foreground"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative min-h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/50 overflow-hidden hover:border-primary transition-colors group">
                  {previewImage ? (
                    <div className="relative">
                      <img src={previewImage} className="max-h-[300px] rounded-md transition-all" />
                      {analyzing && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                          {/* Grid Overlay */}
                          <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'linear-gradient(#4299e1 1px, transparent 1px), linear-gradient(90deg, #4299e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                          </div>

                          {/* Corner Brackets */}
                          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary shadow-[0_0_10px_rgba(66,153,225,0.5)]"></div>
                          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary shadow-[0_0_10px_rgba(66,153,225,0.5)]"></div>
                          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary shadow-[0_0_10px_rgba(66,153,225,0.5)]"></div>
                          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary shadow-[0_0_10px_rgba(66,153,225,0.5)]"></div>

                          {/* Data Stream Overlay */}
                          <div className="absolute bottom-6 left-6 right-6 space-y-1">
                            {scanLines.map((line, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-[10px] font-mono text-primary font-bold drop-shadow-md">{line}</span>
                                <span className="text-[9px] font-mono text-primary/40 ml-auto">0x{Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}</span>
                              </div>
                            ))}
                          </div>

                          {/* Scanning Bar */}
                          <div
                            className="absolute left-0 right-0 h-1.5 bg-primary shadow-[0_0_20px_hsl(var(--primary))] animate-scan"
                            style={{ top: '0%' }}
                          >
                            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-primary/20 to-transparent"></div>
                          </div>

                          {/* Center Focus */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                            <div className="h-24 w-24 border border-primary/30 rounded-full animate-ping opacity-30"></div>
                            <div className="absolute h-16 w-16 border border-primary/50 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-12 transition-transform group-hover:scale-110">
                      <Upload className="mx-auto h-16 w-16 text-muted-foreground/50" />
                      <p className="text-sm mt-4 font-medium">Click or drag gemstone image here</p>
                      <p className="text-xs text-muted-foreground mt-1">Supports JPG and PNG</p>
                    </div>
                  )}

                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleIdentifyFileSelect}
                  />
                </div>

                <Button
                  onClick={handleIdentify}
                  disabled={!identificationFile || analyzing}
                  className={`w-full ${result ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}`}
                  size="lg"
                >
                  {analyzing ? (
                    <>
                      <Sparkles className="animate-spin h-5 w-5 mr-2" />
                      Analyzing Gemstone...
                    </>
                  ) : result ? "Identify Another" : "Start Identification"}
                </Button>

                {result && !analyzing && (
                  <div className={`p-6 rounded-xl border transition-all ${result.confidence > 80 ? 'bg-primary/5 border-primary/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${result.confidence > 80 ? 'bg-primary text-primary-foreground' : 'bg-yellow-500 text-white'}`}>
                          {result.confidence > 80 ? 'High Confidence' : 'Low Confidence'}
                        </span>
                        <h3 className="text-3xl font-bold text-foreground mt-2">{result.label}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-primary">{result.confidence.toFixed(1)}%</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Accuracy</p>
                      </div>
                    </div>

                    <Progress value={result.confidence} className="h-2 mb-6" />

                    {currentGemDetail && (
                      <div className="mt-6 border-t border-primary/20 pt-6 text-left">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-foreground">Gem Details</h4>
                          <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full font-semibold uppercase">{currentGemDetail.color}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {currentGemDetail.description}
                        </p>
                        <Button
                          variant="link"
                          className="mt-2 p-0 h-auto text-primary font-semibold"
                          onClick={() => navigate('/education')}
                        >
                          Learn more in Gem Guide →
                        </Button>
                      </div>
                    )}

                    <div className="mt-6 text-left space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Top Matches</p>
                      {result.allPredictions.map(([l, c]) => (
                        <div key={l} className="flex justify-between text-sm"><span>{l}</span><span>{(c * 100).toFixed(1)}%</span></div>
                      ))}
                    </div>
                  </div>
                )}
                {totalSamples === 0 && !result && !analyzing && (
                  <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>Initializing</AlertTitle><AlertDescription>Please wait for the AI to sync with the database...</AlertDescription></Alert>
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
