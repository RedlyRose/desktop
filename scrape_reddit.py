from curl_cffi import requests
from bs4 import BeautifulSoup
import re

session = requests.Session(impersonate='chrome124')
url = 'https://sh.reddit.com/r/HentaiCensore/'
res = session.get(url)
soup = BeautifulSoup(res.text, 'html.parser')
form = soup.find('form')
inputs = {inp.get('name'): inp.get('value', '') for inp in form.find_all('input') if inp.get('name')}

script_text = soup.find('script').text
m = re.search(r'\(async e=>e\+e\)\("([^"]+)"\)', script_text)
token = m.group(1)
solution = token + token
inputs['solution'] = solution
action = form.get('action') or '/r/HentaiCensore/'
if not action.startswith('http'):
    action = f'https://sh.reddit.com{action}'

print('Posting solution:', inputs)
post_res = session.post(action, data=inputs, headers={
    'Referer': url,
    'Origin': 'https://sh.reddit.com',
    'Content-Type': 'application/x-www-form-urlencoded'
})
print('Post status:', post_res.status_code)
print('Post redirect history:', [r.status_code for r in post_res.history])
print('Post final url:', post_res.url)
print('Post response preview:', post_res.text[:500])
