import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";

class AIModelManager {
    private static instance: AIModelManager;
    private net: mobilenet.MobileNet | null = null;
    private classifier: knnClassifier.KNNClassifier | null = null;
    private loadingPromise: Promise<{ net: mobilenet.MobileNet; classifier: knnClassifier.KNNClassifier } | null> | null = null;
    private isReady = false;

    private constructor() { }

    public static getInstance(): AIModelManager {
        if (!AIModelManager.instance) {
            AIModelManager.instance = new AIModelManager();
        }
        return AIModelManager.instance;
    }

    public async init(): Promise<{ net: mobilenet.MobileNet; classifier: knnClassifier.KNNClassifier } | null> {
        if (this.isReady && this.net && this.classifier) {
            return { net: this.net, classifier: this.classifier };
        }

        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = (async () => {
            try {
                console.log("⚡ AI Engine: Initializing high-speed neural backend...");
                
                // Initialize WebGL backend with CPU fallback
                try {
                    await tf.setBackend('webgl');
                    await tf.ready();
                    console.log("⚡ AI Engine: WebGL hardware acceleration active.");
                } catch (webglErr) {
                    console.warn("WebGL backend failed, falling back to CPU:", webglErr);
                    await tf.setBackend('cpu');
                    await tf.ready();
                }

                // Load lightweight MobileNet (version 1, alpha 0.25) for ultra-fast instant startup (< 1.5 MB)
                console.log("⚡ AI Engine: Loading MobileNet feature extractor...");
                this.net = await mobilenet.load({
                    version: 1,
                    alpha: 0.25
                });

                if (!this.classifier) {
                    this.classifier = knnClassifier.create();
                }

                this.isReady = true;
                console.log("✅ AI Engine: High-speed MobileNet & KNN Classifier ready.");
                return { net: this.net, classifier: this.classifier };
            } catch (error) {
                console.error("❌ AI Engine: Failed to initialize MobileNet", error);
                this.loadingPromise = null;
                this.isReady = false;
                return null;
            }
        })();

        return this.loadingPromise;
    }

    public getModel() {
        return { net: this.net, classifier: this.classifier, isReady: this.isReady };
    }

    public async waitForReady() {
        if (this.isReady && this.net && this.classifier) {
            return { net: this.net, classifier: this.classifier, isReady: true };
        }
        const res = await this.init();
        return { 
            net: res ? res.net : this.net, 
            classifier: res ? res.classifier : this.classifier, 
            isReady: this.isReady 
        };
    }
}

export const aiManager = AIModelManager.getInstance();
