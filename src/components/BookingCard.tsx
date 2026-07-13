"use client";

import { Button, Card } from "@heroui/react";
import  { useState } from "react";
import { DateField, Label } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

interface BookingCardProps {
  product: {
    price: number;
    _id: string;
    productName: string;
    image: string;
    category: string;
  };
}

const BookingCard = ({ product }: BookingCardProps) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [bookDate, setBookDate] = useState<Date | null>(null);

   const { price, _id, productName,image, category  } = product;

  const handleBooking = async () => {
    const bookingData = {
        userId: user?.id,
        userImage: user?.image,
        userName: user?.name,
        productId: _id,
        productName,
        price,
        image,
        category,
        bookDate: bookDate ? bookDate.toISOString() : null
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking`, {
        method: "POST",
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(bookingData),
    })

    const data = await res.json();
console.log(data);
    toast.success("You booked successfully!")
}
return (
    <Card className="rounded-none border mt-5">
      <p className="text-sm text-muted">Starting from</p>
      <h2 className="text-3xl font-bold text-cyan-500">${price}</h2>
      <p className="text-sm text-muted">per person</p>

      <DateField onChange={(v: any) => setBookDate(v)} className="w-[256px]" name="date">
        <Label>Booking Date</Label>
        <DateField.Group>
          <DateField.Input>
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
        </DateField.Group>
      </DateField>

      <Button onClick={handleBooking} className={"w-full rounded-none bg-cyan-500"}>Buy Now</Button>
    </Card>
  );
};

export default BookingCard;