import neo4j from 'neo4j-driver';
import { env } from './envConfig'; 


const driver = neo4j.driver(
  env.NEO4J_URI,
  neo4j.auth.basic(env.NEO4J_USERNAME, env.NEO4J_PASSWORD)
);


export const verifyNeo4jConnection = async () => {
  try {
    await driver.getServerInfo();
    console.log('✅ Conexão com o Neo4j estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Falha ao conectar com o Neo4j:', error);
    throw error;
  }
};

export default driver;