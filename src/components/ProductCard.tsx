import { Button } from "@heroui/react";
import { FiExternalLink } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
type Product = {
  _id: string;
  productName: string;
  image: string;
  price?:  number;
};

const ProductCard = ({ product }: { product: Product }) => {
    
  const { _id, productName, image, price } = product;

  return (
    <div className="border">
      <Image
        className=""
        alt={productName}
        src={image}
        height={400}
        width={400}
      />

      <div className="p-2">
    
        <div className="flex justify-between">
          <div>
            <div>
              <h2 className="text-xl font-bold">{productName}</h2>
            </div>
            
          </div>

          <div>
            <h3 className="text-2xl font-bold">$ {price}</h3>
          </div>
        </div>
        <Link href={`/products/${_id}`}><Button variant="ghost" className={'mt-1 text-cyan-500'}>
             <FiExternalLink/> Buy Now</Button></Link>
      </div>
    </div>
  );
};

export default ProductCard;