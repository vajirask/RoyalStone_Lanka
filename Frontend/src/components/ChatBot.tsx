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

const ChatBot = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Ayubowan! Welcome to RoyalStone Lanka. I'm your Gem Assistant. How can I help you discover the perfect gemstone today?",
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

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
        if (q.includes('price') || q.includes('cost') || q.includes('how much')) {
            return "Gemstone prices in our marketplace start from around $2,100 (Cat's Eye) to over $7,800 (Alexandrite). Each gem is priced based on its carat, clarity, and certification status. Would you like me to show you our top picks?";
        } else if (q.includes('marketplace') || q.includes('shop') || q.includes('buy') || q.includes('gems') || q.includes('list')) {
            return "Our marketplace features authentic Sri Lankan gemstones. Our current bestsellers include:\n\n• Blue Sapphire (2.5 Carat) - $5,200\n• Ruby (1.8 Carat) - $3,800\n• Alexandrite (1.5 Carat) - $7,800\n• Emerald (2.0 Carat) - $4,500\n\nAll our premium gems come with authenticity certificates. Would you like to go to the shop page?";
        } else if (q.includes('identify') || q.includes('check') || q.includes('ai')) {
            return "We have an advanced AI Recognition tool! You can upload a photo of your gemstone, and our system will identify its variety and properties. You can find it in the 'AI Recognition' section.";
        } else if (q.includes('sapphire')) {
            return "Blue Sapphires are the pride of Sri Lanka (Ceylon). We currently have a beautiful 2.5 Carat Blue Sapphire for $5,200 and a premium Star Sapphire for $6,200 in the marketplace.";
        } else if (q.includes('ruby')) {
            return "Our Ruby collection includes a stunning 1.8 Carat Ruby ($3,800) and a rare 2.2 Carat Pink Ruby ($4,100). Both are certified and ethically sourced.";
        } else if (q.includes('contact') || q.includes('support')) {
            return "You can reach our gem experts at support@royalstonelanka.lk or visit our store in Colombo 03.";
        } else if (q.includes('hello') || q.includes('hi')) {
            return "Hello! I'm here to assist you with gemstone identification, education, and our marketplace. Are you looking to buy a specific gem today?";
        }
        return "That's an interesting question! While I'm still learning, I can tell you all about Sri Lankan gemstones, our AI recognition tool, or help you navigate our marketplace. How can I assist further?";
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
                                        <Avatar className="h-8 w-8 border border-muted">
                                            {m.sender === 'bot' ? (
                                                <AvatarImage src="/bot-avatar.png" />
                                            ) : (
                                                <AvatarFallback className="bg-secondary text-secondary-foreground">
                                                    <User className="h-4 w-4" />
                                                </AvatarFallback>
                                            )}
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {m.sender === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                            </AvatarFallback>
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
                                        <Avatar className="h-8 w-8 border border-muted ring-2 ring-primary/20">
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                <Bot className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="bg-muted text-foreground rounded-2xl rounded-tl-none p-3 border border-border">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                            </div>
                                        </div>
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
