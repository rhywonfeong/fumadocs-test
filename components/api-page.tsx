import { openapi } from '@/lib/openapi';
import { createAPIPage } from 'fumadocs-openapi/ui';

const BaseAPIPage = createAPIPage(openapi);

const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch'] as const;

export async function APIPage(props: Record<string, unknown>) {
  const schemas = await openapi.getSchemas();
  const docId = './lib/openapi/admin-api.yaml';
  const schema = schemas[docId];
  if (!schema) return null;

  const operations: Array<{ path: string; method: typeof HTTP_METHODS[number] }> = [];
  for (const [path, pathItem] of Object.entries(
    (schema.dereferenced as { paths?: Record<string, Record<string, unknown>> }).paths ?? {},
  )) {
    for (const method of HTTP_METHODS) {
      if (pathItem[method]) operations.push({ path, method });
    }
  }

  return <BaseAPIPage {...props} document={docId} operations={operations} />;
}
