import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Customer, Order, OrderItem } from "@/db/types";

type OrderWithCustomer = Order & Customer;

export function RecentSales({
  recentSales,
}: {
  recentSales: OrderWithCustomer[];
}) {
  return (
    <div className="space-y-8">
      {recentSales.map((item) => (
        <div key={item.id} className="flex items-center">
          <div
            className="h-9 w-9 rounded-full"
            style={{ backgroundColor: `hsl(${Math.random() * 360}, 70%, 80%)` }}
          />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.email}</p>
          </div>
          <div className="ml-auto font-medium">${item.total_price}</div>
        </div>
      ))}
    </div>
  );
}
