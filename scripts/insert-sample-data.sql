-- サンプルデータ投入（テスト用）

-- 件名マスタデータ投入（最初の10件）
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('KD物流株式会社', 'けーでぃーぶつりゅう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('Lib株式会社', 'りぶ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('くろがね工業株式会社', 'くろがねこうぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社バンテック九州', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社バンテック', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社サクラ物流', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('鶴丸海運株式会社', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('平和物流株式会社', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('田村運輸株式会社', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('三原物流株式会社', 'みはらぶつりゅう', NOW(), NOW());

-- 登録番号マスタデータ投入（最初の10件）
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101を50000', '北九州', '101', 'を', '50000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101か80000', '北九州', '101', 'か', '80000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州111う･･･1', '北九州', '111', 'う', '1', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･025', '北九州', '130', 'う', '025', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･380', '北九州', '100', 'え', '380', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ･794', '筑豊', '130', 'あ', '794', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･194', '北九州', '100', 'き', '194', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･511', '北九州', '130', 'い', '511', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･422', '北九州', '100', 'き', '422', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･352', '北九州', '100', 'き', '352', 0, NULL, true, NOW(), NOW());

-- 件名-登録番号関連データ投入（関連付け）
INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  true, 
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州101か80000';

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, 
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州130う･025';

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  true, 
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･380';

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  true, 
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊130あ･794';

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  true, 
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き･422';

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, 
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き･194';

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  true, 
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100き･352';