import fastify from 'fastify';
import { health } from './routes';

const app = fastify();

app.route(health);

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
