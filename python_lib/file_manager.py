import os
import shutil

def organize_folder(path):
    """Dosyaları uzantılarına göre klasörler."""
    for filename in os.listdir(path):
        if os.path.isfile(os.path.join(path, filename)):
            ext = filename.split('.')[-1]
            ext_dir = os.path.join(path, ext)
            if not os.path.exists(ext_dir):
                os.makedirs(ext_dir)
            shutil.move(os.path.join(path, filename), os.path.join(ext_dir, filename))

def get_file_tree(path):
    """Dizin yapısını ağaç şeklinde döndürür."""
    tree = {}
    for root, dirs, files in os.walk(path):
        tree[root] = {"dirs": dirs, "files": files}
    return tree
