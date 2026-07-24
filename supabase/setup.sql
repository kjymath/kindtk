-- 테이블 생성
CREATE TABLE IF NOT EXISTS public.questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  password text NOT NULL, -- 비밀번호 (비밀글 열람용)
  is_private boolean DEFAULT false, -- 공개/비밀글 여부
  image_url text, -- 업로드한 이미지 URL
  reply text, -- 선생님 답변 내용 (SQL Editor로 직접 업데이트)
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 누구나 읽고 쓸 수 있도록 RLS(Row Level Security) 설정
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 질문을 조회할 수 있음" ON public.questions FOR SELECT USING (true);
CREATE POLICY "누구나 질문을 작성할 수 있음" ON public.questions FOR INSERT WITH CHECK (true);
-- Update 정책은 앱에서 직접 사용하지 않으나, 교사가 대시보드에서 편집할 때 사용됩니다.

-- 스토리지 버킷 생성 (이미지 업로드용)
INSERT INTO storage.buckets (id, name, public) VALUES ('qna-images', 'qna-images', true)
ON CONFLICT (id) DO NOTHING;

-- 스토리지 보안 정책 설정
CREATE POLICY "누구나 이미지 조회 가능" ON storage.objects FOR SELECT USING (bucket_id = 'qna-images');
CREATE POLICY "누구나 이미지 업로드 가능" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'qna-images');
