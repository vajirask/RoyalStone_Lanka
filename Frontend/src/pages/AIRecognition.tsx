import { useState, useEffect, useRef } from "react";
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

const API_BASE_URL = "http://localhost:5000";

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

  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.email === 'admin@royalstone.com';
  const showTraining = isAdmin;
  const showIdentification = true;

  const recalculateOne = async (sample: any, targetNet: mobilenet.MobileNet) => {
    let timeoutId: any;
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `${API_BASE_URL}/uploads/${sample.imagePath}`;

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

      fetch(`${API_BASE_URL}/api/training/save-activation`, {
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
      const res = await fetch(`${API_BASE_URL}/api/training/all`);
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
    let isMounted = true;

    const initializeSystem = async () => {
      try {
        const statusRes = await fetch(`${API_BASE_URL}/api/mongodb/status`);
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

        const res = await fetch(`${API_BASE_URL}/api/training/save`, { method: 'POST', body: formData });
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
      await fetch(`${API_BASE_URL}/api/training/clear`, { method: 'POST' });
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
      setPreviewImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleIdentify = async () => {
    if (!identificationFile || !net || !classifier) return;

    const currentTotal = loadedGemIds.current.size;
    if (currentTotal === 0) {
      toast.error("AI Brain is empty. Training first...");
      await syncAIWithDatabase(classifier, net, false);
      return;
    }

    setAnalyzing(true);
    try {
      const img = new Image();
      img.src = URL.createObjectURL(identificationFile);
      await new Promise(r => img.onload = r);

      // 1. General Reality Check: Is this even an object or a diagram?
      const generalCheck = await net.classify(img);
      const isNonGem = generalCheck.some(pred => {
        const label = pred.className.toLowerCase();
        return label.includes('envelope') ||
          label.includes('web site') ||
          label.includes('diagram') ||
          label.includes('crossword') ||
          label.includes('paper') ||
          label.includes('screen') ||
          label.includes('monitor');
      });

      if (isNonGem) {
        toast.error("Image looks like a diagram or non-gem object. Please upload a real gem photo.");
        setAnalyzing(false);
        setResult(null);
        return;
      }

      // 2. Perform Gem Identification
      const activation = tf.tidy(() => {
        const tfImg = tf.browser.fromPixels(img);
        const resized = tf.image.resizeBilinear(tfImg, [224, 224]);
        return net.infer(resized.expandDims(0), true);
      });

      const k = 1; // Always use best-match (K=1) for maximum accuracy with small specialist sets
      const prediction = await classifier.predictClass(activation, k);
      activation.dispose();

      const confs = Object.entries(prediction.confidences)
        .sort((a, b) => b[1] - a[1])
        .filter(c => c[1] > 0);

      if (confs.length > 0) {
        const topLabel = confs[0][0];
        const topConf = confs[0][1] * 100;

        setResult({ label: topLabel, confidence: topConf, allPredictions: confs as any });
        toast.success(`Identified as ${topLabel}`);
      } else {
        toast.warning("Not recognized as a Gemstone.");
        setResult(null);
      }
    } catch (err) {
      toast.error("Identification failed.");
    } finally {
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
              <CardHeader><CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" />Identification</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="relative min-h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/50 hover:border-primary transition-colors">
                  {previewImage ? <img src={previewImage} className="max-h-[300px] rounded-md" /> : <div className="text-center"><Camera className="mx-auto h-12 w-12 text-muted-foreground" /><p className="text-sm mt-2">Upload Gem Image</p></div>}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleIdentifyFileSelect} />
                </div>
                <Button onClick={handleIdentify} disabled={!identificationFile || analyzing} className="w-full" size="lg">
                  {analyzing ? <Sparkles className="animate-spin h-5 w-5" /> : "Identify Gem"}
                </Button>
                {result && !analyzing && (
                  <div className="p-6 bg-primary/10 rounded-lg text-center">
                    <h3 className="text-2xl font-bold text-primary">{result.label}</h3>
                    <p className="text-sm font-medium mt-1">{result.confidence.toFixed(1)}% Confidence</p>
                    <Progress value={result.confidence} className="mt-4 h-2" />
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
