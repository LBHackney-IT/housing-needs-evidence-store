import fastify from 'fastify';
import {
  deleteDocument,
  findDocuments,
  getDocumentContents,
  getMetadata,
  health,
  saveMetadata,
  getPresignedUploadUrl,
} from './routes';

const app = fastify();

app.register(require('fastify-cors'), {
  origin: /\.hackney\.gov\.uk(:[0-9]*)?$/,
});

app.route(health);
app.route(saveMetadata);
app.route(getMetadata);
app.route(findDocuments);
app.route(getDocumentContents);
app.route(deleteDocument);
app.route(getPresignedUploadUrl);

if (require.main === module) {
  app.listen(5050, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`[dev] <<< Listening on: ${address} >>>`);
    console.log(app.printRoutes());
  });
}

export default app;
