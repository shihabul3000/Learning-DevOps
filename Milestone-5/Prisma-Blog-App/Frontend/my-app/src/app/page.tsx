import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default async function Home() {
  let session = null;
  try {
    session = await authClient.getSession();
    console.log("Session fetched successfully:", session);
  } catch (error) {
    console.error("Error fetching session:", error);
  }
  return (
    <div>
      <Button variant="outline">Click Here</Button>
    </div>
  );
}
