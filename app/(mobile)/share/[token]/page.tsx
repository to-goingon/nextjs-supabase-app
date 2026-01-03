export default async function SharedEventPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Shared Event</h1>
      <p className="mt-2 text-muted-foreground">
        Share Token: {token}. Public event access via share link. UI will be implemented in Phase 2.
      </p>
    </div>
  );
}
