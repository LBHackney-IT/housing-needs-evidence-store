import fastify from 'fastify';

const app = fastify();

app.route({
  method: 'GET',
  url: '/health',
  handler: (_req, reply) => {
    reply.status(200).send();
  }
});

if (require.main === module) {
  app.listen(3000, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`[dev] <<< Listening on: ${address} >>>`);
    console.log(app.printRoutes());
  });
} else {
  module.exports = app;
}
