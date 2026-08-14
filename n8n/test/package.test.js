const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const packageDir = path.resolve(__dirname, '..');
const packageJson = JSON.parse(
  fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'),
);
const nodeFile = path.join(
  packageDir,
  'dist',
  'nodes',
  'HtmlToImage',
  'HtmlToImage.node.js',
);

test('package metadata is configured for n8n community nodes', () => {
  assert.equal(packageJson.name, '@manjidevs/n8n-nodes-html-to-image');
  assert.equal(packageJson.license, 'MIT');
  assert.ok(packageJson.keywords.includes('n8n-community-node-package'));
  assert.equal(packageJson.n8n.strict, true);
  assert.equal(packageJson.n8n.nodes[0], 'dist/nodes/HtmlToImage/HtmlToImage.node.js');
  assert.equal(packageJson.peerDependencies['n8n-workflow'], '*');
});

test('compiled node exists', () => {
  assert.equal(fs.existsSync(nodeFile), true);
});

test('node exports the expected class', () => {
  const { HtmlToImage } = require(nodeFile);
  assert.equal(typeof HtmlToImage, 'function');

  const node = new HtmlToImage();
  assert.equal(node.description.name, 'htmlToImage');
  assert.equal(node.description.displayName, 'HTML to Image');
  assert.equal(node.description.inputs[0], 'main');
  assert.equal(node.description.outputs[0], 'main');
  assert.equal(node.description.usableAsTool, true);
});
