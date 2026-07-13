import { Button } from "@heroui/react";
import ProductCard from "./ProductCard";
import Link from "next/link";

type Product = {
    _id: string;
    productName: string;
    imageUrl: string;
    image: string;
    [key: string]: unknown;
};

const Featured = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/featured`)
    const products = await res.json() as Product[]
    console.log(products)
    return (
        <div className="mt-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
             <div>
               <h1 className="text-3xl font-bold">Featured Products</h1>
            <p className="text-muted">Handpicked products for the fashion enthusiasts</p>
         </div>

     <Link href={'/products'}>    
     <Button variant="outline" 
     className={'rounded-2xl border-cyan-500 border-2 text-cyan-500'}>All Products</Button></Link>
        </div>


        <div className="grid grid-cols-4 gap-5 mt-10">
            {products.map(product => <ProductCard key={product._id} product={product}/>)}
        </div>
            
        </div>
    );
};

export default Featured;