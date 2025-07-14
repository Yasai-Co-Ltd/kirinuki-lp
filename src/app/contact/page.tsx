'use client'

import { Metadata } from 'next'
import Layout from '../../components/layout/Layout'

export default function Contact() {
  return (
    <Layout>
      <section>
        <form>
          <h2 className="c">お問い合わせ<span>Contact</span></h2>

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