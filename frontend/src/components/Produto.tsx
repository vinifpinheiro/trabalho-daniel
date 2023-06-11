import {useState, useEffect} from 'react'
import { FiTrash2 } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { MdShoppingCart, MdLocalMall } from 'react-icons/md' 

interface Product { // tipo de dado
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
  }

const Produto = () => {
    const [name, setName] = useState(''); // variável do formulário
    const [description, setDescription] = useState(''); // variável do formulário
    const [quantity, setQuantity] = useState(0); // variável do formulário
    const [price, setPrice] = useState(0); // variável do formulário
  // variável que guarda todos os produtos
    const [products, setProducts] = useState<Product[]>([]);
    //  vai nos permitir recuperar o userId passado do Login para o Produto
    const location = useLocation();
    // efetivamente recupera o userId a partir do estado
    const userId = location.state?.userId || '';

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await fetch(`http://localhost:3333/products/${userId}`);
            const data = await response.json();
    
            if (response.ok) {
              setProducts(data);
            } else {
              console.error('Failed to fetch products');
            }
          } catch (error) {
            console.error('Error:', error);
          }
        };
    
        fetchProducts();
      }, [userId]);

      useEffect(() => {
        setProducts(products);
      }, [products]);

      // cria um produto no banco de dados e atualiza a lista de produtos
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const productData = { // tipo de dados para enviar ao backend
          name,
          description,
          quantity,
          price,
          userId
        };
   
        try {
          const newProduct = await fetch('http://localhost:3333/product', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
          })
          .then (resp => {
            return resp.json()
          })
    
           // Limpar os campos do formulário
            setName('');
            setDescription('');
            setQuantity(0);
            setPrice(0);

            //atualiza lista de produto com o novo produto
            setProducts((prevProductList) => [...prevProductList, newProduct]);
          
        } catch (error) {
          console.error('Error:', error);
        }
      };

      const handleRemoveProduct = async (id: Number) => {
        // Lógica para fazer a requisição DELETE para a rota /produto/:id
        // Utilize o userId e productId para formar a URL correta
      
        // Exemplo de requisição DELETE utilizando fetch:
       await fetch(`http://localhost:3333/product/${id}`, {
          method: 'DELETE',
        })
          .then(response => {
            return response.json()
        })
          .catch(error => {
            alert(error)
          });
        // atualiza lista de produto, retirando o produto desejado

        setProducts(products.filter((product) => product.id !== id));
      };

      const handleBuyProduct = async (id: Number) => {
        // Lógica para fazer a requisição ATUALIZAÇAO para a rota /produto/:id
        // Utilize o userId e productId para formar a URL correta
        const quantity = Number(prompt('Informe qtde da compra'))
        const price = Number(prompt('Informe valor da compra'))
        const buyData = {
            id,
            userId,
            quantity,
            price
          };

        // Exemplo de requisição PATCH utilizando fetch:
       const newProduct = await fetch(`http://localhost:3333/product/compra`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(buyData),
        })
        .then(response => {
            return response.json()
        })
          .catch(error => {
            alert(error)
          });

        // Encontre o índice do produto atualizado na lista
        const index = products.findIndex((product) => product.id === newProduct.id);
        if (index !== -1) {
          setProducts((prevProductList) => {
              const newProductList = [...prevProductList];
              newProductList[index] = newProduct;
              return newProductList;
        });
        }
      };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
          <div className="max-w-md mx-auto">
            {/* inicia o formulário para cadastrar um produto */ }
             <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-4">
              <div>
            <label htmlFor="name" className="block font-semibold">
              Nome:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block font-semibold">
              Descrição:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
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
              Preço:
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600"
          >
            Cadastrar Produto
          </button>
        </form>
{/* inicia a tabela para listar os produtos */ }
        <div className="max-w-md mx-auto mb-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Produtos</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border-b border-gray-300 py-2 px-4">Nome</th>
            <th className="border-b border-gray-300 py-2 px-4">Descrição</th>
            <th className="border-b border-gray-300 py-2 px-4">Quantidade</th>
            <th className="border-b border-gray-300 py-2 px-4">Preço</th>
            <th className="border-b border-gray-300 py-2 px-4">Remove</th>
            <th className="border-b border-gray-300 py-2 px-4">Compra</th>
            <th className="border-b border-gray-300 py-2 px-4">Venda</th>
          </tr>
        </thead>
        <tbody>
          {/* percorre a lista de produtos */}
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border-b border-gray-300 py-2 px-4">{product.name}</td>
              <td className="border-b border-gray-300 py-2 px-4">{product.description}</td>
              <td className="border-b border-gray-300 py-2 px-4">{product.quantity}</td>
              <td className="border-b border-gray-300 py-2 px-4">{product.price}</td>
              <td className="border-b border-gray-300 py-2 px-4">
                <button
                  onClick={() => handleRemoveProduct(product.id)}
                  className="flex items-center justify-center p-2 text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={20} />
                </button>
              </td>
              <td className="border-b border-gray-300 py-2 px-4">
                <button onClick={() => handleBuyProduct(product.id)} className="flex items-center justify-center p-2 text-green-500 hover:text-green-700">
                <MdShoppingCart size={20}/>
                </button>
              </td>
              <td className="border-b border-gray-300 py-2 px-4">
                <button className="flex items-center justify-center p-2 text-green-500 hover:text-green-700">
                  <MdLocalMall size={20}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      </div>
</div>

      

    )
}

export default Produto