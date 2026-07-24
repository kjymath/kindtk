import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center flex-grow text-center animate-in fade-in duration-700">
      {/* Icon Badge */}
      <div className="inline-flex items-center justify-center p-3 mb-8 bg-blue-50 text-blue-500 rounded-2xl shadow-sm hover:scale-105 transition-transform duration-300">
        <BookOpen className="w-8 h-8" strokeWidth={1.5} />
      </div>
      
      {/* Hero Title */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.15]">
        생각하는 힘을 키우는 <br className="hidden sm:block" />
        <span className="text-blue-500 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500"> 수학탐구교실</span>
      </h1>
      
      {/* Hero Description */}
      <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed font-medium">
        어려운 공식 암기가 아닌, 원리를 이해하고 스스로 문제를 해결하는 능력을 기릅니다.
        강선생님과 함께 수학의 진짜 재미를 발견해보세요.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Link href="/qna" className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-sm sm:text-base hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2">
          <span>1:1 질문하기</span>
        </Link>
        <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-full font-semibold text-sm sm:text-base hover:bg-gray-50 transition-all shadow-sm border border-gray-200 active:scale-95 flex items-center justify-center gap-2">
          <span>더 알아보기</span>
        </button>
      </div>

      {/* Feature cards - placeholders for future extension */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full text-left">
        {[
          { title: "중학교 1학년 수학 탐구", desc: "" },
          { title: "실력 쑥쑥 문제풀이", desc: "수준별 맞춤 문제로 빈틈없이 다지는 탄탄한 실력" },
          { title: "1:1 밀착 코칭", desc: "모르는 문제와 공부 고민까지 1:1 맞춤 피드백" }
        ].map((feature, i) => (
          <div key={i} className={`p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-center`}>
            <h3 className={`font-bold text-gray-900 ${!feature.desc ? 'text-2xl text-center' : 'text-lg mb-2'}`}>
              {feature.title}
            </h3>
            {feature.desc && (
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
