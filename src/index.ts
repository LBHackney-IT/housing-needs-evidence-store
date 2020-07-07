import fastify from 'fastify';
import  { config } from 'dotenv';
import { health, saveMetadata, getMetadata } from './routes';

config();
const app = fastify();

app.route(health);
app.route(saveMetadata);
app.route(getMetadata);

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
