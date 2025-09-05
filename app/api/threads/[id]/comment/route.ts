export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log("This is params id", params.id); 
}
