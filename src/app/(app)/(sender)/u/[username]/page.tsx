import ClientPage from "./client-page";


const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const username = (await params).username;

  return (
    <>
      <ClientPage username={username} />
    </>
  );
};

export default Page;
