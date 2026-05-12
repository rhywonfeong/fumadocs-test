/**
 * 下载 MDX 文件中的所有外部图片到本地，并自动替换引用路径。
 *
 * 用法: node scripts/download-images.mjs
 *
 * 工作流程:
 *   1. 扫描 content/docs 下所有 MDX 文件中的外部图片 URL
 *   2. 下载到 public/images/ 目录
 *   3. 将 MDX 中的外部 URL 替换为本地路径 /images/xxx.png
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import nodeHttp from 'node:http';
import nodeHttps from 'node:https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'content/docs');
const IMAGE_DIR = join(ROOT, 'public/images');

// 匹配 Markdown 图片语法和 <img> 标签中的外部 URL
const EXTERNAL_IMG_RE = /(!\[[^\]]*\]\(|<img[^>]*?src=["'])(https?:\/\/[^)"'\s>]+\.(?:png|jpg|jpeg|gif|svg|webp))/gi;

async function fetch(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? nodeHttps : nodeHttp;
    client
      .get(url, { timeout: 30000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetch(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject)
      .on('timeout', function () {
        this.destroy();
        reject(new Error(`Timeout: ${url}`));
      });
  });
}

function filenameFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const base = pathname.split('/').pop();
    return base || 'image.png';
  } catch {
    return 'image.png';
  }
}

async function walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDir(full)));
    } else if (entry.name.endsWith('.mdx')) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  await mkdir(IMAGE_DIR, { recursive: true });

  const mdxFiles = await walkDir(CONTENT_DIR);
  console.log(`找到 ${mdxFiles.length} 个 MDX 文件\n`);

  let totalDownloaded = 0;
  let totalReplaced = 0;

  for (const file of mdxFiles) {
    const content = await readFile(file, 'utf-8');
    const matches = [...content.matchAll(EXTERNAL_IMG_RE)];

    if (matches.length === 0) continue;

    const relFile = relative(ROOT, file);
    console.log(`[${relFile}] 发现 ${matches.length} 个外部图片`);

    let newContent = content;

    for (const match of matches) {
      const url = match[2];
      const filename = filenameFromUrl(url);
      const localPath = join(IMAGE_DIR, filename);
      const publicPath = `/images/${filename}`;

      // 下载（跳过已存在的）
      try {
        const { stat } = await import('node:fs/promises');
        await stat(localPath);
        console.log(`  ✓ 已存在，跳过: ${filename}`);
      } catch {
        console.log(`  ⬇ 下载: ${url}`);
        const data = await fetch(url);
        await writeFile(localPath, data);
        console.log(`  ✓ 保存: ${filename} (${(data.length / 1024).toFixed(1)} KB)`);
        totalDownloaded++;
      }

      // 替换 URL
      const oldUrlInFile = match[0];
      const newUrlInFile = match[1] + publicPath;
      if (newContent.includes(url)) {
        newContent = newContent.replace(url, publicPath);
        totalReplaced++;
      }
    }

    if (newContent !== content) {
      await writeFile(file, newContent, 'utf-8');
      console.log(`  ✓ 已更新文件引用\n`);
    }
  }

  console.log(`\n完成! 下载 ${totalDownloaded} 张新图片，替换 ${totalReplaced} 处引用`);
  console.log(`图片保存位置: ${relative(ROOT, IMAGE_DIR)}`);
}

main().catch((err) => {
  console.error('出错:', err.message);
  process.exit(1);
});
