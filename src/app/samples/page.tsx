'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, 
  faEye, 
  faHeart, 
  faClock, 
  faVideo, 
  faChartLine, 
  faStar,
  faGamepad,
  faBriefcase,
  faGraduationCap,
  faComments,
  faTv,
  faFilter,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { 
  getSamplePageData, 
  getFormatLabel, 
  getQualityOptionLabel, 
  getPreferLengthLabel, 
  getLanguageLabel,
  getCategoryLabel,
  formatDuration,
  formatNumber
} from '@/lib/sampleData';
import { ProductionSample } from '@/types/sample';

export default function SamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSample, setSelectedSample] = useState<ProductionSample | null>(null);
  
  const samplePageData = getSamplePageData();
  
  // カテゴリーフィルター
  const categories = [
    { key: 'all', label: 'すべて', icon: faVideo },
    { key: 'game', label: 'ゲーム実況', icon: faGamepad },
    { key: 'business', label: 'ビジネス', icon: faBriefcase },
    { key: 'education', label: '教育・学習', icon: faGraduationCap },
    { key: 'talk', label: 'トーク・雑談', icon: faComments },
    { key: 'entertainment', label: 'エンターテイメント', icon: faTv }
  ];

  // フィルタリングされたサンプル
  const filteredSamples = selectedCategory === 'all' 
    ? [...samplePageData.featuredSamples, ...Object.values(samplePageData.categorySamples).flat()]
    : samplePageData.categorySamples[selectedCategory as keyof typeof samplePageData.categorySamples] || [];

  return (
    <Layout>
      {/* ヘッダーセクション */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              制作サンプル
              <span className="block text-xl md:text-2xl font-normal mt-2 opacity-90">
                Production Samples
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              実際の制作事例をご覧いただけます
            </p>
            
            {/* 統計情報 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">{samplePageData.totalSamples}</div>
                <div className="text-sm opacity-80">制作事例</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">{formatNumber(samplePageData.totalClipsCreated)}</div>
                <div className="text-sm opacity-80">切り抜き動画総数</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">{samplePageData.averageClipsPerVideo}</div>
                <div className="text-sm opacity-80">平均切り抜き本数</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* カテゴリーフィルター */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">カテゴリーで絞り込み</h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category.key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                <FontAwesomeIcon icon={category.icon} className="text-sm" />
                <span className="font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* おすすめサンプル */}
      {selectedCategory === 'all' && samplePageData.featuredSamples.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">おすすめ制作事例</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {samplePageData.featuredSamples.map((sample) => (
                <SampleCard 
                  key={sample.id} 
                  sample={sample} 
                  onSelect={setSelectedSample}
                  featured={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* サンプル一覧 */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {selectedCategory === 'all' ? 'すべての制作事例' : `${categories.find(c => c.key === selectedCategory)?.label}の制作事例`}
          </h2>
          
          {filteredSamples.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSamples.map((sample) => (
                <SampleCard 
                  key={sample.id} 
                  sample={sample} 
                  onSelect={setSelectedSample}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                選択されたカテゴリーのサンプルはまだありません
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA セクション */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            あなたの動画も切り抜き動画にしませんか？
          </h2>
          <p className="text-xl mb-8 opacity-90">
            AIが自動で最適なシーンを抽出し、魅力的な切り抜き動画を制作します
          </p>
          <Link 
            href="/order"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            今すぐ注文する
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </section>

      {/* サンプル詳細モーダル */}
      {selectedSample && (
        <SampleDetailModal 
          sample={selectedSample} 
          onClose={() => setSelectedSample(null)} 
        />
      )}
    </Layout>
  );
}

// サンプルカードコンポーネント
interface SampleCardProps {
  sample: ProductionSample;
  onSelect: (sample: ProductionSample) => void;
  featured?: boolean;
}

function SampleCard({ sample, onSelect, featured = false }: SampleCardProps) {
  const categoryIcon = {
    game: faGamepad,
    business: faBriefcase,
    education: faGraduationCap,
    talk: faComments,
    entertainment: faTv
  }[sample.category];

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group ${
        featured ? 'border-2 border-yellow-400' : ''
      }`}
      onClick={() => onSelect(sample)}
    >
      {featured && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 text-sm font-bold flex items-center gap-2">
          <FontAwesomeIcon icon={faStar} />
          おすすめ
        </div>
      )}
      
      <div className="relative">
        <Image
          src={sample.originalVideo.thumbnailUrl}
          alt={sample.originalVideo.title}
          width={400}
          height={225}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <FontAwesomeIcon icon={faPlay} className="text-white text-2xl" />
          </div>
        </div>
        <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
          <FontAwesomeIcon icon={categoryIcon} />
          {getCategoryLabel(sample.category)}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{sample.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sample.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">元動画時間:</span>
            <span className="font-medium">{formatDuration(sample.originalVideo.duration)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">切り抜き本数:</span>
            <span className="font-medium text-blue-600">{sample.results.totalClips}本</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">納期:</span>
            <span className="font-medium">{sample.stats.deliveryDays}営業日</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faEye} />
              {formatNumber(sample.results.totalViews || 0)}
            </div>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faChartLine} />
              {sample.results.engagementRate}%
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            詳細を見る →
          </button>
        </div>
      </div>
    </div>
  );
}

// サンプル詳細モーダルコンポーネント
interface SampleDetailModalProps {
  sample: ProductionSample;
  onClose: () => void;
}

function SampleDetailModal({ sample, onClose }: SampleDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{sample.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          {/* 注文内容 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faVideo} />
              注文内容
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">フォーマット:</span>
                  <div className="font-medium">{getFormatLabel(sample.orderDetails.format)}</div>
                </div>
                <div>
                  <span className="text-gray-500">品質オプション:</span>
                  <div className="font-medium">{getQualityOptionLabel(sample.orderDetails.qualityOption)}</div>
                </div>
                <div>
                  <span className="text-gray-500">優先クリップ長:</span>
                  <div className="font-medium">{getPreferLengthLabel(sample.orderDetails.preferLength)}</div>
                </div>
                <div>
                  <span className="text-gray-500">字幕:</span>
                  <div className="font-medium">{sample.orderDetails.subtitleSwitch ? 'あり' : 'なし'}</div>
                </div>
                <div>
                  <span className="text-gray-500">タイトル:</span>
                  <div className="font-medium">{sample.orderDetails.headlineSwitch ? 'あり' : 'なし'}</div>
                </div>
                <div>
                  <span className="text-gray-500">言語:</span>
                  <div className="font-medium">{getLanguageLabel(sample.orderDetails.language)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 制作結果 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} />
              制作結果
            </h3>
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{sample.results.totalClips}</div>
                <div className="text-sm text-gray-600">切り抜き動画数</div>
              </div>
            </div>

            {/* サンプル動画 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sample.results.clips.slice(0, 3).map((clip) => (
                <div key={clip.id} className="bg-white border rounded-lg overflow-hidden">
                  <div className="relative">
                    <Image
                      src={clip.thumbnailUrl}
                      alt={clip.title}
                      width={300}
                      height={200}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <FontAwesomeIcon icon={faPlay} className="text-white text-xl" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {formatDuration(clip.duration)}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm mb-2 line-clamp-2">{clip.title}</h4>
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} />
                        {formatDuration(clip.duration)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 制作統計 */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} />
              制作統計
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">処理時間:</span>
                  <div className="font-medium">{sample.stats.processingTime}</div>
                </div>
                <div>
                  <span className="text-gray-500">納期:</span>
                  <div className="font-medium">{sample.stats.deliveryDays}営業日</div>
                </div>
                <div>
                  <span className="text-gray-500">満足度:</span>
                  <div className="font-medium flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FontAwesomeIcon 
                        key={i}
                        icon={faStar} 
                        className={i < (sample.stats.customerSatisfaction || 0) ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}