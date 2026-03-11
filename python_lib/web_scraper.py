import requests
from bs4 import BeautifulSoup

def scrape_titles(url):
    """Verilen URL'deki başlıkları (h1, h2) çeker."""
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        titles = [t.get_text().strip() for t in soup.find_all(['h1', 'h2'])]
        return titles
    except Exception as e:
        return [f"Scraping Hatası: {e}"]

def get_crypto_price(coin_id="bitcoin"):
    """CoinGecko üzerinden anlık fiyat çeker."""
    url = f"https://api.coingecko.com/api/v3/simple/price?ids={coin_id}&vs_currencies=usd"
    res = requests.get(url).json()
    return res.get(coin_id, {}).get('usd', 'N/A')
