import BookingCard from "@/components/BookingCard";
import { DeleteAlert } from "@/components/DeleteAlert";
import { EditModal } from "@/components/EditModal";
import Image from "next/image";

const ProductDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/products/${id}`);
  const products = await res.json();
console.log("product", products)
  const { image, price, productName, description, category } =products;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex  items-center gap-3 justify-end mt-5 mb-3">
        <EditModal products={products} />
        <DeleteAlert products={products}/>
      </div>
      <Image
        className="w-full h-100 object-cover"
         src={image}
        alt={productName}
        height={500}
        width={800}
      />

     <div className="flex justify-between gap-10">
       <div className="p-2">
        
        <div className="flex justify-between ">
          <div>
            <div>
              <h2 className="text-xl font-bold">{productName}</h2>
            </div>
            <div><p>{category}</p></div>
            <div>
            <h3 className="text-2xl font-bold">$ {price}</h3>
          </div>
          </div>
        </div>

        <h1 className="mt-10 text-2xl font-bold">Overview</h1>

        <p className="max-w-6xl">{description}</p>
      </div>


      <BookingCard product={products}/>
     </div>


    </div>
  );
};

export default ProductDetailsPage;