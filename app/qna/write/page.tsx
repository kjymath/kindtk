"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Loader2 } from "lucide-react";

export default function QnAWritePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    password: "",
    is_private: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author || !formData.password) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      let image_url = null;

      // 이미지 업로드 처리
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('qna-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('qna-images')
          .getPublicUrl(filePath);

        image_url = publicUrlData.publicUrl;
      }

      // DB 저장
      const { error: insertError } = await supabase
        .from('questions')
        .insert([
          {
            title: formData.title,
            content: formData.content,
            author: formData.author,
            password: formData.password,
            is_private: formData.is_private,
            image_url: image_url
          }
        ]);

      if (insertError) throw insertError;

      alert("질문이 성공적으로 등록되었습니다.");
      router.push("/qna");
      router.refresh();
      
    } catch (error: any) {
      console.error("Error submitting question:", error);
      alert("질문 등록에 실패했습니다: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <Link href="/qna" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> 목록으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">질문 작성하기</h1>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
              <input 
                type="text" name="author" value={formData.author} onChange={handleChange} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호 (글 확인/수정용)</label>
              <input 
                type="password" name="password" value={formData.password} onChange={handleChange} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="숫자 4자리 등"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <input 
              type="text" name="title" value={formData.title} onChange={handleChange} required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="질문 제목을 입력해주세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
            <textarea 
              name="content" value={formData.content} onChange={handleChange} required rows={6}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              placeholder="모르는 문제나 공부 고민을 자세히 적어주세요."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">사진 첨부 (선택)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">{file ? file.name : "클릭하여 사진을 업로드하세요"}</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <div className="flex items-center py-2">
            <input 
              type="checkbox" name="is_private" id="is_private" checked={formData.is_private} onChange={handleChange}
              className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_private" className="ml-3 text-sm text-gray-700 font-medium cursor-pointer">
              비밀글로 작성하기 (선생님과 작성자만 볼 수 있습니다)
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button 
              type="submit" disabled={loading}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "등록 중..." : "질문 등록하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
