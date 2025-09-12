import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Bed, MapPin, Utensils, Car, Download, Star } from "lucide-react";

interface CostSummaryProps {
  totalCost: number;
  costBreakdown: {
    flights: number;
    accommodation: number;
    activities: number;
    meals: number;
    transport: number;
  };
  days: number;
}

export default function CostSummary({ totalCost, costBreakdown, days }: CostSummaryProps) {
  const dailyAverage = totalCost / days;

  const categories = [
    {
      name: "Vuelos",
      icon: <Plane className="h-6 w-6" />,
      amount: costBreakdown.flights,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      name: "Hospedaje",
      icon: <Bed className="h-6 w-6" />,
      amount: costBreakdown.accommodation,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      name: "Actividades",
      icon: <MapPin className="h-6 w-6" />,
      amount: costBreakdown.activities,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      name: "Comidas",
      icon: <Utensils className="h-6 w-6" />,
      amount: costBreakdown.meals,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      name: "Transporte",
      icon: <Car className="h-6 w-6" />,
      amount: costBreakdown.transport || 0,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ].filter(category => category.amount > 0);

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold" data-testid="text-cost-summary-title">
        Resumen de Costos
      </h2>

      {/* Cost Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const percentage = ((category.amount / totalCost) * 100).toFixed(0);
          
          return (
            <Card key={category.name} className="cost-card border border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${category.bgColor}`}>
                    <div className={category.color}>
                      {category.icon}
                    </div>
                  </div>
                  <span className={`text-2xl font-bold ${category.color}`} data-testid={`text-cost-${category.name.toLowerCase()}`}>
                    ${category.amount.toLocaleString()}
                  </span>
                </div>
                <h3 className="font-medium mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {percentage}% del total
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Total Summary */}
      <Card className="border border-border">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold" data-testid="text-total-cost-title">
                Costo Total del Viaje
              </h3>
              <p className="text-muted-foreground">
                {days} días • 1 persona
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary" data-testid="text-total-amount">
                ${totalCost.toLocaleString()}
              </div>
              <div className="text-muted-foreground" data-testid="text-daily-average">
                ${Math.round(dailyAverage).toLocaleString()}/día promedio
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Desglose por categoría</h4>
              <div className="space-y-2 text-sm">
                {categories.map((category) => {
                  const percentage = ((category.amount / totalCost) * 100).toFixed(0);
                  
                  return (
                    <div key={category.name} className="flex justify-between" data-testid={`breakdown-${category.name.toLowerCase()}`}>
                      <span>{category.name} ({percentage}%)</span>
                      <span>${category.amount.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Opciones</h4>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start"
                  data-testid="button-download-pdf-cost"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF - $9.99
                </Button>
                <Button 
                  variant="secondary"
                  className="w-full justify-start"
                  data-testid="button-premium-plan"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Plan Premium - $19.99/mes
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
