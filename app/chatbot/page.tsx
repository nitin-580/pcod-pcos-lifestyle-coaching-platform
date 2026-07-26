'use client';

import React, { useState, useRef, useEffect } from 'react';
import FloatingNavbar from '@/components/FloatingNavbar';
import Footer from '@/components/Footer';
import { Send, RefreshCw, AlertTriangle, ShieldCheck, User, Check } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const translations = {
  english: {
    welcome: "Hello! I am Divya, your evidence-informed WombCare AI health education assistant. I can help answer questions about menstrual health, PCOS, hormones, nutrition, and general reproductive wellness.\n\nHow can I help you today?",
    title: "Chat with Divya",
    subtitle: "Educating, guiding, and supporting your reproductive wellness journey.",
    placeholder: "Ask Divya... (e.g. explain menstrual health)",
    typing: "Divya is typing...",
    disclaimer: "This information is for educational purposes only and is not a medical diagnosis or a substitute for professional medical advice. Please consult a qualified healthcare professional for personalized care.",
    presetTitle: "Common wellness topics to explore",
    assistantLabel: "Divya (AI Assistant)",
    presets: [
      { text: 'Check PCOS symptoms', q: 'What are the common symptoms of PCOS?' },
      { text: 'Safe self-care for cramps', q: 'I have severe period cramps, what safe self-care measures can I take?' },
      { text: 'Questions for doctor', q: 'What questions should I ask my doctor about irregular periods?' },
      { text: 'Lifestyle tips for hormones', q: 'How can lifestyle and nutrition choices help balance hormones naturally?' },
    ]
  },
  hindi: {
    welcome: "नमस्ते! मैं दिव्या हूँ, आपकी WombCare AI स्वास्थ्य शिक्षा सहायक। मैं मासिक धर्म स्वास्थ्य, PCOS, हार्मोन, पोषण और सामान्य प्रजनन कल्याण से जुड़े सवालों के जवाब देने में आपकी मदद कर सकती हूँ। आज मैं आपकी क्या मदद करूँ?",
    title: "दिव्या के साथ चैट करें",
    subtitle: "आपके प्रजनन कल्याण यात्रा की शिक्षा, मार्गदर्शन और समर्थन।",
    placeholder: "दिव्या से पूछें... (जैसे: मासिक धर्म चक्र के बारे में बताएं)",
    typing: "दिव्या लिख रही है...",
    disclaimer: "यह जानकारी केवल शैक्षिक उद्देश्यों के लिए है और यह कोई चिकित्सीय निदान या पेशेवर चिकित्सा सलाह का विकल्प नहीं है। कृपया व्यक्तिगत देखभाल के लिए किसी योग्य स्वास्थ्य पेशेवर से परामर्श लें।",
    presetTitle: "अन्वेषण करने के लिए सामान्य स्वास्थ्य विषय",
    assistantLabel: "दिव्या (एआई सहायक)",
    presets: [
      { text: 'PCOS के लक्षण जाँचें', q: 'PCOS के सामान्य लक्षण क्या हैं?' },
      { text: 'ऐंठन के लिए सुरक्षित घरेलू देखभाल', q: 'मुझे मासिक धर्म में तेज ऐंठन होती है, मैं कौन से सुरक्षित घरेलू उपाय अपना सकती हूँ?' },
      { text: 'डॉक्टर के लिए सवाल', q: 'अनियमित पीरियड्स के बारे में मुझे अपने डॉक्टर से क्या सवाल पूछने चाहिए?' },
      { text: 'हार्मोन संतुलन के लिए टिप्स', q: 'जीवनशैली और पोषण में बदलाव प्राकृतिक रूप से हार्मोन को संतुलित करने में कैसे मदद कर सकते हैं?' },
    ]
  },
  bhojpuri: {
    welcome: "प्रणाम! हम दिव्या हईं, राउर WombCare AI स्वास्थ्य शिक्षा सहायक। हम मासिक धर्म के स्वास्थ्य, PCOS, हार्मोन, खान-पान आ सामान्य प्रजनन कल्याण से जुड़ल सवालन के जवाब देवे में राउर मदद कर सकत हईं। आज हम राउर का मदद करीं?",
    title: "दिव्या से बातचीत करीं",
    subtitle: "राउर प्रजनन कल्याण यात्रा के शिक्षा, मार्गदर्शन आ सहयोग।",
    placeholder: "दिव्या से पूछीं... (जैसे: मासिक धर्म के बारे में बताईं)",
    typing: "दिव्या लिखत हई...",
    disclaimer: "ई जानकारी खाली शिक्षा देवे खातिर बा, एकरा के कौनों डाक्टरी इलाज भा डाक्टर के सलाह के विकल्प मत मानल जाव। कौनों भी परेशानी में योग्य डाक्टर से जरूर सलाह लीं।",
    presetTitle: "कल्याण से जुड़ल कुछ आम विषय",
    assistantLabel: "दिव्या (एआई सहायक)",
    presets: [
      { text: 'PCOS के लच्छन देखीं', q: 'PCOS के आम लच्छन का का होला?' },
      { text: 'दरद खातिर सुरक्षित घरेलू उपाय', q: 'हमरा पीरियड में तेज दरद (ऐंठन) होखता, हम का सुरक्षित घरेलू उपाय कर सकत हईं?' },
      { text: 'डॉक्टर से पूछे वाला सवाल', q: 'अनियमित पीरियड के बारे में हमरा डॉक्टर से का का पूछे के चाहीं?' },
      { text: 'हार्मोन ठीक करे के उपाय', q: 'रहन-सहन आ खान-पान में बदलाव से प्राकृतिक रूप से हार्मोन कइसे ठीक कइल जा सकेला?' },
    ]
  },
  maithili: {
    welcome: "प्रणाम! हम दिव्या छी, अहाँक WombCare AI स्वास्थ्य शिक्षा सहायक। हम मासिक धर्मक स्वास्थ्य, PCOS, हार्मोन, पोषण आ सामान्य प्रजनन कल्याण सं जुड़ल प्रश्नक उत्तर देबय में अहाँक मदद क' सकैत छी। आजु हम अहाँक की मदद करू?",
    title: "दिव्या सँ बात करू",
    subtitle: "अहाँक प्रजनन कल्याण यात्राक शिक्षा, मार्गदर्शन आ सहयोग।",
    placeholder: "दिव्या सं पुछू... (जेना: मासिक धर्म क बारे में बताउ)",
    typing: "दिव्या लिखि रहल छथि...",
    disclaimer: "ई जानकारी केवल शैक्षणिक उद्देश्यक लेल अछि आ एकरा कोनो चिकित्सीय निदान या डॉक्टरक सलाहक विकल्प नहि मानल जाए। कोनो भी समस्या लेल योग्य डॉक्टर सं सलाह ली।",
    presetTitle: "कल्याण सं जुड़ल किछु आम विषय",
    assistantLabel: "दिव्या (एआई सहायक)",
    presets: [
      { text: 'PCOS क लक्षण जाँची', q: 'PCOS क सामान्य लक्षण की की अछि?' },
      { text: 'ऐंठन लेल सुरक्षित घरेलू उपाय', q: 'हमरा पीरियड में पैघ ऐंठन (दरद) होइत अछि, हम की सुरक्षित घरेलू उपाय क\' सकैत छी?' },
      { text: 'डॉक्टर सं पूछे वाला सवाल', q: 'अनियमित पीरियड क बारे में हमरा अपन डॉक्टर सं की की पूछेक चाही?' },
      { text: 'हार्मोन संतुलन लेल टिप्स', q: 'जीवनशैली आ खान-पान में बदलाव प्राकृतिक रूप सं हार्मोन संतुलित करय में कोना मदद क\' सकैत अछि?' },
    ]
  }
};

export default function ChatbotPage() {
  const [language, setLanguage] = useState<'english' | 'hindi' | 'bhojpuri' | 'maithili'>('english');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reload the welcome message whenever the language is switched
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: translations[language].welcome,
      },
    ]);
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Source mapping helper
  const getSourceLink = (sourceName: string) => {
    const name = sourceName.trim().toLowerCase();
    if (name.includes('who')) return 'https://www.who.int';
    if (name.includes('acog')) return 'https://www.acog.org';
    if (name.includes('mayo')) return 'https://www.mayoclinic.org';
    if (name.includes('nhs')) return 'https://www.nhs.uk';
    if (name.includes('cdc')) return 'https://www.cdc.gov';
    if (name.includes('fogsi')) return 'https://www.fogsi.org';
    if (name.includes('icmr')) return 'https://main.icmr.nic.in';
    return `https://www.google.com/search?q=${encodeURIComponent(sourceName)}`;
  };

  // Custom Inline Markdown Parser
  const parseInlineMarkdown = (text: string) => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    
    // Bold/Italic regex matches ***bolditalic***, **bold**, *italic*
    const boldItalicRegex = /(\*\*\*|___\b)(.*?)\1|(\*\*|__\b)(.*?)\3|(\*|_\b)(.*?)\5/g;
    let match;
    
    while ((match = boldItalicRegex.exec(text)) !== null) {
      if (match.index > currentIndex) {
        parts.push(text.substring(currentIndex, match.index));
      }
      
      if (match[2]) {
        parts.push(<strong key={match.index} className="font-extrabold italic text-purple-950">{match[2]}</strong>);
      } else if (match[4]) {
        parts.push(<strong key={match.index} className="font-bold text-slate-900">{match[4]}</strong>);
      } else if (match[6]) {
        parts.push(<em key={match.index} className="italic text-slate-800">{match[6]}</em>);
      }
      currentIndex = boldItalicRegex.lastIndex;
    }
    
    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  // Multi-line Markdown Parser
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    let inList = false;
    const elements: React.ReactNode[] = [];
    let currentListItems: React.ReactNode[] = [];

    const flushList = (keyPrefix: number) => {
      if (currentListItems.length > 0) {
        elements.push(
          <ul key={`list-${keyPrefix}`} className="list-disc pl-5 my-2 space-y-1">
            {currentListItems}
          </ul>
        );
        currentListItems = [];
      }
      inList = false;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('• ') || trimmed.startsWith('- ');

      if (isBullet) {
        inList = true;
        const content = trimmed.replace(/^(\*|•|-)\s*/, '');
        currentListItems.push(
          <li key={`li-${index}`} className="text-slate-700 text-sm md:text-base leading-relaxed">
            {parseInlineMarkdown(content)}
          </li>
        );
      } else {
        if (inList) {
          flushList(index);
        }

        if (trimmed.startsWith('### ')) {
          elements.push(
            <h3 key={index} className="text-sm md:text-base font-bold text-purple-800 mt-4 mb-1">
              {parseInlineMarkdown(trimmed.substring(4))}
            </h3>
          );
        } else if (trimmed.startsWith('## ')) {
          elements.push(
            <h2 key={index} className="text-base md:text-lg font-bold text-purple-900 mt-4 mb-2">
              {parseInlineMarkdown(trimmed.substring(3))}
            </h2>
          );
        } else if (!trimmed) {
          elements.push(<div key={index} className="h-2" />);
        } else {
          // If it looks like a source listing item
          if (trimmed.startsWith('Sources') || trimmed.toLowerCase() === 'sources:') {
            elements.push(
              <h4 key={index} className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-4 mb-1">
                {trimmed}
              </h4>
            );
          } else {
            // Check if this line is in the sources block and make clickable
            const isSourceLine = index > lines.findIndex(l => l.includes('Sources'));
            if (isSourceLine && index < lines.findIndex(l => l.includes('Disclaimer')) && trimmed.length > 2) {
              const cleanedName = trimmed.replace(/^[^a-zA-Z0-9]+/, '');
              elements.push(
                <div key={index} className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 mt-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <a href={getSourceLink(cleanedName)} target="_blank" rel="noopener noreferrer" className="underline decoration-purple-400">
                    {cleanedName}
                  </a>
                </div>
              );
            } else {
              elements.push(
                <p key={index} className="text-slate-700 text-sm md:text-base leading-relaxed">
                  {parseInlineMarkdown(trimmed)}
                </p>
              );
            }
          }
        }
      }
    });

    if (inList) {
      flushList(lines.length);
    }

    return elements;
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.message || 'I apologize, I could not generate a response. Please try again.',
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Unable to connect to the assistant. Please check your internet connection and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (confirm(language === 'english' ? 'Are you sure you want to clear this conversation?' : language === 'hindi' ? 'क्या आप वाकई इस बातचीत को मिटाना चाहते हैं?' : language === 'bhojpuri' ? 'का राउर ई बातचीत मिटावे के चाहत हईं?' : 'की अहाँ सच में एहि बातचीत केँ मिटाबय चाहैत छी?')) {
      setMessages([
        {
          role: 'assistant',
          content: translations[language].welcome,
        },
      ]);
    }
  };

  // Helper to highlight safety/emergency warnings
  const renderMessageContent = (content: string) => {
    const isEmergency = content.includes('⚠️') || content.toLowerCase().includes('urgent medical attention') || content.toLowerCase().includes('nearest emergency department');
    
    if (isEmergency) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-900 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-red-700 font-bold">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>Urgent Medical Attention Required</span>
          </div>
          <div className="whitespace-pre-line text-sm leading-relaxed font-medium">
            {content}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {parseMarkdown(content)}
      </div>
    );
  };

  const activeTranslation = translations[language];

  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-purple-100 selection:text-purple-900 flex flex-col pt-20">
      <FloatingNavbar />

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col">
        {/* Header Block */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md border border-slate-100 bg-white flex-shrink-0">
              <img
                src="/logo.png"
                alt="WombCare Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeTranslation.assistantLabel}
                </span>
                <span className="flex items-center gap-0.5 text-slate-500 text-[10px] bg-slate-100 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Evidence-Informed
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
                {activeTranslation.title}
              </h1>
              <p className="text-[11px] md:text-xs text-slate-500 max-w-xl">
                {activeTranslation.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Language Selector */}
            <div className="bg-slate-100 p-0.5 rounded-xl flex flex-wrap items-center border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage('english')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  language === 'english'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hindi')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  language === 'hindi'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('bhojpuri')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  language === 'bhojpuri'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                भोजपुरी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('maithili')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  language === 'maithili'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                मैथिली
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleClear}
              className="p-2.5 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all ml-auto md:ml-0"
              title="Clear Conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Conversation Box */}
        <div className="bg-white rounded-2xl border border-slate-100 flex-1 flex flex-col min-h-[450px] shadow-sm overflow-hidden mb-6">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-h-[600px]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-semibold shadow-sm overflow-hidden bg-white border border-slate-100`}
                >
                  {msg.role === 'user' ? (
                    <div className="w-full h-full bg-slate-800 text-white flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  ) : (
                    <img
                      src="/logo.png"
                      alt="Divya Logo"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Message Box */}
                <div
                  className={`rounded-2xl p-4 ${
                    msg.role === 'user'
                      ? 'bg-slate-800 text-white'
                      : 'bg-purple-50 text-slate-800 border border-purple-100/50'
                  }`}
                >
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden bg-white border border-slate-100">
                  <img
                    src="/logo.png"
                    alt="Divya Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100/50 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Presets */}
          {messages.length === 1 && (
            <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/50">
              <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                {activeTranslation.presetTitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeTranslation.presets.map((pq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(pq.q)}
                    className="text-left text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-purple-50 hover:border-purple-200 text-slate-700 hover:text-purple-900 transition-all font-medium shadow-2xs"
                  >
                    {pq.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-4 border-t border-slate-100 bg-white flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoading ? activeTranslation.typing : activeTranslation.placeholder}
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white text-slate-800 px-4 py-3 rounded-xl outline-none transition-all text-sm md:text-base disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 text-white p-3.5 rounded-xl transition-all shadow-md disabled:shadow-none flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 md:w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Disclaimer / Safety Alert */}
        <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-4 flex gap-3 text-slate-600 text-xs leading-relaxed mb-6">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-700">Disclaimer:</span> {activeTranslation.disclaimer}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
