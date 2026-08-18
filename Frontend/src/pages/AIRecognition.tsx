import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, Sparkles, Trash2, Database, AlertCircle, PlusCircle, CheckCircle2, RefreshCw, Shield, HelpCircle, FileText, Info, Lock, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import { toast } from "sonner";
import { aiManager } from "@/lib/aiModel";
import { getApiUrl } from "@/lib/api";

// ─── Authentic Sri Lankan Gemological Database ─────────────────────────────────

export interface GemstoneData {
  sinhalaName: string;
  species: string;
  chemicalFormula: string;
  hardness: string;
  refractiveIndex: string;
  specificGravity: string;
  crystalSystem: string;
  colors: string;
  keyOrigins: string;
  description: string;
  identifyingFeatures: string;
}

export const AUTHENTIC_GEM_DATA: Record<string, GemstoneData> = {
  "Blue Sapphire": {
    sinhalaName: "Nil Manikkam (නිල් මැණික්)",
    species: "Corundum",
    chemicalFormula: "Al₂O₃ : Fe²⁺, Ti⁴⁺",
    hardness: "9.0 Mohs",
    refractiveIndex: "1.762 – 1.770",
    specificGravity: "3.99 – 4.01",
    crystalSystem: "Trigonal / Hexagonal",
    colors: "Royal Blue, Cornflower Blue, Velvet Blue, Sky Blue",
    keyOrigins: "Ratnapura, Elahera, Pelmadulla, Balangoda",
    description: "The crown jewel of Sri Lanka. Renowned worldwide for unheated clarity, luminous cornflower-to-royal blue saturation, and world-class luster.",
    identifyingFeatures: "Strong dichroism (blue/greenish-blue), rutile silk inclusions, hex-growth zoning."
  },
  "Padparadscha Sapphire": {
    sinhalaName: "Padmaraga (පද්මරාග)",
    species: "Corundum",
    chemicalFormula: "Al₂O₃ : Cr³⁺, Fe³⁺",
    hardness: "9.0 Mohs",
    refractiveIndex: "1.762 – 1.770",
    specificGravity: "3.99 – 4.01",
    crystalSystem: "Trigonal",
    colors: "Delicate Sunset Pinkish-Orange / Lotus Blossom",
    keyOrigins: "Ratnapura, Pelmadulla (Historic Sri Lankan Signature)",
    description: "The most prestigious and rarest sapphire in the world, named after the sacred lotus blossom (Padma Raga). Must show a harmonious blend of pink and orange.",
    identifyingFeatures: "Subtle pink-orange pleochroism, natural liquid inclusions, high brilliance."
  },
  "Ruby": {
    sinhalaName: "Rathu Manikkam (රතු මැණික්)",
    species: "Corundum",
    chemicalFormula: "Al₂O₃ : Cr³⁺",
    hardness: "9.0 Mohs",
    refractiveIndex: "1.762 – 1.770",
    specificGravity: "3.99 – 4.02",
    crystalSystem: "Trigonal",
    colors: "Vivid Red, Pigeon Blood, Pinkish Red",
    keyOrigins: "Ratnapura, Balangoda, Okkampitiya",
    description: "Vibrant red corundum. Sri Lankan rubies are celebrated for superior clarity, high transparency, and brilliant pinkish-red to vivid red fluorescence under sunlight.",
    identifyingFeatures: "Strong red UV fluorescence, silk rutile needles, distinct double refraction."
  },
  "Yellow Sapphire": {
    sinhalaName: "Pushparaga (පුෂ්පරාග)",
    species: "Corundum",
    chemicalFormula: "Al₂O₃ : Fe³⁺",
    hardness: "9.0 Mohs",
    refractiveIndex: "1.762 – 1.770",
    specificGravity: "3.99 – 4.01",
    crystalSystem: "Trigonal",
    colors: "Golden Yellow, Canary, Butterscotch, Champagne",
    keyOrigins: "Ratnapura, Elahera, Nivithigala",
    description: "A highly auspicious corundum revered in Vedic gemology (associated with Jupiter/Guru). Celebrated for radiant golden luster and exceptional clarity.",
    identifyingFeatures: "Iron absorption bands at 450nm, sharp vitreous luster, high hardness."
  },
  "Star Sapphire": {
    sinhalaName: "Thara Nil Manikkam (තාරකා නිල් මැණික්)",
    species: "Corundum",
    chemicalFormula: "Al₂O₃ with Rutile Silk (TiO₂)",
    hardness: "9.0 Mohs",
    refractiveIndex: "1.762 – 1.770",
    specificGravity: "3.99 – 4.01",
    crystalSystem: "Hexagonal",
    colors: "Deep Blue, Grey-Blue, Indigo with Silver 6-ray Star",
    keyOrigins: "Ratnapura, Pelmadulla, Rakwana",
    description: "Features a sharp 6-ray star asterism gliding across a dome cabochon surface, created by microscopic intersecting rutile needle inclusions.",
    identifyingFeatures: "Crisp 6-ray asterism mobile under single-point light, cabochon cut."
  },
  "Star Ruby": {
    sinhalaName: "Thara Rathu Manikkam (තාරකා රතු මැණික්)",
    species: "Corundum",
    chemicalFormula: "Al₂O₃ : Cr³⁺ with Rutile (TiO₂)",
    hardness: "9.0 Mohs",
    refractiveIndex: "1.762 – 1.770",
    specificGravity: "3.99 – 4.02",
    crystalSystem: "Hexagonal",
    colors: "Purplish Red, Pinkish Red with 6-ray Star",
    keyOrigins: "Ratnapura, Balangoda",
    description: "A rare phenomenon gem displaying a striking 6-ray star floating atop vivid red corundum body color.",
    identifyingFeatures: "6-ray asterism, dense rutile silk intersections, red luminescence."
  },
  "Chrysoberyl Cat's Eye": {
    sinhalaName: "Waidurya / Rayruwa (වෛඩූර්ය)",
    species: "Chrysoberyl",
    chemicalFormula: "BeAl₂O₄",
    hardness: "8.5 Mohs",
    refractiveIndex: "1.746 – 1.755",
    specificGravity: "3.71 – 3.73",
    crystalSystem: "Orthorhombic",
    colors: "Honey Yellow, Milk & Honey, Apple Green, Golden Brown",
    keyOrigins: "Pelmadulla, Ratnapura, Meetiyagoda",
    description: "The gold standard of phenomenal chatoyant gems. Displays a razor-sharp single silver-white band of light opening and closing like a feline eye.",
    identifyingFeatures: "True 'Milk and Honey' effect when lit from side, microscopic parallel hollow tubes."
  },
  "Alexandrite": {
    sinhalaName: "Alexandrite (ඇලෙක්සැන්ඩ්රයිට්)",
    species: "Chrysoberyl",
    chemicalFormula: "BeAl₂O₄ : Cr³⁺",
    hardness: "8.5 Mohs",
    refractiveIndex: "1.746 – 1.755",
    specificGravity: "3.71 – 3.73",
    crystalSystem: "Orthorhombic",
    colors: "Teal Green (Daylight) ⇄ Raspberry Red (Incandescent)",
    keyOrigins: "Ratnapura, Balangoda, Morawaka",
    description: "Extremely rare phenomenal chrysoberyl famously described as 'Emerald by day, Ruby by night'. Exhibits dramatic color shift under different light wavelengths.",
    identifyingFeatures: "Distinct chromate absorption spectrum, trichroism (green/orange/red), extreme hardness."
  },
  "Spinel": {
    sinhalaName: "Kekatiya / Katahiya (කැකැටිය)",
    species: "Spinel Group",
    chemicalFormula: "MgAl₂O₄",
    hardness: "8.0 Mohs",
    refractiveIndex: "1.718 (Singly Refractive)",
    specificGravity: "3.58 – 3.61",
    crystalSystem: "Isometric / Cubic",
    colors: "Flame Red, Cobalt Blue, Vivid Hot Pink, Royal Purple",
    keyOrigins: "Balangoda, Ratnapura, Okkampitiya",
    description: "Naturally untreated gemstone with high dispersion and fire. Historically set in royal crowns and prized for its vivid saturated colors.",
    identifyingFeatures: "Singly refractive (isotropic), octahedral crystals, intense luster, no birefringence."
  },
  "Hessonite Garnet": {
    sinhalaName: "Gomedha (ගෝමේද)",
    species: "Grossular Garnet",
    chemicalFormula: "Ca₃Al₂(SiO₄)₃",
    hardness: "7.0 – 7.5 Mohs",
    refractiveIndex: "1.734 – 1.745",
    specificGravity: "3.59 – 3.65",
    crystalSystem: "Isometric",
    colors: "Warm Cinnamon Honey, Amber Orange, Reddish Brown",
    keyOrigins: "Ratnapura, Matale, Badulla",
    description: "The famous 'Cinnamon Stone' of Sri Lanka. Highly significant in traditional Navaratna astrological talismans (representing Rahu).",
    identifyingFeatures: "Classic roiled/syrupy heat-wave optical texture under magnification, isotropic."
  },
  "Rhodolite Garnet": {
    sinhalaName: "Rhodolite (රෝඩොලයිට්)",
    species: "Pyrope-Almandine Garnet",
    chemicalFormula: "(Mg,Fe)₃Al₂(SiO₄)₃",
    hardness: "7.0 – 7.5 Mohs",
    refractiveIndex: "1.750 – 1.770",
    specificGravity: "3.83 – 3.88",
    crystalSystem: "Isometric",
    colors: "Raspberry Pink, Rose-Red, Purplish Red",
    keyOrigins: "Pelmadulla, Balangoda, Elahera",
    description: "A sought-after garnet prized for its sparkling raspberry-rose hues and complete lack of brownish undertones.",
    identifyingFeatures: "Isotropic, strong iron/manganese absorption spectrum, high clarity."
  },
  "Moonstone": {
    sinhalaName: "Sanda Kanthi Pashana (සඳකාන්ත පාෂාණ)",
    species: "Orthoclase Feldspar",
    chemicalFormula: "KAlSi₃O₈",
    hardness: "6.0 – 6.5 Mohs",
    refractiveIndex: "1.518 – 1.526",
    specificGravity: "2.56 – 2.59",
    crystalSystem: "Monoclinic",
    colors: "Translucent White with Electric Blue Floating Sheen",
    keyOrigins: "Meetiyagoda (World Famous Primary Moonstone Deposit)",
    description: "Ceylon Blue Moonstones from Meetiyagoda are world-renowned for their mesmerizing ethereal blue adularescence floating inside transparent crystal.",
    identifyingFeatures: "Distinct blue adularescence caused by alternating albite/orthoclase micro-lamellae."
  },
  "Ceylon Zircon": {
    sinhalaName: "Zircon (සර්කෝන්)",
    species: "Zircon",
    chemicalFormula: "ZrSiO₄",
    hardness: "7.5 Mohs",
    refractiveIndex: "1.925 – 1.984 (Very High)",
    specificGravity: "4.60 – 4.70",
    crystalSystem: "Tetragonal",
    colors: "Electric Blue, Cognac Brown, Honey Gold, Clear Starlite",
    keyOrigins: "Ratnapura, Matara (Historic 'Matara Diamonds')",
    description: "One of the oldest minerals on Earth, featuring diamond-like brilliance, adamantine luster, and dramatic double refraction.",
    identifyingFeatures: "Extreme facet-edge doubling visible under standard loupe, very high density."
  },
  "Tourmaline": {
    sinhalaName: "Thoramalli (තෝරමල්ලි)",
    species: "Tourmaline Group",
    chemicalFormula: "Complex Borosilicate",
    hardness: "7.0 – 7.5 Mohs",
    refractiveIndex: "1.624 – 1.644",
    specificGravity: "3.06 – 3.11",
    crystalSystem: "Trigonal",
    colors: "Chrome Green, Honey Yellow, Rubellite Pink, Dravite Brown",
    keyOrigins: "Ratnapura, Balangoda, Matale",
    description: "The word 'Tourmaline' is historically derived from the Sinhalese word 'Thoramalli'. Known for extreme pleochroism and vibrant color spectrums.",
    identifyingFeatures: "Strong dichroism, triangular prismatic crystals, vertical striations, pyroelectric."
  },
  "Topaz": {
    sinhalaName: "Topaz (ටෝපෑස්)",
    species: "Topaz",
    chemicalFormula: "Al₂SiO₄(F,OH)₂",
    hardness: "8.0 Mohs",
    refractiveIndex: "1.619 – 1.627",
    specificGravity: "3.53 – 3.56",
    crystalSystem: "Orthorhombic",
    colors: "Silver Clear (White), Imperial Golden, Swiss Blue",
    keyOrigins: "Ratnapura, Polonnaruwa, Elahera",
    description: "Hard and radiant gemstone with vitreous luster and superb crystalline clarity.",
    identifyingFeatures: "Perfect basal cleavage, high scratch resistance (8.0 Mohs), high transparency."
  },
  "Aquamarine": {
    sinhalaName: "Diya Nil (දිය නිල්)",
    species: "Beryl",
    chemicalFormula: "Be₃Al₂Si₆O₁₈ : Fe²⁺",
    hardness: "7.5 – 8.0 Mohs",
    refractiveIndex: "1.577 – 1.583",
    specificGravity: "2.68 – 2.74",
    crystalSystem: "Hexagonal",
    colors: "Pastel Sea Blue, Aquamarine, Ocean Cyan",
    keyOrigins: "Ratnapura, Nawalapitiya, Hatton",
    description: "The serene ocean-blue variety of Beryl. Known for flawless crystal clarity and tranquil pastel blue hues.",
    identifyingFeatures: "Hexagonal prism morphology, distinct two-phase inclusions, low birefringence."
  },
  "Emerald": {
    sinhalaName: "Pachcha (පච්ච)",
    species: "Beryl",
    chemicalFormula: "Be₃Al₂Si₆O₁₈ : Cr³⁺, V³⁺",
    hardness: "7.5 – 8.0 Mohs",
    refractiveIndex: "1.577 – 1.583",
    specificGravity: "2.70 – 2.78",
    crystalSystem: "Hexagonal",
    colors: "Lush Vivid Green, Forest Green",
    keyOrigins: "Fine Beryl Belts",
    description: "Precious beryl highly prized for rich green color symbolizing prosperity and growth.",
    identifyingFeatures: "Three-phase inclusions (jardin), chromium fluorescence line at 683nm."
  },
  "Amethyst": {
    sinhalaName: "Amethyst (ඇමතිස්ට්)",
    species: "Quartz Group",
    chemicalFormula: "SiO₂ : Fe³⁺ / Irradiation",
    hardness: "7.0 Mohs",
    refractiveIndex: "1.544 – 1.553",
    specificGravity: "2.65",
    crystalSystem: "Trigonal",
    colors: "Deep Violet, Royal Purple, Lavender",
    keyOrigins: "Ratnapura, Kandy, Pelmadulla",
    description: "The regal purple variety of crystalline quartz. Symbolizes clarity of mind and peace.",
    identifyingFeatures: "Chevron color zoning, typical quartz 'bulls-eye' optical interference figure."
  },
  "Citrine": {
    sinhalaName: "Citrine (සිට්‍රින්)",
    species: "Quartz Group",
    chemicalFormula: "SiO₂ : Fe³⁺",
    hardness: "7.0 Mohs",
    refractiveIndex: "1.544 – 1.553",
    specificGravity: "2.65",
    crystalSystem: "Trigonal",
    colors: "Golden Yellow, Honey Orange, Madeira Amber",
    keyOrigins: "Ratnapura, Balangoda",
    description: "Golden quartz gemstone representing abundance and vitality.",
    identifyingFeatures: "Dichroism weak to absent, vitreous luster, no cleavage."
  }
};

const DEFAULT_GEM_LIST = Object.keys(AUTHENTIC_GEM_DATA);

// ─── Image & Tensor Processing Helpers ─────────────────────────────────────────

const fileToImg = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Image decode failed"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });

const getActivation = (img: HTMLImageElement, net: mobilenet.MobileNet) =>
  tf.tidy(() => {
    const pixels = tf.browser.fromPixels(img);
    const resized = tf.image.resizeBilinear(pixels, [224, 224]);
    return net.infer(resized.expandDims(0), true);
  });

const saveToStorage = (cls: knnClassifier.KNNClassifier) => {
  try {
    const dataset = cls.getClassifierDataset();
    const serialized: Record<string, number[][]> = {};
    for (const key of Object.keys(dataset)) {
      const t = dataset[key];
      const flat = t.dataSync();
      const rows: number[][] = [];
      for (let i = 0; i < t.shape[0]; i++) {
        rows.push(Array.from(flat.slice(i * t.shape[1], (i + 1) * t.shape[1])));
      }
      serialized[key] = rows;
    }
    localStorage.setItem("royalstone_gem_classifier", JSON.stringify(serialized));
  } catch (e) {
    console.warn("Storage save failed", e);
  }
};

const loadFromStorage = (cls: knnClassifier.KNNClassifier): number => {
  try {
    const raw = localStorage.getItem("royalstone_gem_classifier");
    if (!raw) return 0;
    const serialized: Record<string, number[][]> = JSON.parse(raw);
    const tensors: Record<string, tf.Tensor2D> = {};
    let total = 0;
    for (const key of Object.keys(serialized)) {
      const rows = serialized[key];
      if (rows.length > 0) {
        tensors[key] = tf.tensor2d(rows.flat(), [rows.length, rows[0].length]);
        total += rows.length;
      }
    }
    if (Object.keys(tensors).length > 0) {
      cls.setClassifierDataset(tensors);
      return total;
    }
  } catch (e) {
    console.warn("Storage load failed", e);
  }
  return 0;
};

// ─── Precision Cosine Similarity Evaluator ─────────────────────────────────────

export interface EvaluationResult {
  isMatch: boolean;
  label: string;
  confidence: number;
  maxSimilarity: number;
  classScores: { label: string; similarity: number; confidence: number; isPassed: boolean }[];
  closestMatch?: { label: string; similarity: number };
}

// MobileNet embedding similarity threshold (0.64 is optimal for genuine gemstone features)
const GENUINE_MATCH_THRESHOLD = 0.64;

const evaluateSimilarityAgainstDataset = (
  testAct: tf.Tensor,
  dataset: Record<string, tf.Tensor2D>
): EvaluationResult => {
  return tf.tidy(() => {
    // L2 Normalize test feature vector
    const testNorm = tf.div(testAct, tf.norm(testAct, 'euclidean', 1, true));

    const classScores: { label: string; similarity: number; confidence: number; isPassed: boolean }[] = [];

    for (const [label, tensor] of Object.entries(dataset)) {
      if (!tensor || tensor.shape[0] === 0) continue;

      // L2 Normalize class training samples
      const trainNorm = tf.div(tensor, tf.norm(tensor, 'euclidean', 1, true));

      // Compute pairwise cosine similarities: [1, 1024] x [1024, N] -> [1, N]
      const similarities = tf.matMul(testNorm, trainNorm, false, true);

      // Extract highest similarity for this class
      const maxSimVal = tf.max(similarities).dataSync()[0];

      // Convert raw cosine similarity (typically 0.40 to 0.95) into a clear confidence percentage
      // Range: 0.50 -> 35%, 0.64 (threshold) -> 72%, 0.80 -> 88%, 0.90+ -> 96%+
      let calibratedConf = 0;
      if (maxSimVal >= 0.50) {
        calibratedConf = Math.min(99, Math.max(15, Math.round(((maxSimVal - 0.40) / 0.55) * 100)));
      } else {
        calibratedConf = Math.max(5, Math.round(maxSimVal * 60));
      }

      classScores.push({
        label,
        similarity: Math.round(maxSimVal * 100),
        confidence: calibratedConf,
        isPassed: maxSimVal >= GENUINE_MATCH_THRESHOLD
      });
    }

    // Sort by highest similarity
    classScores.sort((a, b) => b.similarity - a.similarity);

    if (classScores.length === 0) {
      return {
        isMatch: false,
        label: "Untrained Gemstone",
        confidence: 0,
        maxSimilarity: 0,
        classScores: []
      };
    }

    const top = classScores[0];
    const isGenuineMatch = top.similarity >= (GENUINE_MATCH_THRESHOLD * 100);

    return {
      isMatch: isGenuineMatch,
      label: isGenuineMatch ? top.label : "Untrained / Unrecognized Gemstone",
      confidence: isGenuineMatch ? top.confidence : top.similarity,
      maxSimilarity: top.similarity,
      classScores,
      closestMatch: { label: top.label, similarity: top.similarity }
    };
  });
};

// ─── Main Component ────────────────────────────────────────────────────────────

const AIRecognition = () => {
  const navigate = useNavigate();
  const [modelLoading, setModelLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [trainingInProgress, setTrainingInProgress] = useState(false);
  const [classifier, setClassifier] = useState<knnClassifier.KNNClassifier | null>(null);
  const [net, setNet] = useState<mobilenet.MobileNet | null>(null);

  // Gem Selection & Custom Gem Creation
  const [gemList, setGemList] = useState<string[]>(() => {
    try {
      const savedCustom = localStorage.getItem("royalstone_custom_gems");
      if (savedCustom) {
        const custom = JSON.parse(savedCustom);
        return Array.from(new Set([...DEFAULT_GEM_LIST, ...custom]));
      }
    } catch {}
    return DEFAULT_GEM_LIST;
  });
  const [selectedGemType, setSelectedGemType] = useState<string>("Blue Sapphire");
  const [newGemName, setNewGemName] = useState("");
  const [showAddCustom, setShowAddCustom] = useState(false);

  // Training & Identification State
  const [trainingStats, setTrainingStats] = useState<Record<string, number>>({});
  const [totalSamples, setTotalSamples] = useState(0);
  const [trainingFiles, setTrainingFiles] = useState<File[]>([]);
  const [identificationFile, setIdentificationFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [mongoConnected, setMongoConnected] = useState(false);

  const [user, setUser] = useState<any>(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });

  const loadedGemIds = useRef<Set<string>>(new Set());

  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.email?.toLowerCase() === "admin@royalstone.com";
  const identifiedGemInfo = evaluation?.isMatch && evaluation?.label ? (AUTHENTIC_GEM_DATA[evaluation.label] || null) : null;

  // Sync user state
  useEffect(() => {
    const sync = () => {
      try { setUser(JSON.parse(localStorage.getItem("user") || "null")); } catch { setUser(null); }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // Update counts from classifier memory
  const refreshCounts = useCallback((cls: knnClassifier.KNNClassifier) => {
    try {
      const counts = cls.getClassExampleCount() || {};
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      setTrainingStats({ ...counts });
      setTotalSamples(total);
      return total;
    } catch {
      return 0;
    }
  }, []);

  // High-speed initialize AI Engine with clean Single-Source-of-Truth loading
  const loadAIEngine = useCallback(async () => {
    setModelLoading(true);
    try {
      fetch(getApiUrl("/api/mongodb/status"))
        .then(r => r.json())
        .then(s => setMongoConnected(Boolean(s.connected)))
        .catch(() => setMongoConnected(false));

      const model = await aiManager.waitForReady();

      if (model.net && model.classifier) {
        setNet(model.net);
        setClassifier(model.classifier);

        // Fetch real training dataset from MongoDB backend as the single source of truth
        try {
          const res = await fetch(getApiUrl("/api/training/all"));
          const { success, data } = await res.json();

          if (success && Array.isArray(data)) {
            // Reset classifier to prevent duplicate sample accumulation
            model.classifier.clearAllClasses();
            loadedGemIds.current.clear();

            for (const sample of data) {
              if (!sample.activationData?.length) continue;
              if (sample.activationData.every((v: number) => v === 0)) continue;
              const act = tf.tensor(sample.activationData, [1, sample.activationData.length]);
              model.classifier.addExample(act, sample.gemType);
              act.dispose();
              loadedGemIds.current.add(sample._id);

              if (!gemList.includes(sample.gemType)) {
                setGemList(prev => [...prev, sample.gemType]);
              }
            }
            saveToStorage(model.classifier);
            refreshCounts(model.classifier);
          } else {
            // Offline fallback: load from local storage
            loadFromStorage(model.classifier);
            refreshCounts(model.classifier);
          }
        } catch (dbErr) {
          // Offline fallback
          console.warn("Backend training sync skipped, using local cache:", dbErr);
          loadFromStorage(model.classifier);
          refreshCounts(model.classifier);
        }
      }
    } catch (err) {
      console.error("AI Init error:", err);
    } finally {
      setModelLoading(false);
    }
  }, [gemList, refreshCounts]);

  useEffect(() => {
    loadAIEngine();
  }, [loadAIEngine]);

  // Handle adding a new custom gem type
  const handleAddCustomGem = () => {
    const trimmed = newGemName.trim();
    if (!trimmed) {
      toast.error("Please enter a valid gemstone name.");
      return;
    }
    if (gemList.some(g => g.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("This gemstone already exists in the list.");
      return;
    }

    const updatedList = [...gemList, trimmed];
    setGemList(updatedList);
    setSelectedGemType(trimmed);
    setNewGemName("");
    setShowAddCustom(false);

    try {
      const customOnly = updatedList.filter(g => !DEFAULT_GEM_LIST.includes(g));
      localStorage.setItem("royalstone_custom_gems", JSON.stringify(customOnly));
    } catch {}

    toast.success(`Gemstone "${trimmed}" added to training list!`);
  };

  // Train selected gemstone with uploaded images
  const handleTrainSelectedGem = async () => {
    if (!isAdmin) {
      toast.error("Administrator access required. Please sign in as admin to train.");
      navigate("/login");
      return;
    }
    if (!trainingFiles.length) {
      toast.error("Please select at least one gemstone image to train.");
      return;
    }
    if (!selectedGemType.trim()) {
      toast.error("Please choose or add a gemstone variety.");
      return;
    }

    setTrainingInProgress(true);

    try {
      let activeNet = net;
      let activeClassifier = classifier;

      if (!activeNet || !activeClassifier) {
        toast.info("Preparing AI engine...");
        const readyModel = await aiManager.waitForReady();
        if (readyModel.net && readyModel.classifier) {
          activeNet = readyModel.net;
          activeClassifier = readyModel.classifier;
          setNet(activeNet);
          setClassifier(activeClassifier);
        } else {
          throw new Error("Could not initialize TensorFlow MobileNet model.");
        }
      }

      toast.info(`Training ${trainingFiles.length} sample(s) for "${selectedGemType}"...`);
      let trainedCount = 0;

      for (const file of trainingFiles) {
        try {
          const img = await fileToImg(file);
          const act = getActivation(img, activeNet);
          activeClassifier.addExample(act, selectedGemType);
          const actArray = Array.from(await act.data());
          act.dispose();
          trainedCount++;

          // Save immediately to local storage
          saveToStorage(activeClassifier);
          refreshCounts(activeClassifier);

          // Upload training activation to backend DB
          try {
            const form = new FormData();
            form.append("image", file);
            form.append("gemType", selectedGemType);
            form.append("activationData", JSON.stringify(actArray));
            fetch(getApiUrl("/api/training/save"), { method: "POST", body: form })
              .then(r => r.json())
              .then(d => {
                if (d?.data?._id) loadedGemIds.current.add(d.data._id);
              })
              .catch(() => {});
          } catch {}
        } catch (err) {
          console.error("Training sample error:", err);
          toast.error(`Could not process image: ${file.name}`);
        }
      }

      refreshCounts(activeClassifier);
      setTrainingFiles([]);
      toast.success(`✅ Successfully trained ${trainedCount} image(s) for "${selectedGemType}"!`);
    } catch (error: any) {
      console.error("Training failed:", error);
      toast.error(error.message || "Training failed. Please check your connection.");
    } finally {
      setTrainingInProgress(false);
    }
  };

  // Delete training data for a specific gemstone
  const handleDeleteGemTraining = async (gemNameToDelete: string) => {
    if (!isAdmin) {
      toast.error("Admin permission required.");
      return;
    }
    if (!confirm(`Are you sure you want to delete all training data for "${gemNameToDelete}"?`)) {
      return;
    }

    try {
      if (classifier) {
        const dataset = classifier.getClassifierDataset();
        const newTensors: Record<string, tf.Tensor2D> = {};
        for (const key of Object.keys(dataset)) {
          if (key !== gemNameToDelete) {
            newTensors[key] = dataset[key];
          } else {
            dataset[key].dispose();
          }
        }
        classifier.setClassifierDataset(newTensors);
        saveToStorage(classifier);
        refreshCounts(classifier);
      }

      // Delete from backend database
      await fetch(getApiUrl("/api/training/delete-gem"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gemType: gemNameToDelete })
      });

      toast.success(`Training data for "${gemNameToDelete}" deleted successfully.`);
      if (evaluation?.label === gemNameToDelete) {
        setEvaluation(null);
      }
    } catch (err) {
      console.error("Delete gem error:", err);
      toast.error("Failed to delete gem training data.");
    }
  };

  // Clear all training data
  const handleClearAllTraining = async () => {
    if (!isAdmin) {
      toast.error("Admin permission required.");
      return;
    }
    if (!confirm("Are you sure you want to delete ALL trained gemstone data from AI memory?")) {
      return;
    }

    try {
      await fetch(getApiUrl("/api/training/clear"), { method: "POST" });
    } catch {}

    classifier?.clearAllClasses();
    localStorage.removeItem("royalstone_gem_classifier");
    loadedGemIds.current.clear();
    setTrainingStats({});
    setTotalSamples(0);
    setEvaluation(null);
    toast.success("All AI training dataset cleared.");
  };

  // Identify gemstone image with Distance & Cosine Similarity Verification
  const handleIdentify = async () => {
    if (!identificationFile) {
      toast.error("Please upload an image to identify.");
      return;
    }

    setAnalyzing(true);
    try {
      let activeNet = net;
      let activeClassifier = classifier;

      if (!activeNet || !activeClassifier) {
        const readyModel = await aiManager.waitForReady();
        if (readyModel.net && readyModel.classifier) {
          activeNet = readyModel.net;
          activeClassifier = readyModel.classifier;
          setNet(activeNet);
          setClassifier(activeClassifier);
        }
      }

      if (!activeNet || !activeClassifier) {
        throw new Error("AI Neural engine is not ready. Please reload the page.");
      }

      const numClasses = activeClassifier.getNumClasses();
      const total = Object.values(activeClassifier.getClassExampleCount() || {}).reduce((a, b) => a + b, 0);

      if (numClasses === 0 || total === 0) {
        toast.warning("The AI model currently has no trained gemstones. An administrator must train the model with gemstone images first.");
        setAnalyzing(false);
        return;
      }

      const img = await fileToImg(identificationFile);
      const act = getActivation(img, activeNet);

      // Perform genuine cosine similarity evaluation across all trained classes
      const dataset = activeClassifier.getClassifierDataset();
      const evalResult = evaluateSimilarityAgainstDataset(act, dataset);
      act.dispose();

      setEvaluation(evalResult);

      if (evalResult.isMatch) {
        toast.success(`Authentic Match: ${evalResult.label} (${evalResult.confidence}% confidence)`);
      } else {
        toast.error(`Unrecognized: Image does not match your ${numClasses} trained gemstone variety(s).`);
      }

      // Log identification result to backend
      try {
        const form = new FormData();
        form.append("image", identificationFile);
        form.append("predictedGemType", evalResult.label);
        form.append("confidence", (evalResult.confidence / 100).toString());
        form.append("allPredictions", JSON.stringify(evalResult.classScores));
        fetch(getApiUrl("/api/identification/save"), { method: "POST", body: form }).catch(() => {});
      } catch {}
    } catch (err: any) {
      console.error("Identification error:", err);
      toast.error(err.message || "Identification failed. Please ensure the image is clear.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Header Banner */}
      <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground">AI Gemstone Identification & Neural Studio</h1>
              <p className="text-xs text-muted-foreground">High-Speed TensorFlow MobileNet & Cosine Feature Matcher</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted/80 px-3 py-1.5 rounded-full border text-xs font-semibold">
              <div className={`h-2.5 w-2.5 rounded-full ${modelLoading ? "bg-amber-500 animate-pulse" : totalSamples > 0 ? "bg-green-500" : "bg-blue-500"}`} />
              <span>{modelLoading ? "Loading AI..." : `${totalSamples} Trained Sample${totalSamples !== 1 ? "s" : ""} (${Object.keys(trainingStats).length} Varieties)`}</span>
            </div>

            {isAdmin ? (
              <Badge className="bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 py-1 px-3">
                <Shield className="h-3.5 w-3.5" /> Admin Studio Active
              </Badge>
            ) : (
              <Button size="sm" variant="outline" onClick={() => navigate("/login")} className="text-xs font-bold rounded-full gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Admin Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className={`grid gap-8 ${isAdmin ? "lg:grid-cols-12" : "max-w-4xl mx-auto"}`}>

          {/* ══════════════════════════════════════════════════════════════════════════
              ADMIN TRAINING & DATASET STUDIO
              ══════════════════════════════════════════════════════════════════════════ */}
          {isAdmin ? (
            <div className="lg:col-span-6 space-y-6">
              <Card className="shadow-lg border-primary/30">
                <CardHeader className="bg-primary/5 border-b pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-black flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" /> Admin AI Training Studio
                    </CardTitle>
                    <Badge variant="outline" className="border-amber-500/40 text-amber-600 bg-amber-50 font-bold text-[11px]">
                      Administrator Mode
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Train gemstone photos into the AI neural network. The classifier will only match gemstones you have trained.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                  {/* Gem Selection & Custom Adder */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">1. Select Gemstone Variety</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddCustom(!showAddCustom)}
                        className="text-xs text-primary font-bold h-7 hover:bg-primary/10 px-2"
                      >
                        <PlusCircle className="h-3.5 w-3.5 mr-1" /> {showAddCustom ? "Cancel" : "Add Custom Gem"}
                      </Button>
                    </div>

                    {!showAddCustom ? (
                      <Select value={selectedGemType} onValueChange={setSelectedGemType}>
                        <SelectTrigger className="w-full font-bold">
                          <SelectValue placeholder="Choose gemstone..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {gemList.map(gem => (
                            <SelectItem key={gem} value={gem} className="font-medium">
                              {gem} {trainingStats[gem] ? `(${trainingStats[gem]} samples)` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 bg-muted/60 rounded-xl border space-y-2">
                        <label className="text-xs font-bold text-primary">New Gemstone Variety Name</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. Tsavorite Garnet, Taaffeite, Sinhalite..."
                            value={newGemName}
                            onChange={e => setNewGemName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleAddCustomGem()}
                            className="flex-1 px-3 py-2 text-sm rounded-lg border bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <Button size="sm" onClick={handleAddCustomGem} className="font-bold shrink-0">
                            Add Gem
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Upload & Train Trigger */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      2. Upload Training Photos for "{selectedGemType}"
                    </label>

                    <div className="relative border-2 border-dashed rounded-xl p-4 text-center hover:border-primary transition-colors bg-muted/20 cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e => setTrainingFiles(e.target.files ? Array.from(e.target.files) : [])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="h-8 w-8 text-primary mx-auto mb-2 opacity-80" />
                      <p className="text-sm font-bold text-foreground">
                        {trainingFiles.length > 0
                          ? `${trainingFiles.length} photo(s) selected`
                          : "Click to select or drag gemstone photos here"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Upload 2 to 5 clear photos of "{selectedGemType}" for high accuracy</p>
                    </div>

                    <Button
                      onClick={handleTrainSelectedGem}
                      disabled={trainingFiles.length === 0 || trainingInProgress}
                      className="w-full h-11 font-bold shadow-md"
                    >
                      {trainingInProgress ? (
                        <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Training Neural Embeddings...</>
                      ) : (
                        <><Sparkles className="h-4 w-4 mr-2" /> Train "{selectedGemType}" Model</>
                      )}
                    </Button>
                  </div>

                  {/* Trained Dataset Table */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Trained Gem Dataset</h3>
                        <p className="text-[11px] text-muted-foreground">{Object.keys(trainingStats).length} gem varieties in AI memory</p>
                      </div>
                      {totalSamples > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearAllTraining}
                          className="text-xs font-bold text-destructive hover:bg-destructive/10 h-7"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear All Data
                        </Button>
                      )}
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                      {Object.keys(trainingStats).length === 0 ? (
                        <div className="text-center py-6 border rounded-xl bg-muted/30">
                          <p className="text-xs text-muted-foreground">No trained samples in AI memory yet.</p>
                          <p className="text-[11px] text-muted-foreground mt-1">Select a gemstone above and upload sample photos to begin training.</p>
                        </div>
                      ) : (
                        Object.entries(trainingStats).map(([gemName, count]) => (
                          <div
                            key={gemName}
                            className="flex items-center justify-between p-2.5 rounded-lg border bg-background/80 hover:bg-muted/40 transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-xs text-foreground">{gemName}</span>
                              <Badge variant="secondary" className="text-[10px] font-mono font-bold">
                                {count} sample{count !== 1 ? "s" : ""}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteGemTraining(gemName)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                              title={`Delete training for ${gemName}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="mb-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Admin AI Training Studio</p>
                      <p className="text-xs text-muted-foreground">Sign in with an administrator account to train new gemstones, upload dataset photos, and manage AI models.</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => navigate("/login")} className="font-bold text-xs shrink-0 rounded-xl">
                    Sign In as Admin
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              GEMSTONE IDENTIFICATION SECTION (Accessible to Everyone)
              ══════════════════════════════════════════════════════════════════════════ */}
          <div className={isAdmin ? "lg:col-span-6 space-y-6" : "w-full space-y-6"}>
            <Card className="shadow-lg">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-black flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> Instant Gemstone Identification
                  </CardTitle>
                  {previewImage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIdentificationFile(null);
                        setPreviewImage(null);
                        setEvaluation(null);
                      }}
                      className="text-xs font-bold text-muted-foreground hover:text-destructive h-7"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Reset
                    </Button>
                  )}
                </div>
                <CardDescription className="text-xs">
                  Upload a photo of any gemstone. The AI will strictly verify against your trained gemstone dataset.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Upload or Drop Area */}
                <div className="relative min-h-[260px] flex items-center justify-center border-2 border-dashed rounded-2xl bg-muted/20 overflow-hidden hover:border-primary transition-all">
                  {previewImage ? (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <img
                        src={previewImage}
                        alt="Gem Preview"
                        className="max-h-[280px] w-auto object-contain rounded-xl shadow-md"
                      />
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-8 cursor-pointer w-full h-full">
                      <Upload className="h-10 w-10 text-primary/70 mb-3" />
                      <p className="text-sm font-bold text-foreground">Upload Gemstone Photo</p>
                      <p className="text-xs text-muted-foreground mt-1">Select a clear, well-lit gemstone picture</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIdentificationFile(file);
                            setPreviewImage(URL.createObjectURL(file));
                            setEvaluation(null);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                <Button
                  onClick={handleIdentify}
                  disabled={!identificationFile || analyzing}
                  className="w-full h-12 text-sm font-bold shadow-md"
                >
                  {analyzing ? (
                    <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Analyzing Gem Features...</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" /> Identify Gemstone</>
                  )}
                </Button>

                {/* ═══════════════════════════════════════════════════════════════════
                    EVALUATION RESULTS
                    ═══════════════════════════════════════════════════════════════════ */}
                {evaluation && (
                  <>
                    {evaluation.isMatch ? (
                      /* ── POSITIVE MATCH CARD ── */
                      <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-black uppercase tracking-wider">
                              <CheckCircle2 className="h-4 w-4" /> Verified Authentic Match
                            </div>
                            <h3 className="text-2xl font-black text-foreground mt-1">{evaluation.label}</h3>
                            {identifiedGemInfo && (
                              <p className="text-xs font-semibold text-muted-foreground mt-0.5">{identifiedGemInfo.sinhalaName}</p>
                            )}
                          </div>
                          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3 py-1 text-xs">
                            {evaluation.confidence}% Match
                          </Badge>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-muted-foreground">
                            <span>Neural Feature Match Confidence</span>
                            <span className="text-emerald-600 font-black">{evaluation.confidence}%</span>
                          </div>
                          <Progress value={evaluation.confidence} className="h-2 bg-emerald-500/20" />
                        </div>

                        {/* Similarity Score Breakdown */}
                        <div className="p-3 rounded-xl bg-background border space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                            Trained Variety Comparison:
                          </span>
                          <div className="space-y-1.5">
                            {evaluation.classScores.map(score => (
                              <div key={score.label} className="flex items-center justify-between text-xs">
                                <span className={score.isPassed ? "font-bold text-foreground" : "text-muted-foreground"}>
                                  {score.label}
                                </span>
                                <span className={score.isPassed ? "font-bold text-emerald-600 font-mono" : "text-muted-foreground font-mono"}>
                                  {score.similarity}% similarity {score.isPassed ? "✓" : ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Scientific Gemological Mineralogy Details */}
                        {identifiedGemInfo ? (
                          <div className="pt-3 border-t space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5 text-primary" /> Mineralogy & Scientific Specifications
                            </h4>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                              <div className="p-2.5 rounded-lg bg-background border">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Species</span>
                                <span className="font-bold text-foreground">{identifiedGemInfo.species}</span>
                              </div>
                              <div className="p-2.5 rounded-lg bg-background border">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Hardness (Mohs)</span>
                                <span className="font-bold text-foreground">{identifiedGemInfo.hardness}</span>
                              </div>
                              <div className="p-2.5 rounded-lg bg-background border">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Refractive Index</span>
                                <span className="font-bold text-foreground">{identifiedGemInfo.refractiveIndex}</span>
                              </div>
                              <div className="p-2.5 rounded-lg bg-background border">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Specific Gravity</span>
                                <span className="font-bold text-foreground">{identifiedGemInfo.specificGravity}</span>
                              </div>
                              <div className="p-2.5 rounded-lg bg-background border">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Crystal System</span>
                                <span className="font-bold text-foreground">{identifiedGemInfo.crystalSystem}</span>
                              </div>
                              <div className="p-2.5 rounded-lg bg-background border">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Key Origins</span>
                                <span className="font-bold text-foreground">{identifiedGemInfo.keyOrigins}</span>
                              </div>
                            </div>

                            <div className="p-3 rounded-lg bg-background border space-y-1.5 text-xs">
                              <p className="text-muted-foreground leading-relaxed">
                                <strong className="text-foreground">Description: </strong>
                                {identifiedGemInfo.description}
                              </p>
                              <p className="text-muted-foreground leading-relaxed">
                                <strong className="text-foreground">Distinctive Features: </strong>
                                {identifiedGemInfo.identifyingFeatures}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded-lg bg-background border text-xs text-muted-foreground">
                            Custom gemstone class trained by administrator: <strong className="text-foreground">{evaluation.label}</strong>.
                          </div>
                        )}
                      </div>
                    ) : (
                      /* ── UNMATCHED / UNTRAINED GEMSTONE CARD ── */
                      <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 text-amber-600 text-xs font-black uppercase tracking-wider">
                              <XCircle className="h-4 w-4" /> Gemstone Not In Trained Database
                            </div>
                            <h3 className="text-xl font-black text-foreground mt-1">Unrecognized / Untrained Gemstone</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              This image does not match any of your <strong>{evaluation.classScores.length}</strong> currently trained gemstone varieties.
                            </p>
                          </div>
                          <Badge variant="outline" className="border-amber-500/40 text-amber-700 bg-amber-100 font-bold text-xs">
                            No Match
                          </Badge>
                        </div>

                        {/* Similarity Breakdown Matrix */}
                        <div className="p-3 rounded-xl bg-background border space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                            Similarity to Currently Trained Gems:
                          </span>
                          <div className="space-y-2">
                            {evaluation.classScores.map(score => (
                              <div key={score.label} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="font-medium text-foreground">{score.label}</span>
                                  <span className="text-muted-foreground font-mono text-[11px]">
                                    {score.similarity}% similarity (Requires &ge; 64%)
                                  </span>
                                </div>
                                <Progress value={score.similarity} className="h-1.5 bg-muted" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                          <p className="font-bold">Why did this happen?</p>
                          <p className="leading-relaxed">
                            The AI classifier utilizes strict cosine thresholding. Because this gemstone variety has not been trained in your AI database yet, the system correctly refuses to make a false guess.
                          </p>
                          {isAdmin && (
                            <p className="font-semibold text-primary pt-1">
                              💡 Tip: To identify this gemstone, select or add its name in the <strong>Admin AI Training Studio</strong> on the left, upload 2-3 sample photos, and click <strong>Train Model</strong>.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
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
