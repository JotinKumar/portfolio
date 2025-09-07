import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {messages.map((msg) => (
          <Card key={msg.id}>
            <CardHeader>
              <CardTitle>{msg.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{msg.email}</p>
              <p>{msg.message}</p>
              <p className="text-xs mt-2">
                {new Date(msg.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
