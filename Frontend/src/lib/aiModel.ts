import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import "@tensorflow/tfjs-backend-webgl";

class AIModelManager {
    private static instance: AIModelManager;
    private net: mobilenet.MobileNet | null = null;
    private classifier: knnClassifier.KNNClassifier | null = null;
    private loadingPromise: Promise<void> | null = null;
    private isReady = false;

    private constructor() { }

    public static getInstance(): AIModelManager {
        if (!AIModelManager.instance) {
            AIModelManager.instance = new AIModelManager();
        }
        return AIModelManager.instance;
    }

    public async init() {
        if (this.loadingPromise) return this.loadingPromise;

        this.loadingPromise = (async () => {
            try {
                console.log("AI Manager: Initializing in background...");
                await tf.setBackend('webgl');
                await tf.ready();

                // Load MobileNet - Browser will cache this automatically after first load
                this.net = await mobilenet.load({
                    version: 1,
                    alpha: 1.0
                });

                this.classifier = knnClassifier.create();
                this.isReady = true;
                console.log("AI Manager: Ready.");
            } catch (error) {
                console.error("AI Manager: Failed to initialize", error);
                this.loadingPromise = null;
            }
        })();

        return this.loadingPromise;
    }

    public getModel() {
        return { net: this.net, classifier: this.classifier, isReady: this.isReady };
    }

    public async waitForReady() {
        if (this.isReady) return this.getModel();
        await this.init();
        return this.getModel();
    }
}

export const aiManager = AIModelManager.getInstance();
