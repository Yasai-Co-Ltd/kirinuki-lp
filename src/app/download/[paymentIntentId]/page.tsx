'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';

interface VideoFile {
  id: string;
  title: string;
  fileName: string;
  downloadUrl: string;
  fileSize?: string;
  duration?: string;
  viralScore?: string;
  selected: boolean;
  projectId?: number;
}

interface VideoGroup {
  groupId: string;
  originalTitle: string;
  originalUrl: string;
  projectId: number;
  videos: VideoFile[];
  videoCount: number;
  error?: string;
}

interface DownloadPageData {
  customerName: string;
  paymentIntentId: string;
  videoGroups: VideoGroup[];
  totalCount: number;
  groupCount: number;
  status: 'loading' | 'ready' | 'error' | 'not_found';
  errorMessage?: string;
}

export default function DownloadPage() {
  const params = useParams();
  const paymentIntentId = params.paymentIntentId as string;
  
  const [data, setData] = useState<DownloadPageData>({
    customerName: '',
    paymentIntentId: paymentIntentId,
    videoGroups: [],
    totalCount: 0,
    groupCount: 0,
    status: 'loading'
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});

  // ページ読み込み時にデータを取得
  useEffect(() => {
    if (paymentIntentId) {
      fetchDownloadData();
    }
  }, [paymentIntentId]);

  // ダウンロードデータを取得
  const fetchDownloadData = async () => {
    try {
      setData(prev => ({ ...prev, status: 'loading' }));
      
      const response = await fetch(`/api/download/${paymentIntentId}`);
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setData(prev => ({ 
            ...prev, 
            status: 'not_found',
            errorMessage: '指定された注文が見つかりません。'
          }));
        } else {
          setData(prev => ({ 
            ...prev, 
            status: 'error',
            errorMessage: result.error || 'データの取得に失敗しました。'
          }));
        }
        return;
      }

      // videoGroupsの各動画にselectedプロパティを追加
      const videoGroupsWithSelection = result.videoGroups.map((group: any) => ({
        ...group,
        videos: group.videos.map((video: any) => ({
          ...video,
          selected: true // デフォルトで全て選択
        }))
      }));

      setData({
        customerName: result.customerName,
        paymentIntentId: result.paymentIntentId,
        videoGroups: videoGroupsWithSelection,
        totalCount: result.totalCount,
        groupCount: result.groupCount,
        status: 'ready'
      });

    } catch (error) {
      console.error('データ取得エラー:', error);
      setData(prev => ({ 
        ...prev, 
        status: 'error',
        errorMessage: 'ネットワークエラーが発生しました。'
      }));
    }
  };

  // 動画の選択状態を切り替え
  const toggleVideoSelection = (videoId: string) => {
    setData(prev => ({
      ...prev,
      videoGroups: prev.videoGroups.map(group => ({
        ...group,
        videos: group.videos.map(video =>
          video.id === videoId
            ? { ...video, selected: !video.selected }
            : video
        )
      }))
    }));
  };

  // 全選択/全解除
  const toggleAllSelection = () => {
    const allVideos = data.videoGroups.flatMap(group => group.videos);
    const allSelected = allVideos.every(video => video.selected);
    setData(prev => ({
      ...prev,
      videoGroups: prev.videoGroups.map(group => ({
        ...group,
        videos: group.videos.map(video => ({
          ...video,
          selected: !allSelected
        }))
      }))
    }));
  };

  // グループ内の全選択/全解除
  const toggleGroupSelection = (groupId: string) => {
    setData(prev => ({
      ...prev,
      videoGroups: prev.videoGroups.map(group => {
        if (group.groupId === groupId) {
          const allSelected = group.videos.every(video => video.selected);
          return {
            ...group,
            videos: group.videos.map(video => ({
              ...video,
              selected: !allSelected
            }))
          };
        }
        return group;
      })
    }));
  };

  // ファイルをダウンロードする共通関数
  const downloadFile = async (video: VideoFile) => {
    try {
      console.log(`📥 ダウンロード開始: ${video.fileName}`);
      
      // プロキシAPIを使用してファイルを取得
      const response = await fetch('/api/download/file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          downloadUrl: video.downloadUrl,
          fileName: video.fileName,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }
      
      // Blobとして取得
      const blob = await response.blob();
      
      // Blobからダウンロード用URLを作成
      const blobUrl = window.URL.createObjectURL(blob);
      
      // ダウンロード実行
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = video.fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // メモリ解放
      window.URL.revokeObjectURL(blobUrl);
      
      console.log(`✅ ダウンロード完了: ${video.fileName}`);
      
    } catch (error) {
      console.error(`❌ ダウンロードエラー (${video.fileName}):`, error);
      throw error;
    }
  };

  // 選択された動画をまとめてダウンロード
  const downloadSelectedVideos = async () => {
    const selectedVideos = data.videoGroups.flatMap(group => group.videos).filter(video => video.selected);
    
    if (selectedVideos.length === 0) {
      alert('ダウンロードする動画を選択してください。');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress({});

    try {
      for (let i = 0; i < selectedVideos.length; i++) {
        const video = selectedVideos[i];
        
        try {
          // 進行状況を更新
          setDownloadProgress(prev => ({
            ...prev,
            [video.id]: 0
          }));
          
          // ダウンロード実行
          await downloadFile(video);
          
          // 完了状況を更新
          setDownloadProgress(prev => ({
            ...prev,
            [video.id]: 100
          }));
          
          // 複数ファイルの場合は少し間隔を空ける
          if (i < selectedVideos.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
        } catch (error) {
          console.error(`❌ ダウンロードエラー (${video.fileName}):`, error);
          // エラーが発生しても他のファイルのダウンロードは続行
          alert(`${video.fileName}のダウンロードに失敗しました。`);
        }
      }

    } catch (error) {
      console.error('ダウンロードエラー:', error);
      alert('ダウンロードに失敗しました。しばらく時間をおいて再度お試しください。');
    } finally {
      setIsDownloading(false);
      setDownloadProgress({});
    }
  };

  // 個別ダウンロード
  const downloadSingleVideo = async (video: VideoFile) => {
    try {
      await downloadFile(video);
    } catch (error) {
      console.error(`個別ダウンロードエラー (${video.fileName}):`, error);
      alert(`${video.fileName}のダウンロードに失敗しました。しばらく時間をおいて再度お試しください。`);
    }
  };

  // ローディング表示
  if (data.status === 'loading') {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">動画データを読み込み中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // エラー表示
  if (data.status === 'error' || data.status === 'not_found') {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {data.status === 'not_found' ? 'ページが見つかりません' : 'エラーが発生しました'}
            </h1>
            <p className="text-gray-600 mb-6">{data.errorMessage}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              トップページに戻る
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const selectedCount = data.videoGroups.flatMap(group => group.videos).filter(video => video.selected).length;
  const allVideos = data.videoGroups.flatMap(group => group.videos);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  🎬 動画ダウンロード
                </h1>
                <p className="text-gray-600">
                  {data.customerName}様の切り抜き動画が完成しました
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  注文ID: {data.paymentIntentId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">動画数</p>
                <p className="text-2xl font-bold text-blue-600">{data.totalCount}本</p>
                <p className="text-xs text-gray-400">{data.groupCount}つの元動画から</p>
              </div>
            </div>
          </div>

          {/* 全体操作 */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                📹 完成動画一覧
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleAllSelection}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {allVideos.every(video => video.selected) ? '全て解除' : '全て選択'}
                </button>
                <span className="text-sm text-gray-500">
                  {selectedCount}本選択中
                </span>
              </div>
            </div>
          </div>

          {/* 動画グループリスト */}
          <div className="space-y-6">
            {data.videoGroups.map((group) => (
              <div key={group.groupId} className="bg-white rounded-lg shadow-sm p-6">
                {/* グループヘッダー */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      🎥 {group.originalTitle}
                    </h3>
                    {group.originalUrl && (
                      <a
                        href={group.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 underline"
                      >
                        元動画を見る
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleGroupSelection(group.groupId)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {group.videos.every(video => video.selected) ? 'グループ解除' : 'グループ選択'}
                    </button>
                    <span className="text-sm text-gray-500">
                      {group.videos.filter(video => video.selected).length}/{group.videoCount}本選択
                    </span>
                  </div>
                </div>

                {/* グループ内動画リスト */}
                {group.error ? (
                  <div className="text-center py-4 text-red-600">
                    ⚠️ {group.error}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {group.videos.map((video) => (
                      <div
                        key={video.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          video.selected
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={video.selected}
                            onChange={() => toggleVideoSelection(video.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {video.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>📁 {video.fileName}</span>
                              {video.fileSize && <span>📊 {video.fileSize}</span>}
                              {video.duration && <span>⏱️ {video.duration}</span>}
                              {video.viralScore && <span>🔥 スコア: {video.viralScore}/10</span>}
                            </div>
                          </div>

                          <button
                            onClick={() => downloadSingleVideo(video)}
                            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            個別DL
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ダウンロードボタン */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <button
                onClick={downloadSelectedVideos}
                disabled={selectedCount === 0 || isDownloading}
                className={`px-8 py-3 rounded-lg font-medium text-lg transition-colors ${
                  selectedCount === 0 || isDownloading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isDownloading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ダウンロード中...
                  </span>
                ) : (
                  `📥 選択した動画をダウンロード (${selectedCount}本)`
                )}
              </button>
              
              {selectedCount > 1 && (
                <p className="text-sm text-gray-500 mt-2">
                  複数の動画は順次ダウンロードされます
                </p>
              )}
            </div>
          </div>

          {/* 注意事項 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <h3 className="font-medium text-yellow-800 mb-2">📋 ご利用について</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• ダウンロードリンクは30日間有効です</li>
              <li>• 動画は高品質でダウンロードいただけます</li>
              <li>• SNSでの投稿や配信にご自由にお使いください</li>
              <li>• 追加のご要望がございましたらお気軽にお問い合わせください</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}