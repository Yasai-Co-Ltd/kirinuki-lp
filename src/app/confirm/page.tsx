'use client'

import Layout from '../../components/layout/Layout'

export default function Confirm() {
  return (
    <Layout>
      <section>
        <form>
          <h2 className="c">確認画面<span>Contact</span></h2>

          <table className="ta1">
            <tbody>
              <tr>
                <th style={{width: '150px'}}>お名前</th>
                <td>
                  <input type="hidden" name="item1" value="" />
                  サンプル名前
                </td>
              </tr>
              <tr>
                <th style={{width: '150px'}}>メールアドレス</th>
                <td>
                  <input type="hidden" name="item2" value="" />
                  sample@example.com
                </td>
              </tr>
              <tr>
                <th>お問い合わせ内容</th>
                <td>
                  <input type="hidden" name="item3" value="" />
                  サンプルお問い合わせ内容
                </td>
              </tr>
            </tbody>
          </table>

          <p className="c">
            <input type="submit" value="送信する" />
            &nbsp;
            <input type="button" value="戻る" />
          </p>
        </form>
      </section>
    </Layout>
  )
}