import os
import re

def fix_file(path):
    if not os.path.exists(path): return False
    with open(path, 'r') as f:
        content = f.read()

    # Identify JSON.parse calls that use localStorage
    # Pattern 1: JSON.parse(localStorage.getItem('key') || '[]')
    # Pattern 2: const saved = localStorage.getItem('key'); ... JSON.parse(saved)

    # We'll just target the most common ones that might cause a crash
    has_changes = False

    # Replace JSON.parse(localStorage.getItem('key') || '...')
    matches = re.finditer(r"JSON\.parse\(localStorage\.getItem\('([^']+)'\)(?:\s*\|\|\s*'([^']+)')?\)", content)
    for match in matches:
        key = match.group(1)
        fallback = match.group(2) or 'null'
        replacement = f"getStorageItem('{key}', {fallback})"
        content = content.replace(match.group(0), replacement)
        has_changes = True

    # Replace manual check + parse
    # saved = localStorage.getItem('key'); if (saved) ... JSON.parse(saved)
    pattern2 = r"const ([a-zA-Z0-9]+) = localStorage\.getItem\('([^']+)'\);\s+(?:if \(\1\) \{|const [a-zA-Z0-9]+ = \1 \?)\s+(?:[a-zA-Z0-9]+ = )?JSON\.parse\(\1\)"
    # This is getting complex for a generic regex.
    # Let's just do the ones we found.

    if "src/views/SystemExpertView.tsx" in path:
        content = content.replace("const savedLogs = localStorage.getItem('system_error_logs');\n        if (savedLogs) {\n          setLogs(JSON.parse(savedLogs).reverse());",
                                  "const logs = getStorageItem('system_error_logs', []);\n        setLogs([...logs].reverse());")
        has_changes = True

    if "src/views/RequestView.tsx" in path:
        content = content.replace("const saved = localStorage.getItem('system_requests');\n      if (saved) {\n        setRequests(JSON.parse(saved));",
                                  "setRequests(getStorageItem('system_requests', []));")
        has_changes = True

    if has_changes:
        if "getStorageItem" not in content and "utils/storage" not in content:
            depth = path.count('/') - 1
            rel_path = '../' * depth + 'utils/storage'
            if 'src/utils/' in path: rel_path = './storage'
            content = f"import {{ getStorageItem }} from '{rel_path}';\n" + content
        with open(path, 'w') as f:
            f.write(content)
        return True
    return False

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            fix_file(os.path.join(root, file))
