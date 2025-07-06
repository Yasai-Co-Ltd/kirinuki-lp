'use client'

import { Metadata } from 'next'
import Layout from '../../components/layout/Layout'

export default function Contact() {
  return (
    <Layout>
      <section>
        <form>
          <h2 className="c">お問い合わせ<span>Contact</span></h2>
          <p>当ページと同じ３項目のお問い合わせフォーム（自動フォーム試用版）を簡単に使えるようにセットしています。<br />
          <span className="color-check">※当ページ（contact.html）はフォームの見本ページです。実際の自動フォームには使いませんのでご注意下さい。</span></p>
          <p><span className="color-check">自動フォームを使う場合（※編集に入る前にご確認下さい）</span><br />
          あなたのメールアドレス設定と、簡単な編集だけで使えます。<a href="https://template-party.com/file/formgen_manual_set2.html" target="_blank" rel="noopener noreferrer">こちらのマニュアルをご覧下さい。</a></p>
          <p><span className="color-check">自動フォームを使わない場合</span><br />
          テンプレートに梱包されている「form.html」「confirm.html」「finish.html」の3枚のファイルを削除して下さい。</p>

          <table className="ta1">
            <tbody>
              <tr>
                <th>お名前※</th>
                <td><input type="text" name="お名前" size={30} className="ws" /></td>
              </tr>
              <tr>
                <th>メールアドレス※</th>
                <td><input type="text" name="メールアドレス" size={30} className="ws" /></td>
              </tr>
              <tr>
                <th>お問い合わせ詳細※</th>
                <td><textarea name="お問い合わせ詳細" cols={30} rows={10} className="wl"></textarea></td>
              </tr>
            </tbody>
          </table>

          <p className="c">
            <input type="submit" value="内容を確認する" />
          </p>
        </form>
      </section>
    </Layout>
  )
}