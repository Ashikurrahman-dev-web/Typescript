import ProductCard from "@/components/ProductCard";

type Product = {
    _id: string;
    productName: string;
    image: string;
    [key: string]: unknown;
};

const ProductPage = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/products`)
    const products = (await res.json()) as Product[];


    return (
        <div className="max-w-7xl mx-auto">
<h1 className="text-center font-bold text-cyan-500 text-2xl my-2">All Products</h1>


            <div className="grid grid-cols-4 gap-5">
                {
            products.map((product: Product) => <ProductCard key={product._id} product={product}/>)
                }

            </div>

        </div>
    );
};

export default ProductPage;