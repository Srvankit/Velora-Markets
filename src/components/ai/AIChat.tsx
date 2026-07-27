import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { suggestedPrompts, mockChatConversations, generateMockResponse, type ChatMessage, type ChatConversation } from '@/data/chatHistory';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';

export function AIChat() {
  const [conversations, setConversations] = useState<ChatConversation[]>(mockChatConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(mockChatConversations[0]?.id ?? null);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatConversations[0]?.messages ?? []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, streamingText]);

  const handleSend = useCallback((prompt?: string) => {
    const text = (prompt ?? input).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = generateMockResponse(text);

    setTimeout(() => {
      let i = 0;
      const streamInterval = setInterval(() => {
        setStreamingText(response.slice(0, i));
        i += 3;
        if (i >= response.length) {
          clearInterval(streamInterval);
          setStreamingText('');
          setIsTyping(false);
          const assistantMsg: ChatMessage = {
            id: `m-${Date.now()}-a`,
            role: 'assistant',
            content: response,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }
      }, 20);
    }, 600);
  }, [input, isTyping]);

  const handleNewConversation = () => {
    const newConv: ChatConversation = {
      id: `c-${Date.now()}`,
      title: 'New Conversation',
      lastMessage: '',
      timestamp: new Date().toISOString(),
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setMessages([]);
  };

  const handleSelectConversation = (conv: ChatConversation) => {
    setActiveConversationId(conv.id);
    setMessages(conv.messages);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (id === activeConversationId) {
        if (filtered.length > 0) {
          setActiveConversationId(filtered[0].id);
          setMessages(filtered[0].messages);
        } else {
          setActiveConversationId(null);
          setMessages([]);
        }
      }
      return filtered;
    });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      {/* Conversation History */}
      <Card className="hidden h-[calc(100vh-220px)] flex-col p-3 lg:flex">
        <Button variant="outline" size="sm" className="mb-3 gap-1.5" onClick={handleNewConversation}>
          <Plus className="h-3.5 w-3.5" />
          New Chat
        </Button>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleSelectConversation(conv)}
              className={cn(
                'group flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors',
                conv.id === activeConversationId ? 'bg-accent' : 'hover:bg-accent/50',
              )}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{conv.title}</p>
                <p className="truncate text-[10px] text-muted-foreground">{formatRelativeTime(conv.timestamp)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteConversation(conv.id); }}
                className="opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-danger" />
              </button>
            </button>
          ))}
        </div>
      </Card>

      {/* Chat Interface */}
      <Card className="flex h-[calc(100vh-220px)] flex-col p-0">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-border p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Velora AI Assistant</p>
            <p className="text-xs text-muted-foreground">{activeConversation ? activeConversation.title : 'New Conversation'}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && !isTyping && (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-7 w-7" />
              </div>
              <div className="text-center">
                <p className="font-display text-base font-semibold">How can I help you today?</p>
                <p className="text-sm text-muted-foreground">Ask me about your portfolio, market trends, or investment strategies.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestedPrompts.slice(0, 4).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="rounded-lg border border-border bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex gap-2.5', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className={cn(
                  'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm',
                  msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border',
                )}>
                  <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="rounded-2xl border border-border bg-card px-3.5 py-2.5">
                {streamingText ? (
                  <p className="text-sm whitespace-pre-line leading-relaxed">{streamingText}<span className="animate-pulse">|</span></p>
                ) : (
                  <div className="flex gap-1">
                    <motion.span className="h-2 w-2 rounded-full bg-muted-foreground" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                    <motion.span className="h-2 w-2 rounded-full bg-muted-foreground" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} />
                    <motion.span className="h-2 w-2 rounded-full bg-muted-foreground" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask about your portfolio, market trends..."
              className="flex-1 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
            <Button size="icon" className="h-10 w-10 rounded-xl" onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
