import lambdaify from 'aws-lambda-fastify';
import app from './index';

export const handler = lambdaify(app);
