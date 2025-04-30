import fs from 'fs';
import path from 'path';

export default () => {
  const components = [{ path: '~/components', extensions: ['vue'] }];

  for (const e of getAllFolderPaths('./components', '')) components.push({ path: `~/${e}`, extensions: ['vue'] });

  return components;
};

function getAllFolderPaths(baseDir, dir) {
  const results = [];

  try {
    const filesAndFolders = fs.readdirSync(path.join(baseDir, dir));

    for (const item of filesAndFolders) {
      const itemPath = path.join(baseDir, dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        results.push(path.join(baseDir, dir, item));
        const subFolderPaths = getAllFolderPaths(baseDir, path.join(dir, item));
        results.push(...subFolderPaths);
      }
    }
  } catch (e) {
    console.log(`Get folders error:`, e.message);
  }

  return results;
}
