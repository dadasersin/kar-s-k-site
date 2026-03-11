import json
import pandas as pd

def process_data(input_file, output_file):
    """Pandas tabanlı veri işleme ve temizleme."""
    try:
        df = pd.read_csv(input_file)
        # Veri temizleme adımları
        df.dropna(inplace=True)
        df.to_json(output_file, orient='records')
        return True
    except Exception as e:
        print(f"Hata: {e}")
        return False

def calculate_stats(data_list):
    """Sayısal veriler için istatistiksel özet."""
    if not data_list: return {}
    return {
        "mean": sum(data_list) / len(data_list),
        "max": max(data_list),
        "min": min(data_list)
    }
