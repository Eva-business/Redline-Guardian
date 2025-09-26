import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
from tqdm import tqdm

URL = "http://service.jct.org.tw/tjcha_cert/ema.aspx"

def get_tokens(session):
    """取得當前表單的 ASP.NET hidden 欄位值"""
    resp = session.get(URL)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')
    return {
        '__VIEWSTATE': soup.find('input', id='__VIEWSTATE')['value'],
        '__VIEWSTATEGENERATOR': soup.find('input', id='__VIEWSTATEGENERATOR')['value'],
        '__EVENTVALIDATION': soup.find('input', id='__EVENTVALIDATION')['value']
    }

def scrape_all():
    session = requests.Session()
    records = []

    # 首次抓下來所有縣市與級別
    tokens = get_tokens(session)
    soup = BeautifulSoup(session.get(URL).text, 'html.parser')
    counties = [opt['value'] for opt in soup.select('#DropDownList1 option')]
    levels = [opt['value'] for opt in soup.select('#DropDownList2 option')]

    total = len(counties) * len(levels)
    pbar = tqdm(total=total, desc="查詢進度")

    for county in counties:
        for level in levels:
            tokens = get_tokens(session)  # 重新取得 hidden 欄位
            form = {
                '__VIEWSTATE': tokens['__VIEWSTATE'],
                '__VIEWSTATEGENERATOR': tokens['__VIEWSTATEGENERATOR'],
                '__EVENTVALIDATION': tokens['__EVENTVALIDATION'],
                '__EVENTTARGET': '',
                '__EVENTARGUMENT': '',
                'DropDownList1': county,
                'DropDownList2': level,
                'Button1': '查詢'
            }
            try:
                resp = session.post(URL, data=form)
                resp.raise_for_status()
            except Exception as e:
                print(f"🔴 提交失敗: {county}, {level} -> {e}")
                pbar.update(1)
                time.sleep(1.0)
                continue

            soup = BeautifulSoup(resp.text, 'html.parser')
            table = soup.find('table', id='GridView1')
            if table:
                rows = table.find_all('tr')
                # headers = [th.text.strip() for th in rows[0].find_all('th')]
                for row in rows[1:]:
                    cols = row.find_all('td')
                    if len(cols) < 8:
                        continue
                    records.append({
                        '序號': cols[0].get_text(strip=True),
                        '醫療機構代碼': cols[1].get_text(strip=True),
                        '機構名稱': cols[2].get_text(strip=True),
                        '縣市別': cols[3].get_text(strip=True),
                        '評定等級': cols[4].get_text(strip=True),
                        '效期': cols[5].get_text(strip=True),
                        '機構電話': cols[6].get_text(strip=True),
                        '機構地址': cols[7].get_text(strip=True).replace('\xa0', '').strip()
                    })
            # 若沒有 table，表示該組合無資料，略過
            pbar.update(1)
            time.sleep(1.0)
    pbar.close()

    # 整理 DataFrame、去重、重新標註序號
    df = pd.DataFrame(records)
    if not df.empty:
        df = df.drop_duplicates(subset=['醫療機構代碼']).reset_index(drop=True)
        df['序號'] = df.index + 1
    return df

if __name__ == "__main__":
    df = scrape_all()
    if df is not None:
        print(f"✅ 共取得 {len(df)} 筆獨立資料")
        print(df.head(10))
        df.to_csv('jct_ema_data.csv', index=False, encoding='utf-8-sig')
        print("✅ 已儲存至 jct_ema_data.csv")
