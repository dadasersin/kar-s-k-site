import os

def fix_file(path):
    with open(path, 'rb') as f:
        content = f.read()

    new_content = content.replace(b'\\`', b'`').replace(b'\\$', b'$')

    if new_content != content:
        with open(path, 'wb') as f:
            f.write(new_content)
        return True
    return False

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            path = os.path.join(root, file)
            if fix_file(path):
                print(f'Fixed {path}')
