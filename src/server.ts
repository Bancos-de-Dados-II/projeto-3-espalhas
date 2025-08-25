import express from 'express';
import cors from 'cors';
import {env} from './config/envConfig';
import BenefRouter from './router/beneficiario.route';
import AssistenteRouter from './router/assistenteSocial.route';
import { LoginRouter } from './router/login.route';
import {connectDB} from './config/mongo';
import {verifyNeo4jConnection} from './config/neo4j';


const app = express();
app.use(cors());
app.use(express.json());

app.use('/benefs', BenefRouter);
app.use('/assists', AssistenteRouter);
app.use('/login', LoginRouter);

async function startServer() {
  try {
    await verifyNeo4jConnection();
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${env.PORT}`)
    });
  } catch (err) {
    console.error("❌ Erro ao conectar ao banco de dados:", err);
    process.exit(1);
  }
}

startServer();