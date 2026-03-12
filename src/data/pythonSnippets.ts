export interface PythonSnippet {
  name: string;
  category: string;
  code: string;
  description: string;
}

export const pythonSnippets: PythonSnippet[] = [
  {
    name: "data_utils.py",
    category: "Data Processing",
    description: "Pandas tabanlı veri işleme ve istatistiksel analiz fonksiyonları.",
    code: `import json
import pandas as pd

def process_data(input_file, output_file):
    """Pandas tabanlı veri işleme ve temizleme."""
    try:
        df = pd.read_csv(input_file)
        df.dropna(inplace=True)
        df.to_json(output_file, orient='records')
        return True
    except Exception as e:
        print(f"Hata: {e}")
        return False`
  },
  {
    name: "web_scraper.py",
    category: "Automation",
    description: "Web scraping ve API veri çekme (BeautifulSoup & Requests).",
    code: `import requests
from bs4 import BeautifulSoup

def scrape_titles(url):
    """Verilen URL'deki başlıkları (h1, h2) çeker."""
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        titles = [t.get_text().strip() for t in soup.find_all(['h1', 'h2'])]
        return titles
    except Exception as e:
        return [f"Scraping Hatası: {e}"]`
  },
  {
    name: "file_manager.py",
    category: "System",
    description: "Dizin düzenleme ve dosya sistemi işlemleri.",
    code: `import os
import shutil

def organize_folder(path):
    """Dosyaları uzantılarına göre klasörler."""
    for filename in os.listdir(path):
        if os.path.isfile(os.path.join(path, filename)):
            ext = filename.split('.')[-1]
            ext_dir = os.path.join(path, ext)
            if not os.path.exists(ext_dir):
                os.makedirs(ext_dir)
            shutil.move(os.path.join(path, filename), os.path.join(ext_dir, filename))`
  }
];
