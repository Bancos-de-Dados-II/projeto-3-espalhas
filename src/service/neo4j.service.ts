import driver from "../config/neo4j";

export default class Neo4jService {
  static async createAssistenteSocial(
    assistenteId: string,
    adminId: string,
    props: { nome: string; email: string; telefone: string }
    ){
    const session = driver.session();
    try {
      await session.run(
        `
        MERGE (a:Admin {mongoId: $adminId})
        MERGE (s:AssistenteSocial {mongoId: $assistenteId})
        SET s += $props
        MERGE (a)-[:GERENCIA]->(s)
        RETURN s
        `,
        { assistenteId, adminId, props }
      );
      console.log("✅ AssistenteSocial criado no Neo4j:", props.nome);
    } catch (err) {
      console.error("⚠️ Erro ao criar AssistenteSocial no Neo4j:", err);
    } finally {
      await session.close();
    }
  }

  static async createBeneficiario(
        benefId: string,
        criadoPorId: string,
        criadoPorTipo: "Admin" | "AssistenteSocial",
        props: { nome: string; data_nascimento: string }
        ){
        const session = driver.session();
        try {
        await session.run(
            `
            MERGE (creator:${criadoPorTipo} {mongoId: $criadoPorId})
            MERGE (b:Beneficiario {mongoId: $benefId})
            SET b += $props
            MERGE (creator)-[:CRIOU]->(b)
            RETURN b
            `,
            { benefId, criadoPorId, props }
        );
        console.log(`✅ Beneficiario criado no Neo4j: ${props.nome} (criado por ${criadoPorTipo})`);
        } catch (err) {
        console.error("⚠️ Erro ao criar Beneficiario no Neo4j:", err);
        } finally {
        await session.close();
        }
    }

  static async deleteNode(label: string, mongoId: string) {
    const session = driver.session();
    try {
      await session.run(
        `MATCH (n:${label} {mongoId: $mongoId}) DETACH DELETE n`,
        { mongoId }
      );
      console.log(`🗑️ Nó ${label} com mongoId ${mongoId} deletado do Neo4j`);
    } catch (err) {
      console.error("⚠️ Erro ao deletar nó no Neo4j:", err);
    } finally {
      await session.close();
    }
  }

  static async createAdmin(adminId: string, props: { email: string; uuid: string }) {
    const session = driver.session();
    try {
      await session.run(
        `
        MERGE (a:Admin {mongoId: $adminId})
        SET a += $props
        RETURN a
        `,
        { adminId, props }
      );
      console.log("✅ Admin criado no Neo4j:", props.email);
    } catch (err) {
      console.error("⚠️ Erro ao criar Admin no Neo4j:", err);
    } finally {
      await session.close();
    }
  }
}
