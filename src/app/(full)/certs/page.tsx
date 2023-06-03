import { redirect } from "next/navigation";

export default function NoCertIdPage() {
  redirect(process.env.BASE_URL);
}
