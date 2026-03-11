import { pythonSnippets } from '../data/pythonSnippets';

export const searchPythonLibrary = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  const relevant = pythonSnippets.filter(s =>
    s.name.toLowerCase().includes(lowerQuery) ||
    s.description.toLowerCase().includes(lowerQuery) ||
    s.category.toLowerCase().includes(lowerQuery)
  );

  if (relevant.length === 0) return '';

  return relevant.map(s => `
FILENAME: ${s.name}
CATEGORY: ${s.category}
DESCRIPTION: ${s.description}
CODE:
${s.code}
---`).join('\n');
};

export const getAllPythonDocs = () => pythonSnippets;
