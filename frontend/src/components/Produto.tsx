import { HeartIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface Message {
  // tipo de dado
  id: number;
  title: string;
  message: string;
  quantity: number;
  likes: number;
  published: boolean;
}

const Produto = () => {
  const [title, setName] = useState(""); // variável do formulário
  const [message, setMessage] = useState(""); // variável do formulário
  const [quantity, setQuantity] = useState(0); // variável do formulário
  const [likes, setLike] = useState(0); // variável do formulário
  const [published, setPublished] = useState(false); // variável do formulário
  // variável que guarda todos os produtos
  const [messages, setMessages] = useState<Message[]>([]);
  //  vai nos permitir recuperar o userId passado do Login para o Produto
  const location = useLocation();
  // efetivamente recupera o userId a partir do estado
  const userId = location.state?.userId || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3333/messages/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setMessages(data);
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProducts();
  }, [userId]);

  useEffect(() => {
    setMessages(messages);
  }, [messages]);

  // cria um produto no banco de dados e atualiza a lista de produtos
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const productData = {
      // tipo de dados para enviar ao backend
      title,
      message,
      quantity,
      likes,
      userId,
      published,
    };

    try {
      const newProduct = await fetch("http://localhost:3333/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      }).then((resp) => {
        return resp.json();
      });

      // Limpar os campos do formulário
      setName("");
      setMessage("");
      setQuantity(0);
      setLike(0);

      //atualiza lista de produto com o novo produto
      setMessages((prevMessageList) => [...prevMessageList, newProduct]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRemoveProduct = async (id: Number) => {
    // Lógica para fazer a requisição DELETE para a rota /produto/:id
    // Utilize o userId e productId para formar a URL correta

    // Exemplo de requisição DELETE utilizando fetch:
    await fetch(`http://localhost:3333/message/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        alert(error);
      });
    // atualiza lista de produto, retirando o produto desejado

    setMessages(messages.filter((message) => message.id !== id));
  };

  const handleBuyProduct = async (id: Number) => {
    // Lógica para fazer a requisição ATUALIZAÇAO para a rota /produto/:id
    // Utilize o userId e productId para formar a URL correta
    const like = Number(prompt("Informe qtde de Like"));
    const buyData = {
      id,
      userId,
      quantity,
      like,
      published,
    };

    // Exemplo de requisição PATCH utilizando fetch:
    const newProduct = await fetch(`http://localhost:3333/message/enviar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buyData),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        alert(error);
      });

    // Encontre o índice do produto atualizado na lista
    const index = messages.findIndex((message) => message.id === newProduct.id);
    if (index !== -1) {
      setMessages((prevMessageList) => {
        const newProductList = [...prevMessageList];
        newProductList[index] = newProduct;
        return newProductList;
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-300 to-red-400">
      <div className="min-w-[500px] mx-auto">
        {/* inicia o formulário para cadastrar um produto */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-4 flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="block font-semibold">
              Nome:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block font-semibold">
              Descrição:
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div className="hidden">
            <label htmlFor="quantity" className="block font-semibold">
              Quantidade:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="price" className="block font-semibold">
              Likes:
            </label>
            <input
              type="number"
              id="likes"
              value={likes}
              onChange={(e) => setLike(Number(e.target.value))}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
             <div>
          </div>
          </div>
          <div className="flex  items-center gap-x-4">
            <label htmlFor="published" className="block font-semibold">
              Publicado:
            </label>
            <input
              placeholder=""
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="hover:shadow-form rounded-md bg-[#6A64F1] mt-4 py-2 px-4 text-center text-base font-semibold text-white outline-none"
          >
            Cadastrar Produto
          </button>
        </form>
        {/* inicia a tabela para listar os produtos */}
        <div className="flex w-full">
          {messages.map((message) => (
            <div className="flex pt-20 items-center justify-center px-14 max-w-[500px]">
              <div className="bg-gray-600 w-full h-60 border-[#30363d] rounded-md 4 flex-none relative border-2 shadow ">
                <img
                  src="https://cdn.create.vista.com/api/media/medium/160495290/stock-photo-book-and-notepad-on-table?token="
                  alt=""
                  className="object-cover opacity-0  w-full h-full z-10"
                />
                <div className="flex flex-col justify-between absolute p-4 top-0 w-full h-full z-20 ">
                  <div className="flex justify-between">
                    <h1 className="text-lg text-white">{message.title}</h1>
                    <div>
                      <button className="bg-transparent">
                        <TrashIcon
                          className="h-6 w-6 text-white"
                          onClick={() => handleRemoveProduct(message.id)}
                        />
                      </button>
                      <button
                        className="bg-transparent"
                        onClick={() => handleBuyProduct(message.id)}
                      >
                        <PencilIcon className="h-6 w-6 text-white" />
                      </button>
                    </div>
                  </div>
                  <p className="w-3/4 text-white text-xs leading-6">
                    {message.message}
                  </p>
                  <div>
                    <span className="flex  gap-x-2">
                      <HeartIcon className="h-6 w-6 text-red-500" />
                      {message.likes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Produto;
