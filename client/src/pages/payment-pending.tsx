import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Home, List } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PaymentPending() {
  const [, setLocation] = useLocation();

  const urlParams = new URLSearchParams(window.location.search);
  const externalReference = urlParams.get("external_reference");
  
  // Extract tripId from external reference (format: tobugo-{tripId}-{userId}-{timestamp})
  // TripId is a UUID with 5 segments (8-4-4-4-12 characters)
  const tripId = externalReference 
    ? externalReference.replace("tobugo-", "").split("-").slice(0, 5).join("-")
    : null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full" data-testid="card-payment-pending">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          {/* Pending Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="h-12 w-12 text-yellow-600" data-testid="icon-pending" />
            </div>
          </div>

          {/* Pending Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold" data-testid="text-pending-title">
              Pago en Proceso
            </h1>
            <p className="text-muted-foreground">
              Tu pago está siendo procesado
            </p>
          </div>

          <Separator />

          {/* Info Box */}
          <div className="bg-muted p-4 rounded-lg text-left space-y-2">
            <h3 className="font-semibold text-sm">¿Qué significa esto?</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Tu pago está en revisión</li>
              <li>• Puede tomar hasta 48 horas</li>
              <li>• Recibirás un email cuando se confirme</li>
              <li>• No necesitas hacer nada más</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="w-full"
              data-testid="button-home"
            >
              <Home className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setLocation("/dashboard?tab=purchases")}
              className="w-full"
              data-testid="button-history"
            >
              <List className="h-4 w-4 mr-2" />
              Ver Estado en Mis Compras
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Te notificaremos por email cuando el pago se confirme
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
