'use client'

import Layout from '../../components/layout/Layout'

export default function Form() {
  return (
    <Layout>
      <section>
        <form>
          <h2 className="c">お問い合わせ<span>Contact</span></h2>

          <table className="ta1">
            <tbody>
              <tr>
                <th style={{width: '150px'}}>お名前<span style={{color:'red'}}>※</span></th>
                <td>
                  <input name="item1" type="text" size={40} maxLength={500} className="ws" />
                </td>
              </tr>
              <tr>
                <th style={{width: '150px'}}>メールアドレス<span style={{color:'red'}}>※</span></th>
                <td>
                  <input name="item2" type="text" size={40} maxLength={500} className="ws" />
                </td>
              </tr>
              <tr>
                <th>お問い合わせ内容<span style={{color:'red'}}>※</span></th>
                <td>
                  <textarea name="item3" cols={40} rows={10} className="wl"></textarea>
                </td>
              </tr>
            </tbody>
          </table>

          <p className="c">
            <input type="submit" value="内容を確認する" />
            &nbsp;
            <input type="reset" value="リセット" />
          </p>
        </form>
      </section>
    </Layout>
  )
}