"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, User } from "lucide-react";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)] animate-in fade-in zoom-in-95 duration-500">
      
      <div className="flex items-center justify-between mb-6 shrink-0">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> 홈으로 돌아가기
        </Link>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          AI 수학 튜터
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 bg-white border border-gray-100 rounded-3xl shadow-[0_2px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col relative">
        
        {/* 메시지 리스트 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <Sparkles className="w-12 h-12 text-blue-200" strokeWidth={1.5} />
              <p className="text-center">
                안녕하세요! 친절한 AI 수학 선생님입니다.<br />
                모르는 수학 문제나 헷갈리는 개념을 편하게 물어보세요!
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* 아바타 */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${m.role === 'user' ? 'bg-gray-100' : 'bg-blue-100 text-blue-600'}`}>
                    {m.role === 'user' ? <User className="w-4 h-4 text-gray-500" /> : <Sparkles className="w-4 h-4" />}
                  </div>

                  {/* 말풍선 */}
                  <div className={`px-5 py-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm
                    ${m.role === 'user' 
                      ? 'bg-gray-900 text-white rounded-tr-none' 
                      : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-none'}`}
                  >
                    {m.content}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1 text-blue-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 rounded-tl-none flex items-center gap-1.5">
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
        <div className="p-4 bg-white border-t border-gray-50 shrink-0">
          <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="여기에 수학 질문을 입력하세요..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none overflow-hidden"
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
              style={{ minHeight: '52px', maxHeight: '150px' }}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="absolute right-2 bottom-2 w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-all shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[11px] text-gray-400">엔터(Enter)를 눌러 전송, Shift + Enter로 줄바꿈</span>
          </div>
        </div>

      </div>
    </div>
  );
}
