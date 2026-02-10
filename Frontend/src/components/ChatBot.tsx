import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

import { useNavigate } from 'react-router-dom';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    showShopButton?: boolean;
}

const GEM_KNOWLEDGE: Record<string, string> = {
    'blue sapphire': "Sri Lanka is world-renowned for 'Ceylon Blue' Sapphires. These gems represent royalty and wisdom. We have premium certified Sapphires starting from $5,200.",
    'ruby': "Our Rubies are ethically sourced and known for their vibrant brilliance. A 1.8 Carat Ruby is currently available for $3,800.",
    'alexandrite': "Alexandrite is extremely rare in Sri Lanka, known for its 'emerald by day, ruby by night' color-change effect. Our current stock is priced at $7,800.",
    'emerald': "While rare locally, our Emeralds represent lush growth and rebirth. High-clarity Emeralds start from $4,500.",
    'cat\'s eye': "Chrysoberyl Cat's Eye is a Sri Lankan specialty with a sharp light 'eye' across the center. Entry-level pieces start at $2,100.",
    'spinel': "Spinels come in many colors and are prized for their high refractive index. They are becoming very popular among collectors.",
    'topaz': "Our Blue and Yellow Topaz collection offers affordable brilliance, perfect for modern high-fashion jewelry.",
    'amethyst': "Sri Lankan Amethyst offers deep, regal purple hues. They are excellent for emotional clarity and spiritual growth.",
    'pearl': "Historically famous, our natural pearls have a unique luster. We source high-quality white and cream pearls.",
    'diamond': "While not mined locally, we offer ethically sourced, high-clarity Diamonds that meet the highest international standards."
};

const ChatBot = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Ayubowan! I'm your RoyalStone Assistant. I can help you with:\n\n• Gemstone Identification\n• Pricing & Marketplace\n• Gemstone Education\n• Order Support\n\nHow can I sparkle your day?",
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const quickActions = [
        { label: "Identify Gem", query: "how to identify" },
        { label: "Top Gems", query: "market list" },
        { label: "Sapphire Info", query: "blue sapphire" },
        { label: "Prices", query: "how much do gems cost" }
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const q = input.toLowerCase();
            const showShop = q.includes('marketplace') || q.includes('shop') || q.includes('buy') || q.includes('gems') || q.includes('price');

            const botResponse = getBotResponse(input);
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date(),
                showShopButton: showShop,
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const getBotResponse = (query: string): string => {
        const q = query.toLowerCase();

        // Match specific gemstone knowledge
        for (const [gem, info] of Object.entries(GEM_KNOWLEDGE)) {
            if (q.includes(gem)) {
                return info + " Would you like to see our selection in the shop?";
            }
        }

        if (q.includes('price') || q.includes('cost') || q.includes('how much')) {
            return "Gemstone prices vary greatly. Our current collection ranges from $2,100 for Cat's Eye to over $7,800 for rare Alexandrite. Each gem includes a GIA/NGJA certificate.";
        } else if (q.includes('marketplace') || q.includes('shop') || q.includes('buy') || q.includes('gems') || q.includes('list')) {
            return "Explore our high-end marketplace:\n\n• Blue Sapphire - $5,200\n• Ruby - $3,800\n• Alexandrite - $7,800\n• Emerald - $4,500\n• Cat's Eye - $2,100\n\nClick 'Visit Marketplace' below to see all 1,200+ gems!";
        } else if (q.includes('identify') || q.includes('check') || q.includes('ai') || q.includes('recognition')) {
            return "Our AI Recognition tool is state-of-the-art! It uses neural networks to identify gemstones with 100% accuracy once trained. You can upload any gem image for instant analysis.";
        } else if (q.includes('contact') || q.includes('support') || q.includes('help')) {
            return "I am trained to help with:\n1. Pricing & Stock info\n2. Gemstone properties\n3. Finding the AI Recognition tool\n4. Marketplace navigation\n\nNeed a human? Email us at experts@royalstone.lk";
        } else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
            return "Hello! I'm your expert guide to Sri Lankan gemstones. What can I help you find today?";
        }
        return "I'm not quite sure about that, but I can tell you all about Blue Sapphires, Rubies, our high-tech AI tool, or show you our latest prices. What would you prefer?";
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <Card className="mb-4 w-[350px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl border-primary/20 bg-background/80 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300 overflow-hidden">
                    <CardHeader className="p-4 bg-primary text-primary-foreground flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white/20 rounded-full">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-bold text-sm leading-none">Gem Assistant</p>
                                <p className="text-[10px] opacity-80 mt-1">Online | RoyalStone Lanka</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full p-4">
                            <div className="space-y-4">
                                {messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={cn(
                                            "flex gap-3 max-w-[85%]",
                                            m.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                                        )}
                                    >
                                        <Avatar className="h-9 w-9 border border-primary/20 bg-background shadow-sm">
                                            {m.sender === 'bot' ? (
                                                <div className="flex items-center justify-center w-full h-full bg-primary/10 text-primary">
                                                    <Sparkles className="h-5 w-5" />
                                                </div>
                                            ) : (
                                                <AvatarFallback className="bg-secondary text-secondary-foreground">
                                                    <User className="h-5 w-5" />
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div
                                            className={cn(
                                                "rounded-2xl p-3 text-sm shadow-sm",
                                                m.sender === 'user'
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted text-foreground rounded-tl-none border border-border"
                                            )}
                                        >
                                            <div className="whitespace-pre-wrap">{m.text}</div>
                                            {m.showShopButton && (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="mt-3 w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        navigate('/marketplace');
                                                    }}
                                                >
                                                    Visit Marketplace
                                                </Button>
                                            )}
                                            <p className="text-[9px] mt-1 opacity-50 text-right">
                                                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-3">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                            <Sparkles className="h-5 w-5" />
                                        </div>
                                        <div className="bg-muted text-foreground rounded-2xl rounded-tl-none p-3 border border-border shadow-sm">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!isTyping && messages[messages.length - 1].sender === 'bot' && (
                                    <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        {quickActions.map((action) => (
                                            <button
                                                key={action.label}
                                                onClick={() => {
                                                    setInput(action.query);
                                                    setTimeout(() => handleSend(), 50);
                                                }}
                                                className="text-[11px] px-3 py-1.5 rounded-full bg-background border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-3 border-t bg-muted/30 backdrop-blur-md">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex w-full gap-2"
                        >
                            <Input
                                placeholder="Ask about gemstones..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 bg-background border-primary/20 focus-visible:ring-primary"
                            />
                            <Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="shadow-lg transition-all active:scale-95">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}

            {/* Toggle Button */}
            <Button
                size="icon"
                className={cn(
                    "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95",
                    isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary hover:bg-primary/90"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </Button>
        </div>
    );
};

export default ChatBot;
