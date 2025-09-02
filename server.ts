import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { AppException } from "./app.error";

const server = fastify();

server.addContentTypeParser('application/javascript', { parseAs: 'string' }, function (req, body, done) {
  try {
    const json = JSON.parse(body as string);
    done(null, json);
  } catch (error: any) {
    error.statusCode = 400;
    done(error, undefined);
  }
});
server.get('/', (req, reply) => {
  reply.send("")
})

interface DataRequest {
  data: string;
}

server.post('/test', async (req: FastifyRequest<{ Body: DataRequest }>, reply: FastifyReply) => {
  const { data } = req.body;

  type AlienNumeralKey = 'A' | 'B' | 'Z' | 'L' | 'C' | 'D' | 'R';
  const regex = /A{4,}/; 
 if(regex.test(data)) throw new AppException(404, "รูปแบบไม่ถูกต้อง");
  const alienMap: Record<AlienNumeralKey, number> = {
    'A': 1, 'B': 5, 'Z': 10, 'L': 50, 'C': 100, 'D': 500, 'R': 1000
  };

  let total = 0;
  for (let i = 0; i < data.length; i++) {
    const currentVal = alienMap[data[i] as AlienNumeralKey];
    const nextVal = (i + 1 < data.length) ? alienMap[data[i + 1] as AlienNumeralKey] : 0;
    
    if (nextVal > currentVal) {
      total += (nextVal - currentVal);
      i++; 
    } else {
      total += currentVal;
    }
  }
  return total;

});

const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log("server running on http://localhost:3000");
  } catch (err) {
    console.error(`Error : ${err}`);
    process.exit(1);
  }
};
start();