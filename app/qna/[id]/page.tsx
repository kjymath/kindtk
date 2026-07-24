"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, User } from "lucide-react";

type Question = {
  id: string;
  title: string;
  content: string;
  author: string;
  is_private: boolean;
  image_url: string | null;
  reply: string | null;
  created_at: string;
};

export default function QnADetailPage() {
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchQuestion();
    }
  }, [params.id]);

  async function fetchQuestion() {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setQuestion(data);
      
      // 공개 글이면 바로 열람 가능
      if (!data.is_private) {
        setIsUnlocked(true);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      alert("질문을 불러올 수 없습니다.");
      router.push("/qna");
    } finally {
      setLoading(false);
    }
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 보안상 프론트엔드에서 비교하는 것은 취약하지만, 단순 게시판 목적이므로 구현
      const { data, error } = await supabase
        .from("questions")
        .select("password")
        .eq("id", params.id)
        .single();
        
      if (error) throw error;
      
      if (data.password === passwordInput) {
        setIsUnlocked(true);
      } else {
        setErrorMsg("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      setErrorMsg("확인 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <div className="w-full text-center py-20 text-gray-500">불러오는 중...</div>;
  }

  if (!question) return null;

  // 비밀글 잠금 화면
  if (question.is_private && !isUnlocked) {
    return (
      <div className="w-full max-w-md mx-auto pt-20 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white p-8 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 text-center">
          <div className="inline-flex p-4 bg-gray-50 rounded-full mb-6">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">비밀글입니다</h2>
          <p className="text-gray-500 text-sm mb-6">이 글을 작성하셨다면 비밀번호를 입력해주세요.</p>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <input 
              type="password" 
              value={passwordInput} 
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-center"
              placeholder="비밀번호"
            />
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            <button 
              type="submit"
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              확인
            </button>
            <Link href="/qna" className="block text-sm text-gray-500 hover:text-gray-900 mt-4">
              목록으로 돌아가기
            </Link>
          </form>
        </div>
      </div>
    );
  }

  // 상세 내용 화면
  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-500">
      <Link href="/qna" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> 목록으로 돌아가기
      </Link>

      <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-8">
        <div className="p-8 sm:p-10 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">질문</span>
            {question.is_private && <Lock className="w-3.5 h-3.5 text-gray-400" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">{question.title}</h1>
          <div className="flex items-center text-sm text-gray-500 gap-4">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> {question.author}
            </div>
            <span>•</span>
            <span>{new Date(question.created_at).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="p-8 sm:p-10 bg-gray-50/30">
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{question.content}</p>
          
          {question.image_url && (
            <div className="mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={question.image_url} 
                alt="첨부 이미지" 
                className="max-w-full rounded-2xl shadow-sm border border-gray-100"
              />
            </div>
          )}
        </div>
      </div>

      {/* 선생님 답변 영역 */}
      {question.reply ? (
        <div className="bg-blue-50/50 rounded-3xl border border-blue-100 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-600 font-bold text-lg">선생님 답변</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-semibold">완료</span>
          </div>
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{question.reply}</p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-3xl border border-gray-100 p-8 text-center text-gray-500 text-sm">
          아직 선생님의 답변이 달리지 않았습니다. 조금만 기다려주세요!
        </div>
      )}
    </div>
  );
}
