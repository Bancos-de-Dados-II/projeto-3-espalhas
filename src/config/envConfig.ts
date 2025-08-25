import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3333),
  MONGOOSE: z.string(),
  NEO4J_URI: z.string().url().regex(/^neo4j(\+s)?:\/\//, {
    message: "A URI do Neo4j deve começar com neo4j:// ou neo4j+s://",
  }),
  NEO4J_USERNAME: z.string().min(1, "O usuário do Neo4j é obrigatório"),
  NEO4J_PASSWORD: z.string().min(1, "A senha do Neo4j é obrigatória"),
  JWT_SECRET: z.string(),
});

export type Env = z.infer<typeof envSchema>;

const envParseResult = envSchema.safeParse(process.env);

if (!envParseResult.success) {
  console.error(
    "❌ Variáveis de ambiente inválidas:",
    envParseResult.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const env = envParseResult.data;