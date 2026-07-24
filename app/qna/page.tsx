"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { MessageSquare, Lock, ChevronRight } from "lucide-react";

type Question = {
  id: string;
  title: string;
  author: string;
  is_private: boolean;
  reply: string | null;
  created_at: string;
};

export default function QnAListPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("id, title, author, is_private, reply, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">1:1 밀착 코칭</h1>
          <p className="text-gray-500">모르는 문제나 공부 고민을 남겨주시면 선생님이 직접 피드백해 드립니다.</p>
        </div>
        <Link 
          href="/qna/write" 
          className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium text-sm hover:bg-blue-600 transition-colors shadow-sm active:scale-95 flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          질문하기
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">불러오는 중...</div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center text-gray-400">아직 등록된 질문이 없습니다. 첫 질문을 남겨보세요!</div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {questions.map((q) => (
              <li key={q.id}>
                <Link href={`/qna/${q.id}`} className="block p-6 sm:px-8 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {q.is_private && <Lock className="w-4 h-4 text-gray-400" />}
                      <span className="font-medium text-gray-900 text-lg group-hover:text-blue-500 transition-colors">
                        {q.is_private ? "비밀글입니다." : q.title}
                      </span>
                      {q.reply && (
                        <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">
                          답변 완료
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span>{q.author}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{new Date(q.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
