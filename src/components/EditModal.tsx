"use client";
import { FaCamera, FaUser } from "react-icons/fa";
import { uploadImage } from "../utils/uploadImage";
import toast from "react-hot-toast";
import { useState, type FormEvent } from 'react';
import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Modal,
  Surface,
  TextArea,
  TextField,
  Select,
} from "@heroui/react";
import { BiEdit } from "react-icons/bi";

interface Product {
  _id: string;
  image: string;
  price: number;
  productName: string;
  category: string;
  description: string;
  bookDate: string;
}

export function EditModal({ products }: { products: Product }) {
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
  const {
    _id,
    productName,
    category,
    description,
  } = products;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productsData = Object.fromEntries(formData.entries());

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

      productsData.image = imageUrl;
      console.log(productsData);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/products/${_id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(productsData),
        
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    }
  };

  return (
    <Modal>

        <Button variant="outline" className={"rounded-2xl"}>
          <BiEdit /> Edit
        </Button>

      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Edit Products</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-6">
              <Surface variant="default">
                <form onSubmit={onSubmit} className="p-10 space-y-8">
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
                            <p className="text-xs text-slate-400">Edit your product picture</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <div className="md:col-span-2">
                      <TextField
                        defaultValue={productName}
                        name="productName"
                        
                      >
                        <Label>Products Name</Label>
                        <Input
                          placeholder="Product"
                          className="rounded-2xl"
                        />
                        <FieldError />
                      </TextField>
                    </div>

                    {/* Category - Updated Select Component */}
                    <div>
                <Select
                  name="category"
                   defaultValue={category}
            
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
                    <TextField
                      
                      name="price"
                      type="number"
                    
                    >
                      <Label>Price (USD)</Label>
                      <Input
                        type="number"
                        placeholder="1299"
                        className="rounded-2xl"
                      />
                      <FieldError />
                    </TextField>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <TextField
                        defaultValue={description}
                        name="description"
                        
                      >
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

                  <Modal.Footer>
                    <Button type="submit" slot="close">
                      Save
                    </Button>
                  </Modal.Footer>
                </form>
              </Surface>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}