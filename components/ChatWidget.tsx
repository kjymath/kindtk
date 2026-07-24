"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, User, MessageCircle, X } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* 챗봇 창 */}
      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[500px] sm:h-[600px] rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.12)] border border-gray-100 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* 헤더 */}
          <div className="bg-gray-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="w-5 h-5 text-blue-400" />
              AI 수학 튜터
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 메시지 리스트 */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                <Sparkles className="w-10 h-10 text-blue-200" strokeWidth={1.5} />
                <p className="text-center text-sm leading-relaxed px-4">
                  안녕하세요! <br />
                  수학 문제나 헷갈리는 개념을 편하게 물어보세요!
                </p>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[90%] gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* 아바타 */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${m.role === 'user' ? 'bg-gray-200' : 'bg-blue-100 text-blue-600'}`}>
                      {m.role === 'user' ? <User className="w-4 h-4 text-gray-600" /> : <Sparkles className="w-4 h-4" />}
                    </div>

                    {/* 말풍선 */}
                    <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-sm
                      ${m.role === 'user' 
                        ? 'bg-gray-900 text-white rounded-tr-none' 
                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}
                    >
                      {m.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1 text-blue-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white border border-gray-100 rounded-tl-none flex items-center gap-1.5 h-[44px]">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 폼 */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="수학 질문 입력..."
                className="w-full bg-gray-100 border-none rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none overflow-hidden"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) {
                      const event = new Event('submit', { cancelable: true, bubbles: true });
                      e.currentTarget.form?.dispatchEvent(event);
                    }
                  }
                }}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="absolute right-1.5 bottom-1.5 w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 플로팅 토글 버튼 */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-gray-900 text-white' : 'bg-blue-500 text-white'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
