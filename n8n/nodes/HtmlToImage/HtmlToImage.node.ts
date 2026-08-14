import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class HtmlToImage implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'HTML to Image',
    name: 'htmlToImage',
    icon: {
      light: 'file:htmlToImage.light.svg',
      dark: 'file:htmlToImage.dark.svg',
    },
    group: ['transform'],
    version: 1,
    subtitle: 'Convert HTML/CSS to PNG',
    description: 'Render HTML and CSS as a PNG using the ManjiDevs HTML to Image API',
    usableAsTool: true,
    defaults: {
      name: 'HTML to Image',
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    properties: [
      {
        displayName: 'HTML',
        name: 'html',
        type: 'string',
        typeOptions: { rows: 8 },
        default: '<div class="card">Hello</div>',
        required: true,
        description: 'HTML markup to render',
      },
      {
        displayName: 'CSS',
        name: 'css',
        type: 'string',
        typeOptions: { rows: 10 },
        default:
          '.card { width: 1080px; height: 1350px; display: grid; place-items: center; background: #08090d; color: white; font: 700 72px Arial; }',
        required: true,
        description: 'CSS applied to the HTML',
      },
      {
        displayName: 'Width',
        name: 'width',
        type: 'number',
        typeOptions: { minValue: 100, maxValue: 3000 },
        default: 1080,
        description: 'Output width in pixels',
      },
      {
        displayName: 'Height',
        name: 'height',
        type: 'number',
        typeOptions: { minValue: 100, maxValue: 4000 },
        default: 1350,
        description: 'Output height in pixels',
      },
      {
        displayName: 'API URL',
        name: 'apiUrl',
        type: 'string',
        default: 'https://html-to-image-api-free.vercel.app/api/render',
        description: 'Render endpoint. Use your own self-hosted endpoint if preferred',
      },
      {
        displayName: 'Binary Property',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        description: 'Property name where the generated PNG will be stored',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      try {
        const item = items[itemIndex];
        const html = this.getNodeParameter('html', itemIndex) as string;
        const css = this.getNodeParameter('css', itemIndex) as string;
        const width = this.getNodeParameter('width', itemIndex) as number;
        const height = this.getNodeParameter('height', itemIndex) as number;
        const apiUrl = this.getNodeParameter('apiUrl', itemIndex) as string;
        const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex) as string;

        const response = await this.helpers.httpRequest({
          method: 'POST',
          url: apiUrl,
          headers: { 'Content-Type': 'application/json' },
          body: { html, css, width, height },
          json: false,
          encoding: 'arraybuffer',
        });

        const buffer = Buffer.isBuffer(response)
          ? response
          : Buffer.from(response as ArrayBuffer);

        const binaryData = await this.helpers.prepareBinaryData(
          buffer,
          'image.png',
          'image/png',
        );

        returnData.push({
          json: {
            ...item.json,
            width,
            height,
            mimeType: 'image/png',
          },
          binary: {
            ...(item.binary ?? {}),
            [binaryPropertyName]: binaryData,
          },
          pairedItem: { item: itemIndex },
        });
      } catch (error) {
        throw new NodeOperationError(this.getNode(), error, { itemIndex });
      }
    }

    return [returnData];
  }
}
