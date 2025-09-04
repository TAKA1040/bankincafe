-- 件名マスタ・登録番号マスタ・関連データ投入
-- Generated from kenmei_yomigana.csv and masuta.csv
-- Subject records: 180
-- Registration number records: 1122
-- Relations: 1127

-- 既存データをクリア（必要に応じて）
-- DELETE FROM public.subject_registration_numbers;
-- DELETE FROM public.registration_number_master;
-- DELETE FROM public.subject_master;

-- 件名マスタデータ投入
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('KD物流株式会社', 'けーでぃーぶつりゅう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('Lib株式会社', 'りぶ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('くろがね工業株式会社', 'くろがねこうぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('イーストアジア物流株式会社', 'いーすとあじあぶつりゅう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('カリツーオートテクノ株式会社', 'かりつーおーとてくの', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('ケーエムサービス株式会社', 'けーえむさーびす', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('ニッポンロジ株式会社', 'にっぽんろじ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('パッシブル有限会社', 'ぱっしぶる', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('フコク物流株式会社', 'ふこくぶつりゅう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('マコトロジテック株式会社', 'まことろじてっく', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('ユニプレス物流株式会社', 'ゆにぷれすぶつりゅう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('ラックライド株式会社', 'らっくらいど', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('三原物流株式会社', 'みはらぶつりゅう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('三友建設工業株式会社', 'さんゆうけんせつこうぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('上田産業株式会社', 'うえださんぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('中村産業輸送株式会社', 'なかむらさんぎょうゆそう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('中野産業株式会社', 'なかのさんぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('丸屋商事株式会社', 'まるやしょうじ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('丸正運送株式会社', 'まるしょううんそう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('久富産業株式会社', 'ひさとみさんぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('九州紙運輸株式会社', 'きゅうしゅうしかんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('九州西濃運輸株式会社', 'きゅうしゅうせいのううんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('九州運輸建設株式会社', 'きゅうしゅううんゆけんせつ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('二引株式会社', 'にびき', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('京築酒類販売株式会社', 'けいちくしゅるいはんばい', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('仲島運送有限会社', 'なかしまうんそう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('佐川急便株式会社', 'さがわきゅうびん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('八谷紙工株式会社', 'はちやしこう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('凡申産業株式会社', 'ぼんしんさんぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('北九州ダイキュー運輸株式会社', 'きたきゅうしゅうだいきゅううんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('北九州産業運輸株式会社', 'きたきゅうしゅうさんぎょううんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('北九州豊運輸株式会社', 'きたきゅうしゅうゆたかうんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('協栄ライン株式会社', 'きょうえいらいん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('協栄陸運株式会社', 'きょうえいりくうん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('協立運輸株式会社', 'きょうりつうんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('合資会社山下組', 'やましたぐみ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('周防運輸有限会社', 'すおううんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('塚本精工株式会社', 'つかもとせいこう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('大森運送株式会社', 'おおもりうんそう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('宮田運送株式会社', 'みやたうんそう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('宮西設備株式会社', 'みやにしせつび', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('寿屋フロンテ株式会社', 'ことぶきやふろんて', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('小倉第一運送有限会社', 'こくらだいいちうんそう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('岡田設備株式会社', 'おかだせつび', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('嶋本運送株式会社', 'しまもとうんそう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('平和物流株式会社', 'へいわぶつりゅう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('愛宕自動車工業株式会社', 'あたごじどうしゃこうぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('愛岩自動車工業株式会社', 'あいわじどうしゃこうぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('新手運輸有限会社', 'しんてうんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('日立金属株式会社九州工場', 'ひたちきんぞくきゅうしゅうこうじょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('日通北九州運輸株式会社', 'にっつうきたきゅうしゅううんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('曽根金属工業株式会社', 'そねきんぞくこうぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社SONEKIN WORKS', 'そねきんわーくす', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社エコー商会', 'えこーしょうかい', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社エムアイ通商', 'えむあいっつうしょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社オート貿易', 'おーとぼうえき', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社セフティワン', 'せふてぃわん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社トス･エクスプレス', 'とすえくすぷれす', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社パインカーゴ', 'ぱいんかーご', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社三栄運輸', 'さんえいうんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社中本商会', 'なかもとしょうかい', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社井手梱包', 'いでこんぽう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社内本開発', 'うちもとかいはつ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社原田運送', 'はらだうんそう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社双葉商会', 'ふたばしょうかい', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社古井設備', 'ふるいせつび', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社堀本建設', 'ほりもとけんせつ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社大雄産業', 'たいゆうさんぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社安藤建設', 'あんどうけんせつ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社富永運輸', 'とみながうんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社岡田運輸', 'おかだうんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社晃栄建設', 'こうえいけんせつ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社木下金属', 'きのしたきんぞく', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社森通商', 'もりつうしょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社水屋', 'みずや', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社第一建設工業', 'だいいちけんせつこうぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社行橋鎮西運送', 'ゆくはしちんぜいうんそう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社西都流通システム', 'さいとりゅうつうしすてむ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社青浜建設', 'あおはまけんせつ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('東和運送株式会社', 'とうわうんそう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('東洋物産株式会社', 'とうようぶっさん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('東邦興産株式会社', 'とうほうこうさん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('東陸ロジステック株式会社九州事業所', 'とうりくろじすてっくきゅうしゅうじぎょうしょ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('東陸ロジテック株式会社', 'とうりくろじてっく', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社D-LITS', 'でぃーりっつ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社D＆Jロジスティクス', 'でぃーあんどじぇいろじすてぃくす', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社MLS', 'えむえるえす', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社NBSロジソル', 'えぬびーえすろじそる', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社VIP', 'ぶいあいぴー', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社みやけ商会', 'みやけしょうかい', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社みらい', 'みらい', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社アイエヌトラシード', 'あいえぬとらしーど', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社アイエヌライン', 'あいえぬらいん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社アイエヌロジスティクス', 'あいえぬろじすてぃくす', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社アスリートトラフィック', 'あすりーととらふぃっく', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社アールシーロジ', 'あーるしーろじ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社エスワイプロモーション', 'えすわいぷろもーしょん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ガンバコーポレーション', 'がんばこーぽれーしょん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ケイエム運輸機工', 'けーえむうんゆきこう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ケイティトランスポート', 'けーてぃーとらんすぽーと', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ケーツー企画', 'けーつーきかく', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社コヤマ物流', 'こやまぶつりゅう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社サクラ物流', 'さくらぶつりゅう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ジャパンライン', 'じゃぱんらいん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ゼロ･プラス九州', 'ぜろぷらすきゅうしゅう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ゼロ九州工場', 'ぜろきゅうしゅうこうじょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ゼロ･プラス九州 九州カスタマーサービスセンター', 'ぜろぷらすきゅうしゅう きゅうしゅうかすたまーさーびすせんたー', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ダイワ', 'だいわ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ティー・エル・エス', 'てぃーえるえす', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社デイオー運輸', 'でいおーうんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社バンテック', 'ばんてっく', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社バンテック九州', 'ばんてっくきゅうしゅう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社バンテック海上輸送課', 'ばんてっくかいじょうゆそうか', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ヤマガタ本社車輌部', 'やまがたほんしゃしゃりょうぶ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ユートランス', 'ゆーとらんす', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ラインシステム', 'らいんしすてむ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社リアライズコーポレーション', 'りあらいずこーぽれーしょん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ロジコム・アイ', 'ろじこむあい', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社上野商会', 'うえのしょうかい', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社九栄物流', 'きゅうえいぶつりゅう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社共和', 'きょうわ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社前寛商事', 'まえひろしょうじ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社北九州物流サービス', 'きたきゅうしゅうぶつりゅうさーびす', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社啓愛社', 'けいあいしゃ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社坂本産業', 'さかもとさんぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社太田古鐵商店', 'おおたふるてつしょうてん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社守エクスプレス', 'もりえくすぷれす', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社富士技研', 'ふじぎけん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社川村製作所', 'かわむらせいさくしょ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社日栄紙工社', 'にちえいしこうしゃ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社日産クリエイティブサービス', 'にっさんくりえいてぃぶさーびす', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社有門組', 'ありかどぐみ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社東西運輸', 'とうざいうんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社松下運輸', 'まつしたうんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社松本組', 'まつもとぐみ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社森若商会', 'もりわかしょうかい', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社永田興業', 'ながたこうぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社活慎産業', 'かっしんさんぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社清翔産業', 'せいしょうさんぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社牧運輸', 'まきうんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社物流なかま', 'ぶつりゅうなかま', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社田北電機製作所', 'たきたでんきせいさくしょ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社白石開発', 'しらいしかいはつ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社磯部', 'いそべ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社稲田運輸', 'いなだうんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社翔陸運', 'しょうりくうん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社翼LINE', 'つばさらいん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社裕伸', 'ゆうしん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社豊田興業', 'とよたこうぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('梶原産業株式会社', 'かじはらさんぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('河津産業有限会社', 'かわづさんぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('玄海産業株式会社', 'げんかいさんぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('田村運輸株式会社', 'たむらうんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('田町運送有限会社', 'たまちうんそう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('福岡化成工業株式会社', 'ふくおかかせいこうぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('興栄産業株式会社', 'こうえいさんぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('茂木運送有限会社', 'もてきうんそう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('菊竹産業株式会社', 'きくたけさんぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('藤原運輸株式会社', 'ふじわらうんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('藤澤環境開発株式会社', 'ふじさわかんきょうかいはつ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('豊工業有限会社', 'ゆたかこうぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('豊能運送株式会社', 'とよのうんそう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('豊運輸株式会社', 'ゆたかうんゆ', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('長田産業株式会社', 'ながたさんぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('香春石灰化学工業株式会社', 'かわらせっかいかがくこうぎょう', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('鶴丸海運株式会社', 'つるまるかいうん', NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('行橋市・みやこ町清掃施設組合', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社　VIP', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ゼロ・プラス九州', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('太田古鉄商店', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('中野運送　中野正博', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('国土交通省大阪航空局北九州空港事務所', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社　北九州物流サービス', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('有限会社SONEKIN　WORKS', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('曾根金属工業株式会社', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('現金払い', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('苅田工業部制部門経費', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('苅田工場部整部門経費', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('無', NULL, NOW(), NOW());
INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('株式会社ゼロ･プラス九州　九州カスタマーサービスセンター', NULL, NOW(), NOW());

-- 登録番号マスタデータ投入
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101を50000', '北九州', '101', 'を', '50000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101か80000', '北九州', '101', 'か', '80000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州111う･･･1', '北九州', '111', 'う', '1', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州104か･･･1', '北九州', '104', 'か', '1', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州109き･･･1', '北九州', '109', 'き', '1', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州103ゆ･･･1', '北九州', '103', 'ゆ', '1', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州103か･･･2', '北九州', '103', 'か', '2', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州104え･･･3', '北九州', '104', 'え', '3', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('鹿児島101の･･･3', '鹿児島', '101', 'の', '3', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130を･･･4', '北九州', '130', 'を', '4', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101あ･･･5', '北九州', '101', 'あ', '5', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊133い･･･6', '筑豊', '133', 'い', '6', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州133う･･･6', '北九州', '133', 'う', '6', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131え･･･6', '北九州', '131', 'え', '6', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101き･･･7', '北九州', '101', 'き', '7', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･･･7', '北九州', '100', 'き', '7', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100ぬ･･･7', '北九州', '100', 'ぬ', '7', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州102･･･8', '北九州', '102', '', '8', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101き･･･8', '北九州', '101', 'き', '8', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州102け･･･8', '北九州', '102', 'け', '8', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100や･･･8', '北九州', '100', 'や', '8', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('名古屋133い･･･9', '名古屋', '133', 'い', '9', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130け･･･9', '北九州', '130', 'け', '9', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州132を･･10', '北九州', '132', 'を', '10', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('岡崎130う･･11', '岡崎', '130', 'う', '11', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州135う･･11', '北九州', '135', 'う', '11', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州135こ･･11', '北九州', '135', 'こ', '11', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130そ･･11', '北九州', '130', 'そ', '11', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州136を･･11', '北九州', '136', 'を', '11', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130け･･13', '筑豊', '130', 'け', '13', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州132あ･･14', '北九州', '132', 'あ', '14', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州133あ･･17', '北九州', '133', 'あ', '17', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830く･･18', '筑豊', '830', 'く', '18', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130ふ･･21', '北九州', '130', 'ふ', '21', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131け･･22', '北九州', '131', 'け', '22', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･025', '北九州', '130', 'う', '025', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か･･26', '北九州', '130', 'か', '26', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130う･･31', '筑豊', '130', 'う', '31', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830う･･32', '筑豊', '830', 'う', '32', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊132い･･33', '筑豊', '132', 'い', '33', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州133う･･33', '北九州', '133', 'う', '33', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('大分131さ･･33', '大分', '131', 'さ', '33', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('大分131は･･33', '大分', '131', 'は', '33', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830あ･･35', '筑豊', '830', 'あ', '35', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131あ･･40', '北九州', '131', 'あ', '40', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う1041', '北九州', '130', 'う', '1041', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100キ･･43', '北九州', '100', 'キ', '43', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･･43', '北九州', '100', 'き', '43', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11も･･44', '北九州', '11', 'も', '44', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130さ･･47', '北九州', '130', 'さ', '47', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州830う･･52', '北九州', '830', 'う', '52', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･･54', '北九州', '130', 'あ', '54', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131く･･55', '北九州', '131', 'く', '55', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か･･57', '北九州', '130', 'か', '57', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131い･･60', '北九州', '131', 'い', '60', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130き･･60', '北九州', '130', 'き', '60', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130ふ･･60', '北九州', '130', 'ふ', '60', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･･62', '北九州', '130', 'い', '62', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130え･･65', '筑豊', '130', 'え', '65', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('佐賀130こ･･66', '佐賀', '130', 'こ', '66', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130え･･68', '筑豊', '130', 'え', '68', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100け･･69', '北九州', '100', 'け', '69', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･･70', '北九州', '130', 'あ', '70', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130を･･70', '北九州', '130', 'を', '70', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･･73', '北九州', '100', 'き', '73', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･･77', '北九州', '130', 'い', '77', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州132い･･77', '北九州', '132', 'い', '77', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131あ･･78', '北九州', '131', 'あ', '78', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊800か･･79', '筑豊', '800', 'か', '79', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か･･81', '北九州', '130', 'か', '81', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州134あ･･88', '北九州', '134', 'あ', '88', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州132く･･88', '北九州', '132', 'く', '88', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('大分830い･･99', '大分', '830', 'い', '99', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･100', '北九州', '130', 'う', '100', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11ゆ･105', '北九州', '11', 'ゆ', '105', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131あ･106', '北九州', '131', 'あ', '106', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･106', '北九州', '130', 'あ', '106', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州103え･111', '北九州', '103', 'え', '111', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か･118', '北九州', '130', 'か', '118', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('鹿児島130か･123', '鹿児島', '130', 'か', '123', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊800か･125', '筑豊', '800', 'か', '125', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130い･126', '筑豊', '130', 'い', '126', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('山口130か･130', '山口', '130', 'か', '130', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11ゆ･135', '北九州', '11', 'ゆ', '135', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･162', '北九州', '130', 'う', '162', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('きた130い･166', 'きた', '130', 'い', '166', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･166', '北九州', '130', 'い', '166', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･167', '北九州', '130', 'い', '167', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･168', '北九州', '130', 'い', '168', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130い･174', '筑豊', '130', 'い', '174', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･180', '北九州', '130', 'あ', '180', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('宮城130あ･186', '宮城', '130', 'あ', '186', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･188', '北九州', '100', 'き', '188', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･194', '北九州', '100', 'き', '194', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('長崎130か･200', '長崎', '130', 'か', '200', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･211', '北九州', '100', 'き', '211', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100ゆ･213', '北九州', '100', 'ゆ', '213', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･214', '北九州', '100', 'え', '214', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･230', '北九州', '130', 'う', '230', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･244', '北九州', '130', 'あ', '244', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･273', '北九州', '100', 'き', '273', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131う･300', '北九州', '131', 'う', '300', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州132う･300', '北九州', '132', 'う', '300', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え･300', '北九州', '130', 'え', '300', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131え･300', '北九州', '131', 'え', '300', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･309', '北九州', '100', 'き', '309', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･313', '北九州', '100', 'き', '313', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･325', '北九州', '130', 'あ', '325', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･329', '北九州', '100', 'き', '329', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101こ･333', '北九州', '101', 'こ', '333', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101を･333', '北九州', '101', 'を', '333', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･352', '北九州', '100', 'き', '352', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･372', '北九州', '100', 'き', '372', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す･374', '北九州', '100', 'す', '374', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･375', '北九州', '100', 'え', '375', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･380', '北九州', '100', 'え', '380', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･382', '北九州', '100', 'え', '382', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･385', '北九州', '100', 'え', '385', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･387', '北九州', '100', 'え', '387', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･388', '北九州', '100', 'え', '388', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･389', '北九州', '100', 'え', '389', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･394', '北九州', '100', 'え', '394', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･395', '北九州', '100', 'え', '395', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･396', '北九州', '100', 'え', '396', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･397', '北九州', '100', 'え', '397', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･399', '北九州', '100', 'え', '399', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･399', '北九州', '100', 'き', '399', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131あ･400', '北九州', '131', 'あ', '400', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･400', '北九州', '100', 'え', '400', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･401', '北九州', '100', 'え', '401', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･405', '北九州', '100', 'え', '405', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･407', '北九州', '100', 'え', '407', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130く･408', '北九州', '130', 'く', '408', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･411', '北九州', '100', 'え', '411', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･413', '北九州', '100', 'え', '413', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･415', '北九州', '130', 'う', '415', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･415', '北九州', '100', 'え', '415', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･416', '北九州', '130', 'う', '416', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か･416', '北九州', '100', 'か', '416', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130を･416', '北九州', '130', 'を', '416', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･417', '北九州', '130', 'い', '417', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･418', '北九州', '130', 'い', '418', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･418', '北九州', '100', 'え', '418', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･420', '北九州', '100', 'え', '420', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･421', '北九州', '130', 'い', '421', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･421', '北九州', '100', 'え', '421', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･422', '北九州', '100', 'き', '422', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･423', '北九州', '130', 'い', '423', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･423', '北九州', '100', 'え', '423', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･425', '北九州', '130', 'う', '425', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･425', '北九州', '100', 'え', '425', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･426', '北九州', '100', 'え', '426', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･427', '北九州', '130', 'い', '427', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･429', '北九州', '130', 'い', '429', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･430', '北九州', '100', 'え', '430', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･431', '北九州', '100', 'え', '431', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･436', '北九州', '100', 'え', '436', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･450', '北九州', '100', 'え', '450', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･453', '北九州', '130', 'い', '453', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100ゆ･453', '北九州', '100', 'ゆ', '453', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･458', '北九州', '130', 'い', '458', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･461', '北九州', '130', 'あ', '461', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･467', '北九州', '130', 'あ', '467', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･469', '北九州', '100', 'え', '469', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･472', '北九州', '130', 'い', '472', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･473', '北九州', '130', 'い', '473', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･475', '北九州', '130', 'あ', '475', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･475', '北九州', '130', 'い', '475', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･475', '北九州', '100', 'え', '475', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え･476', '北九州', '130', 'え', '476', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え･477', '北九州', '130', 'え', '477', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･478', '北九州', '130', 'い', '478', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え･478', '北九州', '130', 'え', '478', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･480', '北九州', '130', 'う', '480', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･482', '北九州', '130', 'う', '482', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･483', '北九州', '130', 'い', '483', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･491', '北九州', '100', 'え', '491', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･497', '北九州', '130', 'あ', '497', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州132い･500', '北九州', '132', 'い', '500', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･504', '北九州', '100', 'き', '504', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州1100え･510', '北九州', '1100', 'え', '510', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え･510', '北九州', '130', 'え', '510', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･511', '北九州', '130', 'あ', '511', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･511', '北九州', '130', 'い', '511', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州830た･520', '北九州', '830', 'た', '520', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･550', '北九州', '130', 'あ', '550', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州800か･552', '北九州', '800', 'か', '552', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･573', '北九州', '100', 'き', '573', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('福岡130あ･580', '福岡', '130', 'あ', '580', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す･585', '北九州', '100', 'す', '585', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('福岡130あ･586', '福岡', '130', 'あ', '586', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('福岡130い･588', '福岡', '130', 'い', '588', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･590', '北九州', '100', 'き', '590', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･594', '北九州', '100', 'き', '594', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131い･600', '北九州', '131', 'い', '600', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130を･600', '北九州', '130', 'を', '600', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え･610', '北九州', '130', 'え', '610', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･618', '北九州', '100', 'き', '618', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･620', '北九州', '130', 'い', '620', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州830さ･620', '北九州', '830', 'さ', '620', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('福岡130う･629', '福岡', '130', 'う', '629', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ･637', '筑豊', '130', 'あ', '637', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ･655', '筑豊', '130', 'あ', '655', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('佐賀130い･666', '佐賀', '130', 'い', '666', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･680', '北九州', '130', 'い', '680', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･700', '北九州', '130', 'い', '700', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131か･700', '北九州', '131', 'か', '700', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州800は･700', '北九州', '800', 'は', '700', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州800は･701', '北九州', '800', 'は', '701', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州830い･706', '北九州', '830', 'い', '706', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州830さ･706', '北九州', '830', 'さ', '706', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･707', '北九州', '130', 'う', '707', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130き･709', '北九州', '130', 'き', '709', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州830す･720', '北九州', '830', 'す', '720', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･736', '北九州', '100', 'き', '736', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･739', '北九州', '130', 'あ', '739', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･756', '北九州', '130', 'あ', '756', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州120い･759', '北九州', '120', 'い', '759', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･759', '北九州', '130', 'い', '759', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･763', '北九州', '130', 'あ', '763', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･765', '北九州', '130', 'あ', '765', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･768', '北九州', '130', 'あ', '768', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･769', '北九州', '130', 'あ', '769', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･769', '北九州', '100', 'き', '769', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･770', '北九州', '130', 'い', '770', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･771', '北九州', '130', 'あ', '771', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･771', '北九州', '130', 'う', '771', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･773', '北九州', '130', 'う', '773', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･774', '北九州', '130', 'い', '774', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･775', '北九州', '130', 'う', '775', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊800か･775', '筑豊', '800', 'か', '775', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･776', '北九州', '130', 'い', '776', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101き･777', '北九州', '101', 'き', '777', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101く･777', '北九州', '101', 'く', '777', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か･778', '北九州', '130', 'か', '778', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･779', '北九州', '130', 'う', '779', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･780', '北九州', '130', 'い', '780', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か･780', '北九州', '130', 'か', '780', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ･783', '筑豊', '130', 'あ', '783', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･783', '北九州', '130', 'う', '783', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ･785', '筑豊', '130', 'あ', '785', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130いい･786', '北九州', '130', 'いい', '786', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･786', '北九州', '130', 'い', '786', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･787', '北九州', '130', 'あ', '787', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･788', '北九州', '130', 'う', '788', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130き･789', '北九州', '130', 'き', '789', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･790', '北九州', '130', 'あ', '790', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･790', '北九州', '130', 'い', '790', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･790', '北九州', '130', 'う', '790', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130うい･792', '北九州', '130', 'うい', '792', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･792', '北九州', '130', 'い', '792', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･793', '北九州', '130', 'い', '793', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ･794', '筑豊', '130', 'あ', '794', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･795', '北九州', '130', 'い', '795', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･796', '北九州', '130', 'あ', '796', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･797', '北九州', '130', 'う', '797', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州132い･800', '北九州', '132', 'い', '800', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131え･800', '北九州', '131', 'え', '800', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え･800', '北九州', '130', 'え', '800', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('福岡130け･800', '福岡', '130', 'け', '800', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か･801', '北九州', '130', 'か', '801', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か･803', '北九州', '130', 'か', '803', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ･804', '筑豊', '130', 'あ', '804', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州1130か･805', '北九州', '1130', 'か', '805', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か･805', '北九州', '130', 'か', '805', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え･806', '北九州', '130', 'え', '806', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130いえ･807', '北九州', '130', 'いえ', '807', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え･807', '北九州', '130', 'え', '807', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･809', '北九州', '130', 'あ', '809', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130こ･810', '北九州', '130', 'こ', '810', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･812', '北九州', '130', 'い', '812', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え･813', '北九州', '130', 'え', '813', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･815', '北九州', '130', 'い', '815', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･816', '北九州', '130', 'い', '816', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130う･817', '筑豊', '130', 'う', '817', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ･820', '筑豊', '130', 'あ', '820', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･820', '北九州', '130', 'う', '820', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･821', '北九州', '130', 'い', '821', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊800か･821', '筑豊', '800', 'か', '821', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･822', '北九州', '130', 'あ', '822', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･823', '北九州', '130', 'あ', '823', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い･824', '北九州', '130', 'い', '824', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･825', '北九州', '130', 'う', '825', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う･826', '北九州', '130', 'う', '826', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か･828', '北九州', '130', 'か', '828', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州132う･830', '北九州', '132', 'う', '830', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え･831', '北九州', '130', 'え', '831', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ･832', '筑豊', '130', 'あ', '832', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ･834', '筑豊', '130', 'あ', '834', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830あ･840', '筑豊', '830', 'あ', '840', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830あ･841', '筑豊', '830', 'あ', '841', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830あ･842', '筑豊', '830', 'あ', '842', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は･857', '北九州', '100', 'は', '857', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州800か･864', '北九州', '800', 'か', '864', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･882', '北九州', '100', 'え', '882', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･884', '北九州', '100', 'え', '884', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･886', '北九州', '100', 'え', '886', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･887', '北九州', '100', 'え', '887', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州102く･888', '北九州', '102', 'く', '888', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･889', '北九州', '100', 'え', '889', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･890', '北九州', '100', 'え', '890', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･900', '北九州', '100', 'き', '900', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か･901', '北九州', '130', 'か', '901', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･902', '北九州', '100', 'き', '902', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･903', '北九州', '100', 'き', '903', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･931', '北九州', '100', 'え', '931', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け･931', '北九州', '11', 'け', '931', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え･932', '北九州', '100', 'え', '932', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('久留米100え･937', '久留米', '100', 'え', '937', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ･948', '北九州', '130', 'あ', '948', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き･981', '北九州', '100', 'き', '981', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州102く･999', '北九州', '102', 'く', '999', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州103あ1000', '北九州', '103', 'あ', '1000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う1000', '北九州', '130', 'う', '1000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州102か1000', '北九州', '102', 'か', '1000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101す1000', '北九州', '101', 'す', '1000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130い1003', '筑豊', '130', 'い', '1003', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ1007', '筑豊', '130', 'あ', '1007', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え1009', '北九州', '130', 'え', '1009', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1017', '北九州', '100', 'き', '1017', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130いえ1025', '北九州', '130', 'いえ', '1025', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え1025', '北九州', '130', 'え', '1025', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130き1025', '北九州', '130', 'き', '1025', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1028', '北九州', '100', 'き', '1028', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ1029', '北九州', '100', 'あ', '1029', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1029', '北九州', '100', 'き', '1029', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い1040', '北九州', '130', 'い', '1040', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1042', '北九州', '130', 'あ', '1042', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1043', '北九州', '130', 'あ', '1043', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1044', '北九州', '130', 'あ', '1044', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1045', '北九州', '130', 'あ', '1045', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1048', '北九州', '100', 'き', '1048', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い1056', '北九州', '130', 'い', '1056', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う1060', '北九州', '130', 'う', '1060', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1060', '北九州', '100', 'き', '1060', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1061', '北九州', '130', 'あ', '1061', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い1062', '北九州', '130', 'い', '1062', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え1080', '北九州', '130', 'え', '1080', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え1087', '北九州', '100', 'え', '1087', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え1088', '北九州', '100', 'え', '1088', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131い1100', '北九州', '131', 'い', '1100', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131か1100', '北九州', '131', 'か', '1100', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1100', '北九州', '100', 'き', '1100', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130ち1100', '北九州', '130', 'ち', '1100', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か1102', '北九州', '100', 'か', '1102', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え1104', '北九州', '100', 'え', '1104', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100い1111', '北九州', '100', 'い', '1111', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え1119', '北九州', '100', 'え', '1119', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1122', '北九州', '100', 'き', '1122', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1127', '北九州', '100', 'き', '1127', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1143', '北九州', '130', 'あ', '1143', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え1144', '北九州', '130', 'え', '1144', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1182', '北九州', '130', 'あ', '1182', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1198', '北九州', '100', 'き', '1198', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130こ1200', '北九州', '130', 'こ', '1200', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1301', '北九州', '100', 'き', '1301', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830あ1312', '筑豊', '830', 'あ', '1312', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1329', '北九州', '100', 'き', '1329', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1331', '北九州', '100', 'き', '1331', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊100は1344', '筑豊', '100', 'は', '1344', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊100か1354', '筑豊', '100', 'か', '1354', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1369', '北九州', '100', 'き', '1369', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か1378', '北九州', '100', 'か', '1378', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1381', '北九州', '100', 'き', '1381', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う1401', '北九州', '130', 'う', '1401', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130さ1403', '北九州', '130', 'さ', '1403', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830あ1406', '筑豊', '830', 'あ', '1406', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1450', '北九州', '100', 'き', '1450', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1451', '北九州', '100', 'き', '1451', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1453', '北九州', '130', 'あ', '1453', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1458', '北九州', '100', 'き', '1458', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1459', '北九州', '100', 'き', '1459', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1476', '北九州', '100', 'き', '1476', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('京都100き1491', '京都', '100', 'き', '1491', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130い1506', '筑豊', '130', 'い', '1506', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あい1506', '筑豊', '130', 'あい', '1506', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130う1506', '筑豊', '130', 'う', '1506', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1534', '北九州', '100', 'き', '1534', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1545', '北九州', '100', 'き', '1545', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1555', '北九州', '130', 'あ', '1555', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1556', '北九州', '100', 'き', '1556', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い1562', '北九州', '130', 'い', '1562', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1582', '北九州', '130', 'あ', '1582', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1583', '北九州', '130', 'あ', '1583', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('横浜130う1600', '横浜', '130', 'う', '1600', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130き1600', '北九州', '130', 'き', '1600', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か1601', '北九州', '130', 'か', '1601', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か1602', '北九州', '130', 'か', '1602', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130い1603', '筑豊', '130', 'い', '1603', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130う1603', '筑豊', '130', 'う', '1603', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1604', '北九州', '130', 'あ', '1604', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130い1605', '筑豊', '130', 'い', '1605', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('三重100え1620', '三重', '100', 'え', '1620', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ1629', '北九州', '100', 'あ', '1629', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1629', '北九州', '100', 'き', '1629', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830あ1656', '筑豊', '830', 'あ', '1656', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は1661', '北九州', '100', 'は', '1661', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('山口130あ1683', '山口', '130', 'あ', '1683', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は1690', '北九州', '100', 'は', '1690', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い1700', '北九州', '130', 'い', '1700', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130き1700', '北九州', '130', 'き', '1700', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830あ1712', '筑豊', '830', 'あ', '1712', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1729', '北九州', '130', 'あ', '1729', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1743', '北九州', '100', 'き', '1743', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1767', '北九州', '100', 'き', '1767', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1768', '北九州', '130', 'あ', '1768', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊100は1773', '筑豊', '100', 'は', '1773', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1785', '北九州', '100', 'き', '1785', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130く1800', '北九州', '130', 'く', '1800', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1805', '北九州', '100', 'き', '1805', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か1807', '北九州', '100', 'か', '1807', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い1812', '北九州', '130', 'い', '1812', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1865', '北九州', '100', 'き', '1865', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1873', '北九州', '100', 'き', '1873', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1881', '北九州', '130', 'あ', '1881', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130せ1881', '北九州', '130', 'せ', '1881', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か1900', '北九州', '130', 'か', '1900', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え1901', '北九州', '130', 'え', '1901', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か1901', '北九州', '130', 'か', '1901', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い1906', '北九州', '130', 'い', '1906', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か1909', '北九州', '130', 'か', '1909', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1918', '北九州', '100', 'き', '1918', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い1942', '北九州', '130', 'い', '1942', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1952', '北九州', '100', 'き', '1952', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す1959', '北九州', '100', 'す', '1959', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き1962', '北九州', '100', 'き', '1962', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ1971', '北九州', '130', 'あ', '1971', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い1971', '北九州', '130', 'い', '1971', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う1971', '北九州', '130', 'う', '1971', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ1992', '筑豊', '130', 'あ', '1992', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州102こ2000', '北九州', '102', 'こ', '2000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100ひ2000', '北九州', '100', 'ひ', '2000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131え2001', '北九州', '131', 'え', '2001', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州132え2002', '北九州', '132', 'え', '2002', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2007', '北九州', '100', 'き', '2007', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え2010', '北九州', '130', 'え', '2010', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ2014', '北九州', '130', 'あ', '2014', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う2016', '北九州', '130', 'う', '2016', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ2017', '北九州', '130', 'あ', '2017', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ2019', '北九州', '130', 'あ', '2019', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州132う2020', '北九州', '132', 'う', '2020', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う2020', '北九州', '130', 'う', '2020', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131え2020', '北九州', '131', 'え', '2020', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131き2020', '北九州', '131', 'き', '2020', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131け2020', '北九州', '131', 'け', '2020', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州830す2020', '北九州', '830', 'す', '2020', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('鹿児島130う2021', '鹿児島', '130', 'う', '2021', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130こ2021', '北九州', '130', 'こ', '2021', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は2025', '北九州', '100', 'は', '2025', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2070', '北九州', '100', 'き', '2070', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ2086', '北九州', '130', 'あ', '2086', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2087', '北九州', '100', 'き', '2087', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か2095', '北九州', '100', 'か', '2095', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か2100', '北九州', '130', 'か', '2100', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2102', '北九州', '100', 'え', '2102', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2111', '北九州', '100', 'き', '2111', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2141', '北九州', '100', 'き', '2141', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2153', '北九州', '100', 'き', '2153', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2171', '北九州', '100', 'き', '2171', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('横浜100え2173', '横浜', '100', 'え', '2173', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い2180', '北九州', '130', 'い', '2180', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州800か2199', '北九州', '800', 'か', '2199', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う2202', '北九州', '130', 'う', '2202', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130け2206', '北九州', '130', 'け', '2206', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ2210', '北九州', '100', 'あ', '2210', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100け2222', '北九州', '100', 'け', '2222', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100こ2222', '北九州', '100', 'こ', '2222', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す2224', '北九州', '100', 'す', '2224', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か2232', '北九州', '100', 'か', '2232', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2254', '北九州', '100', 'き', '2254', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2273', '北九州', '100', 'き', '2273', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2282', '北九州', '100', 'き', '2282', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2285', '北九州', '100', 'き', '2285', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2286', '北九州', '100', 'き', '2286', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う2288', '北九州', '130', 'う', '2288', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2292', '北九州', '100', 'き', '2292', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ2300', '北九州', '130', 'あ', '2300', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は2300', '北九州', '100', 'は', '2300', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2303', '北九州', '100', 'き', '2303', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2315', '北九州', '100', 'え', '2315', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2316', '北九州', '100', 'き', '2316', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2333', '北九州', '100', 'き', '2333', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2358', '北九州', '100', 'き', '2358', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2364', '北九州', '100', 'え', '2364', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2380', '北九州', '100', 'き', '2380', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か2444', '北九州', '100', 'か', '2444', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か2445', '北九州', '100', 'か', '2445', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州00か2445', '北九州', '00', 'か', '2445', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2445', '北九州', '100', 'き', '2445', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2452', '北九州', '100', 'き', '2452', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2453', '北九州', '100', 'き', '2453', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2465', '北九州', '100', 'え', '2465', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州800か2465', '北九州', '800', 'か', '2465', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2476', '北九州', '100', 'き', '2476', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は2476', '北九州', '100', 'は', '2476', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2477', '北九州', '100', 'き', '2477', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は2480', '北九州', '100', 'は', '2480', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2485', '北九州', '100', 'き', '2485', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('京都100き2491', '京都', '100', 'き', '2491', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州1002503', '北九州', '1002503', '', '', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2503', '北九州', '100', 'き', '2503', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2504', '北九州', '100', 'き', '2504', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2526', '北九州', '100', 'き', '2526', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か2538', '北九州', '100', 'か', '2538', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ2568', '北九州', '130', 'あ', '2568', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('横浜130あ2569', '横浜', '130', 'あ', '2569', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州800か2583', '北九州', '800', 'か', '2583', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2598', '北九州', '100', 'え', '2598', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2600', '北九州', '100', 'き', '2600', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100さ2609', '北九州', '100', 'さ', '2609', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2620', '北九州', '100', 'え', '2620', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2621', '北九州', '100', 'え', '2621', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州800か2624', '北九州', '800', 'か', '2624', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('横浜11け2629', '横浜', '11', 'け', '2629', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い2634', '北九州', '130', 'い', '2634', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は2635', '北九州', '100', 'は', '2635', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2656', '北九州', '100', 'え', '2656', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2658', '北九州', '100', 'き', '2658', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2664', '北九州', '100', 'え', '2664', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2669', '北九州', '100', 'え', '2669', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州800か2669', '北九州', '800', 'か', '2669', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2670', '北九州', '100', 'え', '2670', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2688', '北九州', '100', 'き', '2688', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2689', '北九州', '100', 'き', '2689', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2698', '北九州', '100', 'え', '2698', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ2703', '北九州', '130', 'あ', '2703', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊100か2721', '筑豊', '100', 'か', '2721', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊100か2722', '筑豊', '100', 'か', '2722', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2724', '北九州', '100', 'き', '2724', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2747', '北九州', '100', 'き', '2747', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2767', '北九州', '100', 'き', '2767', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2779', '北九州', '100', 'き', '2779', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2867', '北九州', '100', 'き', '2867', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2871', '北九州', '100', 'え', '2871', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2872', '北九州', '100', 'え', '2872', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2872', '北九州', '100', 'き', '2872', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2889', '北九州', '100', 'き', '2889', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2897', '北九州', '100', 'き', '2897', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2900', '北九州', '100', 'え', '2900', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き2918', '北九州', '100', 'き', '2918', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('横浜130あ2920', '横浜', '130', 'あ', '2920', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2924', '北九州', '100', 'え', '2924', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は2924', '北九州', '100', 'は', '2924', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('横浜100そ2932', '横浜', '100', 'そ', '2932', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ2963', '北九州', '130', 'あ', '2963', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100さ2963', '北九州', '100', 'さ', '2963', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('福岡100え2964', '福岡', '100', 'え', '2964', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('福岡100え2965', '福岡', '100', 'え', '2965', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州か2975', '北九州か', '2975', '', '', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か2975', '北九州', '100', 'か', '2975', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2977', '北九州', '100', 'え', '2977', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え2979', '北九州', '100', 'え', '2979', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い2981', '北九州', '130', 'い', '2981', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('福岡100え2981', '福岡', '100', 'え', '2981', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ2983', '北九州', '130', 'あ', '2983', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ2983', '北九州', '100', 'あ', '2983', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ2984', '北九州', '130', 'あ', '2984', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ2985', '北九州', '130', 'あ', '2985', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ2986', '北九州', '130', 'あ', '2986', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ2996', '北九州', '130', 'あ', '2996', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ2997', '北九州', '130', 'あ', '2997', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ2997', '北九州', '100', 'あ', '2997', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州102い3000', '北九州', '102', 'い', '3000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100く3000', '北九州', '100', 'く', '3000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100け3000', '北九州', '100', 'け', '3000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か3001', '北九州', '130', 'か', '3001', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('k北九州130か3002', 'k北九州', '130', 'か', '3002', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か3005', '北九州', '130', 'か', '3005', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3012', '北九州', '100', 'え', '3012', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ3038', '北九州', '100', 'あ', '3038', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ3054', '北九州', '100', 'あ', '3054', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3068', '北九州', '100', 'え', '3068', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え3100', '北九州', '130', 'え', '3100', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3141', '北九州', '100', 'え', '3141', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3161', '北九州', '100', 'え', '3161', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3162', '北九州', '100', 'え', '3162', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3173', '北九州', '100', 'き', '3173', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3182', '北九州', '100', 'き', '3182', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う3200', '北九州', '130', 'う', '3200', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3201', '北九州', '130', 'あ', '3201', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ3201', '筑豊', '130', 'あ', '3201', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い3201', '北九州', '130', 'い', '3201', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3202', '北九州', '130', 'あ', '3202', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う3202', '北九州', '130', 'う', '3202', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う3203', '北九州', '130', 'う', '3203', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3204', '北九州', '130', 'あ', '3204', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ3205', '筑豊', '130', 'あ', '3205', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3205', '北九州', '100', 'き', '3205', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い3206', '北九州', '130', 'い', '3206', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3207', '北九州', '130', 'あ', '3207', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う3207', '北九州', '130', 'う', '3207', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い3208', '北九州', '130', 'い', '3208', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3209', '北九州', '130', 'あ', '3209', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3210', '北九州', '130', 'あ', '3210', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3211', '北九州', '130', 'あ', '3211', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う3212', '北九州', '130', 'う', '3212', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は3218', '北九州', '100', 'は', '3218', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い3230', '北九州', '130', 'い', '3230', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3240', '北九州', '130', 'あ', '3240', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3240', '北九州', '100', 'き', '3240', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州1100え3245', '北九州', '1100', 'え', '3245', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3245', '北九州', '100', 'え', '3245', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3246', '北九州', '100', 'え', '3246', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3255', '北九州', '100', 'き', '3255', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か3259', '北九州', '100', 'か', '3259', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け3266', '北九州', '11', 'け', '3266', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け3267', '北九州', '11', 'け', '3267', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い3288', '北九州', '130', 'い', '3288', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3296', '北九州', '130', 'あ', '3296', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3297', '北九州', '130', 'あ', '3297', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い3300', '北九州', '130', 'い', '3300', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え3300', '北九州', '130', 'え', '3300', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3302', '北九州', '130', 'あ', '3302', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3302', '北九州', '100', 'え', '3302', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い3303', '北九州', '130', 'い', '3303', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3308', '北九州', '100', 'き', '3308', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3314', '北九州', '100', 'き', '3314', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3315', '北九州', '100', 'き', '3315', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州102き3333', '北九州', '102', 'き', '3333', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3335', '北九州', '100', 'き', '3335', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は3339', '北九州', '100', 'は', '3339', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す3373', '北九州', '100', 'す', '3373', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3381', '北九州', '130', 'あ', '3381', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3396', '北九州', '130', 'あ', '3396', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3409', '北九州', '100', 'え', '3409', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3410', '北九州', '100', 'き', '3410', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す3411', '北九州', '100', 'す', '3411', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊100か3424', '筑豊', '100', 'か', '3424', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は3451', '北九州', '100', 'は', '3451', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3475', '北九州', '100', 'き', '3475', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ3478', '北九州', '100', 'あ', '3478', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3491', '北九州', '100', 'き', '3491', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え3500', '北九州', '130', 'え', '3500', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('キャブ00き3500', 'キャブ', '00', 'き', '3500', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3500', '北九州', '100', 'き', '3500', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か3501', '北九州', '100', 'か', '3501', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3508', '北九州', '100', 'え', '3508', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3509', '北九州', '100', 'え', '3509', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3517', '北九州', '100', 'き', '3517', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830あ3529', '筑豊', '830', 'あ', '3529', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3533', '北九州', '100', 'え', '3533', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3534', '北九州', '100', 'え', '3534', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3535', '北九州', '100', 'え', '3535', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3536', '北九州', '100', 'え', '3536', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3541', '北九州', '100', 'え', '3541', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3547', '北九州', '130', 'あ', '3547', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か3552', '北九州', '100', 'か', '3552', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け3557', '北九州', '11', 'け', '3557', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3558', '北九州', '100', 'き', '3558', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3579', '北九州', '130', 'あ', '3579', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3595', '北九州', '130', 'あ', '3595', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3602', '北九州', '130', 'あ', '3602', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ3606', '北九州', '130', 'あ', '3606', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3608', '北九州', '100', 'き', '3608', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3609', '北九州', '100', 'え', '3609', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3610', '北九州', '100', 'え', '3610', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3611', '北九州', '100', 'え', '3611', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3612', '北九州', '100', 'え', '3612', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3613', '北九州', '100', 'え', '3613', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11そ3621', '北九州', '11', 'そ', '3621', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3656', '北九州', '100', 'き', '3656', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3664', '北九州', '100', 'え', '3664', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は3665', '北九州', '100', 'は', '3665', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3666', '北九州', '100', 'え', '3666', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3667', '北九州', '100', 'え', '3667', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3676', '北九州', '100', 'え', '3676', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3681', '北九州', '100', 'え', '3681', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3682', '北九州', '100', 'え', '3682', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3683', '北九州', '100', 'え', '3683', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3685', '北九州', '100', 'え', '3685', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3686', '北九州', '100', 'え', '3686', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は3689', '北九州', '100', 'は', '3689', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か3690', '北九州', '100', 'か', '3690', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3696', '北九州', '100', 'え', '3696', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3705', '北九州', '100', 'え', '3705', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊100か3708', '筑豊', '100', 'か', '3708', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3710', '北九州', '100', 'き', '3710', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100さ3710', '北九州', '100', 'さ', '3710', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3730', '北九州', '100', 'き', '3730', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3739', '北九州', '100', 'き', '3739', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3747', '北九州', '100', 'き', '3747', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130さ3748', '筑豊', '130', 'さ', '3748', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3751', '北九州', '100', 'き', '3751', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3762', '北九州', '100', 'え', '3762', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3763', '北九州', '100', 'え', '3763', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3765', '北九州', '100', 'き', '3765', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3770', '北九州', '100', 'え', '3770', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3771', '北九州', '100', 'え', '3771', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3772', '北九州', '100', 'え', '3772', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3773', '北九州', '100', 'え', '3773', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3774', '北九州', '100', 'え', '3774', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3775', '北九州', '100', 'え', '3775', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3776', '北九州', '100', 'え', '3776', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3777', '北九州', '100', 'え', '3777', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3783', '北九州', '100', 'え', '3783', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100は3817', '北九州', '100', 'は', '3817', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け3835', '北九州', '11', 'け', '3835', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き3879', '北九州', '100', 'き', '3879', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か3897', '北九州', '100', 'か', '3897', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3903', '北九州', '100', 'え', '3903', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3913', '北九州', '100', 'え', '3913', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ3921', '北九州', '100', 'あ', '3921', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え3940', '北九州', '100', 'え', '3940', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊100か3952', '筑豊', '100', 'か', '3952', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4006', '北九州', '100', 'え', '4006', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4008', '北九州', '100', 'え', '4008', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う4010', '北九州', '130', 'う', '4010', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4010', '北九州', '100', 'え', '4010', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4011', '北九州', '100', 'き', '4011', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11そ4011', '北九州', '11', 'そ', '4011', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4012', '北九州', '130', 'あ', '4012', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ4012', '北九州', '100', 'あ', '4012', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4012', '北九州', '100', 'え', '4012', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4013', '北九州', '130', 'あ', '4013', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4013', '北九州', '100', 'え', '4013', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4017', '北九州', '100', 'え', '4017', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4018', '北九州', '130', 'あ', '4018', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4019', '北九州', '130', 'あ', '4019', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4023', '北九州', '100', 'え', '4023', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130そ4023', '北九州', '130', 'そ', '4023', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4024', '北九州', '100', 'え', '4024', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4024', '北九州', '100', 'き', '4024', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4025', '北九州', '100', 'え', '4025', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11せ4027', '北九州', '11', 'せ', '4027', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4030', '北九州', '130', 'あ', '4030', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4031', '北九州', '130', 'あ', '4031', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4034', '北九州', '100', 'え', '4034', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4045', '北九州', '100', 'き', '4045', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4049', '北九州', '130', 'あ', '4049', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い4050', '北九州', '130', 'い', '4050', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4051', '北九州', '11', 'け', '4051', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4052', '北九州', '11', 'け', '4052', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4054', '北九州', '11', 'け', '4054', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4057', '北九州', '11', 'け', '4057', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4059', '北九州', '130', 'あ', '4059', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4059', '北九州', '11', 'け', '4059', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4060', '北九州', '11', 'け', '4060', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か4061', '北九州', '100', 'か', '4061', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4061', '北九州', '11', 'け', '4061', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4062', '北九州', '11', 'け', '4062', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4064', '北九州', '130', 'あ', '4064', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う4065', '北九州', '130', 'う', '4065', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4065', '北九州', '100', 'き', '4065', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い4066', '北九州', '130', 'い', '4066', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4067', '北九州', '130', 'あ', '4067', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4068', '北九州', '130', 'あ', '4068', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4072', '北九州', '130', 'あ', '4072', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4073', '北九州', '100', 'き', '4073', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4075', '北九州', '11', 'け', '4075', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4077', '北九州', '100', 'え', '4077', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4080', '北九州', '100', 'き', '4080', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4082', '北九州', '100', 'き', '4082', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4084', '北九州', '100', 'き', '4084', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4089', '北九州', '130', 'あ', '4089', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4090', '北九州', '130', 'あ', '4090', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4091', '北九州', '130', 'あ', '4091', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4092', '北九州', '130', 'あ', '4092', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4109', '北九州', '130', 'あ', '4109', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4110', '北九州', '130', 'あ', '4110', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4111', '北九州', '130', 'あ', '4111', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4115', '北九州', '100', 'き', '4115', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い4120', '北九州', '130', 'い', '4120', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い4121', '北九州', '130', 'い', '4121', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4129', '北九州', '130', 'あ', '4129', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ4139', '北九州', '100', 'あ', '4139', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ4145', '北九州', '100', 'あ', '4145', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4196', '北九州', '100', 'え', '4196', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4200', '北九州', '130', 'あ', '4200', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4201', '北九州', '130', 'あ', '4201', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4201', '北九州', '100', 'え', '4201', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4202', '北九州', '130', 'あ', '4202', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ4203', '北九州', '100', 'あ', '4203', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4203', '北九州', '130', 'あ', '4203', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4203', '北九州', '100', 'え', '4203', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4203', '北九州', '11', 'け', '4203', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4204', '北九州', '130', 'あ', '4204', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100さ4207', '北九州', '100', 'さ', '4207', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11い4209', '北九州', '11', 'い', '4209', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4215', '北九州', '11', 'け', '4215', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4222', '北九州', '11', 'け', '4222', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か4229', '北九州', '100', 'か', '4229', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('山口100か4262', '山口', '100', 'か', '4262', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4281', '北九州', '100', 'え', '4281', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4283', '北九州', '130', 'あ', '4283', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4287', '北九州', '100', 'え', '4287', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4299', '北九州', '100', 'え', '4299', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4317', '北九州', '11', 'け', '4317', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4343', '北九州', '11', 'け', '4343', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4351', '北九州', '11', 'け', '4351', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4352', '北九州', '11', 'け', '4352', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4353', '北九州', '11', 'け', '4353', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ4360', '北九州', '100', 'あ', '4360', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4364', '北九州', '100', 'き', '4364', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4370', '北九州', '100', 'え', '4370', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ4378', '北九州', '100', 'あ', '4378', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4399', '北九州', '100', 'き', '4399', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100さ4399', '北九州', '100', 'さ', '4399', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4401', '北九州', '100', 'え', '4401', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す4422', '北九州', '100', 'す', '4422', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4432', '北九州', '11', 'け', '4432', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131あ4444', '北九州', '131', 'あ', '4444', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130ふ4444', '北九州', '130', 'ふ', '4444', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130を4444', '北九州', '130', 'を', '4444', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4450', '北九州', '11', 'け', '4450', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4455', '北九州', '11', 'け', '4455', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け4457', '北九州', '11', 'け', '4457', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4473', '北九州', '100', 'き', '4473', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州800す4487', '北九州', '800', 'す', '4487', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う4500', '北九州', '130', 'う', '4500', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4543', '北九州', '100', 'え', '4543', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4550', '北九州', '100', 'き', '4550', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4559', '北九州', '100', 'き', '4559', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か4599', '北九州', '100', 'か', '4599', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4622', '北九州', '100', 'え', '4622', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4637', '北九州', '100', 'え', '4637', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4644', '北九州', '100', 'え', '4644', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4664', '北九州', '100', 'え', '4664', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4679', '北九州', '100', 'え', '4679', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4680', '北九州', '100', 'え', '4680', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4683', '北九州', '100', 'え', '4683', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4684', '北九州', '100', 'え', '4684', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100さ4702', '北九州', '100', 'さ', '4702', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4739', '北九州', '100', 'き', '4739', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4751', '北九州', '100', 'え', '4751', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4772', '北九州', '100', 'え', '4772', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130さ4774', '筑豊', '130', 'さ', '4774', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4793', '北九州', '100', 'え', '4793', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4799', '北九州', '100', 'え', '4799', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4808', '北九州', '100', 'え', '4808', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ4811', '北九州', '100', 'あ', '4811', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ4823', '北九州', '100', 'あ', '4823', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4853', '北九州', '100', 'え', '4853', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4857', '北九州', '100', 'え', '4857', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4888', '北九州', '100', 'え', '4888', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す4893', '北九州', '100', 'す', '4893', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ4895', '北九州', '100', 'あ', '4895', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4902', '北九州', '100', 'え', '4902', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き4904', '北九州', '100', 'き', '4904', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す4933', '北九州', '100', 'す', '4933', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4952', '北九州', '100', 'え', '4952', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4953', '北九州', '100', 'え', '4953', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4976', '北九州', '130', 'あ', '4976', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ4976', '北九州', '100', 'あ', '4976', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ4981', '北九州', '130', 'あ', '4981', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4986', '北九州', '100', 'え', '4986', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え4988', '北九州', '100', 'え', '4988', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('福岡100き4994', '福岡', '100', 'き', '4994', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ4997', '北九州', '100', 'あ', '4997', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('福岡100え4999', '福岡', '100', 'え', '4999', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('福岡100き4999', '福岡', '100', 'き', '4999', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101を5000', '北九州', '101', 'を', '5000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130く5002', '北九州', '130', 'く', '5002', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130け5002', '北九州', '130', 'け', '5002', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊100か5010', '筑豊', '100', 'か', '5010', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100キ5011', '北九州', '100', 'キ', '5011', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い5016', '北九州', '130', 'い', '5016', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き5026', '北九州', '100', 'き', '5026', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す5026', '北九州', '100', 'す', '5026', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ5081', '北九州', '100', 'あ', '5081', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か5100', '北九州', '130', 'か', '5100', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え5123', '北九州', '100', 'え', '5123', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え5124', '北九州', '100', 'え', '5124', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え5125', '北九州', '100', 'え', '5125', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え5126', '北九州', '100', 'え', '5126', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え5127', '北九州', '100', 'え', '5127', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え5128', '北九州', '100', 'え', '5128', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830あ5141', '筑豊', '830', 'あ', '5141', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え5158', '北九州', '100', 'え', '5158', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('横浜11け5160', '横浜', '11', 'け', '5160', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え5167', '北九州', '100', 'え', '5167', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え5172', '北九州', '100', 'え', '5172', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か5172', '北九州', '100', 'か', '5172', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊100か5188', '筑豊', '100', 'か', '5188', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ5197', '北九州', '100', 'あ', '5197', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か5238', '北九州', '100', 'か', '5238', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('佐賀100か5287', '佐賀', '100', 'か', '5287', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え5300', '北九州', '100', 'え', '5300', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('横浜11け5350', '横浜', '11', 'け', '5350', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け5378', '北九州', '11', 'け', '5378', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け5397', '北九州', '11', 'け', '5397', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ5425', '北九州', '100', 'あ', '5425', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ5465', '北九州', '100', 'あ', '5465', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊100か5471', '筑豊', '100', 'か', '5471', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う5511', '北九州', '130', 'う', '5511', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か5522', '北九州', '100', 'か', '5522', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ5523', '北九州', '100', 'あ', '5523', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('大分100は5536', '大分', '100', 'は', '5536', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か5538', '北九州', '100', 'か', '5538', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州103け5555', '北九州', '103', 'け', '5555', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('横浜100え5632', '横浜', '100', 'え', '5632', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け5656', '北九州', '11', 'け', '5656', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け5667', '北九州', '11', 'け', '5667', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す5681', '北九州', '100', 'す', '5681', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す5699', '北九州', '100', 'す', '5699', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す5714', '北九州', '100', 'す', '5714', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ5718', '北九州', '100', 'あ', '5718', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ5728', '北九州', '100', 'あ', '5728', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州800す5731', '北九州', '800', 'す', '5731', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州800す5734', '北九州', '800', 'す', '5734', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ5743', '北九州', '100', 'あ', '5743', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ5745', '北九州', '100', 'あ', '5745', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か5756', '北九州', '100', 'か', '5756', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か5816', '北九州', '100', 'か', '5816', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ5825', '北九州', '100', 'あ', '5825', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か5861', '北九州', '100', 'か', '5861', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ5888', '北九州', '100', 'あ', '5888', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('佐賀130あ5900', '佐賀', '130', 'あ', '5900', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か5921', '北九州', '100', 'か', '5921', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100き5921', '北九州', '100', 'き', '5921', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か5930', '北九州', '100', 'か', '5930', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ5941', '北九州', '100', 'あ', '5941', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け5947', '北九州', '11', 'け', '5947', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け5950', '北九州', '11', 'け', '5950', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け5953', '北九州', '11', 'け', '5953', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か5957', '北九州', '100', 'か', '5957', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('横浜11け5971', '横浜', '11', 'け', '5971', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か5976', '北九州', '100', 'か', '5976', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ5979', '北九州', '100', 'あ', '5979', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('横浜11け5983', '横浜', '11', 'け', '5983', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う6000', '北九州', '130', 'う', '6000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131う6000', '北九州', '131', 'う', '6000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131け6000', '北九州', '131', 'け', '6000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11せ6010', '北九州', '11', 'せ', '6010', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('久留米100か6050', '久留米', '100', 'か', '6050', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6063', '北九州', '100', 'か', '6063', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う6100', '北九州', '130', 'う', '6100', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う6118', '北九州', '130', 'う', '6118', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ6121', '北九州', '100', 'あ', '6121', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊100か6155', '筑豊', '100', 'か', '6155', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ6158', '北九州', '100', 'あ', '6158', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6176', '北九州', '100', 'か', '6176', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6183', '北九州', '100', 'か', '6183', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6203', '北九州', '100', 'か', '6203', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6213', '北九州', '100', 'か', '6213', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6258', '北九州', '100', 'か', '6258', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ6325', '北九州', '100', 'あ', '6325', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6339', '北九州', '100', 'か', '6339', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ6355', '北九州', '100', 'あ', '6355', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6380', '北九州', '100', 'か', '6380', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6432', '北九州', '100', 'か', '6432', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('山口100か6434', '山口', '100', 'か', '6434', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6447', '北九州', '100', 'か', '6447', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6471', '北九州', '100', 'か', '6471', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す6481', '北九州', '100', 'す', '6481', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6536', '北九州', '100', 'か', '6536', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ6544', '北九州', '100', 'あ', '6544', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け6546', '北九州', '11', 'け', '6546', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け6547', '北九州', '11', 'け', '6547', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('広島100き6567', '広島', '100', 'き', '6567', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830あ6569', '筑豊', '830', 'あ', '6569', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6596', '北九州', '100', 'か', '6596', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ6634', '北九州', '100', 'あ', '6634', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6666', '北九州', '100', 'か', '6666', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('相模100か6672', '相模', '100', 'か', '6672', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6676', '北九州', '100', 'か', '6676', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('佐賀100か6677', '佐賀', '100', 'か', '6677', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ6683', '北九州', '100', 'あ', '6683', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6727', '北九州', '100', 'か', '6727', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け6744', '北九州', '11', 'け', '6744', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ6753', '北九州', '100', 'あ', '6753', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ6755', '北九州', '100', 'あ', '6755', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か6788', '北九州', '100', 'か', '6788', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ6833', '北九州', '100', 'あ', '6833', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け6926', '北九州', '11', 'け', '6926', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11け6929', '北九州', '11', 'け', '6929', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州102い7000', '北九州', '102', 'い', '7000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('亀裂2け7007', '亀裂', '2', 'け', '7007', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ7075', '北九州', '130', 'あ', '7075', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130さ7077', '筑豊', '130', 'さ', '7077', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ7078', '北九州', '130', 'あ', '7078', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ7083', '北九州', '130', 'あ', '7083', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ7084', '北九州', '130', 'あ', '7084', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ7085', '北九州', '130', 'あ', '7085', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ7097', '北九州', '100', 'あ', '7097', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ7114', '北九州', '130', 'あ', '7114', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か7117', '北九州', '130', 'か', '7117', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('大分100か7123', '大分', '100', 'か', '7123', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い7124', '北九州', '130', 'い', '7124', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('熊本100は7133', '熊本', '100', 'は', '7133', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ7140', '北九州', '100', 'あ', '7140', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ7197', '北九州', '100', 'あ', '7197', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か7201', '北九州', '100', 'か', '7201', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ7214', '北九州', '100', 'あ', '7214', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ7287', '北九州', '130', 'あ', '7287', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か7462', '北九州', '100', 'か', '7462', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ7466', '北九州', '100', 'あ', '7466', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ7468', '北九州', '100', 'あ', '7468', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ7481', '北九州', '100', 'あ', '7481', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か7585', '北九州', '100', 'か', '7585', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ7640', '北九州', '100', 'あ', '7640', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か7660', '北九州', '100', 'か', '7660', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ7694', '北九州', '100', 'あ', '7694', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か7717', '北九州', '100', 'か', '7717', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('佐賀100か7755', '佐賀', '100', 'か', '7755', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('宮城130あ7765', '宮城', '130', 'あ', '7765', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11や7872', '北九州', '11', 'や', '7872', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か7885', '北九州', '100', 'か', '7885', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ7914', '北九州', '130', 'あ', '7914', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か7919', '北九州', '100', 'か', '7919', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ7940', '北九州', '130', 'あ', '7940', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か7962', '北九州', '100', 'か', '7962', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か7983', '北九州', '100', 'か', '7983', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州800い8000', '北九州', '800', 'い', '8000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101か8000', '北九州', '101', 'か', '8000', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('横浜130あ8005', '横浜', '130', 'あ', '8005', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131け8008', '北九州', '131', 'け', '8008', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131こ8008', '北九州', '131', 'こ', '8008', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ8013', '北九州', '100', 'あ', '8013', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('久留米100か8039', '久留米', '100', 'か', '8039', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ8047', '北九州', '100', 'あ', '8047', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11や8093', '北九州', '11', 'や', '8093', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ8100', '北九州', '130', 'あ', '8100', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ8104', '北九州', '100', 'あ', '8104', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ8175', '北九州', '100', 'あ', '8175', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え8181', '北九州', '130', 'え', '8181', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8183', '北九州', '100', 'か', '8183', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ8220', '北九州', '100', 'あ', '8220', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100す8246', '北九州', '100', 'す', '8246', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8291', '北九州', '100', 'か', '8291', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8306', '北九州', '100', 'か', '8306', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8384', '北九州', '100', 'か', '8384', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州44や8404', '北九州', '44', 'や', '8404', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8406', '北九州', '100', 'か', '8406', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8409', '北九州', '100', 'か', '8409', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8491', '北九州', '100', 'か', '8491', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ8496', '北九州', '100', 'あ', '8496', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州あ8497', '北九州あ', '8497', '', '', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ8514', '北九州', '130', 'あ', '8514', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ8517', '北九州', '100', 'あ', '8517', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8536', '北九州', '100', 'か', '8536', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ8545', '北九州', '100', 'あ', '8545', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8551', '北九州', '100', 'か', '8551', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8555', '北九州', '100', 'か', '8555', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8601', '北九州', '100', 'か', '8601', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8603', '北九州', '100', 'か', '8603', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8604', '北九州', '100', 'か', '8604', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ8647', '北九州', '100', 'あ', '8647', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ8653', '北九州', '100', 'あ', '8653', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('久留米100か8677', '久留米', '100', 'か', '8677', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8682', '北九州', '100', 'か', '8682', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ8692', '北九州', '100', 'あ', '8692', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8708', '北九州', '100', 'か', '8708', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('久留米100か8708', '久留米', '100', 'か', '8708', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8744', '北九州', '100', 'か', '8744', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100さ8752', '北九州', '100', 'さ', '8752', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ8754', '北九州', '130', 'あ', '8754', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ8774', '北九州', '100', 'あ', '8774', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130を8800', '北九州', '130', 'を', '8800', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州30を8800', '北九州', '30', 'を', '8800', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('久留米100か8801', '久留米', '100', 'か', '8801', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え8802', '北九州', '130', 'え', '8802', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う8803', '北九州', '130', 'う', '8803', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う8804', '北九州', '130', 'う', '8804', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う8805', '北九州', '130', 'う', '8805', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130さ8858', '北九州', '130', 'さ', '8858', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州00か8863', '北九州', '00', 'か', '8863', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8863', '北九州', '100', 'か', '8863', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8864', '北九州', '100', 'か', '8864', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('大分100さ8869', '大分', '100', 'さ', '8869', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州101え8888', '北九州', '101', 'え', '8888', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130う8899', '北九州', '130', 'う', '8899', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8937', '北九州', '100', 'か', '8937', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('大分100か8962', '大分', '100', 'か', '8962', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8962', '北九州', '100', 'か', '8962', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か8990', '北九州', '100', 'か', '8990', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州11き9001', '北九州', '11', 'き', '9001', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ9036', '北九州', '100', 'あ', '9036', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9070', '北九州', '100', 'か', '9070', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9119', '北九州', '100', 'か', '9119', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100さ9153', '北九州', '100', 'さ', '9153', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9212', '北九州', '100', 'か', '9212', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('大分100か9229', '大分', '100', 'か', '9229', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ9230', '北九州', '130', 'あ', '9230', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9243', '北九州', '100', 'か', '9243', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9307', '北九州', '100', 'か', '9307', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9345', '北九州', '100', 'か', '9345', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9378', '北九州', '100', 'か', '9378', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100さ9383', '北九州', '100', 'さ', '9383', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9458', '北九州', '100', 'か', '9458', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9565', '北九州', '100', 'か', '9565', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9566', '北九州', '100', 'か', '9566', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9577', '北九州', '100', 'か', '9577', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9594', '北九州', '100', 'か', '9594', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9595', '北九州', '100', 'か', '9595', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('福岡100あ9600', '福岡', '100', 'あ', '9600', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ9610', '北九州', '130', 'あ', '9610', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9670', '北九州', '100', 'か', '9670', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ9690', '北九州', '130', 'あ', '9690', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9700', '北九州', '100', 'か', '9700', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9779', '北九州', '100', 'か', '9779', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9892', '北九州', '100', 'か', '9892', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('k北九州100か9892', 'k北九州', '100', 'か', '9892', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9930', '北九州', '100', 'か', '9930', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('宇都宮100か9957', '宇都宮', '100', 'か', '9957', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100か9987', '北九州', '100', 'か', '9987', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('不明999ん9998', '不明', '', '', '', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('新車999ん9999', '不明', '', '', '', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('構内車・101', '構内', '', '', '101', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い・168', '北九州', '130', 'い', '168', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ・794', '筑豊', '130', 'あ', '794', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い・812', '北九州', '130', 'い', '812', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い‣511', '北九州', '130', 'い', '511', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('構内車101', '構内', '', '', '101', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('構内車103', '構内', '', '', '103', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130・･67', '筑豊', '130', '', '67', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ655', '筑豊', '130', 'あ', '655', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ768', '北九州', '130', 'あ', '768', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130あ769', '北九州', '130', 'あ', '769', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊130あ794', '筑豊', '130', 'あ', '794', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830あ840', '筑豊', '830', 'あ', '840', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100あ864', '北九州', '100', 'あ', '864', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い780', '北九州', '130', 'い', '780', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い793', '北九州', '130', 'い', '793', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州100え386', '北九州', '100', 'え', '386', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130え476', '北九州', '130', 'え', '476', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か118', '北九州', '130', 'か', '118', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130か805', '北九州', '130', 'か', '805', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130き789', '北九州', '130', 'き', '789', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州131く700', '北九州', '131', 'く', '700', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('筑豊830う32', '筑豊', '830', 'う', '32', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('北九州130い‣11', '北九州', '130', 'い', '11', 0, NULL, true, NOW(), NOW());
INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES ('機内車', '構内', '', '', '', 0, NULL, true, NOW(), NOW());

-- 件名-登録番号関連データ投入

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '行橋市・みやこ町清掃施設組合' AND r.registration_number = '北九州101を50000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州101か80000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社清翔産業' AND r.registration_number = '北九州111う･･･1'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社青浜建設' AND r.registration_number = '北九州104か･･･1'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社アスリートトラフィック' AND r.registration_number = '北九州109き･･･1'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社エコー商会' AND r.registration_number = '北九州103ゆ･･･1'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社アスリートトラフィック' AND r.registration_number = '北九州103か･･･2'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州104え･･･3'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社活慎産業' AND r.registration_number = '鹿児島101の･･･3'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州130を･･･4'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州101あ･･･5'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州101あ･･･5'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '仲島運送有限会社' AND r.registration_number = '筑豊133い･･･6'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社アスリートトラフィック' AND r.registration_number = '北九州133う･･･6'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州131え･･･6'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州101き･･･7'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州100き･･･7'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社エコー商会' AND r.registration_number = '北九州100ぬ･･･7'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州102･･･8'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社三栄運輸' AND r.registration_number = '北九州101き･･･8'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州102け･･･8'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社エコー商会' AND r.registration_number = '北九州100や･･･8'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社アスリートトラフィック' AND r.registration_number = '名古屋133い･･･9'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州130け･･･9'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'パッシブル有限会社' AND r.registration_number = '北九州132を･･10'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社前寛商事' AND r.registration_number = '岡崎130う･･11'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社三栄運輸' AND r.registration_number = '北九州135う･･11'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '上田産業株式会社' AND r.registration_number = '北九州135こ･･11'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社太田古鐵商店' AND r.registration_number = '北九州130そ･･11'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州136を･･11'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社MLS' AND r.registration_number = '筑豊130け･･13'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州132あ･･14'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州133あ･･17'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '丸正運送株式会社' AND r.registration_number = '筑豊830く･･18'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社パインカーゴ' AND r.registration_number = '北九州130ふ･･21'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社三栄運輸' AND r.registration_number = '北九州131け･･22'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130う･025'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州130か･･26'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社永田興業' AND r.registration_number = '筑豊130う･･31'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '丸正運送株式会社' AND r.registration_number = '筑豊830う･･32'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '仲島運送有限会社' AND r.registration_number = '筑豊132い･･33'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州133う･･33'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社水屋' AND r.registration_number = '大分131さ･･33'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社水屋' AND r.registration_number = '大分131は･･33'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '丸正運送株式会社' AND r.registration_number = '筑豊830あ･･35'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社上野商会' AND r.registration_number = '北九州131あ･･40'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130う1041'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100キ･･43'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100き･･43'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社木下金属' AND r.registration_number = '北九州11も･･44'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社太田古鐵商店' AND r.registration_number = '北九州130さ･･47'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '周防運輸有限会社' AND r.registration_number = '北九州830う･･52'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '周防運輸有限会社' AND r.registration_number = '北九州130あ･･54'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '周防運輸有限会社' AND r.registration_number = '北九州131く･･55'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '周防運輸有限会社' AND r.registration_number = '北九州130か･･57'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社上野商会' AND r.registration_number = '北九州131い･･60'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '周防運輸有限会社' AND r.registration_number = '北九州130き･･60'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '愛宕自動車工業株式会社' AND r.registration_number = '北九州130ふ･･60'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '周防運輸有限会社' AND r.registration_number = '北九州130い･･62'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社裕伸' AND r.registration_number = '筑豊130え･･65'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ラインシステム' AND r.registration_number = '佐賀130こ･･66'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '丸正運送株式会社' AND r.registration_number = '筑豊130え･･68'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州100け･･69'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州130あ･･70'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社上野商会' AND r.registration_number = '北九州130を･･70'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ゼロ・プラス九州' AND r.registration_number = '北九州100き･･73'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社三栄運輸' AND r.registration_number = '北九州130い･･77'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社三栄運輸' AND r.registration_number = '北九州132い･･77'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州131あ･･78'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '丸正運送株式会社' AND r.registration_number = '筑豊800か･･79'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社パインカーゴ' AND r.registration_number = '北九州130か･･81'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州134あ･･88'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社豊田興業' AND r.registration_number = '北九州132く･･88'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社アイエヌロジスティクス' AND r.registration_number = '大分830い･･99'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社パインカーゴ' AND r.registration_number = '北九州130う･100'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社オート貿易' AND r.registration_number = '北九州11ゆ･105'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社牧運輸' AND r.registration_number = '北九州131あ･106'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社牧運輸' AND r.registration_number = '北九州130あ･106'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケーツー企画' AND r.registration_number = '北九州103え･111'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社森若商会' AND r.registration_number = '北九州130か･118'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社松下運輸' AND r.registration_number = '鹿児島130か･123'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '丸正運送株式会社' AND r.registration_number = '筑豊800か･125'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社D-LITS' AND r.registration_number = '筑豊130い･126'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ガンバコーポレーション' AND r.registration_number = '山口130か･130'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '太田古鉄商店' AND r.registration_number = '北九州11ゆ･135'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '九州紙運輸株式会社' AND r.registration_number = '北九州130う･162'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '九州紙運輸株式会社' AND r.registration_number = 'きた130い･166'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '九州紙運輸株式会社' AND r.registration_number = '北九州130い･166'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '九州紙運輸株式会社' AND r.registration_number = '北九州130い･167'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '九州紙運輸株式会社' AND r.registration_number = '北九州130い･168'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野運送　中野正博' AND r.registration_number = '筑豊130い･174'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'パッシブル有限会社' AND r.registration_number = '北九州130あ･180'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '大森運送株式会社' AND r.registration_number = '宮城130あ･186'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100き･188'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ユニプレス物流株式会社' AND r.registration_number = '北九州100き･194'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'パッシブル有限会社' AND r.registration_number = '長崎130か･200'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社大雄産業' AND r.registration_number = '北九州100き･211'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '国土交通省大阪航空局北九州空港事務所' AND r.registration_number = '北九州100ゆ･213'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州100え･214'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'パッシブル有限会社' AND r.registration_number = '北九州130う･230'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州130あ･244'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100き･273'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州131う･300'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州132う･300'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州130え･300'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州131え･300'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '宮田運送株式会社' AND r.registration_number = '北九州100き･309'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き･313'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社青浜建設' AND r.registration_number = '北九州130あ･325'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社青浜建設' AND r.registration_number = '北九州130あ･325'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイエム運輸機工' AND r.registration_number = '北九州100き･329'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州101こ･333'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州101を･333'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100き･352'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '北九州100き･372'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社富士技研' AND r.registration_number = '北九州100す･374'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '北九州100え･375'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･380'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･382'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･385'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･387'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･388'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･389'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･394'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･395'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･396'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･397'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･399'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイエム運輸機工' AND r.registration_number = '北九州100き･399'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州131あ･400'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･400'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･401'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･405'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･407'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130く･408'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･411'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･413'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州130う･415'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･415'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130う･416'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州100か･416'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130を･416'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州130い･417'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州130い･418'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･418'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･420'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130い･421'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･421'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き･422'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き･422'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130い･423'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･423'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130う･425'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･425'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･426'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130い･427'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130い･429'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･430'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･431'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･436'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･450'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130い･453'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '曽根金属工業株式会社' AND r.registration_number = '北九州100ゆ･453'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130い･458'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州130あ･461'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130あ･467'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック海上輸送課' AND r.registration_number = '北九州100え･469'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州130い･472'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130い･473'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州130あ･475'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130い･475'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･475'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130え･476'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130え･477'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130い･478'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130え･478'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130う･480'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130う･482'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130い･483'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え･491'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130あ･497'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州132い･500'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100き･504'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州1100え･510'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州130え･510'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130あ･511'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州130い･511'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '丸屋商事株式会社' AND r.registration_number = '北九州830た･520'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'パッシブル有限会社' AND r.registration_number = '北九州130あ･550'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社セフティワン' AND r.registration_number = '北九州800か･552'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '北九州100き･573'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東陸ロジテック株式会社' AND r.registration_number = '福岡130あ･580'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '塚本精工株式会社' AND r.registration_number = '北九州100す･585'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東陸ロジテック株式会社' AND r.registration_number = '福岡130あ･586'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東陸ロジテック株式会社' AND r.registration_number = '福岡130い･588'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '日通北九州運輸株式会社' AND r.registration_number = '北九州100き･590'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ユニプレス物流株式会社' AND r.registration_number = '北九州100き･594'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州131い･600'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州130を･600'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東陸ロジステック株式会社九州事業所' AND r.registration_number = '北九州130え･610'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '河津産業有限会社' AND r.registration_number = '北九州100き･618'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州130い･620'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '丸屋商事株式会社' AND r.registration_number = '北九州830さ･620'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ニッポンロジ株式会社' AND r.registration_number = '福岡130う･629'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊130あ･637'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊130あ･655'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '佐賀130い･666'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'パッシブル有限会社' AND r.registration_number = '北九州130い･680'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社清翔産業' AND r.registration_number = '北九州130い･700'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'パッシブル有限会社' AND r.registration_number = '北九州131か･700'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社共和' AND r.registration_number = '北九州800は･700'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社共和' AND r.registration_number = '北九州800は･701'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社共和' AND r.registration_number = '北九州830い･706'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社共和' AND r.registration_number = '北九州830さ･706'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130う･707'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130き･709'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '丸屋商事株式会社' AND r.registration_number = '北九州830す･720'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州100き･736'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ･739'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ･756'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州120い･759'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･759'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ･763'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ･765'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ･768'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ･769'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイエム運輸機工' AND r.registration_number = '北九州100き･769'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･770'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ･771'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130う･771'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130う･773'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･774'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130う･775'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '丸正運送株式会社' AND r.registration_number = '筑豊800か･775'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･776'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･776'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州101き･777'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州101く･777'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ユートランス' AND r.registration_number = '北九州130か･778'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130う･779'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･780'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'パッシブル有限会社' AND r.registration_number = '北九州130か･780'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊130あ･783'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130う･783'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊130あ･785'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130いい･786'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･786'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ･787'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130う･788'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130き･789'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ･790'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･790'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'パッシブル有限会社' AND r.registration_number = '北九州130う･790'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130うい･792'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･792'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･793'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊130あ･794'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･795'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ･796'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130う･797'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州132い･800'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州131え･800'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130え･800'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社森通商' AND r.registration_number = '福岡130け･800'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130か･801'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130か･803'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊130あ･804'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州1130か･805'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130か･805'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130え･806'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130いえ･807'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130え･807'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ･809'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'パッシブル有限会社' AND r.registration_number = '北九州130こ･810'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･812'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130え･813'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･815'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･816'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊130う･817'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊130あ･820'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'パッシブル有限会社' AND r.registration_number = '北九州130う･820'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･821'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ヤマガタ本社車輌部' AND r.registration_number = '筑豊800か･821'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ･822'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ･823'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い･824'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130う･825'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ユートランス' AND r.registration_number = '北九州130う･826'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130か･828'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州132う･830'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130え･831'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊130あ･832'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊130あ･834'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社永田興業' AND r.registration_number = '筑豊830あ･840'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社永田興業' AND r.registration_number = '筑豊830あ･841'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社永田興業' AND r.registration_number = '筑豊830あ･842'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三友建設工業株式会社' AND r.registration_number = '北九州100は･857'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'Lib株式会社' AND r.registration_number = '北九州800か･864'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･882'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･884'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･886'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･887'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州102く･888'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･889'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え･890'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100き･900'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州130か･901'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き･902'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き･903'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100え･931'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州11け･931'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100え･932'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '久留米100え･937'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州130あ･948'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100き･981'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州102く･999'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '行橋市・みやこ町清掃施設組合' AND r.registration_number = '北九州103あ1000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130う1000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　北九州物流サービス' AND r.registration_number = '北九州102か1000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社晃栄建設' AND r.registration_number = '北九州101す1000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイティトランスポート' AND r.registration_number = '筑豊130い1003'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ティー・エル・エス' AND r.registration_number = '筑豊130あ1007'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ユートランス' AND r.registration_number = '北九州130え1009'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州100き1017'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州130いえ1025'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州130え1025'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130き1025'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き1028'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100あ1029'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き1029'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130い1040'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130う1041'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130あ1042'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130あ1043'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130あ1044'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130あ1045'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '河津産業有限会社' AND r.registration_number = '北九州100き1048'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130い1056'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130う1060'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '北九州100き1060'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ1061'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130い1062'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130え1080'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100え1087'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100え1088'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州131い1100'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ラックライド株式会社' AND r.registration_number = '北九州131か1100'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社SONEKIN　WORKS' AND r.registration_number = '北九州100き1100'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社磯部' AND r.registration_number = '北九州130ち1100'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100か1102'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100え1104'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州100い1111'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100え1119'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '嶋本運送株式会社' AND r.registration_number = '北九州100き1122'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100き1127'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ1143'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130え1144'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ1182'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　北九州物流サービス' AND r.registration_number = '北九州100き1198'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州130こ1200'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100き1301'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイティトランスポート' AND r.registration_number = '筑豊830あ1312'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100き1329'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州100き1331'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社双葉商会' AND r.registration_number = '筑豊100は1344'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊100か1354'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　北九州物流サービス' AND r.registration_number = '北九州100き1369'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社大雄産業' AND r.registration_number = '北九州100か1378'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100き1381'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州130う1401'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '丸屋商事株式会社' AND r.registration_number = '北九州130さ1403'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイティトランスポート' AND r.registration_number = '筑豊830あ1406'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き1450'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き1451'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ1453'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100き1458'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100き1459'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100き1476'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社NBSロジソル' AND r.registration_number = '京都100き1491'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイティトランスポート' AND r.registration_number = '筑豊130い1506'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイティトランスポート' AND r.registration_number = '筑豊130あい1506'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイティトランスポート' AND r.registration_number = '筑豊130う1506'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社SONEKIN　WORKS' AND r.registration_number = '北九州100き1534'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100き1545'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ1555'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社アイエヌライン' AND r.registration_number = '北九州100き1556'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130い1562'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ1582'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ1583'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '横浜130う1600'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州130き1600'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州130か1601'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州130か1602'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイティトランスポート' AND r.registration_number = '筑豊130い1603'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイティトランスポート' AND r.registration_number = '筑豊130う1603'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ1604'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイティトランスポート' AND r.registration_number = '筑豊130い1605'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '長田産業株式会社' AND r.registration_number = '三重100え1620'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100あ1629'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き1629'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイティトランスポート' AND r.registration_number = '筑豊830あ1656'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三友建設工業株式会社' AND r.registration_number = '北九州100は1661'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '大森運送株式会社' AND r.registration_number = '山口130あ1683'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '曾根金属工業株式会社' AND r.registration_number = '北九州100は1690'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社清翔産業' AND r.registration_number = '北九州130い1700'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州130き1700'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイティトランスポート' AND r.registration_number = '筑豊830あ1712'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ1729'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100き1743'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州100き1767'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社大雄産業' AND r.registration_number = '北九州130あ1768'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '香春石灰化学工業株式会社' AND r.registration_number = '筑豊100は1773'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　北九州物流サービス' AND r.registration_number = '北九州100き1785'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州130く1800'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き1805'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100か1807'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　北九州物流サービス' AND r.registration_number = '北九州130い1812'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100き1865'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100き1873'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州130あ1881'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '京築酒類販売株式会社' AND r.registration_number = '北九州130せ1881'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '藤澤環境開発株式会社' AND r.registration_number = '北九州130か1900'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州130え1901'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州130か1901'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社北九州物流サービス' AND r.registration_number = '北九州130い1906'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社啓愛社' AND r.registration_number = '北九州130か1909'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き1918'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130い1942'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100き1952'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '二引株式会社' AND r.registration_number = '北九州100す1959'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州100き1962'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社森若商会' AND r.registration_number = '北九州130あ1971'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社森若商会' AND r.registration_number = '北九州130い1971'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社森若商会' AND r.registration_number = '北九州130う1971'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社富永運輸' AND r.registration_number = '筑豊130あ1992'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州102こ2000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社晃栄建設' AND r.registration_number = '北九州100ひ2000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州131え2001'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州132え2002'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社SONEKIN　WORKS' AND r.registration_number = '北九州100き2007'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '小倉第一運送有限会社' AND r.registration_number = '北九州130え2010'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州130あ2014'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州130う2016'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州130あ2017'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州130あ2019'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社松本組' AND r.registration_number = '北九州132う2020'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社松本組' AND r.registration_number = '北九州130う2020'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州131え2020'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州131き2020'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州131け2020'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社大雄産業' AND r.registration_number = '北九州830す2020'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社松下運輸' AND r.registration_number = '鹿児島130う2021'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州130こ2021'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '国土交通省大阪航空局北九州空港事務所' AND r.registration_number = '北九州100は2025'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き2070'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ2086'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き2087'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州100か2095'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州130か2100'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100え2102'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州100き2111'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ユニプレス物流株式会社' AND r.registration_number = '北九州100き2141'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社翔陸運' AND r.registration_number = '北九州100き2153'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ユニプレス物流株式会社' AND r.registration_number = '北九州100き2171'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '横浜100え2173'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130い2180'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '現金払い' AND r.registration_number = '北九州800か2199'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'マコトロジテック株式会社' AND r.registration_number = '北九州130う2202'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイエム運輸機工' AND r.registration_number = '北九州130け2206'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州100あ2210'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州100け2222'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100こ2222'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社日栄紙工社' AND r.registration_number = '北九州100す2224'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社大雄産業' AND r.registration_number = '北九州100か2232'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社翔陸運' AND r.registration_number = '北九州100き2254'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100き2273'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き2282'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '茂木運送有限会社' AND r.registration_number = '北九州100き2285'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社アイエヌライン' AND r.registration_number = '北九州100き2286'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社内本開発' AND r.registration_number = '北九州130う2288'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き2292'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州130あ2300'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ダイワ' AND r.registration_number = '北九州100は2300'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100き2303'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100え2315'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き2316'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100き2333'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100き2358'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100え2364'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100き2380'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100か2444'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100か2445'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州00か2445'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100き2445'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き2452'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き2453'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100え2465'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州800か2465'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き2476'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '現金払い' AND r.registration_number = '北九州100は2476'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100き2477'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '曽根金属工業株式会社' AND r.registration_number = '北九州100は2480'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100き2485'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社D＆Jロジスティクス' AND r.registration_number = '京都100き2491'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州1002503'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100き2503'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '北九州100き2504'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州100き2526'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100か2538'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州130あ2568'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '横浜130あ2569'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '九州運輸建設株式会社' AND r.registration_number = '北九州800か2583'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '藤原運輸株式会社' AND r.registration_number = '北九州100え2598'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100き2600'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社大雄産業' AND r.registration_number = '北九州100さ2609'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '北九州100え2620'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '北九州100え2621'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州800か2624'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社コヤマ物流' AND r.registration_number = '横浜11け2629'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州豊運輸株式会社' AND r.registration_number = '北九州130い2634'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '曽根金属工業株式会社' AND r.registration_number = '北九州100は2635'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え2656'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き2658'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100え2664'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100え2669'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州800か2669'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100え2670'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社松本組' AND r.registration_number = '北九州100き2688'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社松本組' AND r.registration_number = '北九州100き2689'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100え2698'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州130あ2703'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊100か2721'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊100か2722'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100き2724'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'フコク物流株式会社' AND r.registration_number = '北九州100き2747'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州100き2767'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100き2779'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100き2867'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100え2871'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100え2872'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き2872'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き2889'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100き2897'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100え2900'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社第一建設工業' AND r.registration_number = '北九州100き2918'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '横浜130あ2920'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '北九州100え2924'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '苅田工業部制部門経費' AND r.registration_number = '北九州100は2924'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社日産クリエイティブサービス' AND r.registration_number = '横浜100そ2932'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州130あ2963'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三友建設工業株式会社' AND r.registration_number = '北九州100さ2963'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '協栄ライン株式会社' AND r.registration_number = '福岡100え2964'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '協栄ライン株式会社' AND r.registration_number = '福岡100え2965'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社森若商会' AND r.registration_number = '北九州か2975'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社森若商会' AND r.registration_number = '北九州100か2975'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100え2977'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100え2979'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130い2981'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '協栄ライン株式会社' AND r.registration_number = '福岡100え2981'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ2983'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100あ2983'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ2984'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ2985'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ2986'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ2996'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ2997'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100あ2997'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '行橋市・みやこ町清掃施設組合' AND r.registration_number = '北九州102い3000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100く3000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100け3000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州130か3001'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = 'k北九州130か3002'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州130か3005'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3012'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100あ3038'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州産業運輸株式会社' AND r.registration_number = '北九州100あ3054'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100え3068'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社清翔産業' AND r.registration_number = '北九州130え3100'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3141'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100え3161'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100え3162'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100き3173'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社アイエヌライン' AND r.registration_number = '北九州100き3182'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社清翔産業' AND r.registration_number = '北九州130う3200'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130あ3201'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '筑豊130あ3201'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130い3201'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130あ3202'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130う3202'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130う3203'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130あ3204'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '筑豊130あ3205'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケーツー企画' AND r.registration_number = '北九州100き3205'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130い3206'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130あ3207'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130う3207'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130い3208'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130あ3209'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130あ3210'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130あ3211'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130う3212'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '曾根金属工業株式会社' AND r.registration_number = '北九州100は3218'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州130い3230'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野産業株式会社' AND r.registration_number = '北九州130あ3240'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社トス･エクスプレス' AND r.registration_number = '北九州100き3240'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州1100え3245'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100え3245'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100え3246'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き3255'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '九州西濃運輸株式会社' AND r.registration_number = '北九州100か3259'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州11け3266'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州11け3267'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130い3288'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ3296'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ3297'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '協立運輸株式会社' AND r.registration_number = '北九州130い3300'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社清翔産業' AND r.registration_number = '北九州130え3300'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ3302'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100え3302'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130い3303'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100き3308'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100き3314'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100き3315'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州102き3333'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き3335'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '曽根金属工業株式会社' AND r.registration_number = '北九州100は3339'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社みやけ商会' AND r.registration_number = '北九州100す3373'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ3381'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ3396'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100え3409'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州100き3410'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '苅田工場部整部門経費' AND r.registration_number = '北九州100す3411'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '筑豊100か3424'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '曽根金属工業株式会社' AND r.registration_number = '北九州100は3451'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100き3475'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100あ3478'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100き3491'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社清翔産業' AND r.registration_number = '北九州130え3500'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = 'キャブ00き3500'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き3500'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社森若商会' AND r.registration_number = '北九州100か3501'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3508'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3509'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '北九州100き3517'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ヤマガタ本社車輌部' AND r.registration_number = '筑豊830あ3529'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3533'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3534'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3535'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3536'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100え3541'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州130あ3547'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '玄海産業株式会社' AND r.registration_number = '北九州100か3552'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州11け3557'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100き3558'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130あ3579'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社エムアイ通商' AND r.registration_number = '北九州130あ3595'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州130あ3602'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州130あ3606'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '河津産業有限会社' AND r.registration_number = '北九州100き3608'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3609'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3610'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え3611'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3612'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3613'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社晃栄建設' AND r.registration_number = '北九州11そ3621'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き3656'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3664'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '凡申産業株式会社' AND r.registration_number = '北九州100は3665'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3666'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3667'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社SONEKIN　WORKS' AND r.registration_number = '北九州100え3676'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3681'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3682'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3683'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3685'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3686'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '苅田工場部整部門経費' AND r.registration_number = '北九州100は3689'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州100か3690'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社SONEKIN　WORKS' AND r.registration_number = '北九州100え3696'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社SONEKIN　WORKS' AND r.registration_number = '北九州100え3705'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社原田運送' AND r.registration_number = '筑豊100か3708'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100き3710'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100さ3710'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'カリツーオートテクノ株式会社' AND r.registration_number = '北九州100き3730'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'カリツーオートテクノ株式会社' AND r.registration_number = '北九州100き3739'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100き3747'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '八谷紙工株式会社' AND r.registration_number = '筑豊130さ3748'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き3751'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3762'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3763'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ラックライド株式会社' AND r.registration_number = '北九州100き3765'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3770'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3771'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3772'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3773'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3774'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3775'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3776'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え3777'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社SONEKIN　WORKS' AND r.registration_number = '北九州100え3783'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社エコー商会' AND r.registration_number = '北九州100は3817'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州11け3835'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100き3879'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100か3897'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '北九州100え3903'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '北九州100え3913'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州100あ3921'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社アイエヌライン' AND r.registration_number = '北九州100え3940'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社エスワイプロモーション' AND r.registration_number = '筑豊100か3952'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4006'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4008'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130う4010'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4010'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100き4011'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '無' AND r.registration_number = '北九州11そ4011'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4012'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100あ4012'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4012'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4013'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4013'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4017'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ4018'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ4019'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4023'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '無' AND r.registration_number = '北九州130そ4023'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4024'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100き4024'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4025'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社晃栄建設' AND r.registration_number = '北九州11せ4027'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4030'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4031'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州100え4034'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き4045'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4049'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130い4050'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州11け4051'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州11け4052'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州11け4054'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州11け4057'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ4059'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州11け4059'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州11け4060'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田町運送有限会社' AND r.registration_number = '北九州100か4061'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州11け4061'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州11け4062'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ4064'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130う4065'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100き4065'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130い4066'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ4067'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ4068'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ4072'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100き4073'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州11け4075'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州100え4077'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊能運送株式会社' AND r.registration_number = '北九州100き4080'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊能運送株式会社' AND r.registration_number = '北九州100き4082'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100き4084'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ4089'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4090'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4091'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4092'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4109'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4110'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4111'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き4115'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130い4120'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130い4121'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ4129'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '宮西設備株式会社' AND r.registration_number = '北九州100あ4139'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '宮西設備株式会社' AND r.registration_number = '北九州100あ4145'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社SONEKIN　WORKS' AND r.registration_number = '北九州100え4196'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4200'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4201'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社SONEKIN　WORKS' AND r.registration_number = '北九州100え4201'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4202'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100あ4203'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州130あ4203'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え4203'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州11け4203'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4204'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社富士技研' AND r.registration_number = '北九州100さ4207'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州11い4209'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州11け4215'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州11け4222'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社エムアイ通商' AND r.registration_number = '北九州100か4229'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社西都流通システム' AND r.registration_number = '山口100か4262'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '玄海産業株式会社' AND r.registration_number = '北九州100え4281'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社翼LINE' AND r.registration_number = '北九州130あ4283'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '玄海産業株式会社' AND r.registration_number = '北九州100え4287'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '北九州100え4299'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州11け4317'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州11け4343'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州11け4351'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州11け4352'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州11け4353'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '佐川急便株式会社' AND r.registration_number = '北九州100あ4360'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100き4364'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '北九州100え4370'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州100あ4378'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100き4399'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100さ4399'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100え4401'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社みやけ商会' AND r.registration_number = '北九州100す4422'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州11け4432'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州131あ4444'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社稲田運輸' AND r.registration_number = '北九州130ふ4444'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社稲田運輸' AND r.registration_number = '北九州130を4444'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州11け4450'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州11け4455'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州11け4457'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100き4473'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ゼロ･プラス九州　九州カスタマーサービスセンター' AND r.registration_number = '北九州800す4487'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社清翔産業' AND r.registration_number = '北九州130う4500'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社SONEKIN　WORKS' AND r.registration_number = '北九州100え4543'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100き4550'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100き4559'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100か4599'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州100え4622'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社SONEKIN　WORKS' AND r.registration_number = '北九州100え4637'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え4644'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4664'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4679'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4680'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4683'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4684'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三友建設工業株式会社' AND r.registration_number = '北九州100さ4702'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100き4739'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州100え4751'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州100え4772'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '香春石灰化学工業株式会社' AND r.registration_number = '筑豊130さ4774'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　VIP' AND r.registration_number = '北九州100え4793'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州100え4799'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州100え4808'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100あ4811'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州100あ4823'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ケーエムサービス株式会社' AND r.registration_number = '北九州100え4853'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4857'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100え4888'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '苅田工場部整部門経費' AND r.registration_number = '北九州100す4893'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100あ4895'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '愛宕自動車工業株式会社' AND r.registration_number = '北九州100え4902'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ユニプレス物流株式会社' AND r.registration_number = '北九州100き4904'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '寿屋フロンテ株式会社' AND r.registration_number = '北九州100す4933'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え4952'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ケーエムサービス株式会社' AND r.registration_number = '北九州100え4953'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ4976'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100あ4976'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社九栄物流' AND r.registration_number = '北九州130あ4981'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え4986'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100え4988'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '協栄陸運株式会社' AND r.registration_number = '福岡100き4994'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100あ4997'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '協栄ライン株式会社' AND r.registration_number = '福岡100え4999'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '協栄ライン株式会社' AND r.registration_number = '福岡100き4999'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '行橋市・みやこ町清掃施設組合' AND r.registration_number = '北九州101を5000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州130く5002'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州130け5002'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社松下運輸' AND r.registration_number = '筑豊100か5010'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100キ5011'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ラックライド株式会社' AND r.registration_number = '北九州130い5016'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '福岡化成工業株式会社' AND r.registration_number = '北九州100き5026'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '福岡化成工業株式会社' AND r.registration_number = '北九州100す5026'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100あ5081'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州130か5100'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え5123'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州100え5124'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え5125'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え5126'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え5127'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100え5128'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社中本商会' AND r.registration_number = '筑豊830あ5141'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社エムアイ通商' AND r.registration_number = '北九州100え5158'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '横浜11け5160'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社エムアイ通商' AND r.registration_number = '北九州100え5167'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州100え5172'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100か5172'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社坂本産業' AND r.registration_number = '筑豊100か5188'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100あ5197'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100か5238'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '佐賀100か5287'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社白石開発' AND r.registration_number = '北九州100え5300'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '横浜11け5350'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州11け5378'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州11け5397'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100あ5425'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100あ5465'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '梶原産業株式会社' AND r.registration_number = '筑豊100か5471'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社リアライズコーポレーション' AND r.registration_number = '北九州130う5511'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州100か5522'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100あ5523'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社田北電機製作所' AND r.registration_number = '大分100は5536'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州100か5538'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社堀本建設' AND r.registration_number = '北九州103け5555'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '横浜100え5632'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州11け5656'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州11け5667'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社みやけ商会' AND r.registration_number = '北九州100す5681'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '興栄産業株式会社' AND r.registration_number = '北九州100す5699'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三友建設工業株式会社' AND r.registration_number = '北九州100す5714'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州100あ5718'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100あ5728'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社リアライズコーポレーション' AND r.registration_number = '北九州800す5731'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社リアライズコーポレーション' AND r.registration_number = '北九州800す5734'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社NBSロジソル' AND r.registration_number = '北九州100あ5743'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社NBSロジソル' AND r.registration_number = '北九州100あ5745'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100か5756'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100か5816'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州100あ5825'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100か5861'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州豊運輸株式会社' AND r.registration_number = '北九州100あ5888'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社アイエヌトラシード' AND r.registration_number = '佐賀130あ5900'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州100か5921'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州100き5921'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社大雄産業' AND r.registration_number = '北九州100か5930'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100あ5941'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州11け5947'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州11け5950'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州11け5953'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州100か5957'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '横浜11け5971'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　北九州物流サービス' AND r.registration_number = '北九州100か5976'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100あ5979'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '横浜11け5983'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州130う6000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州131う6000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '行橋市・みやこ町清掃施設組合' AND r.registration_number = '北九州131け6000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社古井設備' AND r.registration_number = '北九州11せ6010'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '久留米100か6050'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100か6063'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州130う6100'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130う6118'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100あ6121'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中村産業輸送株式会社' AND r.registration_number = '筑豊100か6155'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100あ6158'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100か6176'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州100か6183'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100か6203'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100か6213'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社翼LINE' AND r.registration_number = '北九州100か6258'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100あ6325'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '宮田運送株式会社' AND r.registration_number = '北九州100か6339'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100あ6355'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100か6380'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州100か6432'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '大森運送株式会社' AND r.registration_number = '山口100か6434'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100か6447'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社森若商会' AND r.registration_number = '北九州100か6471'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '宮西設備株式会社' AND r.registration_number = '北九州100す6481'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100か6536'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100あ6544'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州11け6546'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州11け6547'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケーツー企画' AND r.registration_number = '広島100き6567'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ヤマガタ本社車輌部' AND r.registration_number = '筑豊830あ6569'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ユニプレス物流株式会社' AND r.registration_number = '北九州100か6596'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州産業運輸株式会社' AND r.registration_number = '北九州100あ6634'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100か6666'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '相模100か6672'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社東西運輸' AND r.registration_number = '北九州100か6676'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '岡田設備株式会社' AND r.registration_number = '佐賀100か6677'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100あ6683'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州100か6727'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州11け6744'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州産業運輸株式会社' AND r.registration_number = '北九州100あ6753'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100あ6755'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ユニプレス物流株式会社' AND r.registration_number = '北九州100か6788'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100あ6833'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州11け6926'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州11け6929'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州102い7000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社みらい' AND r.registration_number = '亀裂2け7007'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ7075'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '香春石灰化学工業株式会社' AND r.registration_number = '筑豊130さ7077'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ7078'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ7083'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ7084'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ7085'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ラックライド株式会社' AND r.registration_number = '北九州100あ7097'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130あ7114'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州130か7117'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東和運送株式会社' AND r.registration_number = '大分100か7123'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州130い7124'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社安藤建設' AND r.registration_number = '熊本100は7133'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100あ7140'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100あ7197'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　北九州物流サービス' AND r.registration_number = '北九州100か7201'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100あ7214'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社森若商会' AND r.registration_number = '北九州130あ7287'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州100か7462'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100あ7466'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100あ7468'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100あ7481'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　北九州物流サービス' AND r.registration_number = '北九州100か7585'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100あ7640'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100か7660'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100あ7694'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100か7717'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケーツー企画' AND r.registration_number = '佐賀100か7755'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '大森運送株式会社' AND r.registration_number = '宮城130あ7765'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社晃栄建設' AND r.registration_number = '北九州11や7872'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ケイエム運輸機工' AND r.registration_number = '北九州100か7885'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州130あ7914'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100か7919'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130あ7940'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100か7962'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '北九州100か7983'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社デイオー運輸' AND r.registration_number = '北九州800い8000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州101か8000'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '横浜130あ8005'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州131け8008'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州131こ8008'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社エムアイ通商' AND r.registration_number = '北九州100あ8013'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '久留米100か8039'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100あ8047'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊工業有限会社' AND r.registration_number = '北九州11や8093'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社パインカーゴ' AND r.registration_number = '北九州130あ8100'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社アールシーロジ' AND r.registration_number = '北九州100あ8104'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社NBSロジソル' AND r.registration_number = '北九州100あ8175'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州130え8181'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100か8183'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100あ8220'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社上野商会' AND r.registration_number = '北九州100す8246'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社大雄産業' AND r.registration_number = '北九州100か8291'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州100か8306'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100か8384'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '曾根金属工業株式会社' AND r.registration_number = '北九州44や8404'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ユニプレス物流株式会社' AND r.registration_number = '北九州100か8406'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100か8409'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100か8491'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100あ8496'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州あ8497'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州130あ8514'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社有門組' AND r.registration_number = '北九州100あ8517'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100か8536'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社岡田運輸' AND r.registration_number = '北九州100あ8545'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100か8551'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ユニプレス物流株式会社' AND r.registration_number = '北九州100か8555'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100か8601'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100か8603'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100か8604'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100あ8647'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ゼロ九州工場' AND r.registration_number = '北九州100あ8653'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック九州' AND r.registration_number = '久留米100か8677'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '日通北九州運輸株式会社' AND r.registration_number = '北九州100か8682'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '宮西設備株式会社' AND r.registration_number = '北九州100あ8692'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100か8708'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '久留米100か8708'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ユニプレス物流株式会社' AND r.registration_number = '北九州100か8744'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社富士技研' AND r.registration_number = '北九州100さ8752'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州130あ8754'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ゼロ九州工場' AND r.registration_number = '北九州100あ8774'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州130を8800'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州30を8800'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '久留米100か8801'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130え8802'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130う8803'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130う8804'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130う8805'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社晃栄建設' AND r.registration_number = '北九州130さ8858'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ユニプレス物流株式会社' AND r.registration_number = '北九州00か8863'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ユニプレス物流株式会社' AND r.registration_number = '北九州100か8863'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100か8864'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '愛岩自動車工業株式会社' AND r.registration_number = '大分100さ8869'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州101え8888'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'イーストアジア物流株式会社' AND r.registration_number = '北九州130う8899'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100か8937'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ジャパンライン' AND r.registration_number = '大分100か8962'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社行橋鎮西運送' AND r.registration_number = '北九州100か8962'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社　北九州物流サービス' AND r.registration_number = '北九州100か8990'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '合資会社山下組' AND r.registration_number = '北九州11き9001'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100あ9036'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100か9070'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100か9119'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社オート貿易' AND r.registration_number = '北九州100さ9153'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ロジコム・アイ' AND r.registration_number = '北九州100か9212'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中村産業輸送株式会社' AND r.registration_number = '大分100か9229'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東洋物産株式会社' AND r.registration_number = '北九州130あ9230'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'くろがね工業株式会社' AND r.registration_number = '北九州100か9243'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州100か9307'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100か9345'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '新手運輸有限会社' AND r.registration_number = '北九州100か9378'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社川村製作所' AND r.registration_number = '北九州100さ9383'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '北九州100か9458'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社エムアイ通商' AND r.registration_number = '北九州100か9565'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社啓愛社' AND r.registration_number = '北九州100か9566'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社SONEKIN　WORKS' AND r.registration_number = '北九州100か9577'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社井手梱包' AND r.registration_number = '北九州100か9594'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '有限会社SONEKIN　WORKS' AND r.registration_number = '北九州100か9595'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社守エクスプレス' AND r.registration_number = '福岡100あ9600'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'ラックライド株式会社' AND r.registration_number = '北九州130あ9610'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '久富産業株式会社' AND r.registration_number = '北九州100か9670'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '豊運輸株式会社' AND r.registration_number = '北九州130あ9690'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社物流なかま' AND r.registration_number = '北九州100か9700'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100か9779'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = '北九州100か9892'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '平和物流株式会社' AND r.registration_number = 'k北九州100か9892'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '三原物流株式会社' AND r.registration_number = '北九州100か9930'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '宇都宮100か9957'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '田村運輸株式会社' AND r.registration_number = '北九州100か9987'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '無' AND r.registration_number = '不明999ん9998'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '菊竹産業株式会社' AND r.registration_number = '新車999ん9999'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ダイワ' AND r.registration_number = '構内車・101'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '九州紙運輸株式会社' AND r.registration_number = '北九州130い・168'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊130あ・794'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い・812'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州130い‣511'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ダイワ' AND r.registration_number = '構内車101'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社ダイワ' AND r.registration_number = '構内車103'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '中野運送　中野正博' AND r.registration_number = '筑豊130・･67'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊130あ655'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ768'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130あ769'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '筑豊130あ794'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社永田興業' AND r.registration_number = '筑豊830あ840'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '東邦興産株式会社' AND r.registration_number = '北九州100あ864'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い780'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130い793'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社バンテック' AND r.registration_number = '北九州100え386'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '北九州ダイキュー運輸株式会社' AND r.registration_number = '北九州130え476'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社森若商会' AND r.registration_number = '北九州130か118'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130か805'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '株式会社サクラ物流' AND r.registration_number = '北九州130き789'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = 'KD物流株式会社' AND r.registration_number = '北九州131く700'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '丸正運送株式会社' AND r.registration_number = '筑豊830う32'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '鶴丸海運株式会社' AND r.registration_number = '北九州130い‣11'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '日立金属株式会社九州工場' AND r.registration_number = '機内車'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;

-- プライマリ登録番号を設定（各件名の最初の登録番号をプライマリに設定）
UPDATE public.subject_registration_numbers
SET is_primary = true
WHERE id IN (
  SELECT DISTINCT ON (subject_id) id
  FROM public.subject_registration_numbers
  ORDER BY subject_id, created_at
);
