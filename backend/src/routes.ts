import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";
import dayjs from "dayjs";

export async function AppRoutes(app: FastifyInstance) {
  // rota para criar um user
  app.post("/user", async (request) => {
    const postBody = z.object({
      username: z.string(),
      password: z.string(),
      email: z.string(),
    });
    const { username, password, email } = postBody.parse(request.body);
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
        email,
        created_at: new Date(),
      },
    });
    return newUser;
  });

  // rota para recuperar um user
  app.post("/user/login", async (request) => {
    const postBody = z.object({
      username: z.string(),
      password: z.string(),
    });
    const { username, password } = postBody.parse(request.body);
    const user = await prisma.user.findMany({
      where: {
        username: username,
        password: password,
      },
    });
    return user;
  });

  // define uma rota que consulta todos os usuários cadastrados no banco de dados
  app.get("/users", async () => {
    const users = await prisma.user.findMany();
    return users;
  });

  // define uma rota que consulta todos os produtos cadastrados no banco de dados
  app.get("/messages", async () => {
    const messages = await prisma.message.findMany();
    return messages;
  });

  // rota para criar um produto
  // define uma rota que cria um produto no banco de dados, usando o verbo post, com um usuário
  app.post("/message", async (request) => {
    // recupera os dados do corpo da requisição
    const createmessageBody = z.object({
      title: z.string(), // Add the missing title property
      message: z.string(),
      quantity: z.number(), // Add the missing quantity property
      likes: z.number(),
      userId: z.number(),
      published: z.boolean(),
    });
    const { title, message, quantity, likes, userId, published } =
      createmessageBody.parse(request.body);
    // insere o produto no banco de dados
    // recupera a data atual - de hoje
    const today = dayjs().startOf("day").toDate(); // sem hora, minuto e segundo
    const newmessage = await prisma.message.create({
      data: {
        title,
        message,
        quantity,
        likes,
        published,
        created_at: today,
        userId,
      },
    });
    return newmessage;
  });


  // recupera todos os produtos de um usuário
  app.get("/messages/:userId", async (request) => {
    const userIdParams = z.object({
      userId: z.string(),
    });
    const { userId } = userIdParams.parse(request.params);
    const messages = await prisma.message.findMany({
      where: {
        userId: Number(userId),
      },
    });
    return messages;
  });

  app.patch("/message/enviar", async (request) => {
    const enviarBody = z.object({
      id: z.number(),
      userId: z.number(),
      quantity: z.number(),
      likes: z.number(),
    });
    const { id, userId, quantity, likes } = enviarBody.parse(request.body);

    let messageUpdated = await prisma.message.update({
      where: {
        id: id,
      },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    });

    const today = dayjs().startOf("day").toDate(); // sem hora, minuto e segundo
    await prisma.control.create({
      data: {
        controlValue: "",
        type: "C",
        quantity,
        likes: likes,
        created_at: today,
        userId,
        messageId: id,
      },
    });
    return messageUpdated;
  });

  //Passo 5. Lista os controls
  app.get("/controls", async () => {
    const controls = await prisma.control.findMany();
    return controls;
  });

  // Passo 6. Lista os controls de um usuário
  app.get("/controls/:userId", async (request) => {
    const userIdParams = z.object({
      userId: z.string(),
    });
    const { userId } = userIdParams.parse(request.params);
    const controls = await prisma.control.findMany({
      where: {
        userId: Number(userId),
      },
    });
    return controls;
  });

  // Passo 7. Realiza uma venda de um usuário
  // rota pra atualizar a quantidade em estoque - venda
  app.patch("/message/venda", async (request) => {
    const vendaBody = z.object({
      id: z.number(),
      x: z.number(),
      userId: z.number(),
      likes: z.number(),
    });
    const { id, x, userId, likes } = vendaBody.parse(request.body);

    let resp = await prisma.message.updateMany({
      where: {
        id: id,
        quantity: {
          gte: x,
        },
      },
      data: {
        quantity: {
          decrement: x,
        },
      },
    });

    //  return resp.count
    if (resp.count > 0) {
      const today = dayjs().startOf("day").toDate(); // sem hora, minuto e segundo
      await prisma.control.create({
        data: {
          controlValue: "",
          type: "V",
          quantity: x,
          likes: likes,
          created_at: today,
          userId,
          messageId: id,
        },
      });
      return 1; // indica que a venda foi realizada
    } else {
      return 0; // indica que a venda não foi realizada
    }
  });

  // rota para remover um produto, usando o verbo delete
  app.delete("/message/:id", async (request) => {
    // recupera o id para remoção
    const idParam = z.object({
      id: z.string(),
    });
    const { id } = idParam.parse(request.params);
    // remove o produto
    let messageDeleted = await prisma.message.delete({
      where: {
        id: Number(id),
      },
    });
    return messageDeleted;
  });
}
