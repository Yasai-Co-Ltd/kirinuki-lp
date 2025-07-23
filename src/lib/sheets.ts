import { google } from 'googleapis';
import { OrderEmailData } from '@/types/email';

// Google Sheets APIの設定
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// 環境変数からGoogle Sheets設定を取得
const GOOGLE_SHEETS_SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const GOOGLE_SHEETS_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const GOOGLE_SHEETS_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Google Sheets認証を取得
async function getGoogleSheetsAuth() {
  if (!GOOGLE_SHEETS_CLIENT_EMAIL || !GOOGLE_SHEETS_PRIVATE_KEY) {
    throw new Error('Google Sheets認証情報が設定されていません');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: GOOGLE_SHEETS_PRIVATE_KEY,
    },
    scopes: SCOPES,
  });

  return auth;
}

// Google Sheetsクライアントを取得
async function getSheetsClient() {
  const auth = await getGoogleSheetsAuth();
  return google.sheets({ version: 'v4', auth });
}

// 注文データをスプレッドシートに保存
export async function saveOrderToSheet(orderData: OrderEmailData): Promise<void> {
  if (!GOOGLE_SHEETS_SPREADSHEET_ID) {
    const error = 'Google Sheets スプレッドシートIDが設定されていません (GOOGLE_SHEETS_SPREADSHEET_ID)';
    console.error(error);
    throw new Error(error);
  }

  try {

    const sheets = await getSheetsClient();

    // 動画情報を文字列に変換
    const videoTitles = orderData.videoInfos.length > 0
      ? orderData.videoInfos.map((info, index) => info.title || `動画 ${index + 1}`).join(' | ')
      : '動画情報取得中';
    const videoUrls = orderData.videoUrls.length > 0
      ? orderData.videoUrls.join(' | ')
      : '';
    const videoDurations = orderData.videoInfos.length > 0
      ? orderData.videoInfos.map((info, index) => {
          const duration = info.duration || 0;
          return duration > 0 ? `${Math.ceil(duration / 60)}分` : '不明';
        }).join(' | ')
      : '不明';

    // フォーマット名を日本語に変換
    const formatName = {
      'default': 'デフォルト',
      'separate': '2分割',
      'zoom': 'ズーム'
    }[orderData.format] || orderData.format;

    // 品質オプション名を日本語に変換
    const qualityOptionName = {
      'ai_only': 'AIのみ',
      'human_review': '人の目で確認'
    }[orderData.qualityOption] || orderData.qualityOption;

    // アスペクト比を日本語に変換
    const aspectRatioName = {
      1: '9:16 (縦型)',
      2: '1:1 (正方形)',
      3: '4:5 (ポートレート)',
      4: '16:9 (横型)'
    }[orderData.aspectRatio] || `${orderData.aspectRatio}`;

    // 優先クリップ長を日本語に変換
    const preferLengthName = {
      0: '自動',
      1: '〜30秒',
      2: '30秒〜60秒',
      3: '60秒〜90秒',
      4: '90秒〜3分'
    }[orderData.preferLength] || `${orderData.preferLength}`;

    // スプレッドシートに追加するデータ行
    const rowData = [
      new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }), // 注文日時
      orderData.paymentIntentId, // 決済ID
      orderData.customerName, // 顧客名
      orderData.customerEmail, // メールアドレス
      orderData.videoInfos.length || 0, // 動画数
      videoTitles, // 動画タイトル
      videoDurations, // 動画時間
      videoUrls, // 動画URL
      formatName, // フォーマット
      qualityOptionName, // 品質オプション
      preferLengthName, // 優先クリップ長
      aspectRatioName, // アスペクト比
      orderData.subtitleSwitch ? 'あり' : 'なし', // 字幕
      orderData.headlineSwitch ? 'あり' : 'なし', // タイトル
      orderData.specialRequests || '', // 特別な要望
      `¥${orderData.amount.toLocaleString()}`, // 金額
      `${orderData.estimatedDeliveryDays}営業日`, // 納期
      '未着手' // ステータス（初期値）
    ];

    // スプレッドシートに行を追加
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'A:U', // A列からU列まで（21列、チャンネル名削除により1列減）
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    console.log('注文データをスプレッドシートに保存しました:', {
      paymentIntentId: orderData.paymentIntentId,
      customerName: orderData.customerName,
      videoCount: orderData.videoInfos.length
    });

  } catch (error) {
    console.error('スプレッドシートへの保存中にエラーが発生しました:', error);
    throw error;
  }
}

// スプレッドシートのヘッダー行を初期化（初回セットアップ用）
export async function initializeSheetHeaders(): Promise<void> {
  try {
    if (!GOOGLE_SHEETS_SPREADSHEET_ID) {
      throw new Error('Google Sheets スプレッドシートIDが設定されていません');
    }

    const sheets = await getSheetsClient();

    // ヘッダー行のデータ
    const headers = [
      '注文日時',
      '決済ID',
      '顧客名',
      'メールアドレス',
      '動画数',
      '動画タイトル',
      '動画時間',
      '動画URL',
      'フォーマット',
      '品質オプション',
      '優先クリップ長',
      'アスペクト比',
      '字幕',
      'タイトル',
      '特別な要望',
      '金額',
      '納期',
      'ステータス',
      '備考',
      '動画生成結果',
      'プロジェクトID',
      '完了プロジェクトID'
    ];

    // A1セルからヘッダーを設定
    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'A1:V1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers],
      },
    });

    // ヘッダー行のスタイルを設定（太字、背景色）
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 22,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.9,
                    green: 0.9,
                    blue: 0.9,
                  },
                  textFormat: {
                    bold: true,
                  },
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },
          },
        ],
      },
    });

    console.log('スプレッドシートのヘッダーを初期化しました');

  } catch (error) {
    console.error('スプレッドシートのヘッダー初期化中にエラーが発生しました:', error);
    throw error;
  }
}

// 環境変数の設定状況を確認
export function checkSheetsConfiguration(): { configured: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!GOOGLE_SHEETS_SPREADSHEET_ID) missing.push('GOOGLE_SHEETS_SPREADSHEET_ID');
  if (!GOOGLE_SHEETS_CLIENT_EMAIL) missing.push('GOOGLE_SHEETS_CLIENT_EMAIL');
  if (!GOOGLE_SHEETS_PRIVATE_KEY) missing.push('GOOGLE_SHEETS_PRIVATE_KEY');
  
  return {
    configured: missing.length === 0,
    missing
  };
}

// スプレッドシートから処理待ちのYouTube URLを取得
export async function getPendingVideoUrls(): Promise<{
  rowIndex: number;
  paymentIntentId: string;
  videoUrls: string[];
  customerName: string;
  customerEmail: string;
  formData: {
    format: 'default' | 'separate' | 'zoom';
    preferLength: number;
    subtitleSwitch: number;
    headlineSwitch: number;
    qualityOption: 'ai_only' | 'human_review';
  };
}[]> {
  if (!GOOGLE_SHEETS_SPREADSHEET_ID) {
    throw new Error('Google Sheets スプレッドシートIDが設定されていません');
  }

  try {
    const sheets = await getSheetsClient();

    // スプレッドシートからデータを取得
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'A:R', // A列からR列まで（チャンネル名削除により1列減）
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return []; // ヘッダー行のみまたはデータなし
    }

    const pendingRows: {
      rowIndex: number;
      paymentIntentId: string;
      videoUrls: string[];
      customerName: string;
      customerEmail: string;
      formData: {
        format: 'default' | 'separate' | 'zoom';
        preferLength: number;
        subtitleSwitch: number;
        headlineSwitch: number;
        qualityOption: 'ai_only' | 'human_review';
      };
    }[] = [];

    // ヘッダー行をスキップして処理
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const status = row[17]; // R列（ステータス）

      // ステータスが「未着手」の行を対象とする
      if (status === '未着手') {
        const paymentIntentId = row[1]; // B列（決済ID）
        const customerName = row[2]; // C列（顧客名）
        const customerEmail = row[3]; // D列（メールアドレス）
        const videoUrlsString = row[7]; // H列（動画URL）
        const formatString = row[8]; // I列（フォーマット）
        const qualityOptionString = row[9]; // J列（品質オプション）
        const preferLengthString = row[10]; // K列（優先クリップ長）
        const subtitleString = row[12]; // M列（字幕）
        const headlineString = row[13]; // N列（タイトル）

        // 品質オプションが「AIのみ」の場合のみ処理対象とする
        if (qualityOptionString !== 'AIのみ') {
          console.log(`スキップ: 決済ID ${paymentIntentId} - 品質オプション「${qualityOptionString}」はcron処理対象外`);
          continue;
        }

        if (videoUrlsString) {
          const videoUrls = videoUrlsString.split(' | ').filter((url: string) => url.trim());
          
          if (videoUrls.length > 0) {
            // フォーマットを英語形式に変換
            let format: 'default' | 'separate' | 'zoom' = 'default';
            if (formatString === '2分割') format = 'separate';
            else if (formatString === 'ズーム') format = 'zoom';

            // 優先クリップ長を数値に変換
            let preferLength = 0;
            if (preferLengthString === '〜30秒') preferLength = 1;
            else if (preferLengthString === '30秒〜60秒') preferLength = 2;
            else if (preferLengthString === '60秒〜90秒') preferLength = 3;
            else if (preferLengthString === '90秒〜3分') preferLength = 4;

            // 字幕・タイトルのスイッチを数値に変換
            const subtitleSwitch = subtitleString === 'あり' ? 1 : 0;
            const headlineSwitch = headlineString === 'あり' ? 1 : 0;

            // 品質オプションを英語形式に変換
            const qualityOption: 'ai_only' | 'human_review' = qualityOptionString === 'AIのみ' ? 'ai_only' : 'human_review';

            pendingRows.push({
              rowIndex: i + 1, // スプレッドシートの行番号（1ベース）
              paymentIntentId,
              videoUrls,
              customerName,
              customerEmail,
              formData: {
                format,
                preferLength,
                subtitleSwitch,
                headlineSwitch,
                qualityOption,
              },
            });
          }
        }
      }
    }

    console.log(`処理待ちの動画URLを${pendingRows.length}件取得しました`);
    return pendingRows;

  } catch (error) {
    console.error('スプレッドシートからの処理待ちURL取得中にエラーが発生しました:', error);
    throw error;
  }
}

// スプレッドシートのステータスを更新
export async function updateRowStatus(rowIndex: number, status: string, note?: string): Promise<void> {
  if (!GOOGLE_SHEETS_SPREADSHEET_ID) {
    throw new Error('Google Sheets スプレッドシートIDが設定されていません');
  }

  try {
    const sheets = await getSheetsClient();

    // ステータス列（S列）を更新
    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      range: `R${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[status]],
      },
    });

    // 備考がある場合は追加の列に記録（T列を使用）
    if (note) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
        range: `S${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[note]],
        },
      });
    }

    console.log(`行${rowIndex}のステータスを「${status}」に更新しました`);

  } catch (error) {
    console.error('スプレッドシートのステータス更新中にエラーが発生しました:', error);
    throw error;
  }
}

// 動画生成結果をスプレッドシートに記録
export async function recordVideoGenerationResult(
  rowIndex: number,
  results: {
    originalUrl: string;
    vizardId: string;
    status: 'processing' | 'completed' | 'failed';
    downloadUrl?: string;
    error?: string;
  }[]
): Promise<void> {
  if (!GOOGLE_SHEETS_SPREADSHEET_ID) {
    throw new Error('Google Sheets スプレッドシートIDが設定されていません');
  }

  try {
    const sheets = await getSheetsClient();

    // 結果を文字列に変換
    const resultString = results.map(result => {
      const statusText = {
        'processing': '処理中',
        'completed': '完了',
        'failed': '失敗'
      }[result.status];
      
      return `${result.originalUrl}: ${statusText}${result.error ? ` (${result.error})` : ''}`;
    }).join(' | ');

    // U列に動画生成結果を記録
    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      range: `T${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[resultString]],
      },
    });

    console.log(`行${rowIndex}に動画生成結果を記録しました`);

  } catch (error) {
    console.error('動画生成結果の記録中にエラーが発生しました:', error);
    throw error;
  }
}

// projectIdとpaymentIntentIdの関連付けを記録（複数プロジェクトID対応）
export async function recordProjectIdMapping(
  rowIndex: number,
  projectId: number,
  paymentIntentId: string,
  append: boolean = false
): Promise<void> {
  if (!GOOGLE_SHEETS_SPREADSHEET_ID) {
    throw new Error('Google Sheets スプレッドシートIDが設定されていません');
  }

  try {
    const sheets = await getSheetsClient();

    let projectIds: string[] = [];

    if (append) {
      // 既存のプロジェクトIDを取得
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
        range: `U${rowIndex}`,
      });

      if (response.data.values?.[0]?.[0]) {
        // 既存のプロジェクトIDをパース（パイプ区切り）
        projectIds = response.data.values[0][0].split('|').map((id: string) => id.trim()).filter((id: string) => id);
      }
    }

    // 新しいプロジェクトIDを追加（重複チェック）
    const newProjectIdStr = projectId.toString();
    if (!projectIds.includes(newProjectIdStr)) {
      projectIds.push(newProjectIdStr);
    }

    // パイプ区切りで保存
    const projectIdValue = projectIds.join(' | ');
    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      range: `U${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[projectIdValue]],
      },
    });

    console.log(`行${rowIndex}にprojectId ${projectId}を${append ? '追加' : '記録'}しました (paymentIntentId: ${paymentIntentId})`);
    console.log(`現在のプロジェクトID: ${projectIdValue}`);

  } catch (error) {
    console.error('projectIdマッピングの記録中にエラーが発生しました:', error);
    throw error;
  }
}

// projectIdからpaymentIntentIdを検索
export async function findPaymentIntentIdByProjectId(projectId: number): Promise<{
  rowIndex: number;
  paymentIntentId: string;
  customerName: string;
  customerEmail: string;
} | null> {
  if (!GOOGLE_SHEETS_SPREADSHEET_ID) {
    throw new Error('Google Sheets スプレッドシートIDが設定されていません');
  }

  try {
    const sheets = await getSheetsClient();

    // スプレッドシートの全データを取得
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'A:U', // A列からU列まで
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return null;
    }

    // ヘッダー行をスキップして検索
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const storedProjectId = row[20]; // U列（0ベースで20番目）
      
      if (storedProjectId && parseInt(storedProjectId) === projectId) {
        return {
          rowIndex: i + 1, // スプレッドシートの行番号（1ベース）
          paymentIntentId: row[1] || '', // B列
          customerName: row[2] || '', // C列
          customerEmail: row[3] || '', // D列
        };
      }
    }

    return null;

  } catch (error) {
    console.error('projectIdによる検索中にエラーが発生しました:', error);
    throw error;
  }
}

// paymentIntentIdに関連する全てのプロジェクトIDを取得（パイプ区切り対応）
export async function findAllProjectIdsByPaymentIntentId(paymentIntentId: string): Promise<number[]> {
  if (!GOOGLE_SHEETS_SPREADSHEET_ID) {
    throw new Error('Google Sheets スプレッドシートIDが設定されていません');
  }

  try {
    const sheets = await getSheetsClient();

    // スプレッドシートの全データを取得
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'A:U', // A列からU列まで
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return [];
    }

    const projectIds: number[] = [];

    // ヘッダー行をスキップして検索
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const storedPaymentIntentId = row[1]; // B列（決済ID）
      const storedProjectIds = row[20]; // U列（プロジェクトID）
      
      if (storedPaymentIntentId === paymentIntentId && storedProjectIds) {
        // パイプ区切りのプロジェクトIDを分割して処理
        const projectIdStrings = storedProjectIds.split('|').map((id: string) => id.trim()).filter((id: string) => id);
        
        for (const projectIdStr of projectIdStrings) {
          const projectId = parseInt(projectIdStr);
          if (!isNaN(projectId) && !projectIds.includes(projectId)) {
            projectIds.push(projectId);
          }
        }
      }
    }

    console.log(`paymentIntentId ${paymentIntentId} に関連するプロジェクトID: ${projectIds.join(', ')}`);
    return projectIds;

  } catch (error) {
    console.error('paymentIntentIdによるプロジェクトID検索中にエラーが発生しました:', error);
    throw error;
  }
}

// projectIdから動画完成メール用の詳細情報を取得
export async function findVideoInfoByProjectId(projectId: number): Promise<{
  rowIndex: number;
  paymentIntentId: string;
  customerName: string;
  customerEmail: string;
  videoTitles: string[];
  videoUrls: string[];
} | null> {
  if (!GOOGLE_SHEETS_SPREADSHEET_ID) {
    throw new Error('Google Sheets スプレッドシートIDが設定されていません');
  }

  try {
    const sheets = await getSheetsClient();

    // スプレッドシートの全データを取得
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'A:U', // A列からU列まで
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return null;
    }

    // ヘッダー行をスキップして検索
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const storedProjectIds = row[20]; // U列（プロジェクトID）
      
      if (storedProjectIds) {
        // パイプ区切りのプロジェクトIDを分割して検索
        const projectIdStrings = storedProjectIds.split('|').map((id: string) => id.trim()).filter((id: string) => id);
        
        for (const projectIdStr of projectIdStrings) {
          const storedProjectId = parseInt(projectIdStr);
          if (storedProjectId === projectId) {
            // 動画タイトルと動画URLを取得
            const videoTitlesString = row[5] || ''; // F列（動画タイトル）
            const videoUrlsString = row[7] || ''; // H列（動画URL）
            
            const videoTitles = videoTitlesString ? videoTitlesString.split(' | ').filter((title: string) => title.trim()) : [];
            const videoUrls = videoUrlsString ? videoUrlsString.split(' | ').filter((url: string) => url.trim()) : [];
            
            return {
              rowIndex: i + 1, // スプレッドシートの行番号（1ベース）
              paymentIntentId: row[1] || '', // B列
              customerName: row[2] || '', // C列
              customerEmail: row[3] || '', // D列
              videoTitles,
              videoUrls,
            };
          }
        }
      }
    }

    return null;

  } catch (error) {
    console.error('projectIdによる動画情報検索中にエラーが発生しました:', error);
    throw error;
  }
}

// 完了したプロジェクトIDを記録する関数
export async function recordCompletedProjectId(
  rowIndex: number,
  projectId: number
): Promise<void> {
  if (!GOOGLE_SHEETS_SPREADSHEET_ID) {
    throw new Error('Google Sheets スプレッドシートIDが設定されていません');
  }

  try {
    const sheets = await getSheetsClient();

    // 現在の完了プロジェクトIDを取得（V列を使用）
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      range: `V${rowIndex}`,
    });

    let completedProjectIds: string[] = [];
    if (response.data.values?.[0]?.[0]) {
      // 既存の完了プロジェクトIDをパース（パイプ区切り）
      completedProjectIds = response.data.values[0][0].split('|').map((id: string) => id.trim()).filter((id: string) => id);
    }

    // 新しいプロジェクトIDを追加（重複チェック）
    const newProjectIdStr = projectId.toString();
    if (!completedProjectIds.includes(newProjectIdStr)) {
      completedProjectIds.push(newProjectIdStr);
    }

    // パイプ区切りで保存
    const completedProjectIdValue = completedProjectIds.join(' | ');
    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      range: `V${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[completedProjectIdValue]],
      },
    });

    console.log(`行${rowIndex}に完了プロジェクトID ${projectId}を記録しました`);
    console.log(`現在の完了プロジェクトID: ${completedProjectIdValue}`);

  } catch (error) {
    console.error('完了プロジェクトIDの記録中にエラーが発生しました:', error);
    throw error;
  }
}

// 全てのプロジェクトが完了したかチェックする関数
export async function checkAllProjectsCompleted(paymentIntentId: string): Promise<{
  allCompleted: boolean;
  totalProjects: number;
  completedProjects: number;
  rowIndex: number;
  customerInfo: {
    name: string;
    email: string;
  };
  videoInfo: {
    titles: string[];
    urls: string[];
  };
}> {
  if (!GOOGLE_SHEETS_SPREADSHEET_ID) {
    throw new Error('Google Sheets スプレッドシートIDが設定されていません');
  }

  try {
    const sheets = await getSheetsClient();

    // スプレッドシートの全データを取得
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'A:V', // A列からV列まで（完了プロジェクトID列を含む）
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      throw new Error('該当する注文データが見つかりません');
    }

    // paymentIntentIdに該当する行を検索
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const storedPaymentIntentId = row[1]; // B列（決済ID）
      
      if (storedPaymentIntentId === paymentIntentId) {
        const allProjectIds = row[20] || ''; // U列（全プロジェクトID）
        const completedProjectIds = row[21] || ''; // V列（完了プロジェクトID）
        
        // プロジェクトIDを配列に変換
        const totalProjectIdArray = allProjectIds ? allProjectIds.split('|').map((id: string) => id.trim()).filter((id: string) => id) : [];
        const completedProjectIdArray = completedProjectIds ? completedProjectIds.split('|').map((id: string) => id.trim()).filter((id: string) => id) : [];
        
        // 顧客情報と動画情報を取得
        const customerName = row[2] || ''; // C列
        const customerEmail = row[3] || ''; // D列
        const videoTitlesString = row[5] || ''; // F列（動画タイトル）
        const videoUrlsString = row[7] || ''; // H列（動画URL）
        
        const videoTitles = videoTitlesString ? videoTitlesString.split(' | ').filter((title: string) => title.trim()) : [];
        const videoUrls = videoUrlsString ? videoUrlsString.split(' | ').filter((url: string) => url.trim()) : [];
        
        const allCompleted = totalProjectIdArray.length > 0 &&
                           totalProjectIdArray.every((projectId: string) => completedProjectIdArray.includes(projectId));
        
        console.log(`注文 ${paymentIntentId} の完了状況:`, {
          totalProjects: totalProjectIdArray.length,
          completedProjects: completedProjectIdArray.length,
          allCompleted,
          totalProjectIds: totalProjectIdArray,
          completedProjectIds: completedProjectIdArray
        });
        
        return {
          allCompleted,
          totalProjects: totalProjectIdArray.length,
          completedProjects: completedProjectIdArray.length,
          rowIndex: i + 1,
          customerInfo: {
            name: customerName,
            email: customerEmail,
          },
          videoInfo: {
            titles: videoTitles,
            urls: videoUrls,
          },
        };
      }
    }
    
    throw new Error(`paymentIntentId ${paymentIntentId} に該当する注文が見つかりません`);

  } catch (error) {
    console.error('プロジェクト完了状況チェック中にエラーが発生しました:', error);
    throw error;
  }
}