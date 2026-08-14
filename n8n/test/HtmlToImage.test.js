const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const packagePath = path.resolve(__dirname, '../package.json');
const sourcePath = path.resolve(__dirname, '../nodes/HtmlToImage/HtmlToImage.node.ts');

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const source = fs.readFileSync(sourcePath, 'utf8');

test('package metadata is configured for n8n community nodes', () => {
  assert.equal(packageJson.name, '@manjidevs/n8n-nodes-html-to-image');
  assert.ok(packageJson.keywords.includes('n8n-community-node-package'));
  assert.equal(packageJson.n8n.nodes[0], 'dist/nodes/HtmlToImage/HtmlToImage.node.js');
  assert.equal(packageJson.peerDependencies['n8n-workflow'], '*');
  assert.equal(packageJson.author.email, 'demon@manjitv.in');
  assert.deepEqual(packageJson.files, ['dist']);
});

test('node source contains valid TypeScript structure', () => {
  assert.match(source, /export class HtmlToImage implements INodeType/);
  assert.match(source, /NodeConnectionTypes\.Main/);
  assert.match(source, /async execute\(this: IExecuteFunctions\)/);
});

test('node source contains the expected render endpoint and PNG output', () => {
  assert.match(source, /https:\/\/html-to-image-api-free\.vercel\.app\/api\/render/);
  assert.match(source, /image\.png/);
  assert.match(source, /image\/png/);
  assert.match(source, /prepareBinaryData/);
});
