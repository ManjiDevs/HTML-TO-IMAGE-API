const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

test('node package exposes HtmlToImage', () => {
  const nodePath = path.resolve(__dirname, '../nodes/HtmlToImage/HtmlToImage.node.js');
  const originalLoad = Module._load;

  Module._load = function (request, parent, isMain) {
    if (request === 'n8n-workflow') {
      return { NodeOperationError: class NodeOperationError extends Error {} };
    }
    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    const { HtmlToImage } = require(nodePath);
    assert.equal(typeof HtmlToImage, 'function');

    const node = new HtmlToImage();
    assert.equal(node.description.displayName, 'HTML to Image');
    assert.equal(node.description.name, 'htmlToImage');
    assert.equal(node.description.version, 1);
    assert.ok(Array.isArray(node.description.properties));

    const names = node.description.properties.map((property) => property.name);
    assert.deepEqual(names, [
      'html',
      'css',
      'width',
      'height',
      'apiUrl',
      'binaryPropertyName',
    ]);
  } finally {
    Module._load = originalLoad;
  }
});

test('node source contains the expected render endpoint default and PNG output', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '../nodes/HtmlToImage/HtmlToImage.node.js'),
    'utf8',
  );

  assert.match(source, /https:\/\/html-to-image-api-free\.vercel\.app\/api\/render/);
  assert.match(source, /image\.png/);
  assert.match(source, /image\/png/);
  assert.match(source, /prepareBinaryData/);
});
