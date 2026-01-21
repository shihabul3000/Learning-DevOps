export const dynamic = "force-dynamic";

export default async function AboutPage() {
  await new Promise((resolve)=> setTimeout(resolve,4000))
  throw new Error("Something went Wrong");
  return (
    <div>
      <h1> This is about page component </h1>
    </div>
  );
}
