import React, { useState, useEffect, useRef } from 'react';
import { generateChatResponse } from '../../services/geminiService';

type Mode = 'chat' | 'video';
interface Message {
    sender: 'user' | 'physio';
    text: string;
}

const TelePhysio: React.FC = () => {
    const [mode, setMode] = useState<Mode>('video');
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const startSession = (selectedMode: Mode) => {
        setMode(selectedMode);
        setIsSessionActive(true);
        if (selectedMode === 'chat') {
            setMessages([{ sender: 'physio', text: "Hello! I'm your AI physiotherapy assistant. How can I help you today?" }]);
        }
    };

    const endSession = () => {
        setIsSessionActive(false);
        setMessages([]);
        setInputValue('');
        setError(null);
        setIsLoading(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() === '' || isLoading) return;

        const userMessage: Message = { sender: 'user', text: inputValue };
        const newMessages = [...messages, userMessage];
        
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);
        setError(null);

        try {
            const responseText = await generateChatResponse(newMessages);
            const physioReply: Message = { sender: 'physio', text: responseText };
            setMessages(prev => [...prev, physioReply]);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderWelcomeScreen = () => (
        <div className="text-center p-8 bg-gray-50 rounded-2xl">
            <i className="fas fa-headset text-5xl text-[#00bfa5] mb-4"></i>
            <h2 className="text-2xl font-bold text-[#37474f] mb-2">Virtual Consultation</h2>
            <p className="text-[#78909c] mb-6">
                Connect with an AI assistant or simulate a video call.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                    className="bg-[#00838f] text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-800 transition-colors"
                    onClick={() => startSession('chat')}
                >
                    <i className="fas fa-comments mr-2"></i>
                    Start AI Chat
                </button>
                <button
                    className="bg-gray-400 text-white font-bold py-3 px-6 rounded-lg cursor-not-allowed"
                    title="Video feature is a mock-up"
                    // onClick={() => startSession('video')} // Mock-up, so interactive start is disabled
                >
                    <i className="fas fa-video mr-2"></i>
                    Start Video Call (Demo)
                </button>
            </div>
        </div>
    );
    
    const renderVideoCall = () => (
         <>
            <div className="bg-black rounded-lg h-96 flex items-center justify-center mb-4 shadow-lg relative">
                <div className="absolute text-white text-center">
                    <i className="fas fa-video text-5xl mb-2"></i>
                    <p>Live Video Feed Area (UI Mock-up)</p>
                </div>
            </div>
            <div className="flex justify-center">
                <button onClick={endSession} className="bg-[#f44336] text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors">
                    <i className="fas fa-phone-slash mr-2"></i> End Session
                </button>
            </div>
        </>
    );
    
    const TypingIndicator = () => (
         <div className="flex mb-3 justify-start">
            <div className="rounded-2xl py-3 px-5 bg-gray-200 text-[#37474f]">
                <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );

    const renderChat = () => (
        <div className="flex flex-col h-[60vh] bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-2xl py-2 px-4 max-w-xs lg:max-w-md break-words ${msg.sender === 'user' ? 'bg-[#00838f] text-white' : 'bg-gray-200 text-[#37474f]'}`}>
                            {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                        </div>
                    </div>
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={chatEndRef} />
            </div>
            {error && <p className="text-red-500 text-xs text-center p-2">{error}</p>}
            <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00838f] disabled:bg-gray-100"
                />
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-[#00bfa5] text-white font-bold py-2 px-5 rounded-full hover:bg-[#00a794] transition-colors disabled:bg-gray-400"
                >
                    Send
                </button>
            </form>
             <button onClick={endSession} className="bg-gray-200 text-gray-700 font-bold py-2 rounded-b-lg hover:bg-gray-300 transition-colors">
                End Chat
            </button>
        </div>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#37474f] mb-4">TelePhysio Session</h2>
            
            {!isSessionActive ? (
                renderWelcomeScreen()
            ) : (
                mode === 'video' ? renderVideoCall() : renderChat()
            )}
            
            <div className="mt-8 p-4 bg-orange-100 border-l-4 border-[#ff9800] text-[#37474f] rounded-r-lg">
                 <p className="font-semibold">
                    <i className="fas fa-exclamation-triangle mr-2 text-[#ff9800]"></i>
                    Disclaimer
                </p>
                <p className="text-sm">
                    The AI chat is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
            </div>
        </div>
    );
};

export default TelePhysio;