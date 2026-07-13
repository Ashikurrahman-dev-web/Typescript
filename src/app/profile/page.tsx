"use client";
import { useEffect, useState, type ChangeEvent } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { uploadImage } from "@/utils/uploadImage";
import toast from "react-hot-toast";

export default function ProfilePage() {
const { data: session } = useSession();

const user = session?.user;
const userEmail = user?.email;

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [isEditing, setIsEditing] = useState(false);

const [imageFile, setImageFile] = useState<File | null>(null);
const [preview, setPreview] = useState("");

const [profile, setProfile] = useState({
name: "",
email: "",
image: "",
});

useEffect(() => {
const loadProfile = async () => {
if (!userEmail) return;

  try {

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/${userEmail}`);

    const data = await res.json();
    console.log("API DATA:", data);
    console.log("DB USER:", data);
console.log("SESSION USER:", user);

setProfile({
  name: data?.name || "",
  email: data?.email || "",
  image: data?.image  || "",
});

setPreview(data?.image || user?.image || "");
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

loadProfile();

}, [userEmail, user]);

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
setProfile({
...profile,
[e.target.name]: e.target.value,
});
};

const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] ?? null;

  if (!file) return;

  setImageFile(file);
  setPreview(URL.createObjectURL(file));

};

const handleSave = async () => {
try {
setSaving(true);
  if (!userEmail) {
    toast.error("No user email");
    setSaving(false);
    return;
  }

  let imageUrl = profile.image;

  if (imageFile) {
    const uploaded = await uploadImage(imageFile);
    if (uploaded) {
      imageUrl = uploaded;
    }
  }
console.log("Image URL:", imageUrl);
  try {
  const result = await authClient.updateUser({
    name: profile.name,
    image: imageUrl,
  });

  console.log("updateUser result:", result);
} catch (err) {
  console.error("updateUser error:", err);
}
const res = await fetch(
  `${process.env.NEXT_PUBLIC_SERVER_URL}/user/${encodeURIComponent(
    userEmail
  )}`,
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  }
);
const data = await res.json();

console.log(data);

if (data.success) {
  toast.success("Profile Updated Successfully");

  setProfile((prev) => ({
    ...prev,
    image: imageUrl,
  }));

  setIsEditing(false);
} else {
  toast.error("Update Failed");
}
} catch (error) {
  console.log(error);
  toast.error("Something went wrong");
} finally {
  setSaving(false);
}
};

if (loading) {
return ( <div className="text-center py-20">
Loading... </div>
);
}

return ( <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">


  <div className="flex justify-between items-center mb-8">
    <h2 className="text-3xl font-bold">
      My Profile
    </h2>

    {!isEditing ? (
      <button
        onClick={() => setIsEditing(true)}
        className="bg-cyan-600 text-white px-5 py-2 rounded-lg cursor-pointer"
      >
        Edit
      </button>
    ) : (
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-green-600 text-white px-5 py-2 rounded-lg cursor-pointer"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    )}
  </div>

  <div className="flex justify-center mb-8">
    <div className="relative">

      <img
        src={
        preview || user?.image || "/default-profile.png"
        }
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover border"
      />

      {isEditing && (
        <>
          <label
            htmlFor="image"
className="absolute bottom-0 right-0 bg-cyan-600 text-white px-3 py-1 rounded-full cursor-pointer text-sm"
          >
            Change
          </label>

          <input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </>
      )}
    </div>
  </div>

  <div className="grid md:grid-cols-2 gap-5">

    <div>
      <label className="block mb-1 font-medium">
        Name
      </label>

      <input
        type="text"
        name="name"
        defaultValue={user?.name}
        onChange={handleChange}
        disabled={!isEditing}
        className="w-full border rounded-lg p-3"
      />
    </div>

    <div>
      <label className="block mb-1 font-medium">
        Email
      </label>

      <input
        type="email"
        defaultValue={userEmail}
        disabled
        className="w-full border rounded-lg p-3 bg-gray-100"
      />
    </div>
</div>
</div>

);
}