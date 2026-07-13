"use client"
import toast from "react-hot-toast";
import { FieldError, Input, Label, TextField, Select, ListBox, TextArea, Button, Card } from "@heroui/react";
import { uploadImage } from "../../utils/uploadImage";
import { useState, type FormEvent } from 'react';
import { FaCamera, FaUser } from "react-icons/fa";

type ProductFormValues = {
  productName: string;
  category: string;
  price: string;
  description: string;
  image?: string;
};

const AddProductPage = () => {
    const [preview, setPreview] = useState<string | null>(null);
        const [imageFile, setImageFile] = useState<File | null>(null);
        const [loading, setLoading] = useState(false);
        const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const product = Object.fromEntries(
          Array.from(formData.entries()).filter(([key]) => key !== "image")
        ) as ProductFormValues

        try {
            let imageUrl = "";
            if (imageFile) {
                try {
                    const uploadedImageUrl = await uploadImage(imageFile);
                    if (!uploadedImageUrl) {
                        toast.error("Image upload failed!");
                        return;
                    }
                    imageUrl = uploadedImageUrl;
                } catch (uploadErr) {
                    toast.error("Image upload failed!");
                    return;
                }
            } else {
                toast.error("Please upload an avatar first");
                return;
            }

            product.image = imageUrl;
            console.log(product)

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/products`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(product)
            })

            const data = await res.json()
            console.log(data)
        } catch (error) {
            toast.error("An error occurred while submitting the form")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-5 max-w-7xl mx-auto">
         <h1 className="text-2xl font-bold">Add Product</h1>

         <Card>
        <form
        onSubmit={onSubmit}
            className="p-10 space-y-8 w-3xl"
          >
   <div className="flex flex-col items-center gap-3 mb-4 w-full">
                           <div className="relative">
   <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-500 shadow-lg bg-slate-800">
                                   {preview ? (
   <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                                   ) : (
                       <div className="w-full h-full flex items-center justify-center text-slate-400">
                                           <FaUser size={32} />
                                       </div>
                                   )}
                               </div>
<label htmlFor="image" className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition">
                                   <FaCamera size={12} />
                               </label>
                           </div>
<input id="image" name="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                           <p className="text-xs text-slate-400">Upload your product picture</p>
                       </div>         
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Name */}
              <div className="md:col-span-2">
                <TextField name="productName" isRequired>
                  <Label>Product Name</Label>
                  <Input placeholder="product" className="rounded-2xl" />
                  <FieldError />
                </TextField>
              </div>

              {/* Category - Updated Select Component */}
              <div>
                <Select
                  name="category"
                  isRequired
                  className="w-full"
                  placeholder="Select category"
                >
                  <Label>Category</Label>
                  <Select.Trigger className="rounded-2xl">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="Cloth" textValue="Cloth">
                        Cloth
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="Electronics" textValue="Electronics">
                        Electronics
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="Food" textValue="Food">
                        Food
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="Cosmetics" textValue="Cosmetics">
                        Cosmetics
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="Groceries" textValue="Groceries">
                        Groceries
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="Pharmaceuticals" textValue="Pharmaceuticals">
                        Pharmaceuticals
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              {/* Price */}
              <TextField name="price" type="number" isRequired>
                <Label>Price (USD)</Label>
                <Input
                  type="number"
                  placeholder="000"
                  className="rounded-2xl"
                />
                <FieldError />
              </TextField>

              {/* Description */}
              <div className="md:col-span-2">
                <TextField name="description" isRequired>
                  <Label>Description</Label>
                  <TextArea
                    placeholder="Describe the travel experience..."
                    className="rounded-3xl"
                  />
                  <FieldError />
                </TextField>
              </div>
            </div>

            {/* Buttons */}

            <Button
              type="submit"
              variant="outline"
              className=" rounded-2xl w-full bg-cyan-500 text-white"
            >
             Add Product
            </Button>
          </form>
         </Card>
        </div>
    );
};

export default AddProductPage;